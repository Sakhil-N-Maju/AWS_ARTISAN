import { NextRequest, NextResponse } from 'next/server';
import { workshopBookingService } from '@/lib/workshop-booking-service';

/**
 * GET /api/workshops/[id]
 * Get workshop details by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const workshop = await workshopBookingService.getWorkshopById(id);

    if (!workshop) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workshop not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: workshop,
    });
  } catch (error) {
    console.error('Error fetching workshop:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch workshop',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
