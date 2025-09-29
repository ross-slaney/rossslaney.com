@description('Container App name')
param containerAppName string

@description('Location for the resources')
param location string

@description('Managed Environment ID')
param managedEnvironmentId string

@description('Domain name')
param domainName string

@description('Certificate ID')
param certificateId string

@description('ACR login server')
param acrLoginServer string

@description('User Assigned Managed Identity ID')
param uamiId string

@description('Container image')
param containerImage string

// Container App with custom domain and certificate (using UAMI)
resource containerAppWithDomain 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerAppName
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${uamiId}': {}
    }
  }
  properties: {
    managedEnvironmentId: managedEnvironmentId
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
        customDomains: [
          {
            name: domainName
            bindingType: 'SniEnabled'
            certificateId: certificateId
          }
        ]
      }
      registries: [
        {
          server: acrLoginServer
          identity: uamiId
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'main'
          image: containerImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'PORT'
              value: '3000'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '10'
              }
            }
          }
        ]
      }
    }
  }
}

// Outputs
output containerAppFqdn string = containerAppWithDomain.properties.configuration.ingress.fqdn
output containerAppName string = containerAppWithDomain.name
