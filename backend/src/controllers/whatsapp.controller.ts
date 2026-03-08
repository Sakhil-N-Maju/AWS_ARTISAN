import { Request, Response, NextFunction } from 'express';
import { whatsappService } from '../services/whatsapp.service';
import { WhatsAppTranslations } from '../services/whatsapp-translations';
import { s3Service } from '../services/s3.service';
import { aiPipelineService } from '../services/ai-pipeline.service';
import { conversationStateService } from '../services/conversation-state.service';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export class WhatsAppController {
  /**
   * Webhook verification (GET)
   * Twilio sends this to verify the webhook URL
   */
  async verifyWebhook(req: Request, res: Response) {
    try {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
        logger.info('Webhook verified successfully');
        res.status(200).send(challenge);
      } else {
        logger.warn('Webhook verification failed', { mode, token });
        res.status(403).send('Forbidden');
      }
    } catch (error) {
      logger.error('Webhook verification error', { error });
      res.status(500).send('Internal Server Error');
    }
  }

  /**
   * Receive incoming WhatsApp messages (POST)
   */
  async receiveMessage(req: Request, res: Response, next: NextFunction) {
    try {
      // Verify signature (disabled for development)
      const signature = req.headers['x-twilio-signature'] as string;
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      
      // TEMPORARY: Skip signature verification for development
      // TODO: Re-enable in production
      const skipSignatureVerification = process.env.NODE_ENV === 'development';
      
      if (!skipSignatureVerification && !whatsappService.verifyWebhookSignature(signature, url, req.body)) {
        logger.warn('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      if (skipSignatureVerification) {
        logger.info('Signature verification skipped (development mode)');
      }

      // Quick acknowledgment
      res.status(200).json({ success: true, message: 'Message received' });

      // Parse message
      const incomingMessage = whatsappService.parseIncomingMessage(req.body);
      logger.info('WhatsApp message received', {
        from: incomingMessage.from,
        type: incomingMessage.type,
        messageId: incomingMessage.messageId
      });

      // Identify artisan
      const artisan = await whatsappService.identifyArtisan(incomingMessage.from);
      
      if (!artisan) {
        logger.warn('Unknown artisan', { phone: incomingMessage.from });
        await whatsappService.sendTextMessage(
          incomingMessage.from,
          '❌ Sorry, your phone number is not registered. Please contact support to register as an artisan.'
        );
        return;
      }

      if (artisan.status !== 'verified' && artisan.status !== 'active') {
        logger.warn('Artisan not verified', { artisanId: artisan.id, status: artisan.status });
        await whatsappService.sendTextMessage(
          incomingMessage.from,
          '❌ Your account is pending verification. We will notify you once your account is approved.'
        );
        return;
      }

      // Handle button responses (approval workflow)
      if (incomingMessage.type === 'text' && incomingMessage.content) {
        const handled = await this.handleButtonResponse(artisan, incomingMessage.content);
        if (handled) return;
      }

      // Process media message
      if (incomingMessage.type === 'voice' || incomingMessage.type === 'image') {
        await this.processMediaMessage(artisan, incomingMessage);
      } else if (incomingMessage.type === 'text') {
        // Handle text-only messages
        await whatsappService.sendTextMessage(
          incomingMessage.from,
          '📸 Please send a photo of your product along with a voice message describing it, or just send a photo and I\'ll help you create a listing!'
        );
      }

    } catch (error) {
      logger.error('Error processing WhatsApp message', { error });
      // Don't throw - we already sent 200 response
    }
  }

  /**
   * Process media message (voice/image)
   */
  private async processMediaMessage(artisan: any, message: any) {
    try {
      // Send acknowledgment
      await whatsappService.sendAcknowledgment(artisan.phone, artisan.language);

      // Download media
      let mediaS3Url: string | undefined;
      if (message.mediaUrl) {
        const mediaBuffer = await whatsappService.downloadMedia(message.mediaUrl);
        
        // Determine file extension
        const extension = this.getFileExtension(message.mimeType);
        const prefix = message.type === 'voice' ? 'voice' : 'images';
        const key = s3Service.generateFileKey(`${prefix}/${artisan.id}`, extension);
        
        // Upload to S3
        mediaS3Url = await s3Service.uploadFile(mediaBuffer, key, message.mimeType);
        logger.info('Media uploaded to S3', { key, url: mediaS3Url });
      }

      // Store message in database
      let dbMessage;
      try {
        dbMessage = await prisma.whatsAppMessage.create({
          data: {
            artisanId: artisan.id,
            messageId: message.messageId,
            from: message.from,
            timestamp: message.timestamp,
            type: message.type,
            content: message.content,
            mediaUrl: mediaS3Url,
            mimeType: message.mimeType,
            status: 'received'
          }
        });
      } catch (dbError) {
        logger.warn('Database save failed, continuing with mock data', { error: dbError });
        // Create mock message object for AI processing
        dbMessage = {
          id: message.messageId,
          artisanId: artisan.id,
          messageId: message.messageId,
          from: message.from,
          timestamp: message.timestamp,
          type: message.type,
          content: message.content,
          mediaUrl: mediaS3Url,
          mimeType: message.mimeType,
          status: 'received'
        };
      }

      // Queue for AI processing (async)
      // For now, send mock product preview directly to save Twilio credits
      setTimeout(async () => {
        try {
          const productId = `PROD-${Date.now()}`;
          const product = {
            productId,
            title: 'Handmade Terracotta Pot',
            description: `Beautiful handcrafted terracotta pot made with traditional techniques by ${artisan.name}. Perfect for home decor and plants. Made in ${artisan.region} with 20 years of experience.`,
            price: 100000, // ₹1000
            imageUrl: mediaS3Url
          };
          
          // Store in conversation state
          conversationStateService.setPendingProduct(artisan.phone, product);
          
          await whatsappService.sendProductPreview(artisan.phone, product, artisan.language);
          logger.info('Product preview sent successfully');
        } catch (error) {
          logger.error('Failed to send product preview', { error });
        }
      }, 2000); // Send after 2 seconds

    } catch (error) {
      logger.error('Error processing media message', { error });
      await whatsappService.sendErrorMessage(artisan.phone, 'general', artisan.language);
    }
  }

  /**
   * Queue AI processing (runs in background)
   */
  private async queueAIProcessing(messageId: string, artisan: any) {
    try {
      // Process through AI pipeline
      const productId = await aiPipelineService.processMessage(messageId);
      
      // Get product details
      let product;
      try {
        product = await prisma.product.findUnique({
          where: { id: productId }
        });
      } catch (dbError) {
        logger.warn('Database fetch failed, using mock product data', { error: dbError });
        // Create mock product for preview
        product = {
          id: productId,
          title: 'Handmade Terracotta Pot',
          description: 'Beautiful handcrafted terracotta pot made with traditional techniques. Perfect for home decor and plants.',
          price: 100000, // ₹1000 in paise
          productId: productId
        };
      }

      if (product) {
        // Send preview to artisan
        await whatsappService.sendProductPreview(artisan.phone, {
          title: product.title,
          description: product.description,
          price: product.price,
          productId: product.productId
        });
      }

    } catch (error) {
      logger.error('AI processing failed', { messageId, error });
      
      // Determine error type
      const errorMessage = error instanceof Error ? error.message : '';
      let errorType: 'transcription' | 'image_quality' | 'general' = 'general';
      
      if (errorMessage.includes('transcription') || errorMessage.includes('audio')) {
        errorType = 'transcription';
      } else if (errorMessage.includes('image') || errorMessage.includes('quality')) {
        errorType = 'image_quality';
      }

      await whatsappService.sendErrorMessage(artisan.phone, errorType, artisan.language);
    }
  }

  /**
   * Handle button responses and natural language edits
   */
  private async handleButtonResponse(artisan: any, content: string): Promise<boolean> {
    const normalizedContent = content.trim().toLowerCase();
    const state = conversationStateService.getState(artisan.phone);

    // Only handle if there's a pending product
    if (state?.state !== 'awaiting_approval') {
      return false;
    }

    const product = conversationStateService.getPendingProduct(artisan.phone);
    if (!product) {
      return false;
    }

    // Handle approval
    if (normalizedContent === '1' || normalizedContent === 'yes' || normalizedContent === 'approve' || 
        normalizedContent.includes('approve') || normalizedContent.includes('publish') ||
        normalizedContent === 'हां' || normalizedContent === 'ஆம்' || normalizedContent === 'అవును' ||
        normalizedContent === 'അതെ' || normalizedContent === 'হ্যাঁ' || normalizedContent === 'હા') {
      conversationStateService.clearState(artisan.phone);
      
      const message = WhatsAppTranslations.getApprovalMessage(product.title, product.productId, artisan.language);
      await whatsappService.sendTextMessage(artisan.phone, message);
      return true;
    }

    // Handle rejection
    if (normalizedContent === '3' || normalizedContent === 'no' || normalizedContent === 'reject' || 
        normalizedContent.includes('reject') || normalizedContent.includes('cancel') ||
        normalizedContent === 'नहीं' || normalizedContent === 'இல்லை' || normalizedContent === 'కాదు' ||
        normalizedContent === 'ഇല്ല' || normalizedContent === 'না' || normalizedContent === 'ના') {
      conversationStateService.clearState(artisan.phone);
      
      const message = WhatsAppTranslations.getRejectionMessage(artisan.language);
      await whatsappService.sendTextMessage(artisan.phone, message);
      return true;
    }

    // Handle natural language edits
    // Pattern: "change/update [field] to [value]"
    const changePriceMatch = content.match(/(?:change|update|set|बदलें|மாற்று|మార్చండి|മാറ്റുക|পরিবর্তন|બદલો)?\s*(?:price|मूल्य|விலை|ధర|വില|মূল্য|કિંમત)\s*(?:to|में|ஆக|కి|ആയി|এ|માં)?\s*(\d+)/i);
    if (changePriceMatch) {
      const newPrice = parseInt(changePriceMatch[1]) * 100; // Convert to paise
      conversationStateService.updatePendingProduct(artisan.phone, 'price', newPrice);
      const updatedProduct = conversationStateService.getPendingProduct(artisan.phone);
      
      const message = WhatsAppTranslations.getUpdateMessage('price', changePriceMatch[1], artisan.language);
      await whatsappService.sendTextMessage(artisan.phone, message);
      
      if (updatedProduct) {
        await whatsappService.sendProductPreview(artisan.phone, updatedProduct, artisan.language);
      }
      return true;
    }

    const changeTitleMatch = content.match(/(?:change|update|set|बदलें|மாற்று|మార్చండి|മാറ്റുക|পরিবর্তন|બદલો)?\s*(?:title|शीर्षक|தலைப்பு|శీర్షిక|ശീർഷകം|শিরোনাম|શીર્ષક)\s*(?:to|में|ஆக|కి|ആയി|এ|માં)?\s*[:\-]?\s*(.+)/i);
    if (changeTitleMatch) {
      const newTitle = changeTitleMatch[1].trim();
      conversationStateService.updatePendingProduct(artisan.phone, 'title', newTitle);
      const updatedProduct = conversationStateService.getPendingProduct(artisan.phone);
      
      const message = WhatsAppTranslations.getUpdateMessage('title', newTitle, artisan.language);
      await whatsappService.sendTextMessage(artisan.phone, message);
      
      if (updatedProduct) {
        await whatsappService.sendProductPreview(artisan.phone, updatedProduct, artisan.language);
      }
      return true;
    }

    const changeDescMatch = content.match(/(?:change|update|set|बदलें|மாற்று|మార్చండి|മാറ്റുക|পরিবর্তন|બદલો)?\s*(?:description|desc|विवरण|விளக்கம்|వివరణ|വിവരണം|বিবরণ|વર્ણન)\s*(?:to|में|ஆக|కి|ആയി|এ|માં)?\s*[:\-]?\s*(.+)/i);
    if (changeDescMatch) {
      const newDesc = changeDescMatch[1].trim();
      conversationStateService.updatePendingProduct(artisan.phone, 'description', newDesc);
      const updatedProduct = conversationStateService.getPendingProduct(artisan.phone);
      
      const message = WhatsAppTranslations.getUpdateMessage('description', newDesc, artisan.language);
      await whatsappService.sendTextMessage(artisan.phone, message);
      
      if (updatedProduct) {
        await whatsappService.sendProductPreview(artisan.phone, updatedProduct, artisan.language);
      }
      return true;
    }

    // If user sent "2" or "edit" without specifying what to edit, give them guidance
    if (normalizedContent === '2' || normalizedContent === 'edit' || normalizedContent.includes('change') ||
        normalizedContent.includes('बदल') || normalizedContent.includes('மாற்') || normalizedContent.includes('మార్చ') ||
        normalizedContent.includes('മാറ്റ') || normalizedContent.includes('পরিবর্তন') || normalizedContent.includes('બદલ')) {
      const message = WhatsAppTranslations.getEditGuidanceMessage(artisan.language);
      await whatsappService.sendTextMessage(artisan.phone, message);
      return true;
    }

    return false;
  }

  /**
   * Handle product approval
   */
  private async handleApproval(artisanId: string) {
    try {
      // Find latest pending product
      const product = await prisma.product.findFirst({
        where: {
          artisanId,
          status: 'pending_review'
        },
        orderBy: { createdAt: 'desc' }
      });

      if (!product) {
        logger.warn('No pending product found for approval', { artisanId });
        return;
      }

      // Update product status
      await prisma.product.update({
        where: { id: product.id },
        data: {
          status: 'published',
          publishedAt: new Date()
        }
      });

      // Get artisan details
      const artisan = await prisma.artisan.findUnique({
        where: { id: artisanId }
      });

      if (artisan) {
        await whatsappService.sendTextMessage(
          artisan.phone,
          `✅ Great! Your product "${product.title}" has been published and is now live on the marketplace!\n\n🔗 View it here: ${process.env.FRONTEND_URL}/products/${product.productId}`
        );
      }

      logger.info('Product approved and published', { productId: product.id });

    } catch (error) {
      logger.error('Error handling approval', { artisanId, error });
    }
  }

  /**
   * Handle product edit request
   */
  private async handleEdit(artisanId: string) {
    try {
      const artisan = await prisma.artisan.findUnique({
        where: { id: artisanId }
      });

      if (artisan) {
        await whatsappService.sendTextMessage(
          artisan.phone,
          '✏️ Please send me the changes you\'d like to make. For example:\n\n"Change price to 2500"\n"Update description: This is a handcrafted..."\n"Change title to: Beautiful Pottery Bowl"'
        );
      }

    } catch (error) {
      logger.error('Error handling edit request', { artisanId, error });
    }
  }

  /**
   * Handle product rejection
   */
  private async handleReject(artisanId: string) {
    try {
      // Find latest pending product
      const product = await prisma.product.findFirst({
        where: {
          artisanId,
          status: 'pending_review'
        },
        orderBy: { createdAt: 'desc' }
      });

      if (product) {
        // Update product status
        await prisma.product.update({
          where: { id: product.id },
          data: { status: 'rejected' }
        });
      }

      // Get artisan details
      const artisan = await prisma.artisan.findUnique({
        where: { id: artisanId }
      });

      if (artisan) {
        await whatsappService.sendTextMessage(
          artisan.phone,
          '❌ No problem! The listing has been discarded. Feel free to send a new product whenever you\'re ready!'
        );
      }

      logger.info('Product rejected', { productId: product?.id });

    } catch (error) {
      logger.error('Error handling rejection', { artisanId, error });
    }
  }

  /**
   * Get file extension from MIME type
   */
  private getFileExtension(mimeType: string): string {
    const mimeMap: Record<string, string> = {
      'audio/ogg': 'ogg',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'video/mp4': 'mp4'
    };

    return mimeMap[mimeType] || 'bin';
  }
}

export const whatsappController = new WhatsAppController();
