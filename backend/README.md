# Artisan AI - Backend

Voice-first platform for Indian artisans powered by AWS AI services.

## Tech Stack

- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **AI Services**: 
  - AWS Bedrock (Claude 3 Sonnet) - Product listing generation
  - AWS Transcribe - Voice-to-text (6 Indian languages)
  - AWS Rekognition - Image analysis
- **Storage**: AWS S3 + CloudFront

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── aws.ts       # AWS SDK clients
│   │   └── database.ts  # Prisma client
│   ├── services/        # Business logic
│   │   ├── s3.service.ts
│   │   ├── transcribe.service.ts
│   │   ├── rekognition.service.ts
│   │   └── bedrock.service.ts
│   ├── middleware/      # Express middleware
│   │   └── errorHandler.ts
│   ├── utils/           # Utility functions
│   │   └── logger.ts
│   └── index.ts         # Application entry point
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis
- AWS Account with access to:
  - S3
  - Transcribe
  - Rekognition
  - Bedrock (Claude 3 Sonnet)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure `.env` with your credentials:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/artisan_ai
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=artisan-ai-media
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

### Development

Start development server:
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

### Health Check
```
GET /health
```

Returns server status and uptime.

## AWS Services Integration

### AWS Bedrock
- Model: Claude 3 Sonnet
- Purpose: Generate product listings from voice + image
- Region: us-east-1

### AWS Transcribe
- Supported languages: Hindi, Malayalam, Tamil, Telugu, Bengali, English
- Purpose: Convert artisan voice notes to text
- Region: ap-south-1

### AWS Rekognition
- Purpose: Analyze product images (labels, colors, quality)
- Region: ap-south-1

### AWS S3
- Purpose: Store audio files, images, QR codes
- CDN: CloudFront for fast delivery

## Database Schema

- **Artisan**: Artisan profiles and verification
- **Product**: Product listings with AI metadata
- **Order**: Customer orders and payments
- **WhatsAppMessage**: Message queue and processing
- **Admin**: Admin users and authentication
- **AuditLog**: Audit trail for all actions

## Development Status

✅ **Phase 1: Infrastructure & Foundation** (COMPLETED)
- [x] Project initialization
- [x] TypeScript configuration
- [x] Database schema (Prisma)
- [x] AWS SDK integration
- [x] S3 service
- [x] Transcribe service
- [x] Rekognition service
- [x] Bedrock service
- [x] Error handling & logging

✅ **Phase 2: Authentication & Artisan Management** (COMPLETED)
- [x] JWT authentication system
- [x] Admin user management
- [x] Artisan CRUD operations
- [x] Artisan verification workflow
- [x] Audit logging
- [x] Role-based access control

✅ **Phase 3: Product Management & AI Pipeline** (COMPLETED)
- [x] AI processing pipeline orchestrator
- [x] Product CRUD operations
- [x] Product listing with filters
- [x] QR code generation
- [x] Product verification endpoint
- [x] Related products algorithm

✅ **Phase 4: API Routes** (COMPLETED)
- [x] Authentication routes
- [x] Artisan management routes
- [x] Product routes (public & admin)
- [x] QR verification routes

✅ **Phase 5: Database Seeding** (COMPLETED)
- [x] Admin user seed
- [x] Sample artisans
- [x] Sample products
- [x] Seed script automation

## API Endpoints

### Public API
```
GET    /health                      # Health check
GET    /api/products                # List products with filters
GET    /api/products/:id            # Get product details
GET    /api/verify/:productId       # QR code verification
```

### Admin API (Protected)
```
POST   /api/admin/auth/login        # Admin login
POST   /api/admin/auth/register     # Create admin
GET    /api/admin/auth/me           # Get current admin
POST   /api/admin/auth/logout       # Logout

GET    /api/admin/artisans          # List artisans
POST   /api/admin/artisans          # Create artisan
GET    /api/admin/artisans/:id      # Get artisan details
PUT    /api/admin/artisans/:id      # Update artisan
DELETE /api/admin/artisans/:id      # Delete artisan
POST   /api/admin/artisans/:id/verify   # Verify artisan
POST   /api/admin/artisans/:id/reject   # Reject artisan
```

## Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start development server
npm run dev
```

Default admin credentials:
- Email: `admin@artisanai.com`
- Password: `admin123456`

## Next Steps

🚧 **Remaining Work**:
1. WhatsApp webhook integration (Twilio)
2. Payment integration (Razorpay)
3. Order management system
4. Email notifications (SendGrid)
5. Admin dashboard analytics
6. Frontend development (Next.js)
7. Deployment to AWS ECS

## License

Proprietary - Artisan AI Platform
