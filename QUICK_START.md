# Quick Start Guide

## What Changed

We're now using `frontend-ref` as the main frontend (renamed to `frontend-new`), connected to the Express backend.

## Current Status

✅ Backend configured (port 3001)
✅ Frontend-new created with API client
✅ API routes updated to use backend
✅ Environment files configured
✅ CORS fixed in backend

## Next Steps

### 1. Clean Up Old Frontend

**Close VS Code first**, then run:

```powershell
# Delete old frontend folder
Remove-Item -Path "frontend" -Recurse -Force

# Rename frontend-new to frontend
Rename-Item -Path "frontend-new" -NewName "frontend"
```

### 2. Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### 3. Start Backend

```powershell
cd backend
npm install  # if not already done
npm run dev
```

Backend will run on http://localhost:3001

### 4. Start Frontend

In a new terminal:

```powershell
cd frontend
npm run dev
```

Frontend will run on http://localhost:3000

## Testing

Visit http://localhost:3000 and verify:

1. Home page loads
2. Products page shows data
3. Product details work
4. Cart functionality
5. Admin login at /admin/login

## Architecture

```
Frontend (Next.js)          Backend (Express)
Port 3000                   Port 3001
     │                           │
     ├─ UI/Pages                 ├─ API Routes
     ├─ Components               ├─ AWS Services
     ├─ API Client ──────────────┤   - S3
     └─ Contexts                 │   - Bedrock
                                 │   - Rekognition
                                 │   - Transcribe
                                 └─ Database (Prisma)
```

## Key Files

### Frontend
- `lib/api-client.ts` - Backend API client
- `lib/config.ts` - Configuration with API URL
- `.env.local` - Environment variables
- `app/api/*/route.ts` - API proxy routes

### Backend
- `src/index.ts` - Express server (CORS fixed)
- `.env` - Environment variables (PORT=3001)
- `src/routes/*.routes.ts` - API endpoints
- `src/services/*.service.ts` - AWS integrations

## Troubleshooting

### Can't delete frontend folder
- Close VS Code completely
- Stop all Node processes
- Restart terminal
- Try again

### CORS errors
Backend CORS is configured for http://localhost:3000
Check backend logs to verify

### Connection refused
Make sure backend is running on port 3001:
```powershell
netstat -ano | findstr :3001
```

### 401 Unauthorized
Clear browser localStorage and login again

## Features Available

- ✅ Product browsing with AWS S3 images
- ✅ AI product generation (voice + image)
- ✅ Shopping cart
- ✅ Artisan profiles
- ✅ Admin dashboard
- ✅ Authentication (JWT)
- ✅ Voice commerce
- ✅ Image recognition
- ✅ All frontend-ref features

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_AI_FEATURES=true
NEXT_PUBLIC_ENABLE_VOICE_FEATURES=true
```

### Backend (.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=prisma+postgres://...
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET=artisan-ai-media
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
JWT_SECRET=your_jwt_secret_min_32_chars
```

## What's Next

After verifying everything works:

1. Test AI product generation
2. Test image upload to S3
3. Test voice recording
4. Configure AWS credentials properly
5. Set up proper JWT secret
6. Deploy to production

## Need Help?

Check these files:
- `FRONTEND_SETUP_COMPLETE.md` - Detailed setup info
- `FRONTEND_INTEGRATION_PLAN.md` - Architecture plan
- `frontend/SETUP.md` - Frontend-specific setup
- `backend/SETUP.md` - Backend-specific setup
