# Artisan AI Backend - Setup Guide

Complete setup instructions for the Artisan AI backend platform.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20+** installed
- **PostgreSQL 15+** running locally or remotely
- **Redis** (optional for MVP, required for production)
- **AWS Account** with the following services enabled:
  - S3 (for media storage)
  - Transcribe (for voice-to-text)
  - Rekognition (for image analysis)
  - Bedrock (for AI content generation - Claude 3 Sonnet access)

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and configure the following:

### Database Configuration
```env
DATABASE_URL=postgresql://username:password@localhost:5432/artisan_ai
```

### AWS Configuration
```env
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET=artisan-ai-media
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

### Authentication
```env
JWT_SECRET=your_random_32_character_secret_here
ENCRYPTION_KEY=your_32_byte_encryption_key_here
```

Generate secure secrets:
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Application
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
```

## Step 3: AWS Setup

### 3.1 Create S3 Bucket

```bash
aws s3 mb s3://artisan-ai-media --region ap-south-1
```

Configure CORS for the bucket:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 3.2 Enable AWS Bedrock

1. Go to AWS Console → Bedrock
2. Request access to Claude 3 Sonnet model
3. Wait for approval (usually instant for most accounts)

### 3.3 IAM Permissions

Ensure your IAM user/role has these permissions:
- `s3:PutObject`, `s3:GetObject` on your S3 bucket
- `transcribe:StartTranscriptionJob`, `transcribe:GetTranscriptionJob`
- `rekognition:DetectLabels`, `rekognition:DetectText`
- `bedrock:InvokeModel` for Claude 3 Sonnet

## Step 4: Database Setup

### 4.1 Create Database

```bash
# Using psql
createdb artisan_ai

# Or using SQL
psql -U postgres -c "CREATE DATABASE artisan_ai;"
```

### 4.2 Generate Prisma Client

```bash
npm run prisma:generate
```

### 4.3 Run Migrations

```bash
npm run prisma:migrate
```

This will create all necessary tables.

### 4.4 Seed Database

```bash
npm run prisma:seed
```

This creates:
- Admin user (email: `admin@artisanai.com`, password: `admin123456`)
- 3 sample artisans
- 2 sample products

## Step 5: Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## Step 6: Verify Setup

### Test Health Endpoint
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-28T...",
  "uptime": 1.234,
  "environment": "development"
}
```

### Test Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@artisanai.com",
    "password": "admin123456"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "admin": {
      "id": "...",
      "name": "Admin User",
      "email": "admin@artisanai.com",
      "role": "super_admin"
    }
  }
}
```

## Available API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `GET /api/verify/:productId` - QR code verification

### Admin Endpoints (require authentication)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get current admin
- `GET /api/admin/artisans` - List artisans
- `POST /api/admin/artisans` - Create artisan
- `PUT /api/admin/artisans/:id` - Update artisan
- `POST /api/admin/artisans/:id/verify` - Verify artisan
- `POST /api/admin/artisans/:id/reject` - Reject artisan

## Development Tools

### Prisma Studio
Visual database browser:
```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### View Logs
Logs are stored in `backend/logs/`:
- `combined.log` - All logs
- `error.log` - Error logs only

## Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U postgres -d artisan_ai -c "SELECT 1;"
```

### AWS Credentials Issues
```bash
# Verify AWS credentials
aws sts get-caller-identity
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
npm run prisma:generate
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET and ENCRYPTION_KEY
3. Enable HTTPS
4. Configure CloudFront for S3
5. Set up proper IAM roles (don't use access keys)
6. Enable CloudWatch logging
7. Set up database backups
8. Configure Redis for caching

## Next Steps

1. Configure WhatsApp Business API (Twilio)
2. Set up Razorpay for payments
3. Configure email service (SendGrid)
4. Set up monitoring (Sentry)
5. Deploy to AWS ECS/Fargate

## Support

For issues or questions:
- Check logs in `backend/logs/`
- Review Prisma schema in `prisma/schema.prisma`
- Check AWS service quotas and limits

---

**Last Updated**: February 28, 2026
