# Artisan AI - Design Document

## Executive Summary

This document outlines the technical architecture, data models, API design, and integration strategy for Artisan AI - a WhatsApp + Voice-first platform for Indian artisans.

**Key Design Principles**:
- Voice-first, mobile-optimized experience
- Minimal complexity for low digital literacy users
- Scalable architecture for future growth
- AWS AI services for transcription and content generation
- Fail-safe mechanisms for critical flows

---

## High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         ARTISAN AI PLATFORM                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Artisan    │         │   Customer   │         │    Admin     │
│  (WhatsApp)  │         │ (Web Browser)│         │ (Web Portal) │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │                        │                        │
       ▼                        ▼                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / LOAD BALANCER                 │
└─────────────────────────────────────────────────────────────────┘
       │                        │                        │
       ▼                        ▼                        ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  WhatsApp    │         │   Web API    │         │  Admin API   │
│   Service    │         │   Service    │         │   Service    │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       └────────────────────────┼────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Core Business Logic │
                    │   - Artisan Service   │
                    │   - Product Service   │
                    │   - Order Service     │
                    │   - Auth Service      │
                    └───────────┬───────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
        ┌──────────────┐ ┌──────────┐ ┌──────────────┐
        │  PostgreSQL  │ │  Redis   │ │   S3 Bucket  │
        │   Database   │ │  Cache   │ │ (Media Files)│
        └──────────────┘ └──────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS                       │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│  WhatsApp    │   AWS AI     │  Razorpay    │   Email Service   │
│  Business    │  - Transcribe│  (Payments)  │   (SendGrid)      │
│     API      │  - Bedrock   │              │                   │
│              │  - Rekognition│             │                   │
└──────────────┴──────────────┴──────────────┴───────────────────┘
```

### Component Responsibilities

#### 1. WhatsApp Service
- Receives incoming messages (voice, images, text)
- Validates artisan identity
- Queues messages for processing
- Sends notifications and responses
- Handles interactive buttons/replies

#### 2. Web API Service
- Serves public catalog
- Product search and filtering
- Product detail pages
- Checkout and payment flow
- QR code verification

#### 3. Admin API Service
- Artisan management (CRUD)
- Product moderation and editing
- Order management
- Platform configuration
- Analytics and reporting

#### 4. AI Processing Pipeline
- Voice transcription (AWS Transcribe)
- Image analysis (AWS Rekognition)
- Content generation (AWS Bedrock)
- Translation (AWS Translate)
- Async job processing

#### 5. Core Business Services
- **Artisan Service**: Onboarding, verification, profile management
- **Product Service**: Listing creation, catalog, search
- **Order Service**: Checkout, payment, fulfillment
- **Auth Service**: Admin authentication, session management
- **Notification Service**: WhatsApp, email, SMS

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **State Management**: React Context + SWR for data fetching
- **UI Components**: Headless UI + custom components
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

### Backend
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5.x
- **Framework**: Express.js
- **API Style**: RESTful JSON APIs
- **Validation**: Zod schemas
- **Deployment**: AWS ECS / Render / Railway

### Database & Storage
- **Primary DB**: PostgreSQL 15 (Neon / AWS RDS)
- **Cache**: Redis (Upstash / AWS ElastiCache)
- **File Storage**: AWS S3
- **ORM**: Prisma

### AI & ML Services
- **Voice Transcription**: AWS Transcribe
- **Image Analysis**: AWS Rekognition
- **Content Generation**: AWS Bedrock (Claude 3 / Titan)
- **Translation**: AWS Translate

### External Services
- **Messaging**: WhatsApp Business API (Twilio / MessageBird)
- **Payments**: Razorpay
- **Email**: SendGrid / AWS SES
- **Monitoring**: Sentry + CloudWatch
- **Analytics**: PostHog / Mixpanel

---

## Data Models

### Core Entities

#### Artisan
```typescript
interface Artisan {
  id: string;                    // UUID
  name: string;
  phone: string;                 // E.164 format
  whatsappNumber: string;
  email?: string;
  craftType: string;             // e.g., "Metal Craft", "Pottery"
  region: string;                // e.g., "Kerala", "Karnataka"
  language: string;              // Primary language code
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  verificationNotes?: string;
  idProofUrl?: string;           // S3 URL
  profilePhotoUrl?: string;
  bio?: string;
  address?: Address;
  bankDetails?: BankDetails;     // Encrypted
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;           // Admin ID
}

interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface BankDetails {
  accountNumber: string;         // Encrypted
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}
```

#### Product
```typescript
interface Product {
  id: string;                    // UUID
  artisanId: string;             // FK to Artisan
  productId: string;             // Human-readable: ART-KER-MET-001
  title: string;
  description: string;           // Rich text
  artisanStory: string;
  culturalContext?: string;
  
  // Attributes
  material: string[];
  dimensions?: Dimensions;
  weight?: number;               // grams
  colors: string[];
  tags: string[];
  
