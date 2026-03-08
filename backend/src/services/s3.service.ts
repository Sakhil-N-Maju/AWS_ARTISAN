import { 
  PutObjectCommand, 
  GetObjectCommand,
  HeadBucketCommand 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, AWS_CONFIG } from '../config/aws';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export class S3Service {
  /**
   * Upload file to S3
   */
  async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: AWS_CONFIG.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType
      });

      await s3Client.send(command);
      
      const url = AWS_CONFIG.CLOUDFRONT_URL
        ? `${AWS_CONFIG.CLOUDFRONT_URL}/${key}`
        : `https://${AWS_CONFIG.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      
      logger.info('File uploaded to S3', { key, url });
      return url;
    } catch (error) {
      logger.error('S3 upload failed', { key, error });
      throw error;
    }
  }

  /**
   * Generate presigned URL for upload
   */
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: AWS_CONFIG.S3_BUCKET,
        Key: key,
        ContentType: contentType
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      logger.error('Failed to generate presigned URL', { key, error });
      throw error;
    }
  }

  /**
   * Generate unique file key
   */
  generateFileKey(prefix: string, extension: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${prefix}/${timestamp}-${random}.${extension}`;
  }

  /**
   * Check if S3 bucket is accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const command = new HeadBucketCommand({
        Bucket: AWS_CONFIG.S3_BUCKET
      });
      await s3Client.send(command);
      return true;
    } catch (error) {
      logger.error('S3 health check failed', { error });
      return false;
    }
  }
}

export const s3Service = new S3Service();
