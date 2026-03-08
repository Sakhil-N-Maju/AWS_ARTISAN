'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { ChevronRight, Volume2, Zap } from 'lucide-react';

type OnboardingStep = 'welcome' | 'preferences' | 'voice' | 'complete';

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [scrolled] = useState(false);
  const [preferences, setPreferences] = useState({
    favoriteCategories: [] as string[],
    budget: 'medium' as 'low' | 'medium' | 'high',
    enableVoice: false,
    language: 'english' as 'english' | 'hindi',
  });

  const toggleCategory = (category: string) => {
    setPreferences((prev) => ({
      ...prev,
      favoriteCategories: prev.favoriteCategories.includes(category)
        ? prev.favoriteCategories.filter((c) => c !== category)
        : [...prev.favoriteCategories, category],
    }));
  };

  const handleComplete = () => {
    setStep('complete');
  };

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      {step === 'welcome' && (
        <div className="flex min-h-screen items-center justify-center px-4 pt-20">
          <div className="w-full max-w-2xl space-y-8 text-center">
            <div>
              <h1 className="text-warm-charcoal mb-4 font-serif text-5xl font-bold sm:text-6xl">
                Welcome to Artisans of India
              </h1>
              <p className="text-warm-charcoal/60 text-xl">
                Let's personalize your shopping experience to find the perfect handcrafted products
                for you.
              </p>
            </div>

            <button
              onClick={() => setStep('preferences')}
              className="bg-primary hover:bg-warm-rust inline-flex items-center gap-2 rounded-lg px-12 py-4 text-lg font-semibold text-white transition"
            >
              Get Started
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {step === 'preferences' && (
        <div className="flex min-h-screen items-center justify-center px-4 pt-20 pb-12">
          <div className="w-full max-w-2xl space-y-8">
            <div>
              <h2 className="text-warm-charcoal mb-2 font-serif text-4xl font-bold">
                Your Preferences
              </h2>
              <p className="text-warm-charcoal/60">Help us understand what you love</p>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <label className="text-warm-charcoal block text-lg font-semibold">
                Favorite Categories
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {['Textiles', 'Pottery', 'Jewelry', 'Woodcraft', 'Metalwork', 'Paintings'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`rounded-lg border-2 p-4 font-semibold transition ${
                        preferences.favoriteCategories.includes(cat)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-warm-charcoal hover:border-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-4">
              <label className="text-warm-charcoal block text-lg font-semibold">Budget Range</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'low', label: 'Under ₹3K' },
                  { value: 'medium', label: '₹3K - ₹10K' },
                  { value: 'high', label: 'Above ₹10K' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPreferences((prev) => ({ ...prev, budget: value as any }))}
                    className={`rounded-lg border-2 p-4 font-semibold transition ${
                      preferences.budget === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-warm-charcoal hover:border-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-4">
              <label className="text-warm-charcoal block text-lg font-semibold">
                Preferred Language
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'english', label: 'English' },
                  { value: 'hindi', label: 'Hindi' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPreferences((prev) => ({ ...prev, language: value as any }))}
                    className={`flex-1 rounded-lg border-2 p-4 font-semibold transition ${
                      preferences.language === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-warm-charcoal hover:border-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep('welcome')}
                className="border-primary text-primary hover:bg-primary flex-1 rounded-lg border-2 py-4 font-semibold transition hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => setStep('voice')}
                className="bg-primary hover:bg-warm-rust flex flex-1 items-center justify-center gap-2 rounded-lg py-4 font-semibold text-white transition"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'voice' && (
        <div className="flex min-h-screen items-center justify-center px-4 pt-20 pb-12">
          <div className="card-light w-full max-w-2xl space-y-8">
            <div>
              <h2 className="text-warm-charcoal mb-2 font-serif text-4xl font-bold">
                Voice Discovery
              </h2>
              <p className="text-warm-charcoal/60">
                Enable voice-first shopping for a revolutionary experience
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-primary/5 border-primary rounded-lg border-2 p-6">
                <div className="flex items-start gap-4">
                  <Volume2 className="text-primary mt-1 h-8 w-8 flex-shrink-0" />
                  <div>
                    <h3 className="text-warm-charcoal mb-2 font-semibold">
                      Discover with Your Voice
                    </h3>
                    <p className="text-warm-charcoal/70">
                      Simply speak to describe what you're looking for. Our AI understands natural
                      language and finds perfect matches for you.
                    </p>
                  </div>
                </div>
              </div>

              <label className="border-border hover:border-primary flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition">
                <input
                  type="checkbox"
                  checked={preferences.enableVoice}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, enableVoice: e.target.checked }))
                  }
                  className="accent-primary h-5 w-5"
                />
                <span className="text-warm-charcoal font-semibold">
                  Enable voice discovery on my account
                </span>
              </label>

              <button
                onClick={() => handleComplete()}
                className="bg-primary hover:bg-warm-rust flex w-full items-center justify-center gap-2 rounded-lg py-4 font-semibold text-white transition"
              >
                <Zap className="h-5 w-5" />
                Complete Onboarding
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="flex min-h-screen items-center justify-center px-4 pt-20">
          <div className="w-full max-w-2xl space-y-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Zap className="h-10 w-10 text-green-600" />
            </div>

            <div>
              <h2 className="text-warm-charcoal mb-2 font-serif text-4xl font-bold">All Set!</h2>
              <p className="text-warm-charcoal/60 text-lg">
                Your personalized shopping experience is ready. Start exploring handcrafted products
                now.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-warm-charcoal/70 font-semibold">Preferences Saved:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-warm-charcoal/60 text-sm">Categories</p>
                  <p className="font-semibold">{preferences.favoriteCategories.length || 'All'}</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-warm-charcoal/60 text-sm">Budget</p>
                  <p className="font-semibold capitalize">{preferences.budget}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = '/')}
              className="bg-primary hover:bg-warm-rust inline-flex items-center gap-2 rounded-lg px-12 py-4 text-lg font-semibold text-white transition"
            >
              Start Shopping
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
