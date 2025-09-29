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

The Bicep template (`infra/main.bicep`) creates:

- **Azure Container Registry (ACR)**: Stores Docker images
- **Container App Environment**: Managed environment for container apps
- **Azure Container App**: Hosts the Next.js application
- **Log Analytics Workspace**: Centralized logging
- **Storage Account**: Blob storage for assets
- **DNS Integration**: Custom domain configuration

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

DNS is automatically configured during deployment! The Bicep template:

1. **References your existing DNS zone** using the `AZURE_DNSZONE_DOMAINNAME` secret
2. **Creates a CNAME record** pointing `@` to the Container App FQDN
3. **Configures the custom domain** on the Container App with SSL
4. **Handles the dependency chain** to ensure proper ordering

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
# Check deployment status
az deployment group show --resource-group rg-rossslaney-prod --name main

# View container app logs
az containerapp logs show --name rossslaney-prod-app --resource-group rg-rossslaney-prod

# Update container app manually
az containerapp update --name rossslaney-prod-app --resource-group rg-rossslaney-prod --image <new-image>

# Check DNS resolution
dig rossslaney.com
nslookup rossslaney.com
```

## Cost Optimization

- Container Apps use consumption-based pricing
- Storage account uses hot tier for frequently accessed assets
- Log Analytics has 30-day retention to control costs
- Basic ACR tier for development/small projects

## Security Considerations

- Container registry admin user is enabled for simplicity
- Consider using managed identity for production
- Storage account allows public blob access for assets
- HTTPS is enforced on the Container App
- Secrets are managed through GitHub repository secrets

## Next Steps

1. **Custom Domain SSL**: Azure automatically provisions SSL certificates
2. **CDN Integration**: Consider Azure CDN for global content delivery
3. **Monitoring**: Add Application Insights for detailed monitoring
4. **Backup**: Configure backup for critical data
5. **CI/CD Enhancements**: Add staging environments and blue-green deployments
