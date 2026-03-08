import { NextRequest, NextResponse } from 'next/server';
import { communityForumSystem } from '@/lib/community-forum-system';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, author, content, replyToId, attachments } = body;

    if (!topicId || !author || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const post = await communityForumSystem.createPost({
      topicId,
      author,
      content,
      replyToId,
      attachments,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Failed to create post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
