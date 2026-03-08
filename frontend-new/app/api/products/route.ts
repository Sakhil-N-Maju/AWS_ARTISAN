import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { withErrorHandling } from '@/lib/api-middleware';

async function handleGET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const params: any = {};
  if (searchParams.get('id')) params.id = searchParams.get('id');
  if (searchParams.get('category')) params.category = searchParams.get('category');
  if (searchParams.get('search')) params.search = searchParams.get('search');
  if (searchParams.get('limit')) params.limit = parseInt(searchParams.get('limit')!);
  if (searchParams.get('offset')) params.offset = parseInt(searchParams.get('offset')!);

  // If requesting single product
  if (params.id) {
    const data = await apiClient.getProduct(params.id);
    return NextResponse.json(data);
  }

  // Get multiple products
  const data = await apiClient.getProducts(params);
  return NextResponse.json(data);
}

async function handlePOST(request: NextRequest) {
  const formData = await request.formData();
  
  // Validate required fields
  const name = formData.get('name');
  const price = formData.get('price');
  
  if (!name || !price) {
    return NextResponse.json(
      { error: 'Missing required fields: name and price are required' },
      { status: 400 }
    );
  }

  const data = await apiClient.createProduct(formData);
  return NextResponse.json(data);
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
