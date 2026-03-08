import { NextRequest, NextResponse } from 'next/server';
import { workshopBookingService } from '@/lib/workshop-booking-service';

/**
 * GET /api/workshops/[id]/schedules
 * Get available schedules for a workshop
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    const schedules = await workshopBookingService.getAvailableSchedules(
      id,
      startDate,
      endDate
    );

    return NextResponse.json({
      success: true,
      data: schedules,
      count: schedules.length,
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch schedules',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
