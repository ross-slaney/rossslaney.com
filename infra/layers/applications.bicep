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

// Deploy Front Door for www redirect
module frontDoorModule '../modules/front-door-www-redirect.bicep' = {
  name: 'frontDoorWwwRedirect'
  params: {
    domainName: domainName
    location: location
    containerAppFqdn: containerAppModule.outputs.containerAppFqdn
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
  }
  dependsOn: [
    frontDoorModule
  ]
}

// First, add custom domain to Container App without certificate
module containerAppCustomDomainModule '../modules/container-app-custom-domain-no-cert.bicep' = {
  name: 'containerAppCustomDomain'
  params: {
    containerAppName: containerAppName
    location: location
    managedEnvironmentId: containerAppsEnvId
    domainName: domainName
    acrLoginServer: acrLoginServer
    uamiId: uamiId
    containerImage: containerImage
  }
  dependsOn: [
    dnsModule
  ]
}

// Now create managed certificate after hostname is added
module certificateModule '../modules/managed-certificate.bicep' = {
  name: 'managedCertificate'
  params: {
    domainName: domainName
    location: location
    managedEnvironmentId: containerAppsEnvId
  }
  dependsOn: [
    containerAppCustomDomainModule
  ]
}

// Finally, update Container App to bind the certificate
module containerAppWithCertificateModule '../modules/container-app-bind-certificate.bicep' = {
  name: 'containerAppWithCertificate'
  params: {
    containerAppName: containerAppName
    location: location
    managedEnvironmentId: containerAppsEnvId
    domainName: domainName
    certificateId: certificateModule.outputs.certificateId
    acrLoginServer: acrLoginServer
    uamiId: uamiId
    containerImage: containerImage
  }
  dependsOn: [
    certificateModule
  ]
}

// Outputs
output containerAppFqdn string = containerAppWithCertificateModule.outputs.containerAppFqdn
output containerAppName string = containerAppWithCertificateModule.outputs.containerAppName
output customDomainUrl string = 'https://${domainName}'
output managedCertificateId string = certificateModule.outputs.certificateId
output frontDoorEndpointHostName string = frontDoorModule.outputs.frontDoorEndpointHostName
output frontDoorProfileName string = frontDoorModule.outputs.frontDoorProfileName
