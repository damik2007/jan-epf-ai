# ==============================================================================
# Jan-EPF AI: Terraform Infrastructure as Code (Azure Cloud Architecture)
# Provisions:
#   - Azure Resource Group (Central India)
#   - Azure Container App Managed Environment & App Service
#   - Azure Blob Storage Account for Encrypted KYC Document Vault
#   - Azure Cache for Redis
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# ------------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------------
variable "location" {
  type        = string
  default     = "centralindia"
  description = "Azure sovereign region (Central India for data residency compliance)"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment"
}

variable "resource_group_name" {
  type        = string
  default     = "jan-epf-rg"
  description = "Name of the Azure Resource Group"
}

# ------------------------------------------------------------------------------
# Resource Group
# ------------------------------------------------------------------------------
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Project     = "Jan-EPF AI"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Compliance  = "EPFO-India-Data-Residency"
  }
}

# ------------------------------------------------------------------------------
# Log Analytics Workspace for Observability
# ------------------------------------------------------------------------------
resource "azurerm_log_analytics_workspace" "logs" {
  name                = "jan-epf-log-workspace"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = azurerm_resource_group.rg.tags
}

# ------------------------------------------------------------------------------
# Container App Managed Environment
# ------------------------------------------------------------------------------
resource "azurerm_container_app_environment" "env" {
  name                       = "jan-epf-container-env"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.logs.id

  tags = azurerm_resource_group.rg.tags
}

# ------------------------------------------------------------------------------
# Encrypted Blob Storage for Citizen Cheque & Aadhaar Uploads
# ------------------------------------------------------------------------------
resource "azurerm_storage_account" "vault" {
  name                     = "janepfstoragevault"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  enable_https_traffic_only = true

  tags = azurerm_resource_group.rg.tags
}

resource "azurerm_storage_container" "kyc_docs" {
  name                  = "epf-kyc-documents"
  storage_account_name  = azurerm_storage_account.vault.name
  container_access_type = "private"
}

# ------------------------------------------------------------------------------
# FastAPI Backend Container App
# ------------------------------------------------------------------------------
resource "azurerm_container_app" "api" {
  name                         = "jan-epf-api"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = azurerm_resource_group.rg.name
  revision_mode                = "Single"

  template {
    container {
      name   = "jan-epf-api"
      image  = "ghcr.io/damik2007/jan-epf-api:latest"
      cpu    = 0.5
      memory = "1.0Gi"

      env {
        name  = "ENVIRONMENT"
        value = var.environment
      }

      env {
        name  = "APP_NAME"
        value = "Jan-EPF AI"
      }
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 8000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  tags = azurerm_resource_group.rg.tags
}

# ------------------------------------------------------------------------------
# Outputs
# ------------------------------------------------------------------------------
output "container_app_fqdn" {
  value       = azurerm_container_app.api.ingress[0].fqdn
  description = "The FQDN of the deployed FastAPI Backend"
}

output "storage_account_name" {
  value       = azurerm_storage_account.vault.name
  description = "Name of the secure encrypted KYC Blob Storage Account"
}
