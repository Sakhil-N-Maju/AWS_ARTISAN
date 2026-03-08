'use client';

import { useState } from 'react';
import { VoiceWelcome } from '@/components/voice/voice-welcome';
import { VoiceDiscovery } from '@/components/voice/voice-discovery';
import { VoiceResults } from '@/components/voice/voice-results';

type VoiceStep = 'welcome' | 'discovery' | 'results';

export default function VoicePage() {
  const [step, setStep] = useState<VoiceStep>('welcome');
  const [discoveredProducts, setDiscoveredProducts] = useState<any[]>([]);

  const handleStartVoice = () => {
    setStep('discovery');
  };

  const handleDiscoveryComplete = (products: any[]) => {
    setDiscoveredProducts(products);
    setStep('results');
  };

  const handleReset = () => {
    setStep('welcome');
    setDiscoveredProducts([]);
  };

  return (
    <main className="from-warm-cream via-warm-sand/30 to-warm-cream min-h-screen bg-gradient-to-br">
      {step === 'welcome' && <VoiceWelcome onStart={handleStartVoice} />}
      {step === 'discovery' && <VoiceDiscovery onComplete={handleDiscoveryComplete} />}
      {step === 'results' && <VoiceResults products={discoveredProducts} onReset={handleReset} />}
    </main>
  );
}
