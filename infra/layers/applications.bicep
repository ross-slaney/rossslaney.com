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

@description('User Assigned Managed Identity ID')
param uamiId string

@description('Storage Account Blob Endpoint')
param storageBlobEndpoint string

// Variables
var containerAppName = '${projectPrefix}-prod-app'

// DNS Zone is referenced in the dns-config module

// Extract Container Apps Environment name from ID
var containerAppsEnvName = split(containerAppsEnvId, '/')[8]

// Reference existing Container Apps Environment
resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' existing = {
  name: containerAppsEnvName
}

// Deploy Container App modules in sequence
module containerAppModule '../modules/container-app-uami.bicep' = {
  name: 'containerApp'
  params: {
    containerAppName: containerAppName
    location: location
    managedEnvironmentId: containerAppsEnvId
    acrLoginServer: acrLoginServer
    uamiId: uamiId
    containerImage: containerImage
  }
}

// Deploy Front Door for www redirect and files CDN
module frontDoorModule '../modules/front-door-www-redirect.bicep' = {
  name: 'frontDoorWwwRedirect'
  params: {
    domainName: domainName
    location: location
    containerAppFqdn: containerAppModule.outputs.containerAppFqdn
    storageBlobEndpoint: storageBlobEndpoint
    projectPrefix: projectPrefix
  }
}

// Deploy DNS configuration using outputs from Container App and Front Door
module dnsModule '../modules/dns-config.bicep' = {
  name: 'dnsConfig'
  params: {
    domainName: domainName
    containerAppFqdn: containerAppModule.outputs.containerAppFqdn
    customDomainVerificationId: containerAppModule.outputs.customDomainVerificationId
    containerAppsEnvironmentStaticIp: containerAppEnvironment.properties.staticIp
    frontDoorEndpointHostName: frontDoorModule.outputs.frontDoorEndpointHostName
    frontDoorEndpointId: frontDoorModule.outputs.frontDoorEndpointId
    apexDomainValidationToken: frontDoorModule.outputs.apexCustomDomainValidationToken
    wwwDomainValidationToken: frontDoorModule.outputs.wwwCustomDomainValidationToken
    filesDomainValidationToken: frontDoorModule.outputs.filesCustomDomainValidationToken
  }
  dependsOn: [
    frontDoorModule
  ]
}

// Outputs
output containerAppFqdn string = containerAppModule.outputs.containerAppFqdn
output containerAppName string = containerAppModule.outputs.containerAppName
output customDomainUrl string = 'https://${domainName}'
output filesCustomDomainUrl string = 'https://files.${domainName}'
output frontDoorEndpointHostName string = frontDoorModule.outputs.frontDoorEndpointHostName
output frontDoorProfileName string = frontDoorModule.outputs.frontDoorProfileName
