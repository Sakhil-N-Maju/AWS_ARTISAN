import { NextRequest, NextResponse } from 'next/server';

// GET /api/stories/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    // Build query parameters for backend
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const queryString = params.toString();
    const url = `${backendUrl}/api/stories/blog${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    // Return mock data as fallback for development
    const mockBlogPosts = [
      {
        id: 1,
        title: 'The Renaissance of Indian Handcrafts in the Digital Age',
        excerpt: 'How technology is empowering artisans while preserving ancient traditions.',
        author: 'Priya Sharma',
        date: 'Dec 3, 2025',
        category: 'Heritage',
        image: '/placeholder.svg?key=blog1',
        readTime: 10,
      },
      {
        id: 2,
        title: 'Sustainable Craftsmanship: The Environmental Impact',
        excerpt: 'Understanding how handcrafted products contribute to environmental sustainability.',
        author: 'Anita Singh',
        date: 'Dec 1, 2025',
        category: 'Sustainability',
        image: '/placeholder.svg?key=blog2',
        readTime: 8,
      },
    ];

    return NextResponse.json(mockBlogPosts);
  }
}

// POST /api/stories/blog - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/stories/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
