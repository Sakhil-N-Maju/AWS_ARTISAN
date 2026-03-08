import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Webhook verification (GET request)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// Receive WhatsApp messages (POST request)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // WhatsApp sends webhook updates
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      // Handle incoming messages
      if (value?.messages) {
        const message = value.messages[0];
        const from = message.from; // Artisan's WhatsApp number
        const messageText = message.text?.body;
        const waMessageId = message.id;

        console.log('Received message from:', from, 'Content:', messageText);

        // Store incoming message
        await prisma.whatsAppMessage.create({
          data: {
            phone: from,
            direction: 'INBOUND',
            messageType: 'text',
            content: messageText,
            waMessageId: waMessageId,
            status: 'SENT',
            sentAt: new Date(),
          },
        });

        // Find the original outbound message to get artisan context
        const originalMessage = await prisma.whatsAppMessage.findFirst({
          where: {
            phone: from,
            direction: 'OUTBOUND',
          },
          orderBy: {
            sentAt: 'desc',
          },
        });

        // Notify frontend via webhook/SSE or store for polling
        // For now, we'll emit a notification that can be picked up by the frontend
        if (originalMessage?.metadata && typeof originalMessage.metadata === 'object') {
          const metadata = originalMessage.metadata as any;
          const artisanId = metadata.artisanId;

          console.log('Artisan reply received for artisan:', artisanId);

          // In a production app, you'd use WebSockets or Server-Sent Events
          // For this implementation, the frontend will poll or check on page load
        }

        // Mark message as read
        await fetch(
          `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              status: 'read',
              message_id: waMessageId,
            }),
          }
        );
      }

      // Handle message status updates (sent, delivered, read)
      if (value?.statuses) {
        const status = value.statuses[0];
        const waMessageId = status.id;
        const newStatus = status.status.toUpperCase();

        await prisma.whatsAppMessage.updateMany({
          where: { waMessageId },
          data: { status: newStatus },
        });

        console.log('Message status update:', waMessageId, newStatus);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
