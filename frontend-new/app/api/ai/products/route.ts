import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = await apiClient.generateProductWithAI({
      voiceFile: formData.get('voice') as File | undefined,
      imageFile: formData.get('image') as File | undefined,
      textDescription: formData.get('description') as string | undefined,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('AI product generation error:', error);
    return NextResponse.json(
      { error: error.response?.data?.error || error.message || 'Failed to generate product with AI' },
      { status: error.response?.status || 500 }
    );
  }
}
