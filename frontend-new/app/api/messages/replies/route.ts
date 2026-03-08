import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fetch artisan replies from WhatsApp messages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artisanId = searchParams.get('artisanId');

    if (!artisanId) {
      return NextResponse.json({ success: false, error: 'Artisan ID required' }, { status: 400 });
    }

    // Find all inbound messages for this artisan
    const inboundMessages = await prisma.whatsAppMessage.findMany({
      where: {
        direction: 'INBOUND',
        // Match against the artisan's phone number
        // In production, you'd join with artisan table
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: 50,
    });

    // Get artisan's phone from outbound messages
    const outboundToArtisan = await prisma.whatsAppMessage.findFirst({
      where: {
        direction: 'OUTBOUND',
        metadata: {
          path: ['artisanId'],
          equals: artisanId,
        },
      },
    });

    if (!outboundToArtisan) {
      return NextResponse.json({
        success: true,
        messages: [],
      });
    }

    const artisanPhone = outboundToArtisan.phone;

    // Filter messages from this artisan's phone
    const artisanReplies = inboundMessages.filter((msg: any) => msg.phone === artisanPhone);

    return NextResponse.json({
      success: true,
      messages: artisanReplies.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.sentAt,
        waMessageId: msg.waMessageId,
      })),
    });
  } catch (error: any) {
    console.error('Fetch replies error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
