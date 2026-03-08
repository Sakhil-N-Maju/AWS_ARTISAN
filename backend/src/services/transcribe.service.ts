import {
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
  TranscriptionJob,
  LanguageCode
} from '@aws-sdk/client-transcribe';
import { transcribeClient, AWS_CONFIG } from '../config/aws';
import { logger } from '../utils/logger';

export class TranscribeService {
  /**
   * Start transcription job
   */
  async startTranscription(
    audioUrl: string,
    language: string = 'hi-IN'
  ): Promise<string> {
    try {
      const jobName = `transcribe-${Date.now()}`;
      
      const command = new StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        LanguageCode: this.mapLanguageCode(language),
        MediaFormat: 'ogg',
        Media: {
          MediaFileUri: audioUrl
        },
        OutputBucketName: AWS_CONFIG.S3_BUCKET,
        Settings: {
          ShowSpeakerLabels: false
        }
      });

      await transcribeClient.send(command);
      logger.info('Transcription job started', { jobName, language });
      
      return jobName;
    } catch (error) {
      logger.error('Failed to start transcription', { error });
      throw error;
    }
  }

  /**
   * Poll transcription job until complete
   */
  async waitForTranscription(
    jobName: string,
    maxAttempts: number = 30,
    delayMs: number = 2000
  ): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const command = new GetTranscriptionJobCommand({
          TranscriptionJobName: jobName
        });

        const response = await transcribeClient.send(command);
        const job = response.TranscriptionJob;

        if (job?.TranscriptionJobStatus === 'COMPLETED') {
          const transcriptUri = job.Transcript?.TranscriptFileUri;
          if (!transcriptUri) {
            throw new Error('Transcript URI not found');
          }

          // Fetch transcript content
          const transcript = await this.fetchTranscript(transcriptUri);
          logger.info('Transcription completed', { jobName });
          return transcript;
        }

        if (job?.TranscriptionJobStatus === 'FAILED') {
          throw new Error(`Transcription failed: ${job.FailureReason}`);
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } catch (error) {
        logger.error('Error polling transcription job', { jobName, attempt, error });
        if (attempt === maxAttempts - 1) throw error;
      }
    }

    throw new Error('Transcription timeout');
  }

  /**
   * Fetch transcript from S3 URL
   */
  private async fetchTranscript(url: string): Promise<string> {
    const response = await fetch(url);
    const data = await response.json() as { results: { transcripts: Array<{ transcript: string }> } };
    return data.results.transcripts[0].transcript;
  }

  /**
   * Map language to AWS Transcribe language code
   */
  private mapLanguageCode(language: string): LanguageCode {
    const languageMap: Record<string, LanguageCode> = {
      'hindi': 'hi-IN' as LanguageCode,
      'malayalam': 'ml-IN' as LanguageCode,
      'tamil': 'ta-IN' as LanguageCode,
      'telugu': 'te-IN' as LanguageCode,
      'bengali': 'bn-IN' as LanguageCode,
      'english': 'en-IN' as LanguageCode
    };

    return languageMap[language.toLowerCase()] || ('hi-IN' as LanguageCode);
  }
}

export const transcribeService = new TranscribeService();
