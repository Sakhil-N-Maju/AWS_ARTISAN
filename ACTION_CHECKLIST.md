# Action Checklist - What to Do Now

**Priority**: CRITICAL  
**Time Sensitive**: Yes (Hackathon deadline)

---

## 🚨 CRITICAL: Diagnose the Issue First (Do This First!)

### Step 0: Run SCP Diagnosis Script

**Time**: 2 minutes  
**Purpose**: Determine if SCP is blocking Bedrock access

**Run**:
```bash
cd backend
node test-scp-diagnosis.js
```

**This will tell you**:
- ✅ If your account is in an AWS Organization
- ✅ If Service Control Policies are attached
- ✅ If SCPs are blocking Marketplace actions
- ✅ Whether to contact Organization admin or AWS Support

**Based on the result, follow the appropriate path below.**

---

## 🚨 Path A: Account is in AWS Organization (SCP Issue)

### Contact Organization Administrator (CRITICAL)

**Time**: 10 minutes  
**Expected Response**: 2-24 hours

**Email Template**:
```
Subject: Request to Allow AWS Marketplace Access for Amazon Bedrock

Hi [Admin Name],

I need access to Amazon Bedrock foundation models for a hackathon project 
(AI for Bharat Hackathon), but I'm encountering an SCP restriction.

AWS Account ID: 557211736798
Issue: AWS Marketplace subscriptions are being blocked by SCP
Service Needed: Amazon Bedrock (Claude 3 models)

Error Details:
- AWS Marketplace agreements expire instantly upon creation
- Error: INVALID_PAYMENT_INSTRUMENT (but payment method is valid)
- Agreement ID: agmt-ehimfxpsr0g0zuctfog215dj

Required Permissions:
- aws-marketplace:Subscribe
- aws-marketplace:Unsubscribe  
- aws-marketplace:ViewSubscriptions

Specifically for Bedrock model Product IDs:
- prod-ozonys2hmmpe* (Anthropic Claude models)

This is time-sensitive for the hackathon. Can you please:
1. Check if there's an SCP blocking AWS Marketplace actions
2. Add an exception for Amazon Bedrock marketplace subscriptions
3. Or temporarily allow marketplace access for my account

Diagnostic output attached.

Thank you!
```

**Attach**: Output from `test-scp-diagnosis.js`

**See**: `AWS_SCP_DIAGNOSIS_AND_FIX.md` for detailed SCP fix instructions

---

## 🚨 Path B: Account is Standalone (Not SCP Issue)

### Option 1: AWS Support Center (BEST)

**Time**: 5 minutes  
**Expected Response**: 1-24 hours

**Steps**:
1. Go to: https://console.aws.amazon.com/support/
2. Click "Create case"
3. Select "Account and billing support"
4. Fill in:
   - **Subject**: "Cannot access Amazon Bedrock - INVALID_PAYMENT_INSTRUMENT error"
   - **Description**: Copy content from `AWS_SUPPORT_REQUEST.md`
   - **Priority**: High
5. Submit

**Why This Works**: Only AWS Support can fix account-level payment issues.

---

### Option 2: Contact Hackathon Organizers

**Time**: 10 minutes  
**Expected Response**: 1-4 hours

**What to Say**:
```
Subject: AWS Bedrock Access Issue - Need Support Escalation

Hi [Organizer Name],

I'm participating in the AI for Bharat Hackathon and facing an AWS Bedrock 
access issue that's blocking my project.

AWS Account ID: 557211736798
Error: INVALID_PAYMENT_INSTRUMENT
Services Blocked: Amazon Bedrock, Amazon Transcribe

I've added a valid payment method and have $200-300 in hackathon credits, 
but AWS Marketplace subscriptions are failing. The agreement is being 
created and expiring instantly.

Can you help escalate this with AWS Support? I've already submitted a 
support ticket but would appreciate any expedited assistance.

Thank you!
```

**Why This Works**: Hackathon organizers often have direct AWS contacts.

---

## ✅ While Waiting: Continue Development

### Task 1: Update AI Pipeline to Use Mock Service (15 min)

**File**: `backend/src/services/ai-pipeline.service.ts`

**Change**:
```typescript
// At the top of the file, add:
import { bedrockMockService } from './bedrock-mock.service';

// In the generateProductListing method, replace:
const aiResult = await bedrockService.generateProductListing(prompt);

// With:
const aiResult = await bedrockMockService.generateProductListing(prompt);
```

**Test**:
```bash
cd backend
node test-ai-generation.js
```

---

### Task 2: Set Up ngrok for WhatsApp Testing (10 min)

**Install ngrok**:
```bash
# Download from: https://ngrok.com/download
# Or use chocolatey:
choco install ngrok

# Or use npm:
npm install -g ngrok
```

**Start ngrok**:
```bash
ngrok http 3001
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

---

### Task 3: Configure Twilio Webhook (5 min)

1. Go to: https://console.twilio.com/
2. Navigate to: Messaging → Try it out → Send a WhatsApp message
3. Click on "Sandbox settings"
4. Set webhook URL: `https://YOUR-NGROK-URL/api/whatsapp/webhook`
5. Method: POST
6. Save

---

