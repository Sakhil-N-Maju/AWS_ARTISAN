# WhatsApp Voice-First AI Integration

## Overview

This document describes the WhatsApp integration that enables artisans to create product listings by sending voice messages and images through WhatsApp.

## Features

- ✅ Multi-language voice transcription (Hindi, Tamil, Telugu, Malayalam, Bengali, Gujarati, English)
- ✅ Image analysis with AWS Rekognition
- ✅ AI-powered product description generation with Claude 3 Sonnet
- ✅ Interactive approval workflow
- ✅ Automatic product publishing
- ✅ Error handling with multi-language support

## Architecture

```
Artisan (WhatsApp) 
    ↓
Twilio WhatsApp API
    ↓
Webhook (/api/whatsapp/webhook)
    ↓
WhatsApp Controller
    ↓
AI Pipeline Service
    ├─ AWS Transcribe (voice → text)
    ├─ AWS Rekognition (image → labels)
    └─ AWS Bedrock (generate listing)
    ↓
Product Preview (WhatsApp)
    ↓
Artisan Approval
    ↓
Product Published
```

## Setup

### 1. Twilio Account Setup

1. Create a Twilio account at https://www.twilio.com/
2. Get a WhatsApp-enabled phone number
3. Note your Account SID and Auth Token

### 2. Environment Variables

Add to `.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
WEBHOOK_VERIFY_TOKEN=your_random_token_here
```

### 3. Configure Webhook

1. Go to Twilio Console → Messaging → Settings → WhatsApp Sandbox
2. Set webhook URL: `https://your-domain.com/api/whatsapp/webhook`
3. Method: POST
4. The webhook will be automatically verified on first request

### 4. Register Artisans

Artisans must be registered in the database before they can use the system:

```bash
# Using the admin API
POST /api/admin/artisans
{
  "name": "Rajesh Kumar",
  "phone": "+919876543210",
  "whatsappNumber": "+919876543210",
  "craftType": "Pottery",
  "region": "Rajasthan",
  "language": "hindi",
  "status": "verified"
}
```

## Usage Flow

### 1. Artisan Sends Message

Artisan sends a WhatsApp message with:
- Voice message describing the product (in their native language)
- Product image(s)

Example voice message:
> "यह एक हाथ से बना मिट्टी का बर्तन है। इसे बनाने में 3 दिन लगे। यह पारंपरिक राजस्थानी शैली में है।"

### 2. System Processes

1. **Acknowledgment** (< 5 seconds)
   - System sends immediate confirmation in artisan's language

2. **AI Processing** (< 90 seconds)
   - Upload media to S3
   - Transcribe voice to text
   - Analyze image for materials, colors, objects
   - Generate product listing with Claude 3 Sonnet
   - Create product draft in database

3. **Preview Sent**
   - System sends formatted preview via WhatsApp
   - Includes title, description, suggested price
   - Shows approval buttons (1. Approve, 2. Edit, 3. Reject)

### 3. Artisan Responds

**Option 1: Approve**
- Artisan replies "1" or "approve"
- Product is published immediately
- Artisan receives confirmation with product link

**Option 2: Edit**
- Artisan replies "2" or "edit"
- System asks for specific changes
- Artisan can modify title, description, or price

**Option 3: Reject**
- Artisan replies "3" or "reject"
- Draft is discarded
- Artisan can send new product anytime

**Option 4: Auto-approve**
- If no response within 24 hours
- Product is automatically published

## API Endpoints

### Webhook Verification (GET)

```
GET /api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=TOKEN&hub.challenge=CHALLENGE
```

Response: Returns the challenge value

### Receive Message (POST)

```
POST /api/whatsapp/webhook
Headers:
  x-twilio-signature: <signature>
Body: (Twilio webhook payload)
```

Response: `{ "success": true, "message": "Message received" }`

## Message Types Supported

### Voice Messages
- Formats: OGG, MP3, WAV
- Max duration: 2 minutes
- Languages: Hindi, Tamil, Telugu, Malayalam, Bengali, Gujarati, English

### Images
- Formats: JPEG, PNG, WebP
- Min resolution: 800x800
- Max size: 5MB
- Multiple images: Up to 5 per product

### Text Messages
- Used for approval responses
- Used for edit requests
- System provides guidance for text-only messages

## Error Handling

### Transcription Errors
- Low audio quality
- Unsupported language
- Background noise

