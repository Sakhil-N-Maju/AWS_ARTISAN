import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandling } from '@/lib/api-middleware';

// Mock artisan WhatsApp numbers (in production, fetch from database)
const artisanWhatsAppNumbers: Record<string, string> = {
  '1': '+919876543210', // Priya Sharma
  '2': '+919876543211',
  '3': '+919876543212',
  '4': '+919876543213',
  '5': '+919876543214',
  '6': '+919876543215',
  '7': '+919876543216',
  '8': '+919876543217',
};

async function handlePOST(request: NextRequest) {
  const { artisanId, artisanName, content, messageId } = await request.json();

  // Validate required fields
  if (!artisanId || !content) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: artisanId and content are required' },
      { status: 400 }
    );
  }

  // Get artisan's WhatsApp number
  const artisanPhone = artisanWhatsAppNumbers[artisanId];

  if (!artisanPhone) {
    return NextResponse.json(
      { success: false, error: 'Artisan WhatsApp number not found' },
      { status: 404 }
    );
  }

  // Format message for WhatsApp
  const whatsappMessage = `New message from Artisans of India platform:\n\n${content}\n\n---\nReply to this message to respond to the customer.`;

  // Check if WhatsApp credentials are configured
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID || !process.env.WHATSAPP_ACCESS_TOKEN) {
    console.warn('WhatsApp credentials not configured, skipping WhatsApp send');
    return NextResponse.json({
      success: true,
      messageId: `local-${Date.now()}`,
      artisanPhone,
      note: 'WhatsApp integration not configured',
    });
  }

  // Send via WhatsApp Business API
  const whatsappResponse = await fetch(
    `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: artisanPhone,
        type: 'text',
        text: { body: whatsappMessage },
      }),
    }
  );

  const whatsappData = await whatsappResponse.json();

  if (!whatsappResponse.ok) {
    console.error('WhatsApp API error:', whatsappData);
    return NextResponse.json(
      { success: false, error: 'Failed to send WhatsApp message', details: whatsappData },
      { status: 500 }
    );
  }

  // Store in database
  await prisma.whatsAppMessage.create({
    data: {
      phone: artisanPhone,
      direction: 'OUTBOUND',
      messageType: 'text',
      content: whatsappMessage,
      waMessageId: whatsappData.messages[0].id,
      status: 'SENT',
      sentAt: new Date(),
      metadata: {
        artisanId,
        artisanName,
        userMessageId: messageId,
      },
    },
  });

  return NextResponse.json({
    success: true,
    messageId: whatsappData.messages[0].id,
    artisanPhone,
  });
}

export const POST = withErrorHandling(handlePOST);
