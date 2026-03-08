import OpenAI from 'openai';
import axios from 'axios';

interface ProductExtraction {
  title: string;
  description: string;
  category: string;
  craftType: string;
  suggestedPrice: number;
  material?: string;
  color?: string;
  tags: string[];
  confidence: number;
}

interface VoiceTranscription {
  text: string;
  language: string;
}

class AIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
    }
    this.openai = new OpenAI({ apiKey: apiKey || '' });
  }

  /**
   * Download media from WhatsApp Cloud API
   */
  async downloadWhatsAppMedia(mediaId: string): Promise<Buffer> {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;

    try {
      // Step 1: Get media URL from WhatsApp
      const mediaResponse = await axios.get(`https://graph.facebook.com/v18.0/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const mediaUrl = mediaResponse.data.url;

      // Step 2: Download the actual media file
      const fileResponse = await axios.get(mediaUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      });

      return Buffer.from(fileResponse.data);
    } catch (error: any) {
      console.error('Error downloading WhatsApp media:', error);
      throw new Error(`Failed to download media: ${error.message}`);
    }
  }

  /**
   * Transcribe voice message using Whisper API
   */
  async transcribeVoice(
    audioBuffer: Buffer,
    mimeType: string = 'audio/ogg'
  ): Promise<VoiceTranscription> {
    try {
      // Convert Node Buffer to ArrayBuffer for Web API compatibility
      const arrayBuffer = audioBuffer.buffer.slice(
        audioBuffer.byteOffset,
        audioBuffer.byteOffset + audioBuffer.byteLength
      ) as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: mimeType });
      const file = new File([blob], 'voice.ogg', { type: mimeType });

      const transcription = await this.openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: 'hi', // Hindi, but Whisper auto-detects
        response_format: 'verbose_json',
      });

      return {
        text: transcription.text,
        language: (transcription as any).language || 'unknown',
      };
    } catch (error: any) {
      console.error('Error transcribing voice:', error);
      throw new Error(`Voice transcription failed: ${error.message}`);
    }
  }

  /**
   * Analyze product image using GPT-4 Vision
   */
  async analyzeProductImage(imageBuffer: Buffer, mimeType: string = 'image/jpeg'): Promise<any> {
    try {
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // GPT-4 Vision
        messages: [
          {
            role: 'system',
            content: `You are an expert in Indian handicrafts and artisan products. Analyze product images and extract detailed information about traditional crafts, materials, techniques, and cultural significance.`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this artisan product image and provide:
1. Product type/category
2. Craft type (e.g., pottery, weaving, embroidery, etc.)
3. Primary materials used
4. Dominant colors
5. Craftsmanship details
6. Estimated complexity
7. Cultural/regional style if identifiable

Respond in JSON format.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content || '{}';

      // Try to parse JSON from response
      try {
        return JSON.parse(content);
      } catch {
        // If not JSON, return as text
        return { analysis: content };
      }
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  /**
   * Extract product details from voice + image analysis
   */
  async extractProductDetails(voiceText: string, imageAnalysis: any): Promise<ProductExtraction> {
    try {
      const prompt = `You are helping an Indian artisan create a product listing. Based on their voice description and image analysis, extract structured product information.

VOICE DESCRIPTION:
${voiceText}

IMAGE ANALYSIS:
${JSON.stringify(imageAnalysis, null, 2)}

Extract and return a JSON object with:
{
  "title": "Catchy product title (max 80 chars)",
  "description": "Detailed, compelling product description highlighting craftsmanship, materials, cultural significance (200-400 words)",
  "category": "One of: Textiles, Pottery, Jewelry, Home Decor, Art, Sculptures, Metalwork, Woodwork, Leather Goods, Other",
  "craftType": "Specific craft type (e.g., Hand-woven, Terracotta, Brass work, etc.)",
  "suggestedPrice": estimated price in INR based on complexity and materials,
  "material": "Primary material",
  "color": "Dominant color",
  "tags": ["relevant", "search", "tags"],
  "confidence": confidence score 0-1
}

Consider:
- Traditional craftsmanship value
- Material quality and rarity
- Time/skill required
- Cultural significance
- Market positioning

Return ONLY valid JSON, no additional text.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert in Indian handicrafts and e-commerce product listing optimization.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content || '{}';
      const extracted = JSON.parse(content);

      return {
        title: extracted.title || 'Handcrafted Artisan Product',
        description: extracted.description || voiceText,
        category: extracted.category || 'Other',
        craftType: extracted.craftType || 'Handcrafted',
        suggestedPrice: extracted.suggestedPrice || 1000,
        material: extracted.material,
        color: extracted.color,
        tags: extracted.tags || [],
        confidence: extracted.confidence || 0.5,
      };
    } catch (error: any) {
      console.error('Error extracting product details:', error);
      throw new Error(`Product extraction failed: ${error.message}`);
    }
  }

  /**
   * Generate AI product story
   */
  async generateProductStory(
    productDetails: ProductExtraction,
    artisanInfo: { name: string; location: string; experience?: number }
  ): Promise<string> {
    try {
      const prompt = `Create a compelling product story for this handcrafted item:

PRODUCT: ${productDetails.title}
CRAFT TYPE: ${productDetails.craftType}
MATERIAL: ${productDetails.material || 'traditional materials'}
ARTISAN: ${artisanInfo.name} from ${artisanInfo.location}
${artisanInfo.experience ? `EXPERIENCE: ${artisanInfo.experience} years` : ''}

Write a 2-3 paragraph story that:
1. Highlights the artisan's craftsmanship and tradition
2. Describes the making process and cultural significance
3. Creates emotional connection with buyers
4. Emphasizes uniqueness and authenticity

Tone: Warm, authentic, culturally respectful
Length: 150-250 words`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a storyteller specializing in artisan crafts and cultural heritage.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
      });

      return response.choices[0].message.content || '';
    } catch (error: any) {
      console.error('Error generating story:', error);
      return ''; // Return empty string on error, story is optional
    }
  }

  /**
   * Complete pipeline: Process WhatsApp media and create product
   */
  async processArtisanMedia(
    imageMediaId: string,
    voiceMediaId: string,
    artisanInfo: { id: string; name: string; location: string; experience?: number }
  ): Promise<ProductExtraction & { story: string }> {
    try {
      console.log('📥 Downloading media from WhatsApp...');

      // Download media
      const [imageBuffer, voiceBuffer] = await Promise.all([
        this.downloadWhatsAppMedia(imageMediaId),
        this.downloadWhatsAppMedia(voiceMediaId),
      ]);

      console.log('🎤 Transcribing voice...');
      // Transcribe voice
      const transcription = await this.transcribeVoice(voiceBuffer, 'audio/ogg');

      console.log('🖼️  Analyzing image...');
      // Analyze image
      const imageAnalysis = await this.analyzeProductImage(imageBuffer, 'image/jpeg');

      console.log('🤖 Extracting product details...');
      // Extract product details
      const productDetails = await this.extractProductDetails(transcription.text, imageAnalysis);

      console.log('📖 Generating product story...');
      // Generate story
      const story = await this.generateProductStory(productDetails, artisanInfo);

      console.log('✅ Product processing complete!');

      return {
        ...productDetails,
        story,
      };
    } catch (error: any) {
      console.error('Error in AI pipeline:', error);
      throw error;
    }
  }

  /**
   * Generate product title from image only (quick processing)
   */
  async quickImageAnalysis(imageBuffer: Buffer): Promise<string> {
    try {
      const base64Image = imageBuffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'What is this product? Describe in one short sentence (max 15 words).',
              },
              {
                type: 'image_url',
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
        max_tokens: 50,
      });

      return response.choices[0].message.content || 'Handcrafted Product';
    } catch (error: any) {
      console.error('Error in quick analysis:', error);
      return 'Artisan Product';
    }
  }
}

export const aiService = new AIService();
export default aiService;