### Task 4: Register Test Artisan (5 min)

**File**: `backend/register-test-artisan.http`

**Run**:
```bash
# Option 1: Use REST Client extension in VS Code
# Open the file and click "Send Request"

# Option 2: Use curl
curl -X POST http://localhost:3001/api/admin/artisans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test Artisan",
    "phone": "+919876543210",
    "whatsappNumber": "+919876543210",
    "craftType": "pottery",
    "region": "Rajasthan",
    "language": "hindi"
  }'
```

**Note**: You'll need to create an admin user first or modify the endpoint to skip auth for testing.

---

### Task 5: Test WhatsApp Integration (10 min)

**Send Test Message**:
1. Open WhatsApp
2. Send message to: +1 415 523 8886
3. First message: `join <your-sandbox-code>`
4. Then send: "Test product" + attach an image

**Expected Flow**:
1. Backend receives webhook
2. Image uploaded to S3
3. Image analyzed with Rekognition
4. Mock AI generates product listing
5. You receive preview message

**Check Logs**:
```bash
# In backend terminal, you should see:
# - Webhook received
# - Image uploaded
# - Labels detected
# - Product listing generated
```

---

### Task 6: Set Up Database (Optional, 30 min)

**If you want to persist data**:

```bash
cd backend

# Install PostgreSQL (if not installed)
# Windows: Download from https://www.postgresql.org/download/windows/

# Create database
createdb artisan_marketplace

# Update .env with real database URL
# DATABASE_URL="postgresql://postgres:password@localhost:5432/artisan_marketplace"

# Run migrations
npx prisma migrate dev

# Seed data
npx prisma db seed
```

---

## 📊 Progress Tracking

### Immediate Actions (Today)
- [ ] Submit AWS Support ticket
- [ ] Contact hackathon organizers
- [ ] Update AI pipeline to use mock service
- [ ] Set up ngrok
- [ ] Configure Twilio webhook
- [ ] Test WhatsApp integration

### After AWS Support Responds
- [ ] Test Bedrock access
- [ ] Switch to real AI service
- [ ] Test voice transcription
- [ ] Complete end-to-end testing

---

## 🎯 Success Metrics

### You'll Know It's Working When:

1. **AWS Support Ticket Submitted**
   - ✅ Received confirmation email
   - ✅ Ticket number assigned

2. **Mock AI Working**
   - ✅ `test-ai-generation.js` passes
   - ✅ Generates realistic product listings
   - ✅ Response time < 2 seconds

3. **WhatsApp Integration Working**
   - ✅ Webhook receives messages
   - ✅ Images uploaded to S3
   - ✅ Product preview sent back
   - ✅ Artisan can approve/reject

4. **AWS Bedrock Restored**
   - ✅ `test-bedrock-simple.js` passes
   - ✅ Real AI generates listings
   - ✅ No payment errors

---

## ⏱️ Time Estimates

| Task | Time | Priority |
|------|------|----------|
| Submit AWS Support ticket | 5 min | 🔴 CRITICAL |
| Contact hackathon organizers | 10 min | 🔴 CRITICAL |
| Update AI pipeline | 15 min | 🟡 High |
| Set up ngrok | 10 min | 🟡 High |
| Configure Twilio | 5 min | 🟡 High |
| Test WhatsApp | 10 min | 🟡 High |
| Set up database | 30 min | 🟢 Medium |
| **Total** | **85 min** | |

**Critical Path**: AWS Support response (1-24 hours)

---

## 🆘 If You Get Stuck

### Mock AI Not Working
```bash
cd backend
npm run build
node test-mock-ai.js
```

Check for compilation errors.

### WhatsApp Not Receiving Messages
1. Check ngrok is running: `ngrok http 3001`
2. Check webhook URL in Twilio console
3. Check backend logs for errors
4. Verify Twilio credentials in `.env`

### Bedrock Still Not Working After AWS Support
1. Wait 2 minutes after they confirm fix
2. Test with: `node test-bedrock-simple.js`
3. Try different region: `AWS_REGION=us-west-2`
4. Check AWS Marketplace subscriptions

---

## 📞 Quick Reference

### AWS Account
- **Account ID**: 557211736798
- **Region**: us-east-1
- **S3 Bucket**: artisan-ai-media (ap-south-1)

### Twilio
- **Account SID**: AC91120c4f571fee7ea8c9f4c5eff95fd9
- **WhatsApp Number**: +14155238886

### Local Servers
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

### Key Commands
```bash
# Test mock AI
cd backend && node test-mock-ai.js

# Test Bedrock
cd backend && node test-bedrock-simple.js

# Start ngrok
ngrok http 3001

# Build backend
cd backend && npm run build

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend-new && npm run dev
```

---

## 🎬 Start Here

1. **Right now**: Submit AWS Support ticket (5 min)
2. **Right now**: Contact hackathon organizers (10 min)
3. **Next**: Update AI pipeline to use mock service (15 min)
4. **Next**: Test WhatsApp integration (30 min)
5. **Wait**: For AWS Support response (1-24 hours)
6. **Then**: Switch to real AI and complete testing

---

**Remember**: Don't let AWS block you. Keep building with the mock service!

**Last Updated**: March 7, 2026
