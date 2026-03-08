'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mic,
  MicOff,
  Loader2,
  CheckCircle2,
  Volume2,
  Languages,
  Download,
  Play,
  Pause,
} from 'lucide-react';
import {
  voiceRecordingService,
  type SupportedLanguage,
  type TranscriptionResult,
} from '@/lib/voice-recording-service';

interface VoiceRecorderProps {
  onTranscriptionComplete?: (result: TranscriptionResult) => void;
  defaultLanguage?: SupportedLanguage;
  maxDuration?: number;
  showTranslation?: boolean;
  className?: string;
}

const languageNames: { [key in SupportedLanguage]: string } = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  bn: 'বাংলা (Bengali)',
  te: 'తెలుగు (Telugu)',
  mr: 'मराठी (Marathi)',
  ta: 'தமிழ் (Tamil)',
  gu: 'ગુજરાતી (Gujarati)',
  kn: 'ಕನ್ನಡ (Kannada)',
  ml: 'മലയാളം (Malayalam)',
  pa: 'ਪੰਜਾਬੀ (Punjabi)',
  or: 'ଓଡ଼ିଆ (Odia)',
  as: 'অসমীয়া (Assamese)',
};

export function VoiceRecorder({
  onTranscriptionComplete,
  defaultLanguage = 'en',
  maxDuration = 300, // 5 minutes default
  showTranslation = true,
  className = '',
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [browserSupported, setBrowserSupported] = useState(true);

  // Check browser support on mount
  useEffect(() => {
    const checkBrowserSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setBrowserSupported(false);
        setError(
          'Your browser does not support voice recording. Please use a modern browser like Chrome, Firefox, Safari, or Edge.'
        );
        return false;
      }

      if (!window.MediaRecorder) {
        setBrowserSupported(false);
        setError(
          'Voice recording is not supported in your browser. Please update to the latest version or use a different browser.'
        );
        return false;
      }

      return true;
    };

    checkBrowserSupport();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (maxDuration && newTime >= maxDuration) {
            handleStopRecording();
          }
          return newTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, maxDuration]);

  useEffect(() => {
    return () => {
      voiceRecordingService.cleanup();
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    if (!browserSupported) {
      setError('Voice recording is not supported in your browser.');
      return;
    }

    try {
      setError(null);
      setTranscription(null);
      setAudioBlob(null);
      setRecordingTime(0);

      await voiceRecordingService.startRecording({
        language: selectedLanguage,
        maxDuration,
        autoStop: true,
      });

      setIsRecording(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Microphone access denied. Please allow microphone permissions in your browser settings.'
          : err instanceof Error && err.name === 'NotFoundError'
            ? 'No microphone found. Please connect a microphone and try again.'
            : 'Failed to start recording. Please check microphone permissions and try again.';
      setError(errorMessage);
      console.error(err);
    }
  };

  const handleStopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      setProcessingProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const blob = await voiceRecordingService.stopRecording();
      setAudioBlob(blob);

      const result = await voiceRecordingService.transcribeAudio(blob, selectedLanguage);

      clearInterval(progressInterval);
      setProcessingProgress(100);

      setTranscription(result);
      setIsProcessing(false);

      if (onTranscriptionComplete) {
        onTranscriptionComplete(result);
      }
    } catch (err) {
      setError('Failed to process recording. Please try again.');
      setIsProcessing(false);
      console.error(err);
    }
  };

  const handlePlayAudio = () => {
    if (!audioBlob) return;

    const audio = new Audio(URL.createObjectURL(audioBlob));
    audio.play();
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const handleDownloadAudio = () => {
    if (!audioBlob) return;

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Recorder
        </CardTitle>
        <CardDescription>
          Record your voice in your preferred language - AI will transcribe and translate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Languages className="h-4 w-4" />
            Select Language
          </label>
          <Select
            value={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)}
            disabled={isRecording || isProcessing || !browserSupported}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languageNames).map(([code, name]) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recording Controls */}
        <div className="bg-warm-sand flex items-center justify-center rounded-lg p-8">
          {!isRecording && !isProcessing ? (
            <Button
              size="lg"
              onClick={handleStartRecording}
              className="gap-2"
              disabled={isProcessing || !browserSupported}
            >
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          ) : isRecording ? (
            <div className="w-full space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="h-4 w-4 animate-pulse rounded-full bg-red-500" />
                <span className="font-mono text-3xl font-bold">{formatTime(recordingTime)}</span>
              </div>
              <Progress
                value={(recordingTime / maxDuration) * 100}
                className="mx-auto w-full max-w-xs"
              />
              <Button
                size="lg"
                variant="destructive"
                onClick={handleStopRecording}
                className="gap-2"
              >
                <MicOff className="h-5 w-5" />
                Stop Recording
              </Button>
            </div>
          ) : (
            <div className="w-full space-y-4 text-center">
              <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
              <div className="space-y-2">
                <p className="font-semibold">Processing your recording...</p>
                <Progress value={processingProgress} className="mx-auto w-full max-w-xs" />
                <p className="text-muted-foreground text-sm">
                  Transcribing and translating your voice
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Transcription Result */}
        {transcription && (
          <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Transcription Complete!</span>
              <Badge variant="secondary" className="ml-auto">
                {Math.round(transcription.confidence * 100)}% confidence
              </Badge>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">
                Original Text ({languageNames[transcription.language]}):
              </p>
              <div className="rounded border bg-white p-3">
                <p className="text-sm">{transcription.text}</p>
              </div>
            </div>

            {showTranslation && transcription.translatedText && (
              <div>
                <p className="mb-2 text-sm font-medium">Translations:</p>
                <div className="space-y-2">
                  {Object.entries(transcription.translatedText).map(([lang, text]) => (
                    <div key={lang} className="rounded border bg-white p-3">
                      <p className="text-muted-foreground mb-1 text-xs">
                        {languageNames[lang as SupportedLanguage]}
                      </p>
                      <p className="text-sm">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio Controls */}
            {audioBlob && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  className="gap-2"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownloadAudio} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
