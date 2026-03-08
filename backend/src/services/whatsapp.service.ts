import crypto from 'crypto';
import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import prisma from '../config/database';

// Force reload environment variables (needed for ts-node-dev hot reload)
dotenv.config({ override: true });

// Read environment variables dynamically to avoid caching issues
const getTwilioConfig = () => {
  const config = {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_NUMBER: process.env.TWILIO_WHATSAPP_NUMBER,
    WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN
  };
  
  // Debug log (only log if values are missing)
  if (!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN || !config.TWILIO_WHATSAPP_NUMBER) {
    logger.error('Twilio configuration missing!', {
      hasSID: !!config.TWILIO_ACCOUNT_SID,
      hasToken: !!config.TWILIO_AUTH_TOKEN,
      hasNumber: !!config.TWILIO_WHATSAPP_NUMBER,
      sidPrefix: config.TWILIO_ACCOUNT_SID?.substring(0, 4),
      numberPrefix: config.TWILIO_WHATSAPP_NUMBER?.substring(0, 4),
      allEnvVars: Object.keys(process.env).filter(k => k.startsWith('TWILIO'))
    });
  }
  
  return config;
};

export interface WhatsAppIncomingMessage {
  messageId: string;
  from: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'image' | 'video' | 'document';
  content?: string;
  mediaUrl?: string;
  mimeType?: string;
  mediaId?: string;
}

export interface InteractiveButton {
  id: string;
  title: string;
}

export interface InteractiveMessage {
  type: 'button' | 'list';
  header?: string;
  body: string;
  footer?: string;
  buttons: InteractiveButton[];
}

export class WhatsAppService {
  private get twilioApiUrl() {
    const { TWILIO_ACCOUNT_SID } = getTwilioConfig();
    return `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}`;
  }

