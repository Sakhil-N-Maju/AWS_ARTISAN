import { NextRequest, NextResponse } from 'next/server';
import { razorpayService } from '@/lib/services/razorpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = razorpayService.verifyWebhookSignature(body, signature);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different webhook events
    switch (event.event) {
      case 'payment.authorized':
        console.log('Payment authorized:', event.payload.payment.entity);
        // Handle authorized payment
        break;

      case 'payment.captured':
        console.log('Payment captured:', event.payload.payment.entity);
        // Handle captured payment
        break;

      case 'payment.failed':
        console.log('Payment failed:', event.payload.payment.entity);
        // Handle failed payment
        break;

      case 'refund.created':
        console.log('Refund created:', event.payload.refund.entity);
        // Update refund status in database
        break;

      case 'refund.processed':
        console.log('Refund processed:', event.payload.refund.entity);
        // Mark refund as completed
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
