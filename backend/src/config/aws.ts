import { S3Client } from '@aws-sdk/client-s3';
import { TranscribeClient } from '@aws-sdk/client-transcribe';
import { RekognitionClient } from '@aws-sdk/client-rekognition';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { TranslateClient } from '@aws-sdk/client-translate';
import dotenv from 'dotenv';

// Force reload environment variables (needed for ts-node-dev hot reload)
dotenv.config({ override: true });

const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
};

// S3 Client for media storage
export const s3Client = new S3Client(awsConfig);

// Transcribe Client for voice-to-text
export const transcribeClient = new TranscribeClient(awsConfig);

// Rekognition Client for image analysis
export const rekognitionClient = new RekognitionClient(awsConfig);

// Bedrock Client for AI content generation
export const bedrockClient = new BedrockRuntimeClient({
  region: 'us-east-1', // Bedrock is available in us-east-1
  credentials: awsConfig.credentials
});

// Translate Client for language translation
export const translateClient = new TranslateClient(awsConfig);

export const AWS_CONFIG = {
  S3_BUCKET: process.env.S3_BUCKET || 'artisan-ai-media',
  CLOUDFRONT_URL: process.env.CLOUDFRONT_URL || '',
  BEDROCK_MODEL_ID: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0'
};
