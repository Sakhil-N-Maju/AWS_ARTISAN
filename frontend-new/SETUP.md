# Frontend Setup Guide

This frontend connects to the Express backend running on port 3001.

## Prerequisites

- Node.js 18+ installed
- Backend server running on port 3001

## Installation

```bash
cd frontend-new
npm install
```

## Environment Setup

Copy `.env.local` and update if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_VOICE_FEATURES=true
```

## Running the Development Server

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Architecture

### API Communication

The frontend uses `lib/api-client.ts` to communicate with the backend:

- All API calls go through the Express backend (port 3001)
- Authentication tokens are stored in localStorage
- Automatic token injection in requests
- Automatic redirect to login on 401 errors

### Key Files

- `lib/api-client.ts` - Backend API client
- `lib/config.ts` - Environment configuration
- `app/api/*/route.ts` - Next.js API routes (proxy to backend)
- `lib/auth-context.tsx` - Authentication context
- `lib/cart-context.tsx` - Shopping cart context

### API Routes

Next.js API routes act as a thin proxy layer:

- `/api/products` → Backend `/api/products`
- `/api/artisans` → Backend `/api/artisans`
- `/api/ai/products` → Backend `/api/products/ai-generate`

## Features

- ✅ Product browsing and search
- ✅ Shopping cart
- ✅ Artisan profiles
- ✅ AI product generation (voice + image)
- ✅ Admin dashboard
- ✅ Authentication
- ✅ Responsive design
- ✅ Dark mode support

## Backend Connection

Make sure the backend is running:

```bash
cd ../backend
npm run dev
```

Backend should be accessible at http://localhost:3001

## Troubleshooting

### CORS Errors

If you see CORS errors, make sure the backend has CORS enabled for http://localhost:3000

### 401 Errors

Clear localStorage and login again:
```javascript
localStorage.clear()
```

### Connection Refused

Make sure the backend is running on port 3001
