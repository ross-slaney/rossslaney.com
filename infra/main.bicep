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

// Get existing DNS Zone
resource dnsZone 'Microsoft.Network/dnsZones@2023-07-01-preview' existing = {
  name: domainName
  scope: resourceGroup()
}

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

// Create CNAME record pointing to Container App
resource cnameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = {
  parent: dnsZone
  name: '@'
  properties: {
    TTL: 300
    CNAMERecord: {
      cname: containerApp.properties.configuration.ingress.fqdn
    }
  }
}

// Add custom domain to Container App after DNS is configured
resource containerAppCustomDomain 'Microsoft.App/containerApps@2024-03-01' = {
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
        customDomains: [
          {
            name: domainName
            bindingType: 'SniEnabled'
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
  dependsOn: [
    cnameRecord
  ]
}

// Outputs
output acrLoginServer string = acr.properties.loginServer
output acrName string = acr.name
output containerAppFqdn string = containerAppCustomDomain.properties.configuration.ingress.fqdn
output storageAccountName string = storageAccount.name
output storageAccountKey string = storageAccount.listKeys().keys[0].value
output containerAppName string = containerAppCustomDomain.name
output resourceGroupName string = resourceGroup().name
output customDomainUrl string = 'https://${domainName}'
