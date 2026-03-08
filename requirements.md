# Artisan AI - Requirements Document

## Executive Summary

**Project**: Artisan AI - Voice-First Platform for Indian Artisans  
**Vision**: Empower 70M+ Indian artisans with WhatsApp + Voice-based digital commerce  
**MVP Timeline**: 4 weeks  
**Target**: 50-100 pilot artisans, ₹5 Cr GMV in Year 1

## Problem Statement

India's 70M+ artisans face:
- Low monthly income (₹3k-15k) with 15-30% middlemen commissions
- Low digital literacy preventing app/website adoption
- High counterfeit risk and lack of authenticity verification
- Seasonal income with no diversified revenue channels
- Limited access to direct customers and fair pricing

## Solution

A WhatsApp + Voice-first AI platform enabling artisans to:
- Onboard using only WhatsApp and voice (no apps, no forms)
- Create product listings from voice note + photo via AI
- Generate QR-based authenticity certificates
- Sell directly with ~3% platform fee (vs 15-30% middlemen)
- Access multi-channel revenue (products, workshops, tourism)

---

## User Personas

### P1: Artisan (Primary User)
**Demographics**:
- Age: 25-60 years
- Location: Rural/semi-urban India (Aranmula, Channapatna, Varanasi, etc.)
- Device: Low-to-mid range Android, WhatsApp user
- Language: Local languages (Malayalam, Hindi, Tamil, etc.)
- Digital Literacy: Low

**Needs**:
- Simple voice-based onboarding
- No complex forms or apps
- Reliable, fast payouts
- Visibility to customers
- Fair pricing without middlemen

**Pain Points**:
- Cannot use complex digital platforms
- Dependent on exploitative middlemen
- Lack of market access
- No proof of authenticity for products

### P2: Customer (Buyer)
**Demographics**:
- Urban Indian or global buyer
- Age: 25-50 years
- Tech-savvy, shops online regularly
- Values authenticity, cultural heritage, impact

**Needs**:
- Discover authentic handicrafts
- Verify product authenticity
- Learn artisan stories and cultural context
- Seamless payment and shipping
- Book cultural experiences/workshops

**Pain Points**:
- Difficulty finding authentic products
- No trust in product origins
- Limited access to artisan stories

### P3: Admin/Operations
**Demographics**:
- Platform operations team
- Manages artisan verification and curation

**Needs**:
- Review artisan applications
- Verify identity documents
- Manage product listings
- Handle disputes and support
- Monitor platform metrics

---

## MVP Scope (4 Weeks)

### In Scope
1. WhatsApp-based artisan intake with voice + photo
2. AI-powered product listing generation (AWS AI services)
3. Public web catalog with search/filter
4. Razorpay test mode integration
5. Basic admin panel for verification
6. 50-100 pilot artisans onboarding
7. Simple QR-based product verification

### Out of Scope (Post-MVP)
- Automated KYC/verification
- Workshop booking system
- Cultural tourism experiences
- Mobile apps (native)
- Advanced analytics dashboard
- Multi-language customer UI
- Inventory management
- Shipping integrations
- Advanced fraud detection

---

## Functional Requirements

### Epic 1: Artisan Onboarding

#### US-1.1: Admin Creates Artisan Profile
**As an** admin  
**When** I need to onboard a new artisan  
**Then** I can create an artisan profile with basic details

**Acceptance Criteria**:
- Admin can input: name, phone, WhatsApp number, craft type, region, language
- Admin can upload artisan ID proof photo
- System validates phone number format
- System generates unique artisan ID
- Artisan status defaults to "Pending Verification"
- System sends WhatsApp welcome message to artisan

#### US-1.2: Admin Verifies Artisan
**As an** admin  
**When** I review an artisan application  
**Then** I can approve or reject with reason

**Acceptance Criteria**:
- Admin can view ID proof documents
- Admin can mark artisan as "Verified" or "Rejected"
- If rejected, admin must provide reason
- System sends WhatsApp notification to artisan about status
- Only verified artisans can create product listings

#### US-1.3: View Artisan Directory
**As an** admin  
**When** I access the artisan management page  
**Then** I can see all artisans with filters

**Acceptance Criteria**:
- Display artisan list with: name, craft type, region, status, join date
- Filter by: status, craft type, region
- Search by name or phone number
- Pagination (20 per page)
- Click artisan to view full profile

---

### Epic 2: WhatsApp → AI Listing Generation

#### US-2.1: Artisan Sends Product via WhatsApp
**As an** artisan  
**When** I want to list a product  
**Then** I send a voice note + photo to the WhatsApp number

**Acceptance Criteria**:
- System receives WhatsApp message with voice + image
- System identifies artisan by phone number
- System validates artisan is verified
- System acknowledges receipt via WhatsApp reply
- System queues message for AI processing

#### US-2.2: AI Transcribes Voice Note
**As the** system  
**When** processing artisan voice input  
**Then** I transcribe voice to text using AWS Transcribe

