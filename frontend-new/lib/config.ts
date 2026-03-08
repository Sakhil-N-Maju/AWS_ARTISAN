/**
 * Environment Configuration
 *
 * Centralized configuration for all environment variables
 * with validation and type safety
 */

export const env = {
  // API Keys
  geminiApiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  openaiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',

  // Speech Services
  googleSpeechApiKey: process.env.NEXT_PUBLIC_GOOGLE_SPEECH_API_KEY || '',
  azureSpeechApiKey: process.env.NEXT_PUBLIC_AZURE_SPEECH_API_KEY || '',
  azureSpeechRegion: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || '',

  // Translation
  googleTranslateApiKey: process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY || '',

  // Database
  mongodbUri: process.env.MONGODB_URI || '',
  databaseUrl: process.env.DATABASE_URL || '',

  // Storage
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  awsS3Bucket: process.env.AWS_S3_BUCKET || '',
  awsRegion: process.env.AWS_REGION || 'us-east-1',

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',

  // Payments
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',

  // Authentication
  nextauthSecret: process.env.NEXTAUTH_SECRET || '',
  nextauthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',

  // Email
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@artisansofindia.com',
  resendApiKey: process.env.RESEND_API_KEY || '',

  // Analytics
  gaTrackingId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',

  // App Settings
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',

  // Feature Flags
  enableAiFeatures: process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === 'true',
  enableVoiceFeatures: process.env.NEXT_PUBLIC_ENABLE_VOICE_FEATURES === 'true',
  enablePayments: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
};

/**
 * Validate that required environment variables are set
 */
export function validateEnv() {
  const errors: string[] = [];

  // Check critical API keys in production
  if (env.nodeEnv === 'production') {
    if (!env.geminiApiKey && !env.openaiApiKey) {
      errors.push('Either NEXT_PUBLIC_GEMINI_API_KEY or NEXT_PUBLIC_OPENAI_API_KEY must be set');
    }

    if (!env.mongodbUri && !env.databaseUrl) {
      errors.push('Either MONGODB_URI or DATABASE_URL must be set');
    }

    if (env.enablePayments) {
      if (!env.razorpayKeyId && !env.stripePublishableKey) {
        errors.push('Payment gateway credentials must be set when payments are enabled');
      }
    }
  }

  if (errors.length > 0) {
    console.error('Environment validation errors:');
    errors.forEach((error) => console.error(`  - ${error}`));

    if (env.nodeEnv === 'production') {
      throw new Error('Critical environment variables are missing');
    }
  }

  return errors.length === 0;
}

/**
 * Check if AI features are properly configured
 */
export function isAiConfigured(): boolean {
  return !!(env.geminiApiKey || env.openaiApiKey);
}

/**
 * Check if voice features are properly configured
 */
export function isVoiceConfigured(): boolean {
  return !!(env.googleSpeechApiKey || env.azureSpeechApiKey);
}

/**
 * Check if payments are properly configured
 */
export function isPaymentsConfigured(): boolean {
  return !!(env.razorpayKeyId || env.stripePublishableKey);
}

/**
 * Get API configuration status
 */
export function getConfigStatus() {
  return {
    ai: {
      configured: isAiConfigured(),
      gemini: !!env.geminiApiKey,
      openai: !!env.openaiApiKey,
    },
    voice: {
      configured: isVoiceConfigured(),
      google: !!env.googleSpeechApiKey,
      azure: !!env.azureSpeechApiKey,
    },
    payments: {
      configured: isPaymentsConfigured(),
      razorpay: !!env.razorpayKeyId,
      stripe: !!env.stripePublishableKey,
    },
    storage: {
      aws: !!(env.awsAccessKeyId && env.awsS3Bucket),
      cloudinary: !!env.cloudinaryCloudName,
    },
    database: {
      mongodb: !!env.mongodbUri,
      postgresql: !!env.databaseUrl,
    },
  };
}

// Validate environment on module load (development only)
if (env.nodeEnv === 'development') {
  validateEnv();
}

export default env;
