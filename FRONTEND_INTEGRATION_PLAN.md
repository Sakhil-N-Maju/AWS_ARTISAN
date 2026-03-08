# Frontend Integration Plan

## Current Situation
- `frontend/` - New frontend being migrated (incomplete)
- `frontend/frontend-ref/` - Complete reference frontend with all features
- `backend/` - Express + Prisma backend with AWS services

## Problem
The frontend-ref uses Next.js API routes with Prisma directly, but we have a separate Express backend that needs to be used instead.

## Solution: Use frontend-ref as Main Frontend + Connect to Backend

### Step 1: Move frontend-ref to Root
```
frontend-ref/ → frontend-new/
```

### Step 2: Create API Client for Backend Connection
Replace Prisma calls in Next.js API routes with calls to Express backend at `http://localhost:3001`

### Step 3: Update Environment Configuration
Add backend API URL to config:
```typescript
apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
```

### Step 4: Key Files to Update

#### API Routes to Convert (from Prisma to Backend API):
- `/app/api/products/route.ts` → Call `GET/POST /api/products`
- `/app/api/artisans/route.ts` → Call `GET /api/artisans`
- `/app/api/orders/route.ts` → Call backend orders endpoint
- `/app/api/ai/products/route.ts` → Call `POST /api/products/ai-generate`

#### Pages Already Good:
- Home page ✓
- Shop page ✓
- Cart page ✓
- Product details ✓
- Admin pages ✓

### Step 5: Add Missing Features from Current Frontend
- Verify product page (`/verify/[productId]`)
- Any other custom pages

### Step 6: Backend Endpoints Needed
Our backend already has:
- ✓ `POST /api/auth/register`
- ✓ `POST /api/auth/login`
- ✓ `GET /api/products`
- ✓ `GET /api/products/:id`
- ✓ `POST /api/products` (with AI generation)
- ✓ `GET /api/artisans`
- ✓ `GET /api/artisans/:id`

### Step 7: Environment Setup
```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend (.env)
PORT=3001
DATABASE_URL=postgresql://...
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## Implementation Steps

1. Copy frontend-ref to root as frontend-new
2. Remove old frontend folder
3. Rename frontend-new to frontend
4. Create API client service
5. Update all API routes to use backend
6. Update config with API URL
7. Test all features
8. Update documentation

## Benefits
- Get all features from frontend-ref immediately
- Proper separation: Frontend (Next.js) + Backend (Express)
- Backend handles AWS services, AI, database
- Frontend handles UI, routing, client state
