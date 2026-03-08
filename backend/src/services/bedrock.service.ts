import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { bedrockClient, AWS_CONFIG } from '../config/aws';
import { logger } from '../utils/logger';
import { ImageAnalysis } from './rekognition.service';

export interface ProductListing {
  title: string;
  description: string;
  artisanStory: string;
  culturalContext: string;
  material: string[];
  suggestedPrice: {
    min: number;
    max: number;
    currency: string;
    reasoning: string;
  };
  tags: string[];
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

export interface ArtisanContext {
  name: string;
  craftType: string;
  region: string;
  language: string;
}

export class BedrockService {
  /**
   * Generate product listing using AWS Bedrock
   */
  async generateListing(
    transcription: string,
    imageAnalysis: ImageAnalysis,
    artisan: ArtisanContext
  ): Promise<ProductListing> {
    try {
      const prompt = this.buildPrompt(transcription, imageAnalysis, artisan);
      
      const command = new InvokeModelCommand({
        modelId: AWS_CONFIG.BEDROCK_MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 2000,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      // Extract JSON from response
      const content = responseBody.content[0].text;
      const listing = this.parseListingResponse(content);
      
      logger.info('Product listing generated', { 
        artisan: artisan.name,
        title: listing.title 
      });
      
      return listing;
    } catch (error) {
      logger.error('Bedrock listing generation failed', { error });
      throw error;
    }
  }

  /**
   * Build prompt for product listing generation
   */
  private buildPrompt(
    transcription: string,
    imageAnalysis: ImageAnalysis,
    artisan: ArtisanContext
  ): string {
    return `You are an expert in Indian handicrafts and e-commerce product listings.

ARTISAN CONTEXT:
- Name: ${artisan.name}
- Craft Type: ${artisan.craftType}
- Region: ${artisan.region}
- Language: ${artisan.language}

ARTISAN'S VOICE DESCRIPTION:
"${transcription}"

IMAGE ANALYSIS:
- Detected Objects: ${imageAnalysis.labels.join(', ')}
- Dominant Colors: ${imageAnalysis.colors.join(', ')}
- Quality Score: ${imageAnalysis.quality}/10

TASK:
Generate a compelling product listing in JSON format with the following fields:

{
  "title": "Engaging product title (50-80 chars, English)",
  "description": "Detailed product description (150-300 words, English) covering materials, process, dimensions, and unique features",
  "artisanStory": "Brief artisan story (100-150 words) highlighting their craft tradition and expertise",
  "culturalContext": "Cultural significance and heritage (50-100 words)",
  "material": ["primary material", "secondary material"],
  "suggestedPrice": {
    "min": 0,
    "max": 0,
    "currency": "INR",
    "reasoning": "Brief explanation"
  },
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "dimensions": {
    "length": 0,
    "width": 0,
    "height": 0,
    "unit": "cm"
  }
}

GUIDELINES:
- Use authentic, respectful language
- Highlight craftsmanship and cultural heritage
- Be specific about materials and techniques
- Price should reflect artisan's input and market research
- Tags should include: material, style, occasion, region
- Keep tone warm and storytelling-focused
- Return ONLY valid JSON, no additional text

Generate the product listing now:`;
  }

  /**
   * Parse listing response from Bedrock
   */
  private parseListingResponse(content: string): ProductListing {
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                       content.match(/```\n([\s\S]*?)\n```/) ||
                       [null, content];
      
      const jsonStr = jsonMatch[1] || content;
      return JSON.parse(jsonStr.trim());
    } catch (error) {
      logger.error('Failed to parse Bedrock response', { content, error });
      throw new Error('Invalid JSON response from Bedrock');
    }
  }
}

export const bedrockService = new BedrockService();
