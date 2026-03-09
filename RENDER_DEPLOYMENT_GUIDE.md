# Deploy Artisan AI to Render.com - Complete Guide

## Prerequisites
- GitHub account with your code pushed
- Render.com account (free - no credit card required)
- AWS credentials (for S3, Transcribe, Bedrock, Rekognition)

---

## Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (recommended for easy deployment)
4. Authorize Render to access your GitHub repositories

---

## Step 2: Deploy PostgreSQL Database

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure database:
   - **Name**: `artisan-ai-db`
   - **Database**: `artisan_ai`
   - **User**: `artisan`
   - **Region**: Singapore (or closest to you)
   - **Plan**: Free
3. Click **"Create Database"**
4. Wait 2-3 minutes for database to be ready
5. **Copy the Internal Database URL** (you'll need this)

---

## Step 3: Deploy Backend API

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `Sakhil-N-Maju/AWS_ARTISAN`
3. Configure service:

### Basic Settings:
- **Name**: `artisan-ai-backend`
- **Region**: Singapore (same as database)
- **Branch**: `master`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: 
  ```bash
  npm install && npx prisma generate && npx prisma migrate deploy
  ```
- **Start Command**: 
  ```bash
  npm start
  ```
- **Plan**: Free

### Environment Variables:
Click **"Add Environment Variable"** for each:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=[Paste Internal Database URL from Step 2]
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=[Your AWS Access Key]
AWS_SECRET_ACCESS_KEY=[Your AWS Secret Key]
S3_BUCKET=artisan-ai-media
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
USE_MOCK_BEDROCK=true
TWILIO_ACCOUNT_SID=[Your Twilio SID]
TWILIO_AUTH_TOKEN=[Your Twilio Token]
TWILIO_WHATSAPP_NUMBER=+14155238886
JWT_SECRET=[Generate random 32 char string]
FRONTEND_URL=https://artisan-ai-frontend.onrender.com
```

4. Click **"Create Web Service"**
5. Wait 5-10 minutes for deployment
6. **Copy the backend URL** (e.g., `https://artisan-ai-backend.onrender.com`)

---

## Step 4: Run Database Migrations & Seed

Once backend is deployed:

1. Go to backend service → **"Shell"** tab
2. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Seed database:
   ```bash
   npm run prisma:seed
   ```

---

## Step 5: Deploy Frontend

### Option A: Deploy as Static Site (Recommended)

1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repository
3. Configure:
   - **Name**: `artisan-ai-frontend`
   - **Branch**: `master`
   - **Root Directory**: `frontend-new`
   - **Build Command**: 
     ```bash
     npm install && npm run build
     ```
   - **Publish Directory**: `.next`

### Environment Variables:
```env
NEXT_PUBLIC_API_URL=[Your backend URL from Step 3]
```

4. Click **"Create Static Site"**
5. Wait 5-10 minutes for deployment

### Option B: Deploy as Web Service (Alternative)

If static site doesn't work:

1. Click **"New +"** → **"Web Service"**
2. Configure:
   - **Root Directory**: `frontend-new`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**: Same as above

---

## Step 6: Verify Deployment

1. **Test Backend**:
   - Visit: `https://artisan-ai-backend.onrender.com/api/products`
   - Should return JSON with products

2. **Test Frontend**:
   - Visit: `https://artisan-ai-frontend.onrender.com`
   - Should show homepage with products

3. **Test Database**:
   - Products and artisans should load
   - Images should display

---

## Step 7: Update Vercel (Optional)

If you want to keep Vercel for frontend:

1. Go to Vercel project settings
2. Update environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://artisan-ai-backend.onrender.com
   ```
3. Redeploy

---

## Troubleshooting

### Backend Issues:

**Build fails:**
- Check Node version (should be 20+)
- Verify all dependencies in `package.json`
- Check build logs for errors

**Database connection fails:**
- Verify DATABASE_URL is correct
- Check database is in same region
- Ensure Prisma migrations ran

**AWS services fail:**
- Verify AWS credentials are correct
- Check AWS_REGION matches your S3 bucket
- Set `USE_MOCK_BEDROCK=true` if Bedrock not available

### Frontend Issues:

**Build fails:**
- Check Node version
- Verify `NEXT_PUBLIC_API_URL` is set
- Check build logs

**API calls fail:**
- Verify backend URL is correct
- Check CORS settings in backend
- Test backend endpoint directly

**Images don't load:**
- Check images are in `frontend-new/public/`
- Verify image paths in database
- Check browser console for errors

---

## Free Tier Limits

**Render Free Tier:**
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ PostgreSQL: 1GB storage, 97 connection limit
- ✅ Automatic HTTPS
- ⚠️ Services sleep after 15 min inactivity (first request takes ~30s)
- ⚠️ 100GB bandwidth/month

**Tips:**
- Use mock data fallback for demo
- Keep services in same region for speed
- Monitor usage in Render dashboard

---

## Production Checklist

Before going live:

- [ ] Database migrations completed
- [ ] Seed data loaded
- [ ] Environment variables set
- [ ] AWS credentials configured
- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] API endpoints working
- [ ] Images displaying
- [ ] CORS configured properly
- [ ] Error logging enabled

---

## Useful Commands

**View Logs:**
- Go to service → "Logs" tab
- Real-time logs for debugging

**Restart Service:**
- Go to service → "Manual Deploy" → "Clear build cache & deploy"

**Database Access:**
- Use connection string from database settings
- Connect with any PostgreSQL client

**Update Code:**
- Push to GitHub master branch
- Render auto-deploys (if enabled)

---

## Cost Estimate

**Free Tier (Current Setup):**
- Backend: Free
- Frontend: Free
- Database: Free
- Total: $0/month

**Paid Tier (For Production):**
- Backend: $7/month (Starter)
- Frontend: $0 (Static)
- Database: $7/month (Starter - 1GB)
- Total: $14/month

---

## Support

**Render Documentation:**
- https://render.com/docs

**Common Issues:**
- https://render.com/docs/troubleshooting

**Community:**
- https://community.render.com

---

**Deployment Complete! 🎉**

Your Artisan AI platform is now live on Render.com with:
- ✅ Backend API running
- ✅ Frontend deployed
- ✅ Database connected
- ✅ Auto-deployments from GitHub

Share your live URL: `https://artisan-ai-frontend.onrender.com`
