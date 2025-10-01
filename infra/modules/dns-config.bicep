@description('Domain name')
param domainName string

@description('Container App FQDN')
param containerAppFqdn string

@description('Custom domain verification ID for TXT record')
param customDomainVerificationId string

@description('Container Apps Environment static IP')
param containerAppsEnvironmentStaticIp string

@description('Front Door endpoint hostname (optional, for Front Door setup)')
param frontDoorEndpointHostName string = ''

@description('Apex domain validation token for Front Door (optional)')
param apexDomainValidationToken string = ''

@description('WWW domain validation token for Front Door (optional)')
param wwwDomainValidationToken string = ''

// Reference existing DNS Zone
resource dnsZone 'Microsoft.Network/dnsZones@2023-07-01-preview' existing = {
  name: domainName
}

// Create A record for root domain pointing to Container Apps Environment static IP
// This will be used as fallback or when not using Front Door
resource aRecord 'Microsoft.Network/dnsZones/A@2023-07-01-preview' = if (frontDoorEndpointHostName == '') {
  parent: dnsZone
  name: '@'
  properties: {
    TTL: 300
    ARecords: [
      {
        ipv4Address: containerAppsEnvironmentStaticIp
      }
    ]
  }
}

// Create CNAME record for apex domain pointing to Front Door (when using Front Door)
resource apexCnameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = if (frontDoorEndpointHostName != '') {
  parent: dnsZone
  name: '@'
  properties: {
    TTL: 300
    CNAMERecord: {
      cname: frontDoorEndpointHostName
    }
  }
}

// Create CNAME record for www subdomain pointing to Front Door
resource wwwCnameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = if (frontDoorEndpointHostName != '') {
  parent: dnsZone
  name: 'www'
  properties: {
    TTL: 300
    CNAMERecord: {
      cname: frontDoorEndpointHostName
    }
  }
}

// Create CNAME record for www subdomain pointing to Container App (fallback)
resource cnameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = if (frontDoorEndpointHostName == '') {
  parent: dnsZone
  name: 'www'
  properties: {
    TTL: 300
    CNAMERecord: {
      cname: containerAppFqdn
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
resource apexDomainValidationTxtRecord 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = if (apexDomainValidationToken != '') {
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
resource wwwDomainValidationTxtRecord 'Microsoft.Network/dnsZones/TXT@2023-07-01-preview' = if (wwwDomainValidationToken != '') {
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
