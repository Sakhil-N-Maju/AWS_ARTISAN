// Test if environment variables are loaded
require('dotenv').config();

console.log('Environment Variables Test:');
console.log('==========================');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '***' + process.env.TWILIO_AUTH_TOKEN.slice(-4) : 'undefined');
console.log('TWILIO_WHATSAPP_NUMBER:', process.env.TWILIO_WHATSAPP_NUMBER);
console.log('WEBHOOK_VERIFY_TOKEN:', process.env.WEBHOOK_VERIFY_TOKEN ? '***' + process.env.WEBHOOK_VERIFY_TOKEN.slice(-4) : 'undefined');
console.log('==========================');
console.log('Total env vars:', Object.keys(process.env).length);
