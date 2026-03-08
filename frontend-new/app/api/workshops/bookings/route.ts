import { NextResponse } from 'next/server';
import { workshopBookingService } from '@/lib/workshop-booking-service';
import { paymentGatewayIntegration } from '@/lib/payment-gateway-integration';
import { withErrorHandling, withAuth, AuthenticatedRequest } from '@/lib/api-middleware';

/**
 * POST /api/workshops/bookings
 * Create a new workshop booking with payment
 */
async function handlePOST(request: AuthenticatedRequest) {
  const body = await request.json();
  
  const {
    workshopId,
    scheduleId,
    participants,
    specialRequests,
    dietaryRestrictions,
    paymentMethod,
  } = body;

  // Validate required fields
  if (!workshopId || !scheduleId || !participants || participants.length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing required fields: workshopId, scheduleId, and participants are required',
      },
      { status: 400 }
    );
  }

  // Create booking
  const booking = await workshopBookingService.createBooking({
    workshopId,
    scheduleId,
    participants,
    specialRequests,
    dietaryRestrictions,
  });

  // Process payment
  try {
    const paymentTransaction = await paymentGatewayIntegration.processPayment({
      orderId: booking.id,
      customerId: booking.userId,
      amount: booking.totalAmount,
      currency: 'INR',
      paymentMethod: paymentMethod || { type: 'card', details: {} },
      gateway: 'razorpay', // Use Razorpay for Indian payments
    });

    // Confirm payment if successful
    if (
      paymentTransaction.status === 'completed' ||
      paymentTransaction.status === 'captured'
    ) {
      await workshopBookingService.confirmPayment(
        booking.id,
        paymentTransaction.id,
        paymentTransaction.paymentMethod.type
      );

      return NextResponse.json({
        success: true,
        data: {
          booking,
          payment: paymentTransaction,
        },
        message: 'Workshop booked successfully',
      });
    } else {
      // Payment failed or pending
      return NextResponse.json(
        {
          success: false,
          error: 'Payment processing failed',
          data: {
            booking,
            payment: paymentTransaction,
          },
        },
        { status: 402 }
      );
    }
  } catch (paymentError) {
    // Payment failed, but booking is created
    return NextResponse.json(
      {
        success: false,
        error: 'Payment failed',
        message: paymentError instanceof Error ? paymentError.message : 'Unknown payment error',
        data: {
          booking,
        },
      },
      { status: 402 }
    );
  }
}

/**
 * GET /api/workshops/bookings
 * Get user's workshop bookings
 */
async function handleGET(request: AuthenticatedRequest) {
  const userId = request.userId || 'user-temp';

  const bookings = await workshopBookingService.getUserBookings(userId);

  return NextResponse.json({
    success: true,
    data: bookings,
    count: bookings.length,
  });
}

export const POST = withErrorHandling(withAuth(handlePOST));
export const GET = withErrorHandling(withAuth(handleGET));
