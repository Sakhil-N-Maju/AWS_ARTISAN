import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { withErrorHandling } from '@/lib/api-middleware';

// Mock data fallback for when backend is unavailable
const mockArtisans = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    region: 'Karnataka',
    craftType: 'Pottery',
    bio: 'Third-generation potter preserving traditional terracotta techniques',
    productsCount: 12,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Priya Sharma',
    region: 'Rajasthan',
    craftType: 'Textiles',
    bio: 'Master weaver specializing in traditional Rajasthani silk sarees',
    productsCount: 18,
    rating: 4.9
  }
];

async function handleGET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const params: any = {};
  if (searchParams.get('id')) params.id = searchParams.get('id');
  if (searchParams.get('limit')) params.limit = parseInt(searchParams.get('limit')!);
  if (searchParams.get('offset')) params.offset = parseInt(searchParams.get('offset')!);
  if (searchParams.get('status')) params.status = searchParams.get('status');
  if (searchParams.get('craftType')) params.craftType = searchParams.get('craftType');
  if (searchParams.get('region')) params.region = searchParams.get('region');
  if (searchParams.get('search')) params.search = searchParams.get('search');

  try {
    // If requesting single artisan
    if (params.id) {
      const data = await apiClient.getArtisan(params.id);
      return NextResponse.json(data);
    }

    // Get multiple artisans
    const data = await apiClient.getArtisans(params);
    return NextResponse.json(data);
  } catch (error) {
    // Fallback to mock data if backend is unavailable
    console.log('Backend unavailable, using mock data');
    if (params.id) {
      const artisan = mockArtisans.find(a => a.id === params.id);
      return NextResponse.json(artisan || mockArtisans[0]);
    }
    return NextResponse.json(mockArtisans);
  }
}

async function handlePOST(request: NextRequest) {
  const body = await request.json();
  
  // Validate required fields
  if (!body.name || !body.email) {
    return NextResponse.json(
      { error: 'Missing required fields: name and email are required' },
      { status: 400 }
    );
  }

  const data = await apiClient.request({
    method: 'POST',
    url: '/api/artisans',
    data: body,
  });
  return NextResponse.json(data);
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
