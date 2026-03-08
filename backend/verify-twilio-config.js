require('dotenv').config();

console.log('🔍 Verifying Twilio Configuration...\n');

const config = {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER,
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN
};

console.log('Environment Variables Status:');
console.log('✓ TWILIO_ACCOUNT_SID:', config.TWILIO_ACCOUNT_SID ? `${config.TWILIO_ACCOUNT_SID.substring(0, 6)}...` : '❌ MISSING');
console.log('✓ TWILIO_AUTH_TOKEN:', config.TWILIO_AUTH_TOKEN ? `${config.TWILIO_AUTH_TOKEN.substring(0, 6)}...` : '❌ MISSING');
console.log('✓ TWILIO_WHATSAPP_NUMBER:', config.TWILIO_WHATSAPP_NUMBER || '❌ MISSING');
console.log('✓ WEBHOOK_VERIFY_TOKEN:', config.WEBHOOK_VERIFY_TOKEN ? 'Set' : '❌ MISSING');

console.log('\n📊 Summary:');
const allPresent = config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN && config.TWILIO_WHATSAPP_NUMBER;
if (allPresent) {
  console.log('✅ All Twilio credentials are configured correctly!');
  console.log('\n🚀 Ready to send WhatsApp messages!');
} else {
  console.log('❌ Some credentials are missing. Check your .env file.');
}
