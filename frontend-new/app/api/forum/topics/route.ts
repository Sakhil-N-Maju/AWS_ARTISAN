import { NextRequest, NextResponse } from 'next/server';
import { communityForumSystem } from '@/lib/community-forum-system';
import { withErrorHandling, withAuth, AuthenticatedRequest } from '@/lib/api-middleware';

async function handleGET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const sortBy = searchParams.get('sortBy') as 'recent' | 'popular' | 'trending' || 'recent';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  if (!categoryId) {
    return NextResponse.json(
      { error: 'Category ID is required' },
      { status: 400 }
    );
  }

  const topics = await communityForumSystem.getTopicsByCategory(categoryId, {
    sortBy,
    limit,
    offset,
  });

  return NextResponse.json(topics);
}

async function handlePOST(request: AuthenticatedRequest) {
  const body = await request.json();
  const { categoryId, author, title, content, tags, attachments } = body;

  if (!categoryId || !title || !content) {
    return NextResponse.json(
      { error: 'Missing required fields: categoryId, title, and content are required' },
      { status: 400 }
    );
  }

  // Use authenticated user info if available
  const authorInfo = author || {
    id: request.userId || 'anonymous',
    name: 'User',
  };

  const topic = await communityForumSystem.createTopic({
    categoryId,
    author: authorInfo,
    title,
    content,
    tags: tags || [],
    attachments,
  });

  return NextResponse.json(topic, { status: 201 });
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(withAuth(handlePOST));
