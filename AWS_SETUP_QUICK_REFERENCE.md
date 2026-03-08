# AWS Setup Quick Reference

## 🚀 Quick Start (30 minutes)

### Step 1: Enable Transcribe (5 minutes)
```
1. Go to: https://console.aws.amazon.com/transcribe/
2. Click "Get started" or "Create transcription job"
3. Accept terms if prompted
4. Wait 2-3 minutes
```

### Step 2: Enable Bedrock (15-30 minutes)
```
1. Go to: https://console.aws.amazon.com/bedrock/
2. Click "Model access" in left sidebar
3. Find "Anthropic" → "Claude 3 Sonnet"
4. Check the box and click "Request model access"
5. Fill out form:
   - Use case: "Artisan Product Listing Generator"
   - Industry: "E-commerce"
   - Requests/day: "100-500"
6. Submit and wait for approval (usually 5-30 minutes)
```

### Step 3: Test Everything
```bash
cd backend
node test-aws-comprehensive.js
```

**Expected Result:**
```
✅ S3:           PASS
✅ Transcribe:   PASS
✅ Rekognition:  PASS
✅ Bedrock:      PASS

🎉 All AWS services are working!
```

---

## 📋 Use Case Form Template

Copy and paste this when requesting Bedrock access:

**Use case name:**
```
Artisan Product Listing Generator
```

**Use case description:**
```
AI-powered product listing generation for an artisan marketplace platform. 
The system processes voice descriptions and product images from artisans 
to generate professional product titles, descriptions, cultural context, 
and metadata for e-commerce listings.
```

**Industry:** E-commerce

**Requests per day:** 100-500

**Will you process personal data?** No

**Will you store model outputs?** Yes

---

## 🔧 Troubleshooting

### Transcribe Error: "Needs subscription"
- Wait 10 minutes and retry
- Try enabling in us-east-1 first
- Check IAM permissions

### Bedrock Error: "Use case not submitted"
- Check Model Access page for status
- Wait up to 24 hours
- Check email for approval

### Still Not Working?
```bash
# Check AWS credentials
aws sts get-caller-identity

# Check region
echo $AWS_REGION  # Should be: ap-south-1
```

---

## 💰 Cost Estimate

**First month (100 products):** ~$4.50
- Transcribe: $2.40
- Bedrock: $1.50
- Rekognition: $0.10
- S3: $0.50

**Free tier available:**
- Transcribe: 60 min/month free
- Rekognition: 5,000 images/month free
- S3: 5 GB free

---

## 📞 Support Links

- **Transcribe Console:** https://console.aws.amazon.com/transcribe/
- **Bedrock Console:** https://console.aws.amazon.com/bedrock/
- **AWS Support:** https://console.aws.amazon.com/support/
- **Service Health:** https://status.aws.amazon.com/

---

## ✅ Next Steps After Setup

1. Run test: `node backend/test-aws-comprehensive.js`
2. Start backend: `npm run dev`
3. Set up ngrok: `ngrok http 3001`
4. Configure Twilio webhook
5. Send test WhatsApp message
6. Monitor logs for processing

---

**Full detailed guide:** See `AWS_SERVICES_SETUP_GUIDE.md`
