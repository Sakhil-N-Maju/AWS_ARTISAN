const axios = require('axios');

async function testWebhook() {
  try {
    console.log('Testing WhatsApp webhook locally...\n');
    
    // Simulate a WhatsApp message webhook from Twilio
    const webhookData = {
      MessageSid: 'TEST123456789',
      From: 'whatsapp:+918590955502',
      To: 'whatsapp:+14155238886',
      Body: 'Test message',
      NumMedia: '0'
    };

    const response = await axios.post(
      'http://localhost:3001/api/whatsapp/webhook',
      new URLSearchParams(webhookData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✅ Webhook response:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('❌ Webhook test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testWebhook();
