import { NextRequest, NextResponse } from 'next/server';

// GET /api/stories/[id] - Get a specific story by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/stories/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const resolvedParams = await params;
    console.error(`Error fetching story ${resolvedParams.id}:`, error);
    
    // Return mock data as fallback for development
    const mockStory = {
      id: Number.parseInt(resolvedParams.id),
      title: "The Weaver's Legacy: 35 Years of Tradition in Jaipur",
      excerpt: 'Priya Sharma carries forward the ancient art of hand-weaving, transforming threads into stories.',
      author: 'Priya Sharma',
      craft: 'Hand-Weaving',
      location: 'Jaipur, Rajasthan',
      date: 'December 3, 2025',
      readTime: 8,
      likes: 1203,
      image: '/placeholder.svg?key=story-detail',
      content: `
# The Weaver's Legacy: 35 Years of Tradition in Jaipur

In the bustling lanes of Jaipur, where the echo of looms has resonated for centuries, sits Priya Sharma—a master weaver whose hands have never forgotten the language of threads.

## A Journey Begins

At seven years old, Priya didn't choose weaving. Weaving chose her, as it had chosen her grandmother, and her grandmother before that.
      `,
      relatedStories: [
        { id: 2, title: "Blue Pottery: Khurja's Art of Resilience", author: 'Rajesh Kumar' },
      ],
    };

    return NextResponse.json(mockStory);
  }
}

// PUT /api/stories/[id] - Update a story
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/stories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const resolvedParams = await params;
    console.error(`Error updating story ${resolvedParams.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

// DELETE /api/stories/[id] - Delete a story
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/stories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Story not found' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const resolvedParams = await params;
    console.error(`Error deleting story ${resolvedParams.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
