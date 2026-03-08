# Artisan AI Platform

> Voice-first digital commerce platform empowering 70M+ Indian artisans with AWS AI services

[![AWS](https://img.shields.io/badge/AWS-Bedrock%20%7C%20Transcribe%20%7C%20Rekognition-orange)](https://aws.amazon.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)

## 🎯 Vision

Empower Indian artisans to sell directly to customers using WhatsApp + Voice, eliminating middlemen and increasing income by 15-30%.

## ✨ Key Features

- 🎤 **Voice-First**: Artisans create listings using WhatsApp voice notes
- 🤖 **AI-Powered**: AWS Bedrock generates product descriptions automatically
- 🔍 **Image Analysis**: AWS Rekognition analyzes product photos
- 🗣️ **Multi-Language**: AWS Transcribe supports 6 Indian languages
- ✅ **Authenticity**: QR codes verify product authenticity
- 💰 **Fair Pricing**: ~3% platform fee vs 15-30% middlemen

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Artisan   │────────▶│  WhatsApp    │────────▶│   AWS AI    │
│  (Voice +   │         │   Business   │         │  Services   │
│   Photo)    │         │     API      │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         ▼
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Customer   │◀────────│   Next.js    │◀────────│  Express.js │
│  (Browser)  │         │   Frontend   │         │   Backend   │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │ PostgreSQL  │
                                                  │  + Redis    │
                                                  └─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- AWS Account (Bedrock, Transcribe, Rekognition access)

### Backend Setup (5 minutes)

```bash
# Clone repository
git clone <repository-url>
cd AWS-EUPHORIA

# Setup backend
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your AWS credentials

# Setup database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start server
npm run dev
```

Server runs at `http://localhost:3000`

### Frontend Setup (2 minutes)

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3001`

**Default Admin Credentials:**
- Email: `admin@artisanai.com`
- Password: `admin123456`

### Quick Demo

1. Visit `http://localhost:3001` - See homepage
2. Click "Browse Products" - Explore catalog
3. Click any product - View details
4. Click "Verify" - See QR verification
5. Click "Admin" - Login to admin panel

## 📚 Documentation

- [Backend Setup Guide](./backend/SETUP.md) - Detailed setup instructions
- [Backend README](./backend/README.md) - API documentation
- [Progress Report](./PROGRESS.md) - Current development status
- [Requirements](./requirements.md) - Product requirements
- [Design Document](./design.md) - Technical design
- [Task List](./tasks.md) - Implementation plan

## 🎨 Tech Stack

### Backend (✅ Complete)
- **Runtime**: Node.js 20 + TypeScript 5
- **Framework**: Express.js
- **Database**: PostgreSQL 15 + Prisma ORM
- **AI Services**: 
  - AWS Bedrock (Claude 3 Sonnet)
  - AWS Transcribe (6 Indian languages)
  - AWS Rekognition (Image analysis)
- **Storage**: AWS S3 + CloudFront
- **Auth**: JWT + bcrypt
- **Logging**: Winston

### Frontend (🚧 Pending)
- Next.js 14
- Tailwind CSS
- React Hook Form
- SWR

### Infrastructure (🚧 Pending)
- AWS ECS/Fargate
- AWS RDS PostgreSQL
- AWS ElastiCache Redis
- Vercel (frontend)

## 📊 Current Status

### ✅ Completed (75% of MVP)
- **Backend (100%)**
  - AWS AI services integration (Bedrock, Transcribe, Rekognition)
  - Authentication & authorization
  - Artisan management (CRUD, verification)
  - Product management (catalog, filters, search)
  - AI processing pipeline (voice → listing)
  - QR code generation & verification
  - API endpoints (public & admin)
  - Database schema & seeding
  - Docker containerization

- **Frontend (50%)**
  - Homepage with hero and features
  - Product catalog with filters
  - Product detail pages
  - QR verification page
  - Admin login
  - Admin dashboard
  - API integration with SWR
  - Responsive design

### 🚧 In Progress (25% remaining)
- Admin UI for artisan management
- Admin UI for product management
- WhatsApp Business API integration
- Payment integration (Razorpay)
- Order management
- Deployment to AWS

## 🔑 Key API Endpoints

### Public API
```
GET  /api/products              # List products with filters
GET  /api/products/:id          # Get product details
GET  /api/verify/:productId     # QR code verification
```

### Admin API (Protected)
```
POST /api/admin/auth/login      # Admin login
GET  /api/admin/artisans        # List artisans
POST /api/admin/artisans        # Create artisan
POST /api/admin/artisans/:id/verify  # Verify artisan
```

See [Postman Collection](./backend/postman_collection.json) for complete API documentation.

## 🤖 AI Processing Pipeline

```
1. Artisan sends voice note + photo via WhatsApp
   ↓
2. AWS Transcribe converts voice to text (6 languages)
   ↓
3. AWS Rekognition analyzes image (labels, colors, quality)
   ↓
4. AWS Bedrock generates product listing (Claude 3 Sonnet)
   ↓
5. QR code generated for authenticity
   ↓
6. Product saved to database
   ↓
7. WhatsApp preview sent to artisan for approval
```

**Processing Time**: <90 seconds end-to-end

## 🎯 Success Metrics (MVP)

### Business Goals
- 50-100 pilot artisans onboarded
- >3 products per artisan
- >20 test orders completed
- ₹5 Cr GMV target (Year 1)

### Technical Goals
- ✅ AI processing: <90s
- ✅ API response: <500ms p95
- ⏳ Page load: <2s on 3G
- ⏳ System uptime: >99%

## 🛠️ Development

### Available Scripts

```bash
# Backend
npm run dev              # Start development server
npm run build            # Build for production
npm run prisma:studio    # Open database GUI
npm run prisma:seed      # Seed database

# Frontend (coming soon)
npm run dev              # Start Next.js dev server
npm run build            # Build for production
```

### Project Structure

```
AWS-EUPHORIA/
├── backend/              # Express.js backend
│   ├── src/
│   │   ├── config/      # AWS & database config
│   │   ├── services/    # Business logic
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API routes
│   │   └── middleware/  # Auth, error handling
│   ├── prisma/          # Database schema
│   └── logs/            # Application logs
├── frontend/            # Next.js frontend (pending)
├── requirements.md      # Product requirements
├── design.md           # Technical design
├── tasks.md            # Implementation tasks
└── PROGRESS.md         # Development progress
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Rate limiting on all APIs
- Input validation with Zod
- Encrypted sensitive data (bank details)
- AWS IAM for service access

## 🌍 Supported Languages

Voice transcription supports:
- Hindi (hi-IN)
- Malayalam (ml-IN)
- Tamil (ta-IN)
- Telugu (te-IN)
- Bengali (bn-IN)
- English (en-IN)

## 📈 Roadmap

### Phase 1: MVP (4 weeks) - 60% Complete
- ✅ Backend infrastructure
- ✅ AWS AI integration
- ✅ Admin & artisan management
- 🚧 WhatsApp integration
- 🚧 Payment integration
- 🚧 Frontend development

### Phase 2: Scale (Months 2-3)
- Automated artisan verification
- Multi-language customer UI
- Workshop booking system
- Shipping integration
- Advanced analytics

### Phase 3: Expand (Months 4-6)
- Cultural tourism experiences
- B2B bulk ordering
- Mobile app (React Native)
- Video product showcases
- Artisan community features

## 🤝 Contributing

This is a proprietary project for the AWS Euphoria hackathon.

## 📄 License

Proprietary - Artisan AI Platform

## 🙏 Acknowledgments

- AWS for Bedrock, Transcribe, and Rekognition services
- Indian artisan community for inspiration
- Open source community for amazing tools

---

**Built with ❤️ for Indian Artisans**

**Last Updated**: February 28, 2026  
**Status**: Backend Core Complete (60% MVP)
