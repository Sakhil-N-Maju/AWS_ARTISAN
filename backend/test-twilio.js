// Quick test script to verify Twilio connection
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

console.log('Testing Twilio connection...');
console.log('Account SID:', accountSid);
console.log('WhatsApp Number:', process.env.TWILIO_WHATSAPP_NUMBER);

// Test by sending a welcome message
client.messages
  .create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    body: '🎉 Welcome to Artisan AI!\n\nYour WhatsApp integration is working! You can now send voice messages and images to create product listings.\n\nTry sending:\n🎤 Voice message describing your product\n📷 Product image\n\nI\'ll create a professional listing for you!',
    to: 'whatsapp:+918590955502'
  })
  .then(message => {
    console.log('✅ Message sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Status:', message.status);
  })
  .catch(error => {
    console.error('❌ Error sending message:', error.message);
    console.error('Error code:', error.code);
  });
