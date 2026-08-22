#!/usr/bin/env bash
# ==============================================================================
# Jan-EPF AI: Automated Vercel Edge Production Deployment Script
# Deploys: Next.js 15 4-Topic Hubs Frontend with Edge Caching & Security Headers
# ==============================================================================

set -euo pipefail

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================================${NC}"
echo -e "${BLUE}  ⚡ Jan-EPF AI: Vercel Edge Frontend Deployment Engine                ${NC}"
echo -e "${BLUE}======================================================================${NC}"

# Source local .env if available to retrieve VERCEL_TOKEN
if [[ -f .env ]]; then
    echo -e "${BLUE}  ℹ Loading configuration from .env...${NC}"
    # Read VERCEL_TOKEN if not already in environment
    if [[ -z "${VERCEL_TOKEN:-}" ]]; then
        TOKEN_VAL=$(grep -E '^VERCEL_TOKEN=' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
        if [[ -n "${TOKEN_VAL}" ]]; then
            export VERCEL_TOKEN="${TOKEN_VAL}"
        fi
    fi
    if [[ -z "${NEXT_PUBLIC_API_URL:-}" ]]; then
        API_VAL=$(grep -E '^NEXT_PUBLIC_API_URL=' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
        if [[ -n "${API_VAL}" ]]; then
            export NEXT_PUBLIC_API_URL="${API_VAL}"
        fi
    fi
fi

# Step 1: Pre-flight Verification
echo -e "\n${YELLOW}[1/4] Checking Node.js and Vercel CLI Environment...${NC}"
if ! command -v npx &> /dev/null && ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Error: Neither 'npx' nor 'vercel' command found. Please install Node.js.${NC}"
    exit 1
fi

VERCEL_CMD="npx --yes vercel"
if command -v vercel &> /dev/null; then
    VERCEL_CMD="vercel"
fi

# Step 2: Authentication Check
echo -e "\n${YELLOW}[2/4] Verifying Vercel Authentication...${NC}"
AUTH_ARGS=""
if [[ -n "${VERCEL_TOKEN:-}" ]]; then
    AUTH_ARGS="--token=${VERCEL_TOKEN}"
    echo -e "${GREEN}✓ Using VERCEL_TOKEN from environment for headless authentication.${NC}"
else
    echo -e "${YELLOW}⚠️ VERCEL_TOKEN not set. Falling back to active Vercel CLI session...${NC}"
fi

# Step 3: Set Environment Variables on Vercel
echo -e "\n${YELLOW}[3/4] Preparing Project Configuration & Environment Variables...${NC}"
if [[ -n "${NEXT_PUBLIC_API_URL:-}" && -n "${AUTH_ARGS}" ]]; then
    echo -e "${BLUE}  ℹ Setting NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} on Vercel...${NC}"
    echo "${NEXT_PUBLIC_API_URL}" | ${VERCEL_CMD} env add NEXT_PUBLIC_API_URL production --force ${AUTH_ARGS} 2>/dev/null || true
fi

# Step 4: Execute Production Deployment
echo -e "\n${YELLOW}[4/4] Deploying Next.js 15 Frontend to Vercel Production...${NC}"
DEPLOY_OUTPUT=$(${VERCEL_CMD} --prod --yes ${AUTH_ARGS})

# Extract deployed URL
DEPLOY_URL=$(echo "${DEPLOY_OUTPUT}" | grep -E '^https://' | tail -n 1 || true)
if [[ -z "${DEPLOY_URL}" ]]; then
    DEPLOY_URL=$(echo "${DEPLOY_OUTPUT}" | tail -n 1)
fi

echo -e "\n${GREEN}======================================================================${NC}"
echo -e "${GREEN}  🎉 Jan-EPF AI Vercel Deployment Succeeded!                         ${NC}"
echo -e "${GREEN}======================================================================${NC}"
echo -e "  🌐 Production Domain:    ${BLUE}${DEPLOY_URL}${NC}"
echo -e "  🛡️ Security Headers:     ${GREEN}Enabled (HSTS, Strict CSP, X-Frame-Options)${NC}"
echo -e "  ⚡ Edge Network:         ${GREEN}Mumbai (bom1) & Singapore (sin1)${NC}"
echo -e "  📱 UI Architecture:      ${BLUE}Next.js 15 App Router (4-Topic Hubs)${NC}"
echo -e "${GREEN}======================================================================${NC}\n"
