#!/bin/bash

# Artisan AI Infrastructure Deployment Script
# This script automates the deployment of AWS infrastructure using Terraform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
TERRAFORM_DIR="./terraform"
ENVIRONMENT="${1:-prod}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Artisan AI Infrastructure Deployment${NC}"
echo -e "${GREEN}Environment: ${ENVIRONMENT}${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Error: Terraform is not installed${NC}"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Navigate to Terraform directory
cd "$TERRAFORM_DIR"

# Initialize Terraform
echo -e "${YELLOW}Initializing Terraform...${NC}"
terraform init

# Validate configuration
echo -e "${YELLOW}Validating Terraform configuration...${NC}"
terraform validate

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Terraform validation failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Terraform validation passed${NC}"
echo ""

# Create plan
echo -e "${YELLOW}Creating Terraform plan...${NC}"
terraform plan \
    -var="environment=${ENVIRONMENT}" \
    -out=tfplan

echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Review the plan above carefully!${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

read -p "Do you want to apply this plan? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}Deployment cancelled${NC}"
    rm -f tfplan
    exit 0
fi

# Apply plan
echo ""
echo -e "${YELLOW}Applying Terraform plan...${NC}"
terraform apply tfplan

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Terraform apply failed${NC}"
    exit 1
fi

# Clean up plan file
rm -f tfplan

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Infrastructure deployed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Display outputs
echo -e "${YELLOW}Infrastructure Outputs:${NC}"
terraform output

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Retrieve secrets from AWS Secrets Manager"
echo "2. Configure application environment variables"
echo "3. Deploy application to ECS"
echo "4. Configure domain and SSL certificate"
echo ""

echo -e "${GREEN}Deployment complete!${NC}"