  // Pricing
  price: number;                 // INR paise (₹100 = 10000)
  suggestedPrice?: number;
  currency: string;              // Default: INR
  
  // Media
  images: ProductImage[];
  videoUrl?: string;
  
  // AI Generation Metadata
  originalVoiceUrl?: string;     // S3 URL
  transcription?: string;
  transcriptionLanguage?: string;
  aiGeneratedFields: string[];   // Fields generated by AI
  
  // Status
  status: 'draft' | 'pending_review' | 'published' | 'sold' | 'archived';
  publishedAt?: Date;
  
  // QR & Authenticity
  qrCodeUrl: string;
  certificateUrl?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  favoriteCount: number;
}

interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'inch';
}

interface ProductImage {
  url: string;                   // S3 URL
  thumbnailUrl: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}
```

#### Order
```typescript
interface Order {
  id: string;                    // UUID
  orderNumber: string;           // ORD-20260123-001
  productId: string;             // FK to Product
  artisanId: string;             // FK to Artisan
  
  // Customer Details
  customer: CustomerDetails;
  
  // Pricing
  productPrice: number;          // INR paise
  shippingFee: number;
  platformFee: number;
  totalAmount: number;
  
  // Payment
  paymentId?: string;            // Razorpay payment ID
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  paidAt?: Date;
  
  // Fulfillment
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  shippingAddress: Address;
}
```

#### WhatsAppMessage
```typescript
interface WhatsAppMessage {
  id: string;
  artisanId: string;
  messageId: string;             // WhatsApp message ID
  from: string;                  // Phone number
  timestamp: Date;
  
  // Content
  type: 'text' | 'voice' | 'image' | 'video' | 'document';
  content?: string;              // Text content
  mediaUrl?: string;             // S3 URL for media
  mimeType?: string;
  
  // Processing
  status: 'received' | 'processing' | 'completed' | 'failed';
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  errorMessage?: string;
  
  // Related Entities
  productId?: string;            // If message created a product
  
  createdAt: Date;
}
```

#### Admin
```typescript
interface Admin {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### AuditLog
```typescript
interface AuditLog {
  id: string;
  entityType: string;            // 'artisan', 'product', 'order'
  entityId: string;
  action: string;                // 'created', 'updated', 'deleted'
  performedBy: string;           // Admin ID or 'system'
  changes?: Record<string, any>; // JSON diff
  timestamp: Date;
}
```

---

## Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Artisan {
  id              String    @id @default(uuid())
  name            String
  phone           String    @unique
  whatsappNumber  String
  email           String?
  craftType       String
  region          String
  language        String
  status          String    @default("pending")
  verificationNotes String?
  idProofUrl      String?
  profilePhotoUrl String?
  bio             String?
  address         Json?
  bankDetails     String?   // Encrypted JSON
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  verifiedAt      DateTime?
  verifiedBy      String?
  
  products        Product[]
  orders          Order[]
  messages        WhatsAppMessage[]
  
  @@index([status])
  @@index([craftType])
  @@index([region])
}

model Product {
  id                  String    @id @default(uuid())
  artisanId           String
  productId           String    @unique
  title               String
  description         String
  artisanStory        String
  culturalContext     String?
  material            String[]
  dimensions          Json?
  weight              Int?
  colors              String[]
  tags                String[]
  price               Int
  suggestedPrice      Int?
  currency            String    @default("INR")
  images              Json[]
  videoUrl            String?
  originalVoiceUrl    String?
  transcription       String?
  transcriptionLanguage String?
  aiGeneratedFields   String[]
  status              String    @default("draft")
  publishedAt         DateTime?
  qrCodeUrl           String
  certificateUrl      String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  viewCount           Int       @default(0)
  favoriteCount       Int       @default(0)
  
  artisan             Artisan   @relation(fields: [artisanId], references: [id])
  orders              Order[]
  
  @@index([artisanId])
  @@index([status])
  @@index([tags])
  @@index([craftType: artisan.craftType])
}

model Order {
  id              String    @id @default(uuid())
  orderNumber     String    @unique
  productId       String
  artisanId       String
  customer        Json
  productPrice    Int
  shippingFee     Int
  platformFee     Int
  totalAmount     Int
  paymentId       String?
  paymentStatus   String    @default("pending")
  paymentMethod   String?
  paidAt          DateTime?
  status          String    @default("pending")
  trackingNumber  String?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  notes           String?
  
  product         Product   @relation(fields: [productId], references: [id])
  artisan         Artisan   @relation(fields: [artisanId], references: [id])
  
  @@index([artisanId])
  @@index([status])
  @@index([paymentStatus])
}

model WhatsAppMessage {
  id                    String    @id @default(uuid())
  artisanId             String
  messageId             String    @unique
  from                  String
  timestamp             DateTime
  type                  String
  content               String?
  mediaUrl              String?
  mimeType              String?
  status                String    @default("received")
  processingStartedAt   DateTime?
  processingCompletedAt DateTime?
  errorMessage          String?
  productId             String?
  createdAt             DateTime  @default(now())
  
  artisan               Artisan   @relation(fields: [artisanId], references: [id])
  
  @@index([artisanId])
  @@index([status])
}

