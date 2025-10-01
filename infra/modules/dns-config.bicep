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

@description('Front Door profile name')
param frontDoorProfileName string

@description('Apex domain validation token for Front Door')
param apexDomainValidationToken string

@description('WWW domain validation token for Front Door')
param wwwDomainValidationToken string

// Reference existing DNS Zone
resource dnsZone 'Microsoft.Network/dnsZones@2023-07-01-preview' existing = {
  name: domainName
}

// Create ALIAS record for apex domain pointing to Front Door
// Note: ALIAS records are preferred over CNAME for apex domains
resource apexAliasRecord 'Microsoft.Network/dnsZones/A@2023-07-01-preview' = {
  parent: dnsZone
  name: '@'
  properties: {
    TTL: 300
    targetResource: {
      id: resourceId('Microsoft.Cdn/profiles', frontDoorProfileName)
    }
  }
}

// Create CNAME record for www subdomain pointing to Front Door
resource wwwCnameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = {
  parent: dnsZone
  name: 'www'
  properties: {
    TTL: 300
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

// Create TXT records for Front Door domain validation (apex domain)
resource apexDomainValidationTxtRecord 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = {
  parent: dnsZone
  name: '_dnsauth'
  properties: {
    TTL: 300
    TXTRecords: [
      {
        value: [
          apexDomainValidationToken
        ]
      }
    ]
  }
}

// Create TXT records for Front Door domain validation (www subdomain)
resource wwwDomainValidationTxtRecord 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = {
  parent: dnsZone
  name: '_dnsauth.www'
  properties: {
    TTL: 300
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
