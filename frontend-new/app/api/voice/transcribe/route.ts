import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/api-middleware';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function handlePOST(request: NextRequest) {
  const formData = await request.formData();
  const audioFile = formData.get('audio') as File;
  const language = formData.get('language') as string || 'en';

  if (!audioFile) {
    return NextResponse.json(
      { error: 'Audio file is required' },
      { status: 400 }
    );
  }

  // Validate file type
  if (!audioFile.type.startsWith('audio/')) {
    return NextResponse.json(
      { error: 'Invalid file type. Only audio files are allowed' },
      { status: 400 }
    );
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (audioFile.size > maxSize) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 10MB' },
      { status: 400 }
    );
  }

  // Forward the audio file to the backend transcription service
  const backendFormData = new FormData();
  backendFormData.append('audio', audioFile);
  backendFormData.append('language', language);

  const response = await fetch(`${BACKEND_URL}/api/voice/transcribe`, {
    method: 'POST',
    body: backendFormData,
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      { error: error.message || 'Transcription failed' },
      { status: response.status }
    );
  }

  const result = await response.json();
  return NextResponse.json(result);
}

export const POST = withErrorHandling(handlePOST);
