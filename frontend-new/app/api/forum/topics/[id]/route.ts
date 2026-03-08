import { NextRequest, NextResponse } from 'next/server';
import { communityForumSystem } from '@/lib/community-forum-system';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: topicId } = await params;
    const posts = await communityForumSystem.getPostsByTopic(topicId);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