model Admin {
  id           String    @id @default(uuid())
  email        String    @unique
  name         String
  passwordHash String
  role         String
  isActive     Boolean   @default(true)
  lastLoginAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model AuditLog {
  id          String   @id @default(uuid())
  entityType  String
  entityId    String
  action      String
  performedBy String
  changes     Json?
  timestamp   DateTime @default(now())
  
  @@index([entityType, entityId])
  @@index([timestamp])
}
```

---

## API Design

### REST API Endpoints

#### Public API (Customer-facing)

```
GET    /api/products                    # List products with filters
GET    /api/products/:id                # Get product details
GET    /api/products/search             # Search products
GET    /api/artisans/:id                # Get artisan profile
GET    /api/verify/:productId           # QR code verification
POST   /api/orders                      # Create order
POST   /api/payments/webhook            # Razorpay webhook
```

#### Admin API (Protected)

```
# Authentication
POST   /api/admin/auth/login            # Admin login
POST   /api/admin/auth/logout           # Admin logout
GET    /api/admin/auth/me               # Get current admin

# Artisans
GET    /api/admin/artisans              # List artisans
POST   /api/admin/artisans              # Create artisan
GET    /api/admin/artisans/:id          # Get artisan details
PUT    /api/admin/artisans/:id          # Update artisan
DELETE /api/admin/artisans/:id          # Delete artisan
POST   /api/admin/artisans/:id/verify   # Verify artisan
POST   /api/admin/artisans/:id/reject   # Reject artisan

# Products
GET    /api/admin/products              # List all products
GET    /api/admin/products/:id          # Get product details
PUT    /api/admin/products/:id          # Update product
DELETE /api/admin/products/:id          # Delete product
POST   /api/admin/products/:id/publish  # Publish product
POST   /api/admin/products/:id/archive  # Archive product

# Orders
GET    /api/admin/orders                # List orders
GET    /api/admin/orders/:id            # Get order details
PUT    /api/admin/orders/:id/status     # Update order status
GET    /api/admin/orders/export         # Export orders CSV

# Analytics
GET    /api/admin/analytics/dashboard   # Dashboard metrics
GET    /api/admin/analytics/artisans    # Artisan metrics
GET    /api/admin/analytics/products    # Product metrics

# Configuration
GET    /api/admin/config                # Get platform config
PUT    /api/admin/config                # Update platform config
```

#### WhatsApp Webhook API

```
POST   /api/whatsapp/webhook            # Receive WhatsApp messages
GET    /api/whatsapp/webhook            # Webhook verification
```

### API Request/Response Examples

#### GET /api/products
```json
// Request
GET /api/products?craftType=Metal%20Craft&region=Kerala&page=1&limit=24

// Response
{
  "data": [
    {
      "id": "uuid",
      "productId": "ART-KER-MET-001",
      "title": "Handcrafted Aranmula Kannadi Mirror",
      "price": 850000,
      "currency": "INR",
      "images": [
        {
          "url": "https://s3.../image.jpg",
          "thumbnailUrl": "https://s3.../thumb.jpg",
          "isPrimary": true
        }
      ],
      "artisan": {
        "id": "uuid",
        "name": "Rajesh Kumar",
        "region": "Kerala",
        "verified": true
      },
      "tags": ["mirror", "metal", "traditional", "kerala"],
      "status": "published"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 24,
    "total": 156,
    "totalPages": 7
  }
}
```

#### POST /api/admin/artisans/:id/verify
```json
// Request
POST /api/admin/artisans/uuid-123/verify
{
  "notes": "ID verified, craft samples reviewed"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "status": "verified",
    "verifiedAt": "2026-01-23T10:30:00Z",
    "verifiedBy": "admin-uuid"
  }
}
```

---

## AI Processing Pipeline

### Voice-to-Listing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI PROCESSING PIPELINE                        │
└─────────────────────────────────────────────────────────────────┘

1. WhatsApp Message Received
   ├─ Voice Note (audio/ogg)
   └─ Product Photo (image/jpeg)
          │
          ▼
2. Store Media in S3
   ├─ /audio/{artisanId}/{messageId}.ogg
   └─ /images/{artisanId}/{messageId}.jpg
          │
          ▼
3. AWS Transcribe (Async)
   ├─ Input: S3 audio URL
   ├─ Language: Auto-detect or artisan.language
   ├─ Output: Transcription JSON
   └─ Duration: ~15-30 seconds
          │
          ▼
4. AWS Rekognition (Parallel)
   ├─ Detect Labels (objects, materials)
   ├─ Detect Colors (dominant colors)
   ├─ Detect Text (if any)
   └─ Quality Assessment
          │
          ▼
5. AWS Bedrock (Content Generation)
   ├─ Model: Claude 3 Sonnet / Titan
   ├─ Input: Transcription + Image analysis + Artisan context
   ├─ Prompt: Generate structured product listing
   └─ Output: JSON with title, description, story, price, tags
          │
          ▼
6. AWS Translate (If needed)
   ├─ Translate description to artisan's language
   └─ For WhatsApp preview
          │
          ▼
7. Generate QR Code
   ├─ Create unique product ID
   ├─ Generate QR code image
   └─ Upload to S3
          │
          ▼
8. Save Product (Draft)
   └─ Store in database with status='pending_review'
          │
          ▼
9. Send WhatsApp Preview
   ├─ Product photo
   ├─ Generated content (translated)
   ├─ Interactive buttons: Approve/Edit/Reject
   └─ Wait for artisan response
          │
          ▼
10. Artisan Approval
    ├─ If Approved → Publish (status='published')
    ├─ If Edit → Notify admin
    └─ If Rejected → Archive
```

### AWS Bedrock Prompt Template

```typescript
const generateListingPrompt = (
  transcription: string,
  imageAnalysis: RekognitionResult,
  artisan: Artisan
) => `
You are an expert in Indian handicrafts and e-commerce product listings.

ARTISAN CONTEXT:
- Name: ${artisan.name}
- Craft Type: ${artisan.craftType}
- Region: ${artisan.region}
- Language: ${artisan.language}

ARTISAN'S VOICE DESCRIPTION:
"${transcription}"

IMAGE ANALYSIS:
- Detected Objects: ${imageAnalysis.labels.join(', ')}
- Dominant Colors: ${imageAnalysis.colors.join(', ')}
- Quality Score: ${imageAnalysis.quality}/10

TASK:
Generate a compelling product listing in JSON format with the following fields:

{
  "title": "Engaging product title (50-80 chars, English)",
  "description": "Detailed product description (150-300 words, English) covering materials, process, dimensions, and unique features",
  "artisanStory": "Brief artisan story (100-150 words) highlighting their craft tradition and expertise",
  "culturalContext": "Cultural significance and heritage (50-100 words)",
  "material": ["primary material", "secondary material"],
  "suggestedPrice": {
    "min": 0,
    "max": 0,
    "currency": "INR",
    "reasoning": "Brief explanation"
  },
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "dimensions": {
    "length": 0,
    "width": 0,
    "height": 0,
    "unit": "cm"
  }
}

GUIDELINES:
- Use authentic, respectful language
- Highlight craftsmanship and cultural heritage
- Be specific about materials and techniques
- Price should reflect artisan's input and market research
- Tags should include: material, style, occasion, region
- Keep tone warm and storytelling-focused
`;
```

---

## Integration Architecture

### WhatsApp Business API Integration

**Provider Options**: Twilio, MessageBird, 360Dialog

**Flow**:
```typescript
// Incoming Message Handler
app.post('/api/whatsapp/webhook', async (req, res) => {
  const { from, messageId, type, mediaUrl, body } = req.body;
  
  // 1. Acknowledge immediately
  res.status(200).send('OK');
  
  // 2. Identify artisan
  const artisan = await prisma.artisan.findUnique({
    where: { whatsappNumber: from }
  });
  
  if (!artisan || artisan.status !== 'verified') {
    await sendWhatsAppMessage(from, 
      'Please contact support to register as an artisan.'
    );
    return;
  }
  
  // 3. Store message
  const message = await prisma.whatsAppMessage.create({
    data: {
      artisanId: artisan.id,
      messageId,
      from,
      type,
      mediaUrl,
      content: body,
      status: 'received'
    }
  });
  
  // 4. Queue for AI processing
  await queueAIProcessing(message.id);
  
  // 5. Send acknowledgment
  await sendWhatsAppMessage(from,
    'Thank you! We are processing your product. You will receive a preview shortly.'
  );
});

// Send Message Helper
async function sendWhatsAppMessage(
  to: string,
  message: string,
  buttons?: Button[]
) {
  // Twilio example
  await twilioClient.messages.create({
    from: process.env.WHATSAPP_NUMBER,
    to: `whatsapp:${to}`,
    body: message,
    // Interactive buttons if supported
  });
}
```

### AWS AI Services Integration

#### 1. AWS Transcribe
```typescript
import { TranscribeClient, StartTranscriptionJobCommand } from '@aws-sdk/client-transcribe';

async function transcribeAudio(audioUrl: string, language: string) {
  const client = new TranscribeClient({ region: 'ap-south-1' });
  
  const jobName = `transcribe-${Date.now()}`;
  
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: language, // 'hi-IN', 'ml-IN', 'ta-IN', etc.
    MediaFormat: 'ogg',
    Media: {
      MediaFileUri: audioUrl
    },
    OutputBucketName: process.env.S3_BUCKET,
    Settings: {
      ShowSpeakerLabels: false,
      MaxSpeakerLabels: 1
    }
  });
  
  await client.send(command);
  
  // Poll for completion
  const result = await pollTranscriptionJob(jobName);
  return result.transcripts[0].transcript;
}
```

#### 2. AWS Rekognition
```typescript
import { RekognitionClient, DetectLabelsCommand, DetectTextCommand } from '@aws-sdk/client-rekognition';

async function analyzeImage(imageUrl: string) {
  const client = new RekognitionClient({ region: 'ap-south-1' });
  
  // Detect labels (objects, materials)
  const labelsCommand = new DetectLabelsCommand({
    Image: {
      S3Object: {
        Bucket: process.env.S3_BUCKET,
        Name: getS3KeyFromUrl(imageUrl)
      }
    },
    MaxLabels: 20,
    MinConfidence: 70
  });
  
  const labelsResult = await client.send(labelsCommand);
  
  // Detect colors (custom logic or use labels)
  const labels = labelsResult.Labels.map(l => l.Name);
  const colors = extractColors(labelsResult);
  
  return {
    labels,
    colors,
    quality: calculateQualityScore(labelsResult)
  };
}
```

#### 3. AWS Bedrock
```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

async function generateListing(
  transcription: string,
  imageAnalysis: any,
  artisan: Artisan
) {
  const client = new BedrockRuntimeClient({ region: 'us-east-1' });
  
  const prompt = generateListingPrompt(transcription, imageAnalysis, artisan);
  
  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });
  
  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  
  return JSON.parse(responseBody.content[0].text);
}
```

### Razorpay Payment Integration

```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
async function createPaymentOrder(order: Order) {
  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount, // paise
    currency: 'INR',
    receipt: order.orderNumber,
    notes: {
      orderId: order.id,
      productId: order.productId,
      artisanId: order.artisanId
    }
  });
  
  return razorpayOrder;
}

// Verify Payment Webhook
app.post('/api/payments/webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);
  
  // Verify signature
  const isValid = razorpay.webhooks.validateWebhookSignature(
    body,
    signature,
    process.env.RAZORPAY_WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(400).send('Invalid signature');
  }
  
  const event = req.body.event;
  const payment = req.body.payload.payment.entity;
  
  if (event === 'payment.captured') {
    // Update order
    await prisma.order.update({
      where: { orderNumber: payment.notes.orderId },
      data: {
        paymentId: payment.id,
        paymentStatus: 'completed',
        paymentMethod: payment.method,
        paidAt: new Date(payment.created_at * 1000)
      }
    });
    
    // Notify artisan via WhatsApp
    const order = await prisma.order.findUnique({
      where: { orderNumber: payment.notes.orderId },
      include: { artisan: true, product: true }
    });
    
    await sendWhatsAppMessage(
      order.artisan.whatsappNumber,
      `Great news! Your product "${order.product.title}" has been sold for ₹${order.productPrice / 100}. Payment will be processed within 2-3 business days.`
    );
  }
  
  res.status(200).send('OK');
});
```

---

## Security Design

### Authentication & Authorization

#### Admin Authentication
```typescript
// JWT-based authentication
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Login
app.post('/api/admin/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const admin = await prisma.admin.findUnique({
    where: { email }
  });
  
  if (!admin || !admin.isActive) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const isValid = await bcrypt.compare(password, admin.passwordHash);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() }
  });
  
  res.json({ token, admin: { id: admin.id, name: admin.name, role: admin.role } });
});

// Auth Middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Data Encryption

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 bytes
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Usage: Encrypt bank details
const bankDetails = {
  accountNumber: '1234567890',
  ifscCode: 'SBIN0001234',
  accountHolderName: 'Rajesh Kumar',
  bankName: 'State Bank of India'
};

const encrypted = encrypt(JSON.stringify(bankDetails));
await prisma.artisan.update({
  where: { id: artisanId },
  data: { bankDetails: encrypted }
});
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Public API rate limiting
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
});

app.use('/api/products', publicLimiter);

// WhatsApp webhook rate limiting (per artisan)
const whatsappLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 messages per minute per artisan
  keyGenerator: (req) => req.body.from,
  message: 'Too many messages, please wait a moment.'
});

app.use('/api/whatsapp/webhook', whatsappLimiter);
```

---

## Frontend Architecture

### Next.js App Structure

```
/app
  /(public)
    /page.tsx                    # Homepage
    /products
      /page.tsx                  # Product catalog
      /[id]
        /page.tsx                # Product detail
    /verify
      /[productId]
        /page.tsx                # QR verification
    /checkout
      /page.tsx                  # Checkout flow
    /order
      /[id]
        /page.tsx                # Order confirmation
  /(admin)
    /admin
      /layout.tsx                # Admin layout with auth
      /page.tsx                  # Dashboard
      /artisans
        /page.tsx                # Artisan list
        /[id]
          /page.tsx              # Artisan detail
      /products
        /page.tsx                # Product list
        /[id]
          /page.tsx              # Product edit
      /orders
        /page.tsx                # Order list
      /config
        /page.tsx                # Platform config
  /api
    /products
      /route.ts                  # Product API
    /orders
      /route.ts                  # Order API
    /whatsapp
      /webhook
        /route.ts                # WhatsApp webhook
    /payments
      /webhook
        /route.ts                # Razorpay webhook

/components
  /ui                            # Reusable UI components
  /product                       # Product-specific components
  /admin                         # Admin-specific components

/lib
  /prisma.ts                     # Prisma client
  /aws.ts                        # AWS SDK clients
  /whatsapp.ts                   # WhatsApp helpers
  /razorpay.ts                   # Razorpay helpers
  /utils.ts                      # Utility functions

/hooks
  /useProducts.ts                # Product data fetching
  /useAuth.ts                    # Admin auth
```

### Key Frontend Components

#### Product Card
```typescript
interface ProductCardProps {
  product: {
    id: string;
    productId: string;
    title: string;
    price: number;
    images: ProductImage[];
    artisan: {
      name: string;
      region: string;
      verified: boolean;
    };
    tags: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
        <img
          src={product.images[0].thumbnailUrl}
          alt={product.title}
          className="h-full w-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-900">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {product.artisan.name} • {product.artisan.region}
          {product.artisan.verified && (
            <span className="ml-2 text-green-600">✓ Verified</span>
          )}
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          ₹{(product.price / 100).toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}
```

#### Product Filter
```typescript
export function ProductFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    craftType: '',
    region: '',
    priceRange: [0, 50000],
    tags: []
  });
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium">Craft Type</label>
        <select
          value={filters.craftType}
          onChange={(e) => {
            const newFilters = { ...filters, craftType: e.target.value };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
          className="mt-1 block w-full rounded-md border-gray-300"
        >
          <option value="">All Crafts</option>
          <option value="Metal Craft">Metal Craft</option>
          <option value="Pottery">Pottery</option>
          <option value="Textile">Textile</option>
          {/* ... */}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium">Region</label>
        <select
          value={filters.region}
          onChange={(e) => {
            const newFilters = { ...filters, region: e.target.value };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
          className="mt-1 block w-full rounded-md border-gray-300"
        >
          <option value="">All Regions</option>
          <option value="Kerala">Kerala</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          {/* ... */}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium">
          Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="50000"
          step="1000"
          value={filters.priceRange[1]}
          onChange={(e) => {
            const newFilters = {
              ...filters,
              priceRange: [0, parseInt(e.target.value)]
            };
            setFilters(newFilters);
            onFilterChange(newFilters);
          }}
          className="mt-2 w-full"
        />
      </div>
    </div>
  );
}
```

---

## Deployment Architecture

### Infrastructure Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION SETUP                         │
└─────────────────────────────────────────────────────────────────┘

Frontend (Vercel)
├─ Next.js app deployed to Vercel
├─ Automatic deployments from main branch
├─ Edge caching for static assets
└─ Environment variables configured

Backend (AWS ECS / Render)
├─ Docker container with Node.js app
├─ Auto-scaling based on CPU/memory
├─ Load balancer for high availability
└─ Health checks and monitoring

Database (Neon / AWS RDS)
├─ PostgreSQL 15
├─ Automated backups (daily)
├─ Connection pooling (PgBouncer)
└─ Read replicas for scaling

Cache (Upstash Redis / AWS ElastiCache)
├─ Session storage
├─ API response caching
└─ Rate limiting data

Storage (AWS S3)
├─ /audio/{artisanId}/{messageId}.ogg
├─ /images/{artisanId}/{messageId}.jpg
├─ /qr-codes/{productId}.png
└─ CloudFront CDN for fast delivery

Monitoring
├─ Sentry (error tracking)
├─ CloudWatch (logs & metrics)
├─ PostHog (analytics)
└─ Uptime monitoring (UptimeRobot)
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/artisan_ai
REDIS_URL=redis://user:pass@host:6379

# AWS
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
S3_BUCKET=artisan-ai-media
CLOUDFRONT_URL=https://cdn.artisanai.in

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
WHATSAPP_NUMBER=+14155238886

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Auth
JWT_SECRET=xxx
ENCRYPTION_KEY=xxx (32 bytes)

# Email
SENDGRID_API_KEY=xxx
FROM_EMAIL=noreply@artisanai.in

# Monitoring
SENTRY_DSN=xxx
POSTHOG_API_KEY=xxx

# App
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://artisanai.in
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --chown=nodejs:nodejs package*.json ./

USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml (for local development)
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: artisan
      POSTGRES_PASSWORD: artisan
      POSTGRES_DB: artisan_ai
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://artisan:artisan@postgres:5432/artisan_ai
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./src:/app/src

volumes:
  postgres_data:
```

---

## Error Handling & Resilience

### Graceful Degradation

```typescript
// AI Processing with fallback
async function processArtisanMessage(messageId: string) {
  try {
    // Primary flow: Full AI processing
    const transcription = await transcribeAudio(audioUrl, language);
    const imageAnalysis = await analyzeImage(imageUrl);
    const listing = await generateListing(transcription, imageAnalysis, artisan);
    
    return listing;
  } catch (error) {
    logger.error('AI processing failed', { messageId, error });
    
    // Fallback: Manual review
    await prisma.whatsAppMessage.update({
      where: { id: messageId },
      data: {
        status: 'failed',
        errorMessage: error.message
      }
    });
    
    // Notify admin for manual processing
    await notifyAdminForManualReview(messageId);
    
    // Notify artisan
    await sendWhatsAppMessage(
      artisan.whatsappNumber,
      'We are reviewing your product manually. You will hear from us within 24 hours.'
    );
  }
}
```

### Retry Logic

```typescript
// Exponential backoff for external API calls
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const transcription = await retryWithBackoff(
  () => transcribeAudio(audioUrl, language),
  3,
  2000
);
```

### Circuit Breaker

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime?: number;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime! > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Usage
const bedrockBreaker = new CircuitBreaker(5, 60000);

async function generateListingWithBreaker(...args) {
  return bedrockBreaker.execute(() => generateListing(...args));
}
```

---

## Performance Optimization

### Database Indexing Strategy

```sql
-- Artisan indexes
CREATE INDEX idx_artisan_status ON artisan(status);
CREATE INDEX idx_artisan_craft_type ON artisan(craft_type);
CREATE INDEX idx_artisan_region ON artisan(region);
CREATE INDEX idx_artisan_phone ON artisan(phone);

-- Product indexes
CREATE INDEX idx_product_artisan_id ON product(artisan_id);
CREATE INDEX idx_product_status ON product(status);
CREATE INDEX idx_product_tags ON product USING GIN(tags);
CREATE INDEX idx_product_published_at ON product(published_at DESC);
CREATE INDEX idx_product_price ON product(price);

-- Order indexes
CREATE INDEX idx_order_artisan_id ON order(artisan_id);
CREATE INDEX idx_order_status ON order(status);
CREATE INDEX idx_order_payment_status ON order(payment_status);
CREATE INDEX idx_order_created_at ON order(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_product_status_published ON product(status, published_at DESC);
CREATE INDEX idx_product_craft_region ON product(craft_type, region);
```

### Caching Strategy

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache product catalog
async function getProducts(filters: ProductFilters) {
  const cacheKey = `products:${JSON.stringify(filters)}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from database
  const products = await prisma.product.findMany({
    where: buildWhereClause(filters),
    include: { artisan: true },
    orderBy: { publishedAt: 'desc' }
  });
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(products));
  
  return products;
}

// Invalidate cache on product update
async function updateProduct(id: string, data: any) {
  await prisma.product.update({ where: { id }, data });
  
  // Invalidate all product list caches
  const keys = await redis.keys('products:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

### Image Optimization

```typescript
// Generate thumbnails on upload
import sharp from 'sharp';

async function processProductImage(buffer: Buffer): Promise<{
  original: string;
  thumbnail: string;
}> {
  const timestamp = Date.now();
  
  // Original (max 2000px)
  const original = await sharp(buffer)
    .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
  
  // Thumbnail (400px)
  const thumbnail = await sharp(buffer)
    .resize(400, 400, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer();
  
  // Upload to S3
  const originalUrl = await uploadToS3(original, `images/${timestamp}.jpg`);
  const thumbnailUrl = await uploadToS3(thumbnail, `images/${timestamp}_thumb.jpg`);
  
  return { original: originalUrl, thumbnail: thumbnailUrl };
}
```

---

## Testing Strategy

### Unit Tests
```typescript
// Example: Product service tests
import { describe, it, expect, beforeEach } from 'vitest';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  
  beforeEach(() => {
    service = new ProductService();
  });
  
  it('should generate product ID in correct format', () => {
    const id = service.generateProductId('Kerala', 'Metal Craft', 1);
    expect(id).toBe('ART-KER-MET-001');
  });
  
  it('should validate product price range', () => {
    expect(service.isValidPrice(10000)).toBe(true);
    expect(service.isValidPrice(-100)).toBe(false);
    expect(service.isValidPrice(0)).toBe(false);
  });
});
```

### Integration Tests
```typescript
// Example: API endpoint tests
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app';

describe('GET /api/products', () => {
  it('should return products with pagination', async () => {
    const response = await request(app)
      .get('/api/products?page=1&limit=24')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
    expect(response.body.data).toBeInstanceOf(Array);
  });
  
  it('should filter products by craft type', async () => {
    const response = await request(app)
      .get('/api/products?craftType=Metal%20Craft')
      .expect(200);
    
    response.body.data.forEach(product => {
      expect(product.artisan.craftType).toBe('Metal Craft');
    });
  });
});
```

### E2E Tests
```typescript
// Example: Playwright test
import { test, expect } from '@playwright/test';

test('customer can browse and view product details', async ({ page }) => {
  // Navigate to catalog
  await page.goto('https://artisanai.in/products');
  
  // Wait for products to load
  await page.waitForSelector('[data-testid="product-card"]');
  
  // Click first product
  await page.click('[data-testid="product-card"]:first-child');
  
  // Verify product detail page
  await expect(page).toHaveURL(/\/products\/[a-z0-9-]+/);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-testid="buy-now-button"]')).toBeVisible();
});
```

---

## Monitoring & Observability

### Logging Strategy

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Product created', {
  productId: product.id,
  artisanId: product.artisanId,
  processingTime: Date.now() - startTime
});

logger.error('AI processing failed', {
  messageId,
  error: error.message,
  stack: error.stack
});
```

