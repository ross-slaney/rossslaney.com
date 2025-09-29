#!/bin/bash

# Validation script for Azure deployment setup
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Validating Azure Deployment Setup${NC}"
echo "====================================="

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed${NC}"
    echo -e "${YELLOW}💡 Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Azure CLI is installed${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo -e "${YELLOW}💡 Install it from: https://docs.docker.com/get-docker/${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is installed${NC}"

# Check if logged into Azure
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into Azure CLI${NC}"
    echo -e "${YELLOW}💡 Run: az login${NC}"
else
    SUBSCRIPTION=$(az account show --query name --output tsv)
    echo -e "${GREEN}✅ Logged into Azure CLI (Subscription: $SUBSCRIPTION)${NC}"
fi

# Check required files exist
FILES=(
    "Dockerfile"
    "infra/main.bicep"
    "infra/main.parameters.json"
    ".github/workflows/deploy.yml"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file is missing${NC}"
    fi
done

# Validate Bicep template
echo -e "${BLUE}🔍 Validating Bicep template...${NC}"
if az bicep build --file infra/main.bicep --stdout > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Bicep template is valid${NC}"
else
    echo -e "${RED}❌ Bicep template has errors${NC}"
    echo -e "${YELLOW}💡 Run: az bicep build --file infra/main.bicep${NC}"
fi

# Check GitHub secrets (if in GitHub Actions environment)
if [ "$GITHUB_ACTIONS" = "true" ]; then
    echo -e "${BLUE}🔍 GitHub Actions environment detected${NC}"
    
    REQUIRED_SECRETS=(
        "AZURE_CREDENTIALS"
        "AZURE_DNSZONE_DOMAINNAME"
    )
    
    for secret in "${REQUIRED_SECRETS[@]}"; do
        if [ -n "${!secret}" ]; then
            echo -e "${GREEN}✅ $secret is set${NC}"
        else
            echo -e "${RED}❌ $secret is not set${NC}"
        fi
    done
fi

# Test Docker build
echo -e "${BLUE}🐳 Testing Docker build...${NC}"
if docker build -t test-build . > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker build successful${NC}"
    docker rmi test-build > /dev/null 2>&1
else
    echo -e "${RED}❌ Docker build failed${NC}"
    echo -e "${YELLOW}💡 Check your Dockerfile and dependencies${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Validation Complete!${NC}"
echo "======================"
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "1. Ensure GitHub repository secrets are configured"
echo "2. Ensure your DNS zone exists in Azure"
echo "3. Push to main branch to trigger deployment"
echo "4. Monitor deployment in GitHub Actions"
echo "5. Your app will be automatically available at your custom domain!"
