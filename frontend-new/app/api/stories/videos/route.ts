import { NextRequest, NextResponse } from 'next/server';

// GET /api/stories/videos - Get all story videos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const craft = searchParams.get('craft');

    // Build query parameters for backend
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (craft) params.append('craft', craft);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const queryString = params.toString();
    const url = `${backendUrl}/api/stories/videos${queryString ? `?${queryString}` : ''}`;

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
    console.error('Error fetching videos:', error);
    
    // Return mock data as fallback for development
    const mockVideos = [
      {
        id: 1,
        title: 'The Art of Hand-Weaving: A Complete Process',
        description: 'Follow Priya Sharma through a complete day of hand-weaving.',
        artisan: 'Priya Sharma',
        craft: 'Weaving',
        thumbnail: '/placeholder.svg?key=video1',
        duration: '12:45',
        views: 24500,
        date: '2 weeks ago',
      },
      {
        id: 2,
        title: 'Natural Dye Workshop with Priya Sharma',
        description: 'Learn how natural indigo and turmeric are transformed into vibrant dyes.',
        artisan: 'Priya Sharma',
        craft: 'Weaving',
        thumbnail: '/placeholder.svg?key=video2',
        duration: '18:30',
        views: 15800,
        date: '3 weeks ago',
      },
    ];

    return NextResponse.json(mockVideos);
  }
}