### Metrics Collection

```typescript
// Custom metrics for monitoring
interface Metrics {
  // Artisan metrics
  artisansOnboarded: number;
  artisansVerified: number;
  artisansPending: number;
  
  // Product metrics
  productsCreated: number;
  productsPublished: number;
  avgListingGenerationTime: number;
  aiAccuracyRate: number;
  
  // Order metrics
  ordersPlaced: number;
  ordersCompleted: number;
  totalGMV: number;
  avgOrderValue: number;
  
  // System metrics
  apiResponseTime: number;
  errorRate: number;
  whatsappMessageVolume: number;
}

// Track metrics
async function trackMetric(name: string, value: number, tags?: Record<string, string>) {
  // Send to PostHog/Mixpanel
  await analytics.track({
    event: name,
    properties: { value, ...tags }
  });
  
  // Send to CloudWatch
  await cloudwatch.putMetricData({
    Namespace: 'ArtisanAI',
    MetricData: [{
      MetricName: name,
      Value: value,
      Timestamp: new Date(),
      Dimensions: Object.entries(tags || {}).map(([Name, Value]) => ({ Name, Value }))
    }]
  });
}
```

### Health Checks

```typescript
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'unknown',
      redis: 'unknown',
      s3: 'unknown'
    }
  };
  
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'degraded';
  }
  
  try {
    // Check Redis
    await redis.ping();
    health.checks.redis = 'ok';
  } catch (error) {
    health.checks.redis = 'error';
    health.status = 'degraded';
  }
  
  try {
    // Check S3
    await s3.headBucket({ Bucket: process.env.S3_BUCKET });
    health.checks.s3 = 'ok';
  } catch (error) {
    health.checks.s3 = 'error';
    health.status = 'degraded';
  }
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

## Critical Design Decisions

### 1. WhatsApp vs Native App
**Decision**: WhatsApp-first approach  
**Rationale**: 
- 99% of target artisans already use WhatsApp
- Zero learning curve for voice + photo sharing
- No app installation or updates required
- Works on low-end devices with poor connectivity

### 2. AWS AI Services vs OpenAI
**Decision**: AWS Bedrock, Transcribe, Rekognition  
**Rationale**:
- Better regional support (ap-south-1 Mumbai)
- Lower latency for Indian users
- Integrated with existing AWS infrastructure
- Cost-effective for high volume
- Multi-language support for Indian languages

### 3. Manual vs Automated Artisan Verification (MVP)
**Decision**: Manual verification for MVP  
**Rationale**:
- Build trust with initial artisan cohort
- Understand verification patterns before automation
- Avoid false positives/negatives in early stage
- Can automate in Phase 2 with learned patterns

### 4. Monolithic vs Microservices
**Decision**: Monolithic for MVP, modular for future  
**Rationale**:
- Faster development for 4-week timeline
- Easier debugging and deployment
- Lower operational complexity
- Code organized in modules for future extraction

### 5. Real-time vs Async AI Processing
**Decision**: Async processing with queue  
**Rationale**:
- AI processing takes 60-90 seconds
- Prevents timeout issues
- Better resource utilization
- Allows retry and error handling
- Artisans notified when ready

---

## Migration & Rollout Plan

### Week 1: Infrastructure Setup
- Set up AWS accounts and services
- Configure WhatsApp Business API
- Deploy database and Redis
- Set up CI/CD pipelines

### Week 2: Core Development
- Implement data models and APIs
- Build AI processing pipeline
- Develop admin panel basics
- Create public catalog pages

### Week 3: Integration & Testing
- Integrate WhatsApp webhook
- Integrate Razorpay payments
- End-to-end testing
- Performance optimization

### Week 4: Pilot Launch
- Onboard 10 pilot artisans
- Monitor and fix issues
- Gather feedback
- Iterate on UX

### Post-MVP: Scale
- Onboard 50-100 artisans
- Optimize AI prompts based on feedback
- Add missing features
- Plan Phase 2 enhancements

---

**Document Version**: 1.0  
**Last Updated**: January 23, 2026  
**Owner**: Engineering Team
