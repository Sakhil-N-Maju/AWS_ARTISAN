import { NextRequest, NextResponse } from 'next/server';
import { workshopBookingService } from '@/lib/workshop-booking-service';
import { withErrorHandling } from '@/lib/api-middleware';

/**
 * GET /api/workshops
 * Get all workshops with optional filters
 */
async function handleGET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters = {
    craftType: searchParams.get('craftType') || undefined,
    location: searchParams.get('location') || undefined,
    difficulty: searchParams.get('difficulty') || undefined,
    priceRange: searchParams.get('minPrice') && searchParams.get('maxPrice')
      ? {
          min: Number.parseInt(searchParams.get('minPrice')!),
          max: Number.parseInt(searchParams.get('maxPrice')!),
        }
      : undefined,
    virtualOption: searchParams.get('virtualOption') === 'true' ? true : undefined,
  };

  const workshops = await workshopBookingService.getWorkshops(filters);

  return NextResponse.json({
    success: true,
    data: workshops,
    count: workshops.length,
  });
}

export const GET = withErrorHandling(handleGET);
