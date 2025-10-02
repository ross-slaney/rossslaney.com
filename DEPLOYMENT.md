# Azure Deployment Guide

This document describes how to deploy the rossslaney.com Next.js application to Azure Container Apps using Bicep infrastructure as code and GitHub Actions.

## Prerequisites

1. **Azure Subscription** with sufficient permissions to create resources
2. **GitHub Repository** with the following secrets configured:
   - `AZURE_CREDENTIALS`: Service principal JSON with Owner rights
   - `AZURE_DNSZONE_DOMAINNAME`: Your domain name (e.g., "rossslaney.com")
   - `AZURE_LOCATION`: Azure region (e.g., "eastus")
   - `AZURE_RESOURCE_GROUP`: Resource group name (e.g., "rg-rossslaney-prod")
   - `NAME_PREFIX`: Prefix for resource names (e.g., "rossslaney")

## Infrastructure Components

The deployment uses a layered Bicep architecture:

### Layer 1: Foundation (`infra/layers/foundation.bicep`)

- **Azure Container Registry (ACR)**: Stores Docker images with managed identity authentication
- **Container App Environment**: Managed environment for container apps
- **Log Analytics Workspace**: Centralized logging
- **Storage Account**: Blob storage for assets
- **User Assigned Managed Identity (UAMI)**: Secure ACR access

### Layer 2: Applications (`infra/layers/applications.bicep`)

- **Azure Container App**: Hosts the Next.js application
- **Azure Front Door**: Global CDN with custom domain and SSL
- **DNS Configuration**: Automated DNS records for custom domain
- **www → apex redirect**: Automatic redirect from www to apex domain

## Deployment Process

### Automatic Deployment

1. **Push to main branch** triggers the GitHub workflow automatically
2. The workflow:
   - Creates/updates Azure infrastructure using Bicep
   - Builds and pushes Docker image to ACR
   - Updates Container App with new image
   - Provides DNS configuration instructions

### Manual Deployment

You can also trigger deployment manually:

1. Go to GitHub Actions tab
2. Select "Deploy to Azure Container Apps" workflow
3. Click "Run workflow"

## DNS Configuration

DNS is automatically configured during deployment! The infrastructure creates:

1. **A record (apex domain)**: Points to Azure Front Door using ALIAS record
2. **CNAME record (www subdomain)**: Points to Azure Front Door
3. **TXT records**: Front Door domain validation for SSL certificate issuance
4. **Front Door routing**: Routes traffic from custom domain to Container App

The Container App uses its default `.azurecontainerapps.io` domain, while Front Door handles:

- Custom domain SSL/TLS certificates
- Global CDN and caching
- www to apex domain redirect

No manual DNS configuration is required - everything is automated!

## Environment Variables

The application uses these environment variables:

- `NODE_ENV`: Set to "production"
- `PORT`: Set to "3000"

Add additional environment variables in the Bicep template under the `env` section of the container configuration.

## Scaling Configuration

The Container App is configured with:

- **Min replicas**: 1
- **Max replicas**: 3
- **CPU**: 0.25 cores
- **Memory**: 0.5 GB
- **Scaling rule**: HTTP-based (10 concurrent requests per replica)

## Storage Account

A blob storage account is created for storing assets:

- **Account name**: `{namePrefix}{environment}storage`
- **Container**: `assets` (public access)
- **Tier**: Hot
- **Replication**: LRS (Locally Redundant Storage)

## Monitoring

- **Log Analytics**: Centralized logging for all container apps
- **Application Insights**: Can be added for detailed application monitoring
- **Container App logs**: Available through Azure portal or CLI

## Troubleshooting

### Common Issues

1. **DNS not resolving**: Wait for DNS propagation (up to 48 hours)
2. **SSL certificate issues**: Azure automatically provisions certificates for custom domains
3. **Container startup failures**: Check container logs in Azure portal
4. **Build failures**: Verify Dockerfile and dependencies

### Useful Commands

```bash
# Check foundation deployment status
az deployment group show --resource-group FOUNDATION --name foundation

# Check applications deployment status
az deployment group show --resource-group FOUNDATION --name applications

# View container app logs
az containerapp logs show --name ross-prod-app --resource-group FOUNDATION

# Update container app manually
az containerapp update --name ross-prod-app --resource-group FOUNDATION --image <new-image>

# Check DNS resolution
dig rossslaney.com
nslookup rossslaney.com

# Check Front Door status
az afd profile show --profile-name <profile-name> --resource-group FOUNDATION
```

## Cost Optimization

- Container Apps use consumption-based pricing
- Storage account uses hot tier for frequently accessed assets
- Log Analytics has 30-day retention to control costs
- Basic ACR tier for development/small projects

## Security Considerations

- **Managed Identity**: Uses User Assigned Managed Identity for ACR authentication (no passwords stored)
- **Front Door SSL**: Automatic managed SSL/TLS certificates from Azure
- **HTTPS-only**: All traffic is forced to HTTPS through Front Door
- **Storage Access**: Blob storage allows public access for static assets
- **Secrets**: Managed through GitHub repository secrets and Azure Key Vault ready

## Architecture Benefits

- ✅ **Global Performance**: Azure Front Door provides global CDN and edge caching
- ✅ **Automatic SSL**: Managed certificates with auto-renewal
- ✅ **www Redirect**: Automatic redirect from www to apex domain
- ✅ **Secure Authentication**: Managed identity for container registry (no passwords)
- ✅ **Scalable**: Container Apps auto-scale based on HTTP traffic
- ✅ **Cost Effective**: Consumption-based pricing for all services

## Next Steps

1. **Monitoring**: Add Application Insights for detailed application monitoring
2. **Staging Environment**: Deploy a staging layer for pre-production testing
3. **Custom Caching**: Configure Front Door caching rules for optimal performance
4. **WAF Protection**: Enable Web Application Firewall on Front Door for security
5. **Backup**: Configure backup for critical data in storage account
6. **Custom Error Pages**: Configure custom 404/500 pages in Front Door
