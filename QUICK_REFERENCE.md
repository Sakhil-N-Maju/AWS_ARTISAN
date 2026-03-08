# 🚀 Quick Reference - WhatsApp Voice-First AI MVP

## ⚡ Quick Start (When Ready to Test)

```bash
# 1. Start ngrok (new terminal)
ngrok http 3001

# 2. Copy ngrok URL and configure in Twilio
# https://console.twilio.com/ → Messaging → WhatsApp Sandbox Settings
# Webhook: https://[your-ngrok-url].ngrok.io/api/whatsapp/webhook

# 3. Join WhatsApp sandbox from your phone
# Send to +1 415 523 8886: "join [your-code]"

# 4. Register your artisan account
# Open: backend/register-test-artisan.http
# Click "Send Request"

# 5. Send test message from WhatsApp!
```

---

## 📱 Your Configuration

```
Your Phone: +918590955502
Twilio Number: +14155238886
Account SID: AC91120c4f571fee7ea8c9f4c5eff95fd9
Webhook Token: artisan_ai_webhook_secret_2026
```

---

## 🌐 URLs

```
Backend:  http://localhost:3001
Frontend: http://localhost:3000
ngrok UI: http://localhost:4040
Twilio:   https://console.twilio.com/
```

---

## 📋 Test Message Template

**From WhatsApp (+918590955502) to +1 415 523 8886:**

```
🎤 Voice (30-60 sec):
"This is a handmade clay pottery bowl.
It's made using traditional techniques.
Perfect for serving food.
Microwave safe."

📷 Attach: Product image

Send!
```

**Expected Response (< 5 sec):**
```
✅ Thank you! I received your message.
I'm processing it now...
```

**Expected Preview (< 90 sec):**
```
✨ Your Product Listing is Ready!

*Handcrafted Clay Pottery Bowl*

[Description...]

💰 Suggested Price: ₹850.00

1. ✅ Approve
2. ✏️ Edit  
3. ❌ Reject
```

**To Approve:**
```
Reply: 1
```

---

## 🔍 Monitoring

### Backend Logs
```bash
# Watch terminal running: npm run dev
# Look for:
- "Webhook received"
- "Message parsed"
- "AI pipeline started"
- "Preview sent"
```

### ngrok Requests
```
Open: http://localhost:4040
View all webhook requests/responses
```

### Database (if configured)
```bash
cd backend
npx prisma studio
# View WhatsAppMessage, Product, Artisan tables
```

---

## 💰 Cost Tracking

```
Per Test:
- Basic flow: $0.30 (6 messages)
- Edit flow: $0.40 (8 messages)
- Reject flow: $0.20 (4 messages)

Your Credits: $15
Max Tests: ~50 complete flows
```

---

## 🐛 Quick Troubleshooting

### No webhook response?
```bash
# Check ngrok is running
curl http://localhost:4040/api/tunnels

# Check backend logs
# Should show: "Webhook received"
```

### "Artisan not found"?
```bash
# Register artisan
# Use: backend/register-test-artisan.http
```

### AI timeout?
```bash
# Check AWS credentials in backend/.env
# Check CloudWatch logs
```

---

## 📚 Documentation

```
Start Here:     READY_TO_TEST_CHECKLIST.md
Testing Guide:  WHATSAPP_TESTING_GUIDE.md
Implementation: WHATSAPP_MVP_IMPLEMENTATION.md
This Session:   SESSION_SUMMARY.md
```

---

## ✅ Pre-Flight Checklist

- [ ] Backend running (port 3001)
- [ ] Frontend running (port 3000)
- [ ] ngrok installed
- [ ] ngrok running
- [ ] Twilio webhook configured
- [ ] WhatsApp sandbox joined
- [ ] Artisan registered
- [ ] Ready to test!

---

## 🎯 Success Criteria

After first test:
- [ ] Webhook receives message (< 1s)
- [ ] Acknowledgment sent (< 5s)
- [ ] AI processing completes (< 90s)
- [ ] Preview is accurate
- [ ] Approval works
- [ ] Product on website

---

## 🚨 Emergency Commands

```bash
# Restart backend
cd backend
npm run dev

# Restart frontend
cd frontend-new
npm run dev

# Restart ngrok
ngrok http 3001

# Check artisan
curl http://localhost:3001/api/artisans?phone=+918590955502

# Test webhook
curl "http://localhost:3001/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=artisan_ai_webhook_secret_2026&hub.challenge=test"
```

---

## 📞 Support Files

```
HTTP Tests:     backend/register-test-artisan.http
Twilio Test:    backend/test-twilio.js
Postman:        backend/postman_collection.json
Environment:    backend/.env
```

---

**You're all set! When ready, follow READY_TO_TEST_CHECKLIST.md** 🎉