**Response**: System asks for clearer audio in artisan's language

### Image Errors
- Low resolution
- Poor lighting
- Blurry image

**Response**: System requests better photo

### AI Generation Errors
- API failures
- Invalid responses
- Timeout

**Response**: System notifies artisan and escalates to admin

## Multi-Language Support

### Supported Languages

| Language | Code | AWS Transcribe Code |
|----------|------|---------------------|
| Hindi | hindi | hi-IN |
| Tamil | tamil | ta-IN |
| Telugu | telugu | te-IN |
| Malayalam | malayalam | ml-IN |
| Bengali | bengali | bn-IN |
| Gujarati | gujarati | gu-IN |
| English | english | en-IN |

### Message Templates

All system messages are available in all supported languages:
- Acknowledgment messages
- Error messages
- Approval confirmations
- Instructions

## Testing

### Local Testing with ngrok

1. Install ngrok: `npm install -g ngrok`
2. Start backend: `npm run dev`
3. Expose webhook: `ngrok http 3001`
4. Update Twilio webhook URL with ngrok URL
5. Send test messages to Twilio sandbox number

### Test Scenarios

1. **Voice + Image**
   - Send voice message in Hindi
   - Attach product image
   - Verify transcription accuracy
   - Check generated listing quality

2. **Image Only**
   - Send product image without voice
   - System should request voice description

3. **Approval Flow**
   - Send product
   - Receive preview
   - Reply "1" to approve
   - Verify product is published

4. **Error Handling**
   - Send low-quality audio
   - Verify error message in correct language

5. **Unknown Artisan**
   - Send message from unregistered number
   - Verify rejection message

## Monitoring

### Key Metrics

- Message processing time (target: < 90 seconds)
- Transcription accuracy (target: > 85%)
- AI generation success rate (target: > 95%)
- Artisan approval rate (target: > 90%)

### Logs

All operations are logged with context:

```typescript
logger.info('WhatsApp message received', {
  from: phoneNumber,
  type: messageType,
  messageId: messageId
});
```

### CloudWatch Alarms

- Processing time > 120 seconds
- Error rate > 5%
- Transcription confidence < 80%

## Troubleshooting

### Webhook Not Receiving Messages

1. Check Twilio webhook configuration
2. Verify webhook URL is publicly accessible
3. Check signature verification is passing
4. Review Twilio debugger logs

### Transcription Failing

1. Check AWS Transcribe service limits
2. Verify audio format is supported
3. Check language code mapping
4. Review audio quality

### AI Generation Failing

1. Check AWS Bedrock access
2. Verify Claude 3 Sonnet model access
3. Review prompt template
4. Check response parsing logic

### Messages Not Sending

1. Verify Twilio credentials
2. Check WhatsApp number is active
3. Review Twilio account balance
4. Check rate limits

## Security

### Webhook Signature Verification

All incoming webhooks are verified using Twilio's signature:

```typescript
const expectedSignature = crypto
  .createHmac('sha1', TWILIO_AUTH_TOKEN)
  .update(Buffer.from(data, 'utf-8'))
  .digest('base64');
```

### Data Encryption

- Voice files encrypted at rest in S3
- Images encrypted at rest in S3
- Sensitive data encrypted in database

### Rate Limiting

- 5 messages per minute per artisan
- 100 messages per hour per artisan
- Prevents abuse and spam

## Cost Optimization

### AWS Services

- **Transcribe**: ~$0.024 per minute
- **Rekognition**: ~$0.001 per image
- **Bedrock**: ~$0.003 per 1K tokens
- **S3**: ~$0.023 per GB

**Estimated cost per product**: ~$0.10

### Twilio Costs

- WhatsApp messages: $0.005 per message
- Media messages: $0.02 per message

**Estimated cost per product**: ~$0.05

**Total cost per product**: ~$0.15

## Future Enhancements

- [ ] Support for video messages
- [ ] Batch product uploads
- [ ] Voice-based product editing
- [ ] Multi-image product listings
- [ ] Automated pricing suggestions
- [ ] Integration with inventory management
- [ ] Analytics dashboard for artisans
- [ ] WhatsApp Business API (for verified accounts)

## Support

For issues or questions:
- Check logs in CloudWatch
- Review Twilio debugger
- Contact development team

---

**Last Updated**: March 5, 2026  
**Version**: 1.0.0
