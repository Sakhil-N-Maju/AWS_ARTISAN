# AWS Credits & Cost Management - AI for Bharat Hackathon

## 🎉 Your Available Credits

| Source | Amount | Status |
|--------|--------|--------|
| AWS Free Tier Sign-up | $100 | ✅ Automatic |
| AWS Service Exploration | $100 | ✅ You've explored services |
| Hackathon Credit Code | $100 | ⏳ Need to redeem |
| **Total** | **$300** | |

---

## 🔐 Step 1: Add Payment Method (Required)

Even with credits, AWS requires a payment method for identity verification.

**Your card will NOT be charged while you have credits!**

1. Go to: https://console.aws.amazon.com/billing/
2. Click "Payment methods"
3. Click "Add a payment method"
4. Enter card details
5. Save

Wait 2-3 minutes for verification.

---

## 🎫 Step 2: Redeem Hackathon Credit Code

If you have a hackathon credit code from the organizers:

1. Go to: https://console.aws.amazon.com/billing/
2. Click your account name → "Billing and Cost Management"
3. Click "Credits" in left panel
4. Click "Redeem credit"
5. Enter your hackathon code
6. Enter CAPTCHA
7. Click "Redeem credit"

Your $100 hackathon credit will be added!

---

## 🛡️ Step 3: Set Up Cost Protection

### Enable Free Tier Alerts

1. Go to Billing and Cost Management
2. Click "Billing Preferences"
3. Enable "AWS Free Tier alerts"
4. Enter your email
5. Save

### Create a Budget Alert

1. In Billing, click "Budgets"
2. Click "Create budget"
3. Select "Monthly cost budget"
4. Set amount: **$50** (well below your $300 limit)
5. Add your email
6. Create budget

You'll get an email if spending approaches $50.

### Monitor with Cost Explorer

1. In Billing, click "Cost Explorer"
2. Enable it (free)
3. Check regularly to see your spending

---

## 💡 Your Project Costs (Estimated)

For the WhatsApp Voice-First AI MVP:

| Service | Usage (100 products) | Cost | Covered By |
|---------|---------------------|------|------------|
| S3 | 500 MB storage | $0.50 | Free Tier |
| Rekognition | 100 images | $0.10 | Free Tier |
| Bedrock | 100 requests | $1.50 | Credits |
| Transcribe | 100 minutes | $2.40 | Credits |
| **Total** | | **$4.50** | |

**For 1000 products:** ~$45/month (still well within $300 credits!)

---

## 🎯 Best Practices to Stay Within Limits

1. **Stop EC2 instances** when not in use
2. **Delete unused resources** (EBS volumes, Elastic IPs)
3. **Use serverless** (Lambda, DynamoDB) - scales to zero
4. **Monitor regularly** via Cost Explorer
5. **Set up billing alerts** (done above)
6. **Use t3.micro instances** (Free Tier eligible)

---

## 📊 Current Status

After adding payment method:

- ✅ S3 - Working
- ✅ Rekognition - Working  
- ⏳ Bedrock - Will work after payment method added
- ❌ Transcribe - Needs AWS Support

---

## 🚀 Next Steps

1. **Add payment method** (link above)
2. **Wait 2-3 minutes**
3. **Test Bedrock**: `node backend/test-ai-generation.js`
4. **Redeem hackathon code** (if you have one)
5. **Set up billing alerts** (for safety)
6. **Start building!**

---

## 📞 Support

- **AWS Billing FAQs**: https://aws.amazon.com/billing/faqs
- **Hackathon Support**: Contact organizers
- **AWS Documentation**: https://docs.aws.amazon.com

---

**With $300 in credits, you can build and test extensively without worrying about costs!** 🎉
