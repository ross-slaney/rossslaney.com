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

// Deploy Container App first to get verification ID
module containerAppModule 'modules/container-app.bicep' = {
  name: 'containerApp'
  params: {
    containerAppName: containerAppName
    location: location
    managedEnvironmentId: containerAppEnvironment.id
    acrLoginServer: acr.properties.loginServer
    acrUsername: acr.listCredentials().username
    acrPassword: acr.listCredentials().passwords[0].value
    containerImage: containerImage
  }
}

// Deploy DNS configuration using outputs from Container App
module dnsModule 'modules/dns-config.bicep' = {
  name: 'dnsConfig'
  params: {
    domainName: domainName
    containerAppFqdn: containerAppModule.outputs.containerAppFqdn
    customDomainVerificationId: containerAppModule.outputs.customDomainVerificationId
    containerAppsEnvironmentStaticIp: containerAppEnvironment.properties.staticIp
  }
}

// Deploy managed certificate after DNS is configured
module certificateModule 'modules/managed-certificate.bicep' = {
  name: 'managedCertificate'
  params: {
    domainName: domainName
    location: location
    managedEnvironmentId: containerAppEnvironment.id
  }
  dependsOn: [
    dnsModule
  ]
}

// Update Container App with custom domain and certificate
module containerAppCustomDomainModule 'modules/container-app-custom-domain.bicep' = {
  name: 'containerAppCustomDomain'
  params: {
    containerAppName: containerAppName
    location: location
    managedEnvironmentId: containerAppEnvironment.id
    domainName: domainName
    certificateId: certificateModule.outputs.certificateId
    acrLoginServer: acr.properties.loginServer
    acrUsername: acr.listCredentials().username
    acrPassword: acr.listCredentials().passwords[0].value
    containerImage: containerImage
  }
}

// Outputs
output acrLoginServer string = acr.properties.loginServer
output acrName string = acr.name
output containerAppFqdn string = containerAppCustomDomainModule.outputs.containerAppFqdn
output storageAccountName string = storageAccount.name
output containerAppName string = containerAppCustomDomainModule.outputs.containerAppName
output resourceGroupName string = resourceGroup().name
output customDomainUrl string = 'https://${domainName}'
output managedCertificateId string = certificateModule.outputs.certificateId
