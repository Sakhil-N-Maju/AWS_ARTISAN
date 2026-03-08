import { NextResponse } from 'next/server';
import { communityForumSystem } from '@/lib/community-forum-system';

export async function GET() {
  try {
    const categories = await communityForumSystem.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
