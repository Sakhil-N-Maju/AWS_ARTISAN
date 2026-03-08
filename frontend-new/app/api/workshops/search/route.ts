import { NextRequest, NextResponse } from 'next/server';
import { workshopBookingService } from '@/lib/workshop-booking-service';

/**
 * GET /api/workshops/search
 * Search workshops by query
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      );
    }

    const workshops = await workshopBookingService.searchWorkshops(query);

    return NextResponse.json({
      success: true,
      data: workshops,
      count: workshops.length,
    });
  } catch (error) {
    console.error('Error searching workshops:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search workshops',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
