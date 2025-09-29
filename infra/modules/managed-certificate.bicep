@description('Domain name')
param domainName string

@description('Location for the resources')
param location string

@description('Managed Environment ID')
param managedEnvironmentId string

// Reference existing managed environment
resource managedEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' existing = {
  name: split(managedEnvironmentId, '/')[8] // Extract name from resource ID
}

// Managed certificate for custom domain
resource managedCertificate 'Microsoft.App/managedEnvironments/managedCertificates@2024-03-01' = {
  parent: managedEnvironment
  name: '${replace(domainName, '.', '-')}-cert'
  location: location
  properties: {
    subjectName: domainName
    domainControlValidation: 'TXT'
  }
}

// Outputs
output certificateId string = managedCertificate.id
