import { NextRequest, NextResponse } from 'next/server';
import { communityForumSystem } from '@/lib/community-forum-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, userId } = body;

    if (!type || !id || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type !== 'topic' && type !== 'post') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "topic" or "post"' },
        { status: 400 }
      );
    }

    await communityForumSystem.upvote({ type, id, userId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to upvote:', error);
    return NextResponse.json(
      { error: 'Failed to upvote' },
      { status: 500 }
    );
  }
}