  /**
   * Verify webhook signature from Twilio
   */
  verifyWebhookSignature(signature: string, url: string, params: any): boolean {
    const { TWILIO_AUTH_TOKEN } = getTwilioConfig();
    if (!TWILIO_AUTH_TOKEN) {
      logger.warn('TWILIO_AUTH_TOKEN not configured, skipping signature verification');
      return true; // Allow in development
    }

    try {
      // Sort parameters alphabetically
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}${params[key]}`)
        .join('');

      // Create signature
      const data = url + sortedParams;
      const expectedSignature = crypto
        .createHmac('sha1', TWILIO_AUTH_TOKEN)
        .update(Buffer.from(data, 'utf-8'))
        .digest('base64');

      return signature === expectedSignature;
    } catch (error) {
      logger.error('Signature verification failed', { error });
      return false;
    }
  }

  /**
   * Parse incoming WhatsApp message from Twilio webhook
   */
  parseIncomingMessage(payload: any): WhatsAppIncomingMessage {
    const message: WhatsAppIncomingMessage = {
      messageId: payload.MessageSid || payload.SmsMessageSid,
      from: payload.From?.replace('whatsapp:', '') || payload.WaId,
      timestamp: new Date(),
      type: this.detectMessageType(payload),
      content: payload.Body,
      mediaUrl: payload.MediaUrl0,
      mimeType: payload.MediaContentType0,
      mediaId: payload.MediaSid0
    };

    return message;
  }

  /**
   * Detect message type from payload
   */
  private detectMessageType(payload: any): WhatsAppIncomingMessage['type'] {
    if (payload.MediaUrl0) {
      const contentType = payload.MediaContentType0 || '';
      if (contentType.startsWith('audio/')) return 'voice';
      if (contentType.startsWith('image/')) return 'image';
      if (contentType.startsWith('video/')) return 'video';
      return 'document';
    }
    return 'text';
  }

  /**
   * Download media from Twilio
   */
  async downloadMedia(mediaUrl: string): Promise<Buffer> {
    try {
      const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = getTwilioConfig();
      const response = await axios.get(mediaUrl, {
        auth: {
          username: TWILIO_ACCOUNT_SID!,
          password: TWILIO_AUTH_TOKEN!
        },
        responseType: 'arraybuffer'
      });

      return Buffer.from(response.data);
    } catch (error) {
      logger.error('Failed to download media', { mediaUrl, error });
      throw error;
    }
  }

  /**
   * Send text message via WhatsApp
   */
  async sendTextMessage(to: string, message: string): Promise<void> {
    try {
      const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER } = getTwilioConfig();
      const url = `${this.twilioApiUrl}/Messages.json`;
      
      await axios.post(
        url,
        new URLSearchParams({
          From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          To: `whatsapp:${to}`,
          Body: message
        }),
        {
          auth: {
            username: TWILIO_ACCOUNT_SID!,
            password: TWILIO_AUTH_TOKEN!
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      logger.info('WhatsApp message sent', { to, messageLength: message.length });
    } catch (error) {
      logger.error('Failed to send WhatsApp message', { to, error });
      throw error;
    }
  }

  /**
   * Send interactive message with buttons
   */
  async sendInteractiveMessage(to: string, message: InteractiveMessage): Promise<void> {
    try {
      // Twilio doesn't support interactive buttons directly
      // We'll send a text message with numbered options
      let formattedMessage = '';
      
      if (message.header) {
        formattedMessage += `*${message.header}*\n\n`;
      }
      
      formattedMessage += message.body + '\n\n';
      
      message.buttons.forEach((button, index) => {
        formattedMessage += `${index + 1}. ${button.title}\n`;
      });
      
      if (message.footer) {
        formattedMessage += `\n_${message.footer}_`;
      }
      
      formattedMessage += '\n\nReply with the number of your choice.';

      await this.sendTextMessage(to, formattedMessage);
    } catch (error) {
      logger.error('Failed to send interactive message', { to, error });
      throw error;
    }
  }

  /**
   * Send product preview to artisan
   */
  async sendProductPreview(
    phoneNumber: string,
    product: {
      title: string;
      description: string;
      price: number;
      productId: string;
    }
  ): Promise<void> {
    const message: InteractiveMessage = {
      type: 'button',
      header: '✨ Your Product Listing is Ready!',
      body: `*${product.title}*\n\n${product.description.substring(0, 200)}...\n\n💰 Suggested Price: ₹${(product.price / 100).toFixed(2)}`,
      footer: 'Product ID: ' + product.productId,
      buttons: [
        { id: 'approve', title: '✅ Approve' },
        { id: 'edit', title: '✏️ Edit' },
        { id: 'reject', title: '❌ Reject' }
      ]
    };

    await this.sendInteractiveMessage(phoneNumber, message);
  }

  /**
   * Send acknowledgment message
   */
  async sendAcknowledgment(phoneNumber: string, language: string = 'english'): Promise<void> {
    const messages: Record<string, string> = {
      english: '✅ Thank you! I received your message. I\'m processing it now and will send you a product preview shortly (usually within 2 minutes).',
      hindi: '✅ धन्यवाद! मुझे आपका संदेश मिल गया है। मैं इसे अभी प्रोसेस कर रहा हूं और जल्द ही आपको उत्पाद का पूर्वावलोकन भेजूंगा (आमतौर पर 2 मिनट के भीतर)।',
      tamil: '✅ நன்றி! உங்கள் செய்தியைப் பெற்றேன். நான் இப்போது அதைச் செயலாக்குகிறேன், விரைவில் உங்களுக்கு தயாரிப்பு முன்னோட்டத்தை அனுப்புவேன் (பொதுவாக 2 நிமிடங்களுக்குள்)।',
      telugu: '✅ ధన్యవాదాలు! మీ సందేశం నాకు అందింది. నేను దానిని ఇప్పుడు ప్రాసెస్ చేస్తున్నాను మరియు త్వరలో మీకు ఉత్పత్తి ప్రివ్యూను పంపుతాను (సాధారణంగా 2 నిమిషాల్లో)।',
      malayalam: '✅ നന്ദി! നിങ്ങളുടെ സന്ദേശം എനിക്ക് ലഭിച്ചു. ഞാൻ ഇപ്പോൾ അത് പ്രോസസ്സ് ചെയ്യുന്നു, ഉടൻ നിങ്ങൾക്ക് ഉൽപ്പന്ന പ്രിവ്യൂ അയയ്ക്കും (സാധാരണയായി 2 മിനിറ്റിനുള്ളിൽ)।',
      bengali: '✅ ধন্যবাদ! আমি আপনার বার্তা পেয়েছি। আমি এখন এটি প্রসেস করছি এবং শীঘ্রই আপনাকে পণ্যের প্রিভিউ পাঠাব (সাধারণত 2 মিনিটের মধ্যে)।',
      gujarati: '✅ આભાર! મને તમારો સંદેશ મળ્યો છે. હું હવે તેને પ્રોસેસ કરી રહ્યો છું અને ટૂંક સમયમાં તમને ઉત્પાદન પૂર્વાવલોકન મોકલીશ (સામાન્ય રીતે 2 મિનિટમાં)।'
    };

    const message = messages[language.toLowerCase()] || messages.english;
    await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Send error message
   */
  async sendErrorMessage(
    phoneNumber: string,
    errorType: 'transcription' | 'image_quality' | 'general',
    language: string = 'english'
  ): Promise<void> {
    const errorMessages: Record<string, Record<string, string>> = {
      transcription: {
        english: '❌ Sorry, I couldn\'t understand the audio clearly. Please send a clearer voice message in a quiet environment.',
        hindi: '❌ क्षमा करें, मैं ऑडियो को स्पष्ट रूप से समझ नहीं सका। कृपया शांत वातावरण में एक स्पष्ट वॉयस संदेश भेजें।',
        tamil: '❌ மன்னிக்கவும், ஆடியோவை தெளிவாகப் புரிந்து கொள்ள முடியவில்லை. அமைதியான சூழலில் தெளிவான குரல் செய்தியை அனுப்பவும்.',
        telugu: '❌ క్షమించండి, నేను ఆడియోను స్పష్టంగా అర్థం చేసుకోలేకపోయాను. దయచేసి నిశ్శబ్ద వాతావరణంలో స్పష్టమైన వాయిస్ సందేశాన్ని పంపండి।',
        malayalam: '❌ ക്ഷമിക്കണം, എനിക്ക് ഓഡിയോ വ്യക്തമായി മനസ്സിലായില്ല. ശാന്തമായ അന്തരീക്ഷത്തിൽ വ്യക്തമായ വോയ്സ് സന്ദേശം അയയ്ക്കുക.',
        bengali: '❌ দুঃখিত, আমি অডিও স্পষ্টভাবে বুঝতে পারিনি। দয়া করে শান্ত পরিবেশে একটি স্পষ্ট ভয়েস বার্তা পাঠান।',
        gujarati: '❌ માફ કરશો, હું ઓડિયોને સ્પષ્ટપણે સમજી શક્યો નહીં. કૃપા કરીને શાંત વાતાવરણમાં સ્પષ્ટ વૉઇસ સંદેશ મોકલો।'
      },
      image_quality: {
        english: '❌ The image quality is too low. Please send a clearer photo in good lighting.',
        hindi: '❌ छवि की गुणवत्ता बहुत कम है। कृपया अच्छी रोशनी में एक स्पष्ट फोटो भेजें।',
        tamil: '❌ படத்தின் தரம் மிகவும் குறைவாக உள்ளது. நல்ல வெளிச்சத்தில் தெளிவான புகைப்படத்தை அனுப்பவும்.',
        telugu: '❌ చిత్రం నాణ్యత చాలా తక్కువగా ఉంది. దయచేసి మంచి వెలుతురులో స్పష్టమైన ఫోటోను పంపండి।',
        malayalam: '❌ ചിത്രത്തിന്റെ ഗുണനിലവാരം വളരെ കുറവാണ്. നല്ല വെളിച്ചത്തിൽ വ്യക്തമായ ഫോട്ടോ അയയ്ക്കുക.',
        bengali: '❌ ছবির গুণমান খুব কম। দয়া করে ভাল আলোতে একটি স্পষ্ট ছবি পাঠান।',
        gujarati: '❌ છબીની ગુણવત્તા ખૂબ ઓછી છે. કૃપા કરીને સારા પ્રકાશમાં સ્પષ્ટ ફોટો મોકલો।'
      },
      general: {
        english: '❌ Something went wrong while processing your message. Our team has been notified. Please try again or contact support.',
        hindi: '❌ आपके संदेश को प्रोसेस करते समय कुछ गलत हो गया। हमारी टीम को सूचित कर दिया गया है। कृपया पुनः प्रयास करें या सहायता से संपर्क करें।',
        tamil: '❌ உங்கள் செய்தியைச் செயலாக்கும்போது ஏதோ தவறு ஏற்பட்டது. எங்கள் குழுவுக்கு அறிவிக்கப்பட்டுள்ளது. மீண்டும் முயற்சிக்கவும் அல்லது ஆதரவைத் தொடர்பு கொள்ளவும்.',
        telugu: '❌ మీ సందేశాన్ని ప్రాసెస్ చేస్తున్నప్పుడు ఏదో తప్పు జరిగింది. మా బృందానికి తెలియజేయబడింది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా మద్దతును సంప్రదించండి।',
        malayalam: '❌ നിങ്ങളുടെ സന്ദേശം പ്രോസസ്സ് ചെയ്യുമ്പോൾ എന്തോ തെറ്റ് സംഭവിച്ചു. ഞങ്ങളുടെ ടീമിനെ അറിയിച്ചിട്ടുണ്ട്. വീണ്ടും ശ്രമിക്കുക അല്ലെങ്കിൽ പിന്തുണയെ ബന്ധപ്പെടുക.',
        bengali: '❌ আপনার বার্তা প্রসেস করার সময় কিছু ভুল হয়েছে। আমাদের দলকে জানানো হয়েছে। দয়া করে আবার চেষ্টা করুন বা সহায়তার সাথে যোগাযোগ করুন।',
        gujarati: '❌ તમારા સંદેશને પ્રોસેસ કરતી વખતે કંઈક ખોટું થયું. અમારી ટીમને જાણ કરવામાં આવી છે. કૃપા કરીને ફરી પ્રયાસ કરો અથવા સપોર્ટનો સંપર્ક કરો।'
      }
    };

    const messages = errorMessages[errorType];
    const message = messages[language.toLowerCase()] || messages.english;
    await this.sendTextMessage(phoneNumber, message);
  }

  /**
   * Identify artisan by phone number
   */
  async identifyArtisan(phoneNumber: string) {
    try {
      const artisan = await prisma.artisan.findFirst({
        where: {
          OR: [
            { phone: phoneNumber },
            { whatsappNumber: phoneNumber }
          ]
        }
      });

      return artisan;
    } catch (error) {
      // If database is not available, use mock data
      logger.warn('Database not available, using mock artisan data');
      
      // Mock artisan data
      const mockArtisans = [
        {
          id: '1',
          name: 'Test Artisan',
          craftType: 'Pottery',
          region: 'Karnataka',
          bio: 'Traditional pottery maker testing WhatsApp AI system',
          phone: '+918590955502',
          whatsappNumber: '+918590955502',
          email: 'test@artisanai.in',
          language: 'english',
          status: 'verified' as const,
          profileImage: '/placeholder-user.jpg',
          createdAt: new Date('2024-03-06'),
          updatedAt: new Date('2024-03-06')
        }
      ];

      // Find artisan by phone number
      const artisan = mockArtisans.find(a => 
        a.phone === phoneNumber || a.whatsappNumber === phoneNumber
      );

      return artisan || null;
    }
  }
}

export const whatsappService = new WhatsAppService();
