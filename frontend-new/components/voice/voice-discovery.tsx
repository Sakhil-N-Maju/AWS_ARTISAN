'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VoiceDiscoveryProps {
  onComplete: (products: any[]) => void;
}

export function VoiceDiscovery({ onComplete }: VoiceDiscoveryProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [visualization, setVisualization] = useState<number[]>(Array(20).fill(0));
  const [isProcessing, setIsProcessing] = useState(false);
  const [browserSupported, setBrowserSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check browser support on mount
  useEffect(() => {
    const checkBrowserSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setBrowserSupported(false);
        setError(
          'Your browser does not support voice recording. Please use Chrome, Firefox, Safari, or Edge.'
        );
        return false;
      }

      if (!window.MediaRecorder) {
        setBrowserSupported(false);
        setError(
          'Voice recording is not supported. Please update your browser to the latest version.'
        );
        return false;
      }

      return true;
    };

    checkBrowserSupport();
  }, []);

  // Simulate voice input
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      setVisualization((prev) => prev.map(() => Math.random() * 100));
    }, 100);

    // Simulate listening after 3 seconds
    const timer = setTimeout(() => {
      setTranscript(
        'I am looking for handwoven textiles, preferably sarees with natural dyes in earth tones'
      );
      setIsListening(false);
      setIsProcessing(true);

      // Simulate processing
      setTimeout(() => {
        const mockProducts = [
          { id: 1, name: 'Hand-Woven Saree', price: 4500, image: '/placeholder.svg?key=voice1' },
          { id: 3, name: 'Silk Shawl', price: 8900, image: '/placeholder.svg?key=voice2' },
          {
            id: 2,
            name: 'Organic Cotton Dupatta',
            price: 2200,
            image: '/placeholder.svg?key=voice3',
          },
        ];
        onComplete(mockProducts);
      }, 2000);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isListening, onComplete]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-12">
        {/* Browser Support Error */}
        {!browserSupported && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Voice Waveform */}
        <div className="space-y-8">
          <div className="from-primary/10 flex h-48 items-end justify-center gap-1 rounded-2xl bg-gradient-to-t to-transparent p-8">
            {visualization.map((height, idx) => (
              <div
                key={idx}
                className="from-primary to-secondary flex-1 rounded-full bg-gradient-to-t transition-all duration-100"
                style={{ height: `${Math.max(height, 10)}%` }}
              />
            ))}
          </div>

          {/* Status */}
          <div className="space-y-4 text-center">
            {isListening && (
              <div>
                <p className="text-warm-charcoal text-lg font-semibold">Listening...</p>
                <p className="text-warm-charcoal/60">
                  Speak naturally about what you're looking for
                </p>
              </div>
            )}

            {transcript && !isProcessing && (
              <div>
                <p className="text-warm-charcoal mb-2 text-lg font-semibold">Heard:</p>
                <div className="border-primary rounded-lg border-2 bg-white p-6">
                  <p className="text-warm-charcoal italic">"{transcript}"</p>
                </div>
              </div>
            )}

            {isProcessing && (
              <div>
                <p className="text-warm-charcoal mb-4 text-lg font-semibold">
                  Finding perfect matches...
                </p>
                <div className="flex justify-center gap-2">
                  <div className="bg-primary h-3 w-3 animate-bounce rounded-full" />
                  <div
                    className="bg-primary h-3 w-3 animate-bounce rounded-full"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="bg-primary h-3 w-3 animate-bounce rounded-full"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsListening(!isListening)}
            disabled={isProcessing || !browserSupported}
            className={`relative flex h-24 w-24 items-center justify-center rounded-full text-lg font-semibold transition-all duration-300 ${
              isListening
                ? 'scale-110 bg-red-500 text-white shadow-lg shadow-red-500/50'
                : isProcessing
                  ? 'bg-primary/50 cursor-not-allowed text-white'
                  : !browserSupported
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-primary hover:bg-warm-rust text-white shadow-lg hover:scale-105 hover:shadow-xl'
            }`}
          >
            {isListening ? (
              <MicOff className="h-10 w-10" />
            ) : isProcessing ? (
              <Volume2 className="h-10 w-10" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="border-border rounded-lg border bg-white p-6">
          <h3 className="text-warm-charcoal mb-3 font-semibold">Tips for best results:</h3>
          <ul className="text-warm-charcoal/70 space-y-2 text-sm">
            <li>• Be specific about what you're looking for</li>
            <li>• Mention materials, colors, or style preferences</li>
            <li>• Tell us about the occasion or use case</li>
            <li>• Specify your budget if you have one</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
