@description('Domain name')
param domainName string

@description('Container App FQDN - for reference only')
param containerAppFqdn string

@description('Custom domain verification ID for TXT record - for reference only')
param customDomainVerificationId string

@description('Container Apps Environment static IP - for reference only')
param containerAppsEnvironmentStaticIp string

@description('Front Door endpoint hostname')
param frontDoorEndpointHostName string

@description('Front Door endpoint resource ID')
param frontDoorEndpointId string

@description('Apex domain validation token from Front Door')
param apexDomainValidationToken string

@description('WWW domain validation token from Front Door')
param wwwDomainValidationToken string

@description('Files domain validation token from Front Door')
param filesDomainValidationToken string

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

// Create CNAME record for files subdomain pointing to Front Door
resource filesCnameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = {
  parent: dnsZone
  name: 'files'
  properties: {
    TTL: 3600
    CNAMERecord: {
      cname: frontDoorEndpointHostName
    }
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

// Front Door domain validation TXT record for files subdomain
resource filesDomainValidationTxtRecord 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = {
  parent: dnsZone
  name: '_dnsauth.files'
  properties: {
    TTL: 3600
    TXTRecords: [
      {
        value: [
          filesDomainValidationToken
        ]
      }
    ]
  }
}

// Outputs
output aRecordCreated bool = true
output txtRecordCreated bool = true
output cnameRecordCreated bool = true
