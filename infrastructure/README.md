# Artisan AI - AWS Infrastructure

Complete AWS infrastructure setup using Terraform for the Artisan AI platform.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         AWS Cloud                            │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    VPC (10.0.0.0/16)                   │ │
│  │                                                         │ │
│  │  ┌──────────────────┐    ┌──────────────────┐         │ │
│  │  │  Public Subnet   │    │  Public Subnet   │         │ │
│  │  │   (AZ-1)         │    │   (AZ-2)         │         │ │
│  │  │                  │    │                  │         │ │
│  │  │  ┌────────────┐  │    │  ┌────────────┐  │         │ │
│  │  │  │    ALB     │  │    │  │   NAT GW   │  │         │ │
│  │  │  └────────────┘  │    │  └────────────┘  │         │ │
│  │  └──────────────────┘    └──────────────────┘         │ │
│  │                                                         │ │
│  │  ┌──────────────────┐    ┌──────────────────┐         │ │
│  │  │ Private Subnet   │    │ Private Subnet   │         │ │
│  │  │   (AZ-1)         │    │   (AZ-2)         │         │ │
│  │  │                  │    │                  │         │ │
│  │  │  ┌────────────┐  │    │  ┌────────────┐  │         │ │
│  │  │  │ ECS Tasks  │  │    │  │ ECS Tasks  │  │         │ │
│  │  │  └────────────┘  │    │  └────────────┘  │         │ │
│  │  │                  │    │                  │         │ │
│  │  │  ┌────────────┐  │    │  ┌────────────┐  │         │ │
│  │  │  │    RDS     │  │    │  │   Redis    │  │         │ │
│  │  │  └────────────┘  │    │  └────────────┘  │         │ │
│  │  └──────────────────┘    └──────────────────┘         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │     S3      │  │ CloudFront  │  │ Secrets Manager  │   │
│  │  (3 buckets)│  │   (2 CDNs)  │  │                  │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Bedrock   │  │ Transcribe  │  │  Rekognition     │   │
│  │  (Claude)   │  │             │  │                  │   │
│  └─────────────┘  └─────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Infrastructure Components

### 1. Networking (VPC)
- **VPC**: 10.0.0.0/16 CIDR block
- **Public Subnets**: 2 subnets across 2 AZs for high availability
- **Private Subnets**: 2 subnets for application and database
- **Internet Gateway**: For public subnet internet access
- **NAT Gateway**: For private subnet outbound internet access
- **VPC Endpoints**: S3 endpoint for cost optimization

### 2. Database (RDS PostgreSQL)
- **Engine**: PostgreSQL 15.4
- **Instance**: db.t3.micro (configurable)
- **Storage**: 20GB GP3 with auto-scaling up to 100GB
- **Encryption**: At rest and in transit
- **Backups**: 7-day retention, automated daily backups
- **Monitoring**: Enhanced monitoring with CloudWatch
- **Multi-AZ**: Disabled by default (enable for production)

### 3. Cache (ElastiCache Redis)
- **Engine**: Redis 7.0
- **Node Type**: cache.t3.micro (configurable)
- **Nodes**: 1 (single node for dev/staging)
- **Snapshots**: 5-day retention
- **Encryption**: At rest and in transit

### 4. Storage (S3)
- **Media Bucket**: Product images, artisan photos
- **Audio Bucket**: Voice notes from artisans
- **QR Codes Bucket**: Generated QR codes (public read)
- **Features**:
  - Versioning enabled
  - Server-side encryption (AES256)
  - Lifecycle policies (transition to IA/Glacier)
  - CORS configuration

### 5. CDN (CloudFront)
- **Media Distribution**: For product images and media
- **QR Codes Distribution**: For QR code images
- **Features**:
  - HTTPS redirect
  - Compression enabled
  - Global edge locations
  - Origin Access Identity for S3

### 6. Secrets Management
- **AWS Secrets Manager**: Stores sensitive credentials
  - Database credentials
  - Redis connection info
  - S3 bucket names
  - Application secrets
- **Automatic Rotation**: Supported for RDS passwords

### 7. Monitoring (CloudWatch)
- **Log Groups**: Application and RDS logs
- **Alarms**:
  - RDS CPU utilization (>80%)
  - RDS storage space (<5GB)
  - RDS connections (>80)
  - Redis CPU utilization (>75%)
  - Redis memory usage (>80%)
- **Dashboard**: Centralized monitoring view

### 8. IAM Roles & Policies
- **ECS Task Execution Role**: For pulling images and secrets
- **ECS Task Role**: For application AWS service access
  - S3 read/write access
  - Secrets Manager read access
  - Bedrock, Transcribe, Rekognition access
  - CloudWatch Logs write access

## Prerequisites

1. **AWS Account**: Active AWS account with appropriate permissions
2. **AWS CLI**: Installed and configured
   ```bash
   aws configure
   ```
3. **Terraform**: Version >= 1.0
   ```bash
   # macOS
   brew install terraform
   
   # Windows
   choco install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```

4. **AWS Permissions**: IAM user/role with permissions for:
   - VPC, EC2, RDS, ElastiCache
   - S3, CloudFront
   - IAM, Secrets Manager
   - CloudWatch
   - Bedrock, Transcribe, Rekognition

## Deployment Steps

### Step 1: Initialize Terraform

```bash
cd infrastructure/terraform
terraform init
```

