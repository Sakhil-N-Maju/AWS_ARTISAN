import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { withErrorHandling } from '@/lib/api-middleware';

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

  // If requesting single artisan
  if (params.id) {
    const data = await apiClient.getArtisan(params.id);
    return NextResponse.json(data);
  }

  // Get multiple artisans
  const data = await apiClient.getArtisans(params);
  return NextResponse.json(data);
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
