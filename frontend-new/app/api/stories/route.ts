import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/api-middleware';

// GET /api/stories - Get all stories with optional filtering
async function handleGET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  // Build query parameters for backend
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (search) params.append('search', search);
  if (featured) params.append('featured', featured);

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const queryString = params.toString();
  const url = `${backendUrl}/api/stories${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    // Return mock data as fallback for development
    console.warn('Backend not available, returning mock data');
    const mockStories = [
      {
        id: 1,
        title: "The Weaver's Legacy: 35 Years of Tradition in Jaipur",
        excerpt: 'Priya Sharma carries forward the ancient art of hand-weaving, transforming threads into stories.',
        artisan: 'Priya Sharma',
        craft: 'Hand-Weaving',
        image: '/placeholder.svg?key=story1',
        readTime: 8,
        date: '2025-12-03',
        aiGenerated: true,
        likes: 1203,
        bookmarks: 342,
      },
      {
        id: 2,
        title: "Blue Pottery: Khurja's Art of Resilience",
        excerpt: 'In the heart of Khurja, Rajesh Kumar preserves the 600-year-old tradition of blue pottery.',
        artisan: 'Rajesh Kumar',
        craft: 'Pottery',
        image: '/placeholder.svg?key=story2',
        readTime: 7,
        date: '2025-12-02',
        aiGenerated: true,
        likes: 856,
        bookmarks: 267,
      },
    ];

    return NextResponse.json({ data: mockStories, _mock: true });
  }

  const data = await response.json();
  return NextResponse.json(data);
}

// POST /api/stories - Create a new story
async function handlePOST(request: NextRequest) {
  const body = await request.json();
  
  // Validate required fields
  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: 'Missing required fields: title and content are required' },
      { status: 400 }
    );
  }
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${backendUrl}/api/stories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      { error: error.message || 'Failed to create story' },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 201 });
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
