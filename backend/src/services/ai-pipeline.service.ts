import prisma from '../config/database';
import { logger } from '../utils/logger';
import { transcribeService } from './transcribe.service';
import { rekognitionService } from './rekognition.service';
import { bedrockService } from './bedrock.service';
import { mockBedrockService } from './bedrock-mock.service';
import { s3Service } from './s3.service';
import QRCode from 'qrcode';

// Use mock service if AWS Bedrock is not available
const USE_MOCK_BEDROCK = process.env.USE_MOCK_BEDROCK === 'true' || true; // Default to true until Bedrock access is restored
const aiService = USE_MOCK_BEDROCK ? mockBedrockService : bedrockService;

export class AIPipelineService {
  /**
   * Process WhatsApp message and generate product listing
   */
  async processMessage(messageId: string): Promise<string> {
    const startTime = Date.now();
    
    try {
      // Get message
      const message = await prisma.whatsAppMessage.findUnique({
        where: { id: messageId },
        include: { artisan: true }
      });

      if (!message) {
        throw new Error('Message not found');
      }

      // Update status to processing
      await prisma.whatsAppMessage.update({
        where: { id: messageId },
        data: {
          status: 'processing',
          processingStartedAt: new Date()
        }
      });

      logger.info('Starting AI pipeline', { messageId });

      // Step 1: Transcribe audio
      let transcription = '';
      if (message.type === 'voice' && message.mediaUrl) {
        const jobName = await transcribeService.startTranscription(
          message.mediaUrl,
          message.artisan.language
        );
        transcription = await transcribeService.waitForTranscription(jobName);
        logger.info('Transcription completed', { messageId, transcription });
      }

      // Step 2: Analyze image
      let imageAnalysis;
      if (message.mediaUrl && (message.type === 'image' || message.type === 'voice')) {
        const imageKey = this.extractS3Key(message.mediaUrl);
        imageAnalysis = await rekognitionService.analyzeImage(imageKey);
        logger.info('Image analysis completed', { messageId, imageAnalysis });
      }

      // Step 3: Generate product listing
      const listing = await aiService.generateListing(
        transcription,
        imageAnalysis!,
        {
          name: message.artisan.name,
          craftType: message.artisan.craftType,
          region: message.artisan.region,
          language: message.artisan.language
        }
      );

      logger.info('Product listing generated', { messageId, title: listing.title });

      // Step 4: Generate product ID and QR code
      const productId = await this.generateProductId(
        message.artisan.region,
        message.artisan.craftType
      );

      const qrCodeUrl = await this.generateQRCode(productId);

      // Step 5: Create product in database
      const product = await prisma.product.create({
        data: {
          artisanId: message.artisan.id,
          productId,
          title: listing.title,
          description: listing.description,
          artisanStory: listing.artisanStory,
          culturalContext: listing.culturalContext,
          material: listing.material, // Already an array
          colors: imageAnalysis?.colors || [],
          tags: listing.tags,
          price: Math.round((listing.suggestedPrice.min + listing.suggestedPrice.max) / 2 * 100), // Convert to paise
          suggestedPrice: Math.round(listing.suggestedPrice.max * 100),
          images: message.mediaUrl ? [{
            url: message.mediaUrl,
            thumbnailUrl: message.mediaUrl,
            alt: listing.title,
            order: 0,
            isPrimary: true
          }] : [],
          originalVoiceUrl: message.type === 'voice' ? message.mediaUrl : undefined,
          transcription,
          transcriptionLanguage: message.artisan.language,
          aiGeneratedFields: ['title', 'description', 'artisanStory', 'culturalContext', 'tags'],
          status: 'pending_review',
          qrCodeUrl,
          dimensions: listing.dimensions
        }
      });

      // Update message status
      await prisma.whatsAppMessage.update({
        where: { id: messageId },
        data: {
          status: 'completed',
          processingCompletedAt: new Date(),
          productId: product.id
        }
      });

      const processingTime = Date.now() - startTime;
      logger.info('AI pipeline completed', {
        messageId,
        productId: product.id,
        processingTime: `${processingTime}ms`
      });

      // TODO: Send WhatsApp preview to artisan

      return product.id;
    } catch (error) {
      logger.error('AI pipeline failed', { messageId, error });

      // Update message status
      await prisma.whatsAppMessage.update({
        where: { id: messageId },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          processingCompletedAt: new Date()
        }
      });

      throw error;
    }
  }

  /**
   * Generate unique product ID
   */
  private async generateProductId(region: string, craftType: string): Promise<string> {
    const regionCode = region.substring(0, 3).toUpperCase();
    const craftCode = craftType.substring(0, 3).toUpperCase();
    
    // Get count of products for this region/craft
    const count = await prisma.product.count({
      where: {
        productId: {
          startsWith: `ART-${regionCode}-${craftCode}`
        }
      }
    });

    const number = String(count + 1).padStart(3, '0');
    return `ART-${regionCode}-${craftCode}-${number}`;
  }

  /**
   * Generate QR code for product
   */
  private async generateQRCode(productId: string): Promise<string> {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${productId}`;
    
    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      width: 400,
      margin: 2
    });

    // Upload to S3
    const key = s3Service.generateFileKey(`qr-codes/${productId}`, 'png');
    const url = await s3Service.uploadFile(qrBuffer, key, 'image/png');

    return url;
  }

  /**
   * Extract S3 key from URL
   */
  private extractS3Key(url: string): string {
    // Extract key from S3 or CloudFront URL
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1); // Remove leading slash
  }
}

export const aiPipelineService = new AIPipelineService();
