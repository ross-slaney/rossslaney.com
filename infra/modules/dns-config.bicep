@description('Domain name')
param domainName string

@description('Container App FQDN')
param containerAppFqdn string

@description('Custom domain verification ID for TXT record')
param customDomainVerificationId string

@description('Container Apps Environment static IP')
param containerAppsEnvironmentStaticIp string

// Reference existing DNS Zone
resource dnsZone 'Microsoft.Network/dnsZones@2023-07-01-preview' existing = {
  name: domainName
}

// Create A record for root domain pointing to Container Apps Environment static IP
resource aRecord 'Microsoft.Network/dnsZones/A@2023-07-01-preview' = {
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

// Create TXT record for domain verification (required for TXT validation)
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

// Create CNAME record for www subdomain (optional)
resource cnameRecord 'Microsoft.Network/dnsZones/CNAME@2023-07-01-preview' = {
  parent: dnsZone
  name: 'www'
  properties: {
    TTL: 300
    CNAMERecord: {
      cname: containerAppFqdn
    }
  }
}

// Outputs
output aRecordCreated bool = true
output txtRecordCreated bool = true
output cnameRecordCreated bool = true