**Acceptance Criteria**:
- Support languages: Hindi, Malayalam, Tamil, Telugu, Bengali, English
- Transcription accuracy >85%
- Handle background noise and accents
- Store both original audio and transcription
- Processing time <30 seconds

#### US-2.3: AI Generates Product Listing
**As the** system  
**When** I have transcription and photo  
**Then** I generate structured product listing using AWS Bedrock

**Acceptance Criteria**:
- Extract from voice: product name, material, size, process, story, cultural context
- Analyze photo using AWS Rekognition for: colors, patterns, quality
- Generate:
  - Product title (English, 50-80 chars)
  - Product description (English, 150-300 words)
  - Artisan story snippet (100-150 words)
  - Suggested price range (₹)
  - Tags: material, style, occasion, region (5-10 tags)
- Store original transcription and generated content
- Processing time <60 seconds total

#### US-2.4: Artisan Reviews Generated Listing
**As an** artisan  
**When** AI generates my product listing  
**Then** I receive WhatsApp message with preview and approval options

**Acceptance Criteria**:
- WhatsApp message includes:
  - Product photo
  - Generated title and description (in artisan's language)
  - Suggested price
  - Approve/Edit/Reject buttons
- If approved: listing goes live immediately
- If edit requested: admin notified for manual review
- If rejected: artisan can resubmit
- Response timeout: 24 hours (auto-approve after)

---

### Epic 3: Public Catalog & Discovery

#### US-3.1: Browse Product Catalog
**As a** customer  
**When** I visit the catalog page  
**Then** I can browse all available products

**Acceptance Criteria**:
- Display product grid with: photo, title, price, artisan name, region
- Show 24 products per page with pagination
- Responsive design (mobile-first)
- Load time <2 seconds on 3G
- Show "Verified Artisan" badge

#### US-3.2: Filter and Search Products
**As a** customer  
**When** I want to find specific products  
**Then** I can filter and search the catalog

**Acceptance Criteria**:
- Filter by:
  - Craft type (dropdown)
  - Region (dropdown)
  - Price range (slider: ₹0-₹50,000)
  - Tags (multi-select)
- Search by keyword (product name, description, artisan name)
- Filters persist in URL for sharing
- Clear all filters option
- Show result count

#### US-3.3: View Product Details
**As a** customer  
**When** I click on a product  
**Then** I see complete product information

**Acceptance Criteria**:
- Display:
  - Product photo (zoomable)
  - Title, price, description
  - Artisan story and profile
  - Material, size, process details
  - Cultural context and significance
  - Region and craft type
  - QR code for authenticity
  - "Verified Artisan" status
- "Buy Now" button
- Share buttons (WhatsApp, Twitter, Facebook)
- Related products section (3-4 items)

---

### Epic 4: Authenticity & QR Verification

#### US-4.1: Generate Product Certificate
**As the** system  
**When** a product listing is approved  
**Then** I generate a unique authenticity certificate

**Acceptance Criteria**:
- Generate unique product ID (format: ART-{region}-{craft}-{number})
- Create QR code linking to product detail page
- Certificate includes:
  - Product ID and photo
  - Artisan name and verification status
  - Craft type and region
  - Creation date
  - Platform seal
- Store certificate metadata in database

#### US-4.2: Scan QR Code
**As a** customer  
**When** I scan a product QR code  
**Then** I see authenticity verification page

**Acceptance Criteria**:
- QR code resolves to: /verify/{productId}
- Page displays:
  - "Verified Authentic" banner
  - Product details
  - Artisan profile
  - Verification date
  - Platform guarantee statement
- Works on any mobile device
- Load time <1 second

---

### Epic 5: Payments & Orders (Test Mode)

#### US-5.1: Customer Checkout
**As a** customer  
**When** I want to buy a product  
**Then** I can complete checkout with Razorpay

**Acceptance Criteria**:
- Click "Buy Now" opens checkout form
- Collect: name, email, phone, shipping address
- Display order summary: product, price, shipping (TBD), total
- Integrate Razorpay test mode
- Support payment methods: UPI, cards, netbanking, wallets
- Show loading state during payment
- Handle payment success/failure

#### US-5.2: Order Confirmation
**As a** customer  
**When** payment succeeds  
**Then** I receive order confirmation

**Acceptance Criteria**:
- Redirect to success page with order ID
- Send confirmation email with:
  - Order details
  - Estimated delivery (placeholder)
  - Artisan story
  - Support contact
- Send WhatsApp notification to artisan
- Create order record in database

#### US-5.3: View Orders (Admin)
**As an** admin  
**When** I access orders dashboard  
**Then** I see all test orders

**Acceptance Criteria**:
- Display order list: ID, customer, product, artisan, amount, date, status
- Filter by: status, date range, artisan
- Click order to view details
- Export orders as CSV
- Show test mode banner

---

### Epic 6: Admin Tools

#### US-6.1: Admin Dashboard
**As an** admin  
**When** I log into the platform  
**Then** I see key metrics and recent activity

**Acceptance Criteria**:
- Display metrics:
  - Total artisans (verified/pending)
  - Total products (live/draft)
  - Total orders (test mode)
  - Avg. listing generation time
- Show recent activity feed:
  - New artisan applications
  - New product submissions
  - Recent orders
- Quick action buttons

#### US-6.2: Edit Product Listing
**As an** admin  
**When** an artisan requests edits or AI generates incorrect content  
**Then** I can manually edit product listings

**Acceptance Criteria**:
- Access product edit form
- Edit: title, description, story, price, tags, photos
- Preview changes before saving
- Log edit history (who, when, what changed)
- Notify artisan via WhatsApp of changes

#### US-6.3: Platform Configuration
**As an** admin  
**When** I need to configure platform settings  
**Then** I can update key parameters

**Acceptance Criteria**:
- Configure:
  - Platform fee percentage
  - Supported craft types (add/remove)
  - Supported regions (add/remove)
  - WhatsApp templates
  - AI prompt templates
- Changes take effect immediately
- Audit log of configuration changes

---

## Non-Functional Requirements

### NFR-1: Performance
- Product catalog page load: <2s on 3G
- AI listing generation: <90s end-to-end
- WhatsApp message acknowledgment: <5s
- Support 100 concurrent users (MVP)
- Database queries: <500ms p95

### NFR-2: Accessibility
- Mobile-first responsive design
- Works on low-bandwidth (2G/3G)
- WhatsApp as primary interface for artisans
- Support screen readers (WCAG 2.1 AA)
- Minimum font size: 16px

### NFR-3: Scalability (Post-MVP)
- Architecture supports 10,000+ artisans
- Handle 100,000+ products
- Process 1,000+ orders/day
- Horizontal scaling for backend services

### NFR-4: Security
- HTTPS for all web traffic
- Encrypt artisan ID documents at rest
- Secure payment data (PCI DSS via Razorpay)
- Admin authentication (JWT-based)
- Rate limiting on APIs
- Input validation and sanitization

### NFR-5: Reliability
- 99% uptime target (MVP)
- Automated backups (daily)
- Error logging and monitoring
- Graceful degradation if AI services fail
- WhatsApp message retry logic (3 attempts)

### NFR-6: Localization
- Support 6 Indian languages for voice transcription
- Admin UI in English
- Customer catalog in English (MVP)
- Date/currency formatting (Indian standards)

---

## Success Metrics (MVP)

### Artisan Metrics
- 50-100 artisans onboarded
- Avg. listing creation time: <5 minutes
- Artisan satisfaction: >4/5 rating
- Listings per artisan: >3

### Platform Metrics
- AI accuracy: >85% (manual review sample)
- Time to publish: <2 minutes (voice to live listing)
- Catalog uptime: >99%
- Test orders completed: >20

### Customer Metrics
- Catalog page views: >1,000
- Product detail views: >500
- Test checkout completion rate: >60%

---

## Assumptions & Constraints

### Assumptions
- Artisans have WhatsApp and basic smartphone
- Artisans can take clear product photos
- Admin team available for manual verification (MVP)
- Test mode sufficient for payment validation
- English catalog acceptable for MVP customers

### Constraints
- 4-week development timeline
- Limited budget for AI API calls
- Manual artisan verification (no automated KYC)
- No shipping integration (manual coordination)
- Test payments only (no real money)

---

## Future Enhancements (Post-MVP)

### Phase 2 (Months 2-3)
- Automated artisan verification (KYC APIs)
- Multi-language customer catalog
- Workshop booking system
- Shipping partner integration
- Inventory management
- Advanced analytics dashboard

### Phase 3 (Months 4-6)
- Cultural tourism experiences
- B2B bulk ordering
- Mobile app (React Native)
- Video product showcases
- Artisan community features
- Referral program

### Phase 4 (Months 7-12)
- GI certification integration
- PM Vishwakarma partnership
- State tourism board partnerships
- International shipping
- Advanced fraud detection
- Artisan training programs

---

## Compliance & Legal

- Data privacy: Comply with Indian data protection laws
- Payment regulations: RBI guidelines via Razorpay
- Artisan contracts: Standard platform agreement
- Customer terms: Clear refund/return policy
- Content moderation: Review AI-generated content
- Tax compliance: GST collection and remittance (post-MVP)

---

## Glossary

- **Artisan**: Skilled craftsperson creating handmade products
- **GI**: Geographical Indication (certification for regional products)
- **GMV**: Gross Merchandise Value (total sales volume)
- **KYC**: Know Your Customer (identity verification)
- **PM Vishwakarma**: Government scheme for artisans
- **TAT**: Turnaround Time
- **QR**: Quick Response (2D barcode)

---

**Document Version**: 1.0  
**Last Updated**: January 23, 2026  
**Owner**: Product Team
