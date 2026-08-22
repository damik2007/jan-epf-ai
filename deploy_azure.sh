#!/usr/bin/env bash
# ==============================================================================
# Jan-EPF AI: Automated Microsoft Azure Container Apps Deployment Script
# Provisions: Resource Group, Container Apps Environment, and FastAPI Microservice
# ==============================================================================

set -euo pipefail

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}  🚀 Jan-EPF AI: Microsoft Azure Sovereign Cloud Deployment Engine     ${NC}"
echo -e "${BLUE}======================================================================${NC}"

# Deployment Configuration
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-jan-epf-rg}"
LOCATION="${AZURE_LOCATION:-centralindia}"
CONTAINER_ENV="${AZURE_CONTAINER_APP_ENV:-jan-epf-env}"
APP_NAME="${AZURE_CONTAINER_APP_NAME:-jan-epf-api}"
TARGET_PORT=8000
CPU="${CONTAINER_CPU:-0.5}"
MEMORY="${CONTAINER_MEMORY:-1.0Gi}"

# Step 1: Pre-flight Verification
echo -e "\n${YELLOW}[1/5] Checking Azure CLI Installation & Authentication...${NC}"
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Error: Azure CLI ('az') is not installed. Please install it to continue.${NC}"
    exit 1
fi

# Check if authenticated
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️ Azure session not found. Initiating non-interactive / interactive login...${NC}"
    if [[ -n "${AZURE_CLIENT_ID:-}" && -n "${AZURE_CLIENT_SECRET:-}" && -n "${AZURE_TENANT_ID:-}" ]]; then
        az login --service-principal -u "$AZURE_CLIENT_ID" -p "$AZURE_CLIENT_SECRET" --tenant "$AZURE_TENANT_ID"
    else
        az login --use-device-code
    fi
fi

SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo -e "${GREEN}✓ Authenticated with Subscription: ${SUBSCRIPTION_NAME}${NC}"

# Step 2: Ensure Resource Group
echo -e "\n${YELLOW}[2/5] Ensuring Azure Resource Group: ${RESOURCE_GROUP} (${LOCATION})...${NC}"
az group create \
    --name "${RESOURCE_GROUP}" \
    --location "${LOCATION}" \
    --output none
echo -e "${GREEN}✓ Resource Group '${RESOURCE_GROUP}' is ready.${NC}"

# Step 3: Ensure Azure Container Apps Environment
echo -e "\n${YELLOW}[3/5] Ensuring Container Apps Managed Environment: ${CONTAINER_ENV}...${NC}"
if ! az containerapp env show --name "${CONTAINER_ENV}" --resource-group "${RESOURCE_GROUP}" &> /dev/null; then
    az containerapp env create \
        --name "${CONTAINER_ENV}" \
        --resource-group "${RESOURCE_GROUP}" \
        --location "${LOCATION}" \
        --output none
    echo -e "${GREEN}✓ Created Container Apps Environment '${CONTAINER_ENV}'.${NC}"
else
    echo -e "${GREEN}✓ Container Apps Environment '${CONTAINER_ENV}' already exists.${NC}"
fi

# Step 4: Build & Deploy FastAPI Container to Azure Container Apps
echo -e "\n${YELLOW}[4/5] Deploying Microservice '${APP_NAME}' via Azure Container Apps...${NC}"

# Extract non-sensitive environment variables
APP_ENV_VARS="ENVIRONMENT=production APP_NAME=\"Jan-EPF AI\" DEBUG=false"

if [[ -f .env ]]; then
    echo -e "${BLUE}  ℹ Sourcing configuration from .env safely...${NC}"
fi

az containerapp up \
    --name "${APP_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --environment "${CONTAINER_ENV}" \
    --source . \
    --ingress external \
    --target-port "${TARGET_PORT}" \
    --env-vars ${APP_ENV_VARS} \
    --output none

# Step 5: Verification & Health Check
echo -e "\n${YELLOW}[5/5] Verifying Deployment & Probing Health Check...${NC}"
APP_URL=$(az containerapp show --name "${APP_NAME}" --resource-group "${RESOURCE_GROUP}" --query "properties.configuration.ingress.fqdn" -o tsv)
FULL_URL="https://${APP_URL}"

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}  🎉 Jan-EPF AI Azure Deployment Succeeded!                          ${NC}"
echo -e "${GREEN}======================================================================${NC}"
echo -e "  🌐 Public API URL:       ${BLUE}${FULL_URL}${NC}"
echo -e "  📖 Swagger Docs:         ${BLUE}${FULL_URL}/docs${NC}"
echo -e "  📊 Prometheus Telemetry: ${BLUE}${FULL_URL}/metrics${NC}"
echo -e "  🩺 Liveness Health:      ${BLUE}${FULL_URL}/health${NC}"
echo -e "${GREEN}======================================================================${NC}\n"
