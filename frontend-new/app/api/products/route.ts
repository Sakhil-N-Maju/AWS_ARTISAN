import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';
import { withErrorHandling } from '@/lib/api-middleware';

// Mock data fallback for when backend is unavailable
const mockProducts = [
  {
    id: '1',
    productId: 'ART-KAR-POT-001',
    title: 'Handcrafted Traditional Karnataka Terracotta Water Pot',
    description: 'This exquisite terracotta water pot embodies centuries of Karnataka pottery tradition. Handcrafted using traditional techniques passed down through generations.',
    price: 120000,
    images: [{url: '/terracotta-pots.jpg', order: 0}],
    artisan: { name: 'Rajesh Kumar', region: 'Karnataka' },
    category: 'Pottery',
    tags: ['handmade', 'terracotta', 'traditional']
  },
  {
    id: '2',
    productId: 'ART-RAJ-TEX-001',
    title: 'Hand-Woven Rajasthani Silk Saree',
    description: 'Beautiful handwoven silk saree featuring traditional Rajasthani patterns and vibrant colors.',
    price: 850000,
    images: [{url: '/hand-woven-saree.jpg', order: 0}],
    artisan: { name: 'Priya Sharma', region: 'Rajasthan' },
    category: 'Textiles',
    tags: ['handwoven', 'silk', 'saree']
  }
];

async function handleGET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const params: any = {};
  if (searchParams.get('id')) params.id = searchParams.get('id');
  if (searchParams.get('category')) params.category = searchParams.get('category');
  if (searchParams.get('search')) params.search = searchParams.get('search');
  if (searchParams.get('limit')) params.limit = parseInt(searchParams.get('limit')!);
  if (searchParams.get('offset')) params.offset = parseInt(searchParams.get('offset')!);

  try {
    // If requesting single product
    if (params.id) {
      const data = await apiClient.getProduct(params.id);
      return NextResponse.json(data);
    }

    // Get multiple products
    const data = await apiClient.getProducts(params);
    return NextResponse.json(data);
  } catch (error) {
    // Fallback to mock data if backend is unavailable
    console.log('Backend unavailable, using mock data');
    if (params.id) {
      const product = mockProducts.find(p => p.id === params.id);
      return NextResponse.json(product || mockProducts[0]);
    }
    return NextResponse.json(mockProducts);
  }
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
