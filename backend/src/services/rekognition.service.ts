import {
  DetectLabelsCommand,
  DetectTextCommand,
  Label
} from '@aws-sdk/client-rekognition';
import { rekognitionClient, AWS_CONFIG } from '../config/aws';
import { logger } from '../utils/logger';

export interface ImageAnalysis {
  labels: string[];
  colors: string[];
  quality: number;
  text?: string[];
}

export class RekognitionService {
  /**
   * Analyze product image
   */
  async analyzeImage(imageKey: string): Promise<ImageAnalysis> {
    try {
      const labels = await this.detectLabels(imageKey);
      const text = await this.detectText(imageKey);
      
      const analysis: ImageAnalysis = {
        labels: labels.map(l => l.Name || '').filter(Boolean),
        colors: this.extractColors(labels),
        quality: this.calculateQuality(labels),
        text: text.filter(Boolean)
      };

      logger.info('Image analysis completed', { imageKey, analysis });
      return analysis;
    } catch (error) {
      logger.error('Image analysis failed', { imageKey, error });
      throw error;
    }
  }

  /**
   * Detect labels in image
   */
  private async detectLabels(imageKey: string): Promise<Label[]> {
    const command = new DetectLabelsCommand({
      Image: {
        S3Object: {
          Bucket: AWS_CONFIG.S3_BUCKET,
          Name: imageKey
        }
      },
      MaxLabels: 20,
      MinConfidence: 70
    });

    const response = await rekognitionClient.send(command);
    return response.Labels || [];
  }

  /**
   * Detect text in image
   */
  private async detectText(imageKey: string): Promise<string[]> {
    try {
      const command = new DetectTextCommand({
        Image: {
          S3Object: {
            Bucket: AWS_CONFIG.S3_BUCKET,
            Name: imageKey
          }
        }
      });

      const response = await rekognitionClient.send(command);
      return response.TextDetections
        ?.filter(t => t.Type === 'LINE')
        .map(t => t.DetectedText || '')
        .filter(Boolean) || [];
    } catch (error) {
      logger.warn('Text detection failed', { imageKey, error });
      return [];
    }
  }

  /**
   * Extract color information from labels
   */
  private extractColors(labels: Label[]): string[] {
    const colorKeywords = [
      'red', 'blue', 'green', 'yellow', 'orange', 'purple', 
      'pink', 'brown', 'black', 'white', 'gray', 'gold', 
      'silver', 'bronze', 'copper'
    ];

    const colors = new Set<string>();
    
    labels.forEach(label => {
      const name = label.Name?.toLowerCase() || '';
      colorKeywords.forEach(color => {
        if (name.includes(color)) {
          colors.add(color);
        }
      });
    });

    return Array.from(colors);
  }

  /**
   * Calculate image quality score (1-10)
   */
  private calculateQuality(labels: Label[]): number {
    if (labels.length === 0) return 5;

    // Average confidence of top labels
    const avgConfidence = labels
      .slice(0, 10)
      .reduce((sum, l) => sum + (l.Confidence || 0), 0) / Math.min(labels.length, 10);

    // Convert to 1-10 scale
    return Math.round((avgConfidence / 100) * 10);
  }
}

export const rekognitionService = new RekognitionService();
