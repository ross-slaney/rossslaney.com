@description('The name prefix for all resources')
param namePrefix string = 'rossslaney'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The domain name for DNS zone integration')
param domainName string

@description('The container image to deploy')
param containerImage string = 'nginx:latest'

@description('Environment name (dev, staging, prod)')
param environment string = 'prod'

// Variables
var resourceSuffix = '${namePrefix}-${environment}'
var acrName = replace('${resourceSuffix}acr', '-', '')
var containerAppName = '${resourceSuffix}-app'
var containerAppEnvName = '${resourceSuffix}-env'
var storageAccountName = replace('${resourceSuffix}storage', '-', '')
var logAnalyticsName = '${resourceSuffix}-logs'

// Log Analytics Workspace
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
  }
}

// Azure Container Registry
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// Container App Environment
resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// Storage Account for Blob Storage
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: true
    supportsHttpsTrafficOnly: true
  }
}

// Blob Container for public assets
resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  name: '${storageAccount.name}/default/assets'
  properties: {
    publicAccess: 'Blob'
  }
}

// DNS Zone is referenced in the deployment script via environment variables

// Container App (without custom domain initially)
resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
      registries: [
        {
          server: acr.properties.loginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'main'
          image: containerImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '3000'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '10'
              }
            }
          }
        ]
      }
    }
  }
}

// Deployment script to configure DNS and custom domain
resource dnsConfigScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: '${containerAppName}-dns-config'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.50.0'
    timeout: 'PT30M'
    retentionInterval: 'PT1H'
    environmentVariables: [
      {
        name: 'RESOURCE_GROUP'
        value: resourceGroup().name
      }
      {
        name: 'DNS_ZONE_NAME'
        value: domainName
      }
      {
        name: 'CONTAINER_APP_NAME'
        value: containerAppName
      }
      {
        name: 'CONTAINER_APP_FQDN'
        value: containerApp.properties.configuration.ingress.fqdn
      }
    ]
    scriptContent: '''
      echo "🌐 Configuring DNS for $DNS_ZONE_NAME"
      
      # Get Container App IP address
      echo "📡 Resolving Container App IP..."
      CONTAINER_APP_IP=$(nslookup $CONTAINER_APP_FQDN | grep -A 1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
      
      if [ -z "$CONTAINER_APP_IP" ]; then
        echo "Trying alternative DNS resolution..."
        CONTAINER_APP_IP=$(dig +short $CONTAINER_APP_FQDN | head -1)
      fi
      
      if [ -z "$CONTAINER_APP_IP" ]; then
        echo "❌ Could not resolve Container App IP"
        exit 1
      fi
      
      echo "✅ Container App IP: $CONTAINER_APP_IP"
      
      # Delete existing A record if it exists
      az network dns record-set a delete \
        --resource-group $RESOURCE_GROUP \
        --zone-name $DNS_ZONE_NAME \
        --name "@" \
        --yes 2>/dev/null || echo "No existing A record"
      
      # Create A record pointing to Container App IP
      az network dns record-set a add-record \
        --resource-group $RESOURCE_GROUP \
        --zone-name $DNS_ZONE_NAME \
        --record-set-name "@" \
        --ipv4-address $CONTAINER_APP_IP \
        --ttl 300
      
      echo "✅ A record created: $DNS_ZONE_NAME -> $CONTAINER_APP_IP"
      
      # Wait for DNS propagation
      echo "⏳ Waiting for DNS propagation..."
      sleep 60
      
      # Add custom domain to Container App
      az containerapp hostname add \
        --hostname $DNS_ZONE_NAME \
        --name $CONTAINER_APP_NAME \
        --resource-group $RESOURCE_GROUP
      
      echo "✅ Custom domain added with SSL certificate"
    '''
  }
}

// Outputs
output acrLoginServer string = acr.properties.loginServer
output acrName string = acr.name
output containerAppFqdn string = containerApp.properties.configuration.ingress.fqdn
output storageAccountName string = storageAccount.name
output containerAppName string = containerApp.name
output resourceGroupName string = resourceGroup().name
output customDomainUrl string = 'https://${domainName}'
