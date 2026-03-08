import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/services/whatsapp';
import { aiService } from '@/lib/services/ai';
import prisma from '@/lib/prisma';

// Store for tracking artisan media uploads
const artisanUploads = new Map<
  string,
  {
    imageMediaId?: string;
    voiceMediaId?: string;
    timestamp: number;
  }
>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (!mode || !token) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const result = whatsappService.verifyWebhook(mode, token, challenge || '');

    if (result) {
      return new NextResponse(result, { status: 200 });
    }

    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
  } catch (error: any) {
    console.error('WhatsApp webhook verification error:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle incoming webhook
    const result = await whatsappService.handleWebhook(body);

    // Process AI pipeline for artisan media
    processArtisanMedia(body).catch((err) => {
      console.error('Error in AI pipeline:', err);
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: result.error || 'Webhook processing failed' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Process artisan media uploads (image + voice) and create products
 */
async function processArtisanMedia(webhookData: any) {
  try {
    const entry = webhookData.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) return;

    const message = messages[0];
    const from = message.from; // Artisan's phone number
    const type = message.type;

    // Find artisan by phone number
    const user = await prisma.user.findUnique({
      where: { phone: from },
      include: { artisanProfile: true },
    });

    if (!user?.artisanProfile) {
      // Not an artisan or not registered
      return;
    }

    const artisan = user.artisanProfile;

    // Get or create upload tracking
    let upload = artisanUploads.get(from) || { timestamp: Date.now() };

    // Handle different message types
    if (type === 'image') {
      const imageMediaId = message.image?.id;
      if (imageMediaId) {
        upload.imageMediaId = imageMediaId;
        upload.timestamp = Date.now();
        artisanUploads.set(from, upload);

        // Send acknowledgment
        await whatsappService.sendTextMessage(
          from,
          "📸 Image received! Now send a voice message describing your product (language doesn't matter - Hindi, English, or any regional language).",
          user.id
        );

        // Quick image preview
        const imageBuffer = await aiService.downloadWhatsAppMedia(imageMediaId);
        const quickDesc = await aiService.quickImageAnalysis(imageBuffer);
        await whatsappService.sendTextMessage(
          from,
          `I can see: "${quickDesc}". Please describe it in your own words via voice message.`,
          user.id
        );
      }
    } else if (type === 'audio' || type === 'voice') {
      const voiceMediaId = message.audio?.id || message.voice?.id;
      if (voiceMediaId) {
        upload.voiceMediaId = voiceMediaId;
        upload.timestamp = Date.now();
        artisanUploads.set(from, upload);

        // Check if we have both image and voice
        if (upload.imageMediaId && upload.voiceMediaId) {
          await whatsappService.sendTextMessage(
            from,
            '🤖 Perfect! Processing your product with AI... This will take about 30 seconds.',
            user.id
          );

          try {
            // Process with AI
            const productData = await aiService.processArtisanMedia(
              upload.imageMediaId,
              upload.voiceMediaId,
              {
                id: artisan.id,
                name: artisan.businessName,
                location: `${artisan.district}, ${artisan.state}`,
                experience: artisan.experience || undefined,
              }
            );

            // Create product in database
            const slug = `${productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

            const product = await prisma.product.create({
              data: {
                artisanId: artisan.id,
                title: productData.title,
                description: productData.description,
                aiStory: productData.story,
                price: productData.suggestedPrice,
                category: productData.category,
                craftType: productData.craftType,
                material: productData.material,
                color: productData.color,
                tags: productData.tags,
                slug,
                status: 'PENDING_REVIEW',
                stock: 1,
              },
            });

            // Send success message
            await whatsappService.sendTextMessage(
              from,
              `✅ Product created successfully!\n\n📦 ${productData.title}\n💰 Suggested Price: ₹${productData.suggestedPrice}\n📁 Category: ${productData.category}\n\n✏️ You can edit and publish it from your dashboard.\n\nConfidence Score: ${Math.round(productData.confidence * 100)}%`,
              user.id
            );

            // Clear upload tracking
            artisanUploads.delete(from);
          } catch (error: any) {
            console.error('Error creating product:', error);
            await whatsappService.sendTextMessage(
              from,
              `❌ Sorry, there was an error processing your product. Please try again or contact support.\n\nError: ${error.message}`,
              user.id
            );
          }
        } else {
          // Need image first
          await whatsappService.sendTextMessage(
            from,
            '🎤 Voice received! But I need a product image first. Please send an image of your product.',
            user.id
          );
        }
      }
    } else if (type === 'text') {
      const text = message.text?.body?.toLowerCase() || '';

      // Handle commands
      if (text.includes('help') || text.includes('start')) {
        await whatsappService.sendTextMessage(
          from,
          `👋 Welcome ${artisan.businessName}!\n\n📸 To create a product listing:\n1. Send a clear photo of your product\n2. Send a voice message describing it\n\nI'll use AI to create a professional listing for you!\n\nCommands:\n• "help" - Show this message\n• "status" - Check pending uploads\n• "cancel" - Cancel current upload`,
          user.id
        );
      } else if (text.includes('status')) {
        const current = artisanUploads.get(from);
        if (current?.imageMediaId || current?.voiceMediaId) {
          await whatsappService.sendTextMessage(
            from,
            `📊 Upload Status:\n${current.imageMediaId ? '✅ Image uploaded' : '❌ Image pending'}\n${current.voiceMediaId ? '✅ Voice uploaded' : '❌ Voice pending'}\n\n${!current.imageMediaId ? 'Send product image' : !current.voiceMediaId ? 'Send voice description' : 'Processing...'}`,
            user.id
          );
        } else {
          await whatsappService.sendTextMessage(
            from,
            '📭 No uploads in progress. Send an image to start!',
            user.id
          );
        }
      } else if (text.includes('cancel')) {
        artisanUploads.delete(from);
        await whatsappService.sendTextMessage(
          from,
          '🗑️ Upload cancelled. Send a new image to start over.',
          user.id
        );
      }
    }

    // Clean up old uploads (older than 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    for (const [phone, data] of artisanUploads.entries()) {
      if (data.timestamp < tenMinutesAgo) {
        artisanUploads.delete(phone);
      }
    }
  } catch (error) {
    console.error('Error in processArtisanMedia:', error);
  }
}
