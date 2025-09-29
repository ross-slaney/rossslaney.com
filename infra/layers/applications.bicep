@description('Location for all resources')
param location string = resourceGroup().location

@description('Project prefix for naming')
param projectPrefix string

@description('Container Apps Environment ID')
param containerAppsEnvId string

@description('ACR login server')
param acrLoginServer string

@description('Container image')
param containerImage string

@description('Domain name for custom domain')
param domainName string

// Variables
var containerAppName = '${projectPrefix}-prod-app'

// Reference existing DNS Zone
resource dnsZone 'Microsoft.Network/dnsZones@2023-07-01-preview' existing = {
  name: domainName
}

// Extract Container Apps Environment name from ID
var containerAppsEnvName = split(containerAppsEnvId, '/')[8]

// Reference existing Container Apps Environment
resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' existing = {
  name: containerAppsEnvName
}

// Deploy Container App modules in sequence
module containerAppModule '../modules/container-app.bicep' = {
  name: 'containerApp'
  params: {
    containerAppName: containerAppName
    location: location
    managedEnvironmentId: containerAppsEnvId
    acrLoginServer: acrLoginServer
    acrUsername: 'dummy' // Will be updated to use managed identity
    acrPassword: 'dummy' // Will be updated to use managed identity
    containerImage: containerImage
  }
}

// Deploy DNS configuration using outputs from Container App
module dnsModule '../modules/dns-config.bicep' = {
  name: 'dnsConfig'
  params: {
    domainName: domainName
    containerAppFqdn: containerAppModule.outputs.containerAppFqdn
    customDomainVerificationId: containerAppModule.outputs.customDomainVerificationId
    containerAppsEnvironmentStaticIp: containerAppEnvironment.properties.staticIp
  }
}

// Deploy managed certificate after DNS is configured
module certificateModule '../modules/managed-certificate.bicep' = {
  name: 'managedCertificate'
  params: {
    domainName: domainName
    location: location
    managedEnvironmentId: containerAppsEnvId
  }
  dependsOn: [
    dnsModule
  ]
}

// Update Container App with custom domain and certificate
module containerAppCustomDomainModule '../modules/container-app-custom-domain.bicep' = {
  name: 'containerAppCustomDomain'
  params: {
    containerAppName: containerAppName
    location: location
    managedEnvironmentId: containerAppsEnvId
    domainName: domainName
    certificateId: certificateModule.outputs.certificateId
    acrLoginServer: acrLoginServer
    acrUsername: 'dummy' // Will be updated to use managed identity
    acrPassword: 'dummy' // Will be updated to use managed identity
    containerImage: containerImage
  }
}

// Outputs
output containerAppFqdn string = containerAppCustomDomainModule.outputs.containerAppFqdn
output containerAppName string = containerAppCustomDomainModule.outputs.containerAppName
output customDomainUrl string = 'https://${domainName}'
output managedCertificateId string = certificateModule.outputs.certificateId
