import { NextRequest, NextResponse } from 'next/server';
import { communityForumSystem } from '@/lib/community-forum-system';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const categoryId = searchParams.get('categoryId');
    const tags = searchParams.get('tags')?.split(',');
    const authorId = searchParams.get('authorId');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const results = await communityForumSystem.search(query, {
      categoryId: categoryId || undefined,
      tags: tags || undefined,
      authorId: authorId || undefined,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to search:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
