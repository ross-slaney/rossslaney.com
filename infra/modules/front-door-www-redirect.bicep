@description('Domain name (apex domain)')
param domainName string

@description('Location for the resources')
param location string

@description('Container App FQDN (backend)')
param containerAppFqdn string

@description('Project prefix for naming')
param projectPrefix string

// Variables
var frontDoorProfileName = '${projectPrefix}-frontdoor-profile'
var frontDoorEndpointName = '${projectPrefix}-frontdoor-endpoint'

// Azure Front Door Profile
resource frontDoorProfile 'Microsoft.Cdn/profiles@2024-02-01' = {
  name: frontDoorProfileName
  location: 'global'
  sku: {
    name: 'Standard_AzureFrontDoor'
  }
  properties: {}
}

// Front Door Endpoint
resource frontDoorEndpoint 'Microsoft.Cdn/profiles/afdEndpoints@2024-02-01' = {
  parent: frontDoorProfile
  name: frontDoorEndpointName
  location: 'global'
  properties: {
    enabledState: 'Enabled'
  }
}

// Origin Group for Container App
resource originGroup 'Microsoft.Cdn/profiles/originGroups@2024-02-01' = {
  parent: frontDoorProfile
  name: 'container-app-origin-group'
  properties: {
    loadBalancingSettings: {
      sampleSize: 4
      successfulSamplesRequired: 3
      additionalLatencyInMilliseconds: 50
    }
    healthProbeSettings: {
      probePath: '/'
      probeRequestType: 'HEAD'
      probeProtocol: 'Https'
      probeIntervalInSeconds: 100
    }
  }
}

// Origin for Container App
resource origin 'Microsoft.Cdn/profiles/originGroups/origins@2024-02-01' = {
  parent: originGroup
  name: 'container-app-origin'
  properties: {
    hostName: containerAppFqdn
    httpPort: 80
    httpsPort: 443
    originHostHeader: containerAppFqdn
    priority: 1
    weight: 1000
    enabledState: 'Enabled'
    enforceCertificateNameCheck: true
  }
}

// Custom Domain for apex domain
resource apexCustomDomain 'Microsoft.Cdn/profiles/customDomains@2024-02-01' = {
  parent: frontDoorProfile
  name: replace(domainName, '.', '-')
  properties: {
    hostName: domainName
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}

// Custom Domain for www subdomain
resource wwwCustomDomain 'Microsoft.Cdn/profiles/customDomains@2024-02-01' = {
  parent: frontDoorProfile
  name: 'www-${replace(domainName, '.', '-')}'
  properties: {
    hostName: 'www.${domainName}'
    tlsSettings: {
      certificateType: 'ManagedCertificate'
      minimumTlsVersion: 'TLS12'
    }
  }
}

// Rule Set for www redirect
resource wwwRedirectRuleSet 'Microsoft.Cdn/profiles/ruleSets@2024-02-01' = {
  parent: frontDoorProfile
  name: 'wwwRedirectRuleSet'
}

// Rule for redirecting www to apex
resource wwwRedirectRule 'Microsoft.Cdn/profiles/ruleSets/rules@2024-02-01' = {
  parent: wwwRedirectRuleSet
  name: 'wwwToApexRedirect'
  properties: {
    order: 1
    conditions: [
      {
        name: 'RequestHeader'
        parameters: {
          '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleRequestHeaderConditionParameters'
          selector: 'Host'
          operator: 'Equal'
          matchValues: [
            'www.${domainName}'
          ]
          transforms: []
          negateCondition: false
        }
      }
    ]
    actions: [
      {
        name: 'UrlRedirect'
        parameters: {
          '@odata.type': '#Microsoft.Azure.Cdn.Models.DeliveryRuleUrlRedirectActionParameters'
          redirectType: 'PermanentRedirect'
          destinationProtocol: 'Https'
          customHostname: domainName
          customPath: ''
          customQueryString: ''
          customFragment: ''
        }
      }
    ]
  }
}

// Route for apex domain (forward to Container App)
resource apexRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2024-02-01' = {
  parent: frontDoorEndpoint
  name: 'apex-route'
  properties: {
    customDomains: [
      {
        id: apexCustomDomain.id
      }
    ]
    originGroup: {
      id: originGroup.id
    }
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    forwardingProtocol: 'HttpsOnly'
    linkToDefaultDomain: 'Enabled'
    httpsRedirect: 'Enabled'
    enabledState: 'Enabled'
  }
  dependsOn: [
    origin
  ]
}

// Route for www subdomain (redirect to apex)
resource wwwRoute 'Microsoft.Cdn/profiles/afdEndpoints/routes@2024-02-01' = {
  parent: frontDoorEndpoint
  name: 'www-redirect-route'
  properties: {
    customDomains: [
      {
        id: wwwCustomDomain.id
      }
    ]
    originGroup: {
      id: originGroup.id
    }
    supportedProtocols: [
      'Http'
      'Https'
    ]
    patternsToMatch: [
      '/*'
    ]
    linkToDefaultDomain: 'Disabled'
    httpsRedirect: 'Enabled'
    ruleSets: [
      {
        id: wwwRedirectRuleSet.id
      }
    ]
    enabledState: 'Enabled'
  }
  dependsOn: [
    origin
    wwwRedirectRule
  ]
}

// Outputs
output frontDoorEndpointHostName string = frontDoorEndpoint.properties.hostName
output frontDoorProfileName string = frontDoorProfile.name
// Note: Validation tokens will be available after domain validation is complete
output apexCustomDomainValidationToken string = ''
output wwwCustomDomainValidationToken string = ''
