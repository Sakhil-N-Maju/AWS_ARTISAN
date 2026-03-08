'use client';

import { Volume2, Sparkles, Zap, Users } from 'lucide-react';

interface VoiceWelcomeProps {
  onStart: () => void;
}

export function VoiceWelcome({ onStart }: VoiceWelcomeProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-2xl space-y-12 text-center">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative h-24 w-24">
            <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full" />
            <div
              className="bg-primary/10 absolute inset-2 animate-ping rounded-full"
              style={{ animationDuration: '2s' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Volume2
                className="text-primary h-12 w-12 animate-bounce"
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-warm-charcoal text-balance-heading font-serif text-5xl font-bold sm:text-6xl">
            Discover with Your Voice
          </h1>
          <p className="text-warm-charcoal/60 text-xl">
            Experience the revolutionary voice-first shopping platform. Just speak, and we'll find
            the perfect handcrafted products for you.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <div className="bg-primary/20 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
              <Sparkles className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-warm-charcoal font-semibold">Smart Discovery</h3>
            <p className="text-warm-charcoal/60 text-sm">
              Describe what you're looking for in natural language
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-primary/20 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
              <Zap className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-warm-charcoal font-semibold">Instant Results</h3>
            <p className="text-warm-charcoal/60 text-sm">
              Get personalized recommendations in seconds
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-primary/20 mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
              <Users className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-warm-charcoal font-semibold">Connect with Artisans</h3>
            <p className="text-warm-charcoal/60 text-sm">
              Learn artisan stories behind each product
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="bg-primary hover:bg-warm-rust inline-flex items-center gap-3 rounded-lg px-12 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Volume2 className="h-6 w-6" />
          Start Voice Discovery
        </button>

        {/* Language Support */}
        <p className="text-warm-charcoal/60 text-sm">
          Available in English and Hindi. Works on all devices.
        </p>
      </div>
    </div>
  );
}
