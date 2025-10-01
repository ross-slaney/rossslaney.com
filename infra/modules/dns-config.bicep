@description('Domain name')
param domainName string

@description('Container App FQDN')
param containerAppFqdn string

@description('Custom domain verification ID for TXT record')
param customDomainVerificationId string

@description('Container Apps Environment static IP')
param containerAppsEnvironmentStaticIp string

@description('Front Door endpoint hostname')
param frontDoorEndpointHostName string

@description('Front Door endpoint resource ID')
param frontDoorEndpointId string

@description('Apex domain validation token from Front Door')
param apexDomainValidationToken string

@description('WWW domain validation token from Front Door')
param wwwDomainValidationToken string

// Reference existing DNS Zone
resource dnsZone 'Microsoft.Network/dnsZones@2023-07-01-preview' existing = {
  name: domainName
}

// Create ALIAS record for apex domain pointing to Front Door endpoint
resource apexAliasRecord 'Microsoft.Network/dnsZones/A@2023-07-01-preview' = {
  parent: dnsZone
  name: '@'
  properties: {
    TTL: 3600
    targetResource: {
      id: frontDoorEndpointId
    }
  }
}

// Create CNAME record for www subdomain pointing to Front Door
resource wwwCnameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = {
  parent: dnsZone
  name: 'www'
  properties: {
    TTL: 3600
    CNAMERecord: {
      cname: frontDoorEndpointHostName
    }
  }
}

// Create TXT record for Container App domain verification (still needed for custom domain)
resource txtVerificationRecord 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = {
  parent: dnsZone
  name: 'asuid'
  properties: {
    TTL: 300
    TXTRecords: [
      {
        value: [
          customDomainVerificationId
        ]
      }
    ]
  }
}

// Front Door domain validation TXT record for apex domain
resource apexDomainValidationTxtRecord 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = {
  parent: dnsZone
  name: '_dnsauth'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          apexDomainValidationToken
        ]
      }
    ]
  }
}

// Front Door domain validation TXT record for www subdomain
resource wwwDomainValidationTxtRecord 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = {
  parent: dnsZone
  name: '_dnsauth.www'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          wwwDomainValidationToken
        ]
      }
    ]
  }
}

// Outputs
output aRecordCreated bool = true
output txtRecordCreated bool = true
output cnameRecordCreated bool = true
