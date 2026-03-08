/**
 * Regional Adaptation Component
 *
 * Provides UI components for regional customization:
 * - Language selector
 * - Currency selector
 * - Regional preferences
 * - Localized content display
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Globe, DollarSign, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types
export interface RegionalSettings {
  language: string;
  currency: string;
  region: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

interface Region {
  code: string;
  name: string;
  languages: string[];
  currencies: string[];
}

// Context
const RegionalContext = createContext<{
  settings: RegionalSettings;
  updateSettings: (settings: Partial<RegionalSettings>) => void;
  languages: Language[];
  currencies: Currency[];
  regions: Region[];
} | null>(null);

export const useRegional = () => {
  const context = useContext(RegionalContext);
  if (!context) {
    throw new Error('useRegional must be used within RegionalProvider');
  }
  return context;
};

// Data
const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
];

const REGIONS: Region[] = [
  {
    code: 'IN',
    name: 'India',
    languages: ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa'],
    currencies: ['INR'],
  },
  { code: 'US', name: 'United States', languages: ['en', 'es'], currencies: ['USD'] },
  { code: 'UK', name: 'United Kingdom', languages: ['en'], currencies: ['GBP'] },
  { code: 'EU', name: 'European Union', languages: ['en', 'de', 'fr', 'es'], currencies: ['EUR'] },
  { code: 'JP', name: 'Japan', languages: ['ja', 'en'], currencies: ['JPY'] },
  { code: 'AU', name: 'Australia', languages: ['en'], currencies: ['AUD'] },
  { code: 'CA', name: 'Canada', languages: ['en', 'fr'], currencies: ['CAD'] },
  { code: 'SG', name: 'Singapore', languages: ['en'], currencies: ['SGD'] },
  { code: 'AE', name: 'UAE', languages: ['ar', 'en'], currencies: ['AED'] },
];

// Provider Component
export function RegionalProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<RegionalSettings>(() => {
    if (typeof window === 'undefined') {
      return {
        language: 'en',
        currency: 'USD',
        region: 'US',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: 'en-US',
      };
    }
    const saved = localStorage.getItem('regionalSettings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to auto-detect
      }
    }
    // Auto-detect region from browser
    const browserLang = navigator.language.split('-')[0];
    const detectedRegion = detectRegion();
    return {
      language: browserLang,
      currency: 'USD',
      region: detectedRegion,
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'en-US',
    };
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('regionalSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<RegionalSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <RegionalContext.Provider
      value={{
        settings,
        updateSettings,
        languages: LANGUAGES,
        currencies: CURRENCIES,
        regions: REGIONS,
      }}
    >
      {children}
    </RegionalContext.Provider>
  );
}

// Helper function to detect region
function detectRegion(): string {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (timezone.includes('America/New_York') || timezone.includes('America/Los_Angeles'))
    return 'US';
  if (timezone.includes('Europe/London')) return 'UK';
  if (timezone.includes('Europe/')) return 'EU';
  if (timezone.includes('Asia/Kolkata')) return 'IN';
  if (timezone.includes('Asia/Tokyo')) return 'JP';
  if (timezone.includes('Australia/')) return 'AU';
  if (timezone.includes('Asia/Dubai')) return 'AE';

  return 'US'; // Default
}

// Language Selector Component
export function LanguageSelector({ variant = 'dropdown' }: { variant?: 'dropdown' | 'inline' }) {
  const { settings, updateSettings, languages } = useRegional();
  const currentLanguage = languages.find((l) => l.code === settings.language);

  if (variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={settings.language === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateSettings({ language: lang.code })}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="mr-2 h-4 w-4" />
          <span className="mr-2">{currentLanguage?.flag}</span>
          {currentLanguage?.name || 'Language'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => updateSettings({ language: lang.code })}
            className={settings.language === lang.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            <div className="flex flex-col">
              <span>{lang.name}</span>
              <span className="text-muted-foreground text-xs">{lang.nativeName}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Currency Selector Component
export function CurrencySelector() {
  const { settings, updateSettings, currencies } = useRegional();
  const currentCurrency = currencies.find((c) => c.code === settings.currency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <DollarSign className="mr-2 h-4 w-4" />
          {currentCurrency?.code || 'Currency'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => updateSettings({ currency: currency.code })}
            className={settings.currency === currency.code ? 'bg-accent' : ''}
          >
            <span className="mr-2 font-bold">{currency.symbol}</span>
            <div className="flex flex-col">
              <span>{currency.code}</span>
              <span className="text-muted-foreground text-xs">{currency.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Region Selector Component
export function RegionSelector() {
  const { settings, updateSettings, regions } = useRegional();
  const currentRegion = regions.find((r) => r.code === settings.region);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MapPin className="mr-2 h-4 w-4" />
          {currentRegion?.name || 'Region'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Region</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {regions.map((region) => (
          <DropdownMenuItem
            key={region.code}
            onClick={() => {
              updateSettings({
                region: region.code,
                currency: region.currencies[0],
                language: region.languages[0],
              });
            }}
            className={settings.region === region.code ? 'bg-accent' : ''}
          >
            {region.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Combined Regional Settings Component
export function RegionalSettings() {
  return (
    <div className="flex items-center gap-2">
      <LanguageSelector />
      <CurrencySelector />
      <RegionSelector />
    </div>
  );
}

// Utility Hooks
export function useFormatCurrency() {
  const { settings, currencies } = useRegional();
  const currency = currencies.find((c) => c.code === settings.currency);

  return (amount: number) => {
    if (!currency) return amount.toString();
    return `${currency.symbol}${amount.toFixed(2)}`;
  };
}

export function useFormatDate() {
  const { settings } = useRegional();

  return (date: Date) => {
    return new Intl.DateTimeFormat(settings.numberFormat, {
      dateStyle: 'medium',
      timeZone: settings.timezone,
    }).format(date);
  };
}

export function useFormatNumber() {
  const { settings } = useRegional();

  return (num: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(settings.numberFormat, options).format(num);
  };
}

// Translation Hook (placeholder - would integrate with actual translation service)
export function useTranslation() {
  const { settings } = useRegional();

  return {
    t: (key: string) => {
      // Placeholder - in production would fetch from translation service
      return key;
    },
    language: settings.language,
  };
}