### Step 2: Review Configuration

Edit `variables.tf` or create `terraform.tfvars`:

```hcl
aws_region          = "ap-south-1"
environment         = "prod"
project_name        = "artisan-ai"
db_instance_class   = "db.t3.micro"
redis_node_type     = "cache.t3.micro"
enable_cloudfront   = true
```

### Step 3: Plan Infrastructure

```bash
terraform plan -out=tfplan
```

Review the plan carefully to ensure all resources are correct.

### Step 4: Apply Infrastructure

```bash
terraform apply tfplan
```

This will create all AWS resources. The process takes approximately 15-20 minutes.

### Step 5: Retrieve Outputs

```bash
terraform output
```

Save these outputs for application configuration:
- VPC ID and subnet IDs
- RDS endpoint
- Redis endpoint
- S3 bucket names
- CloudFront domains
- IAM role ARNs

### Step 6: Configure Application

Update your application's `.env` file with the infrastructure outputs:

```bash
# Get database credentials from Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id artisan-ai/db/password-prod \
  --query SecretString \
  --output text | jq -r

# Get Redis connection info
aws secretsmanager get-secret-value \
  --secret-id artisan-ai/redis/connection-prod \
  --query SecretString \
  --output text | jq -r

# Get S3 bucket names
aws secretsmanager get-secret-value \
  --secret-id artisan-ai/s3/buckets-prod \
  --query SecretString \
  --output text | jq -r
```

## Cost Estimation

### Monthly Costs (ap-south-1 region)

| Service | Configuration | Estimated Cost |
|---------|--------------|----------------|
| RDS PostgreSQL | db.t3.micro, 20GB | $15-20 |
| ElastiCache Redis | cache.t3.micro | $12-15 |
| S3 Storage | 100GB + requests | $3-5 |
| CloudFront | 100GB transfer | $8-10 |
| NAT Gateway | 1 gateway | $32-35 |
| Data Transfer | Moderate usage | $10-15 |
| CloudWatch | Logs + alarms | $5-10 |
| **Total** | | **$85-110/month** |

### Cost Optimization Tips

1. **Use VPC Endpoints**: Reduces data transfer costs
2. **Enable S3 Lifecycle Policies**: Move old data to cheaper storage
3. **Right-size Instances**: Start small, scale as needed
4. **Use Reserved Instances**: For production workloads
5. **Enable CloudWatch Logs Retention**: Limit to 30 days
6. **Monitor with AWS Cost Explorer**: Track spending

## Security Best Practices

### Implemented
- ✅ VPC with public/private subnets
- ✅ Security groups with least privilege
- ✅ Encryption at rest (RDS, S3, ElastiCache)
- ✅ Encryption in transit (HTTPS, SSL/TLS)
- ✅ Secrets Manager for credentials
- ✅ IAM roles with minimal permissions
- ✅ CloudWatch logging and monitoring
- ✅ S3 bucket policies and access controls

### Recommended
- 🔒 Enable MFA for AWS root account
- 🔒 Use AWS WAF for application firewall
- 🔒 Enable AWS GuardDuty for threat detection
- 🔒 Implement AWS Config for compliance
- 🔒 Use AWS Certificate Manager for SSL/TLS
- 🔒 Enable VPC Flow Logs
- 🔒 Implement backup and disaster recovery

## Maintenance

### Regular Tasks

1. **Monitor CloudWatch Alarms**: Check for any triggered alarms
2. **Review Logs**: Check application and database logs
3. **Update Security Groups**: Review and update as needed
4. **Rotate Secrets**: Rotate database passwords periodically
5. **Review Costs**: Monitor AWS Cost Explorer monthly
6. **Update Terraform**: Keep Terraform and providers updated

### Backup and Recovery

1. **RDS Automated Backups**: 7-day retention
2. **Manual Snapshots**: Create before major changes
3. **S3 Versioning**: Enabled for all buckets
4. **Disaster Recovery Plan**: Document and test regularly

## Troubleshooting

### Common Issues

1. **Terraform State Lock**
   ```bash
   # Force unlock if needed
   terraform force-unlock <lock-id>
   ```

2. **Resource Already Exists**
   ```bash
   # Import existing resource
   terraform import aws_s3_bucket.media bucket-name
   ```

3. **Permission Denied**
   - Check IAM permissions
   - Verify AWS CLI configuration
   - Check resource policies

4. **Connection Timeout**
   - Verify security group rules
   - Check VPC routing tables
   - Verify NAT gateway status

## Cleanup

To destroy all infrastructure:

```bash
# Review what will be destroyed
terraform plan -destroy

# Destroy infrastructure
terraform destroy
```

**Warning**: This will delete all resources including databases and S3 buckets. Ensure you have backups!

## Next Steps

After infrastructure is deployed:

1. ✅ Deploy application to ECS (see `../deployment/README.md`)
2. ✅ Configure domain and SSL certificate
3. ✅ Set up CI/CD pipeline
4. ✅ Configure monitoring and alerting
5. ✅ Implement backup and disaster recovery
6. ✅ Perform security audit
7. ✅ Load testing and optimization

## Support

For issues or questions:
- Check AWS documentation
- Review Terraform logs
- Contact AWS Support (if applicable)
- Review CloudWatch logs and metrics

---

**Last Updated**: February 28, 2026  
**Terraform Version**: >= 1.0  
**AWS Provider Version**: ~> 5.0
