'use client';

import { Volume2 } from 'lucide-react';

export function VoiceCallToAction() {
  return (
    <section className="bg-floral-full relative bg-cover bg-fixed bg-center py-20">
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="bg-primary mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <Volume2 className="h-8 w-8 text-white" />
        </div>

        <h2 className="mb-4 font-serif text-4xl font-bold text-white sm:text-5xl">
          Discover with Your Voice
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
          Experience our innovative voice-first shopping platform. Listen to artisan stories,
          explore products hands-free, and discover the perfect handcrafted item just by speaking.
        </p>

        <button className="bg-primary hover:bg-warm-rust mb-6 inline-flex items-center gap-3 rounded-lg px-8 py-4 font-semibold text-white transition-all duration-300">
          <Volume2 className="h-5 w-5" />
          Start Voice Discovery
        </button>

        <p className="text-sm text-white/80">
          Available on iOS, Android, and web. Works in English and Hindi.
        </p>
      </div>
    </section>
  );
}
