# 🚀 Next Steps - You're Almost Ready!

## Current Status
- ✅ Backend running on port 3001
- ✅ Frontend running on port 3000
- ✅ Twilio credentials configured
- ✅ ngrok opened (check the ngrok window)

---

## Step 1: Get Your ngrok URL

**Look at the ngrok window** that opened. You should see:

```
ngrok

Session Status                online
Account                       [your account]
Version                       3.x.x
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3001
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                              COPY THIS URL!
```

**Copy the HTTPS URL** (the one that ends with `.ngrok-free.app`)

---

## Step 2: Configure Twilio Webhook

1. **Open Twilio Console**: https://console.twilio.com/

2. **Go to WhatsApp Sandbox**:
   - Click: **Messaging** (left sidebar)
   - Click: **Try it out**
   - Click: **Send a WhatsApp message**
   - Or direct: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

3. **Click "Sandbox Settings"** (top right button)

4. **Configure the webhook**:
   - Find section: "When a message comes in"
   - **URL**: `https://[your-ngrok-url].ngrok-free.app/api/whatsapp/webhook`
   - **Example**: `https://abc123.ngrok-free.app/api/whatsapp/webhook`
   - **Method**: POST (dropdown)
   - Click **"Save"** (bottom of page)

---

## Step 3: Join WhatsApp Sandbox

**From your phone** (+918590955502):

1. Open **WhatsApp**
2. Start a new chat with: **+1 415 523 8886**
3. Send message: **`join [your-code]`**
   - You'll see the code in Twilio console
   - Example: `join happy-tiger` or `join clever-fox`
4. Wait for confirmation message from Twilio

**Expected response:**
```
✅ Twilio Sandbox: You are all set!
You can start testing your WhatsApp application.
```

---

## Step 4: Register Your Artisan Account

**Option A: Using VS Code REST Client** (Easiest)

1. Open file: `backend/register-test-artisan.http`
2. Find the first request (POST http://localhost:3001/api/artisans)
3. Click **"Send Request"** (appears above the request)
4. You should see: `201 Created` with your artisan details

**Option B: Using PowerShell**

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    name = "Test Artisan"
    email = "test@artisanai.in"
    phone = "+918590955502"
    whatsappNumber = "+918590955502"
    craftType = "Pottery"
    region = "Karnataka"
    bio = "Traditional pottery maker testing WhatsApp AI"
    language = "english"
    status = "verified"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/artisans" -Method POST -Headers $headers -Body $body
```

**Verify it worked:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/artisans?phone=+918590955502"
```

---

## Step 5: Test the Webhook Connection

Before sending a real WhatsApp message, verify the webhook is working:

**Open in your browser:**
```
https://[your-ngrok-url].ngrok-free.app/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=artisan_ai_webhook_secret_2026&hub.challenge=test123
```

**Expected response:** `test123`

If you see this, your webhook is connected! ✅

---

## Step 6: Send Your First Test Message! 🎉

**From WhatsApp** (+918590955502) **to** +1 415 523 8886:

### What to Send:

1. **🎤 Record a voice message** (30-60 seconds):
   ```
   "This is a handmade clay pottery bowl.
   It's made using traditional techniques from Karnataka.
   The bowl is perfect for serving food.
   It's microwave safe and dishwasher safe.
   It took me 3 days to make this beautiful piece."
   ```

2. **📷 Attach a product image**
   - Use a clear, well-lit photo
   - JPEG or PNG format
   - Show the product clearly

3. **Send!**

---

## What Will Happen:

### Response 1: Acknowledgment (< 5 seconds)
```
✅ Thank you! I received your message.
I'm processing it now...
```

### Response 2: Product Preview (< 90 seconds)
```
✨ Your Product Listing is Ready!

*Handcrafted Karnataka Clay Pottery Bowl*

This beautiful handmade pottery bowl showcases 
traditional Karnataka craftsmanship. Made from 
high-quality clay using time-honored techniques, 
this bowl is perfect for serving food...

💰 Suggested Price: ₹850.00

1. ✅ Approve
2. ✏️ Edit
3. ❌ Reject

Reply with the number of your choice.
```

### Response 3: Approve the Product
```
Reply: 1

System responds:
✅ Great! Your product has been published!
🔗 View it here: http://localhost:3000/products/[id]
```

---

## 🔍 Monitoring Your Test

### Watch Backend Logs
Your backend terminal should show:
```
Webhook received from: whatsapp:+918590955502
Message parsed: voice + image
Artisan identified: Test Artisan
AI pipeline started
Uploading to S3...
Starting transcription...
Analyzing image...
Generating content...
Preview sent to artisan
```

### Check ngrok Dashboard
Open: **http://localhost:4040**

You'll see all webhook requests and responses in real-time!

---

## 💰 Cost for This Test

- WhatsApp messages: ~$0.30 (6 messages)
- AWS Transcribe: ~$0.024
- AWS Rekognition: ~$0.001
- AWS Bedrock: ~$0.003
- **Total: ~$0.33**

You have $15 credit = ~45 complete tests

---

## 🐛 Troubleshooting

### No response after sending WhatsApp?

**Check 1:** Is ngrok still running?
- Look at the ngrok window
- Should show "Session Status: online"

**Check 2:** Is the webhook configured correctly?
- Go to Twilio console → Sandbox Settings
- Verify URL matches your ngrok URL
- Should end with `/api/whatsapp/webhook`

**Check 3:** Is backend running?
- Check terminal with backend
- Should show "Server running on port 3001"

**Check 4:** Did you join the sandbox?
- Send "join [code]" to +1 415 523 8886
- Wait for confirmation

**Check 5:** Is artisan registered?
- Run: `Invoke-RestMethod -Uri "http://localhost:3001/api/artisans?phone=+918590955502"`
- Should return your artisan details

### "Artisan not found" error?

**Solution:** Register your artisan using Step 4 above

### Webhook verification failed?

**Check:** 
- Webhook token in `backend/.env` is: `artisan_ai_webhook_secret_2026`
- Twilio webhook URL is correct

---

## ✅ Quick Checklist

- [ ] ngrok window open and showing HTTPS URL
- [ ] Copied ngrok HTTPS URL
- [ ] Twilio webhook configured with ngrok URL
- [ ] Joined WhatsApp sandbox (sent "join [code]")
- [ ] Received confirmation from Twilio
- [ ] Registered artisan account
- [ ] Tested webhook (got "test123" response)
- [ ] Ready to send test message!

---

## 🎯 Quick Reference

**Your Phone:** +918590955502  
**Twilio Number:** +1 415 523 8886  
**Backend:** http://localhost:3001  
**Frontend:** http://localhost:3000  
**ngrok Dashboard:** http://localhost:4040  

**Twilio Console:** https://console.twilio.com/  
**WhatsApp Sandbox:** https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

---

## 🚀 Ready to Test!

Once you complete Steps 1-5, send your WhatsApp message and watch the magic happen! ✨

The system will:
1. Receive your voice + image
2. Transcribe your voice to text
3. Analyze your image
4. Generate a professional product listing
5. Send you a preview
6. Publish after you approve

**Time to first product listing: < 2 minutes!** 🎉

---

**Need help?** Check:
- `WHATSAPP_TESTING_GUIDE.md` - Detailed testing guide
- `QUICK_REFERENCE.md` - One-page reference
- Backend logs - For error messages
- ngrok dashboard (http://localhost:4040) - For webhook requests
