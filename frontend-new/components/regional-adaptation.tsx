'use client';

/**
 * Regional Adaptation Component
 *
 * Provides UI for regional customization:
 * - Language selector
 * - Currency selector
 * - Region-specific preferences
 * - Localized content display
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, DollarSign, MapPin, Settings } from 'lucide-react';

// Regional Context
interface RegionalContext {
  region: string;
  currency: string;
  language: string;
  setRegion: (region: string) => void;
  setCurrency: (currency: string) => void;
  setLanguage: (language: string) => void;
  formatCurrency: (amount: number) => string;
  translate: (key: string) => string;
}

const RegionalContext = createContext<RegionalContext | null>(null);

export function useRegionalContext() {
  const context = useContext(RegionalContext);
  if (!context) {
    throw new Error('useRegionalContext must be used within RegionalProvider');
  }
  return context;
}

// Available regions
const REGIONS = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    languages: ['en', 'hi', 'bn', 'te', 'mr', 'ta'],
  },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', languages: ['en', 'es'] },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', languages: ['en'] },
  {
    code: 'EU',
    name: 'European Union',
    flag: '🇪🇺',
    currency: 'EUR',
    languages: ['en', 'de', 'fr', 'es', 'it'],
  },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', languages: ['en'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', languages: ['en', 'fr'] },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    languages: ['en', 'zh', 'ms', 'ta'],
  },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', currency: 'AED', languages: ['en', 'ar'] },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', languages: ['ja', 'en'] },
];

// Available currencies
const CURRENCIES = [
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

// Available languages
const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
];

// Simple translations (in production, would use i18n library)
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'region.select': 'Select Region',
    'currency.select': 'Select Currency',
    'language.select': 'Select Language',
    'preferences.title': 'Regional Preferences',
    'preferences.description': 'Customize your experience',
    'region.current': 'Current Region',
    'currency.current': 'Current Currency',
    'language.current': 'Current Language',
    'save.preferences': 'Save Preferences',
    'reset.defaults': 'Reset to Defaults',
  },
  hi: {
    'region.select': 'क्षेत्र चुनें',
    'currency.select': 'मुद्रा चुनें',
    'language.select': 'भाषा चुनें',
    'preferences.title': 'क्षेत्रीय प्राथमिकताएं',
    'preferences.description': 'अपने अनुभव को अनुकूलित करें',
  },
};

// Regional Provider Component
export function RegionalProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState('IN');
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('en');

  // Load preferences from localStorage
  useEffect(() => {
    // Effect only for subscribing to changes, initial load handled by useState
  }, []);

  // Save preferences to localStorage
  const handleSetRegion = (newRegion: string) => {
    setRegion(newRegion);
    if (typeof window !== 'undefined') {
      localStorage.setItem('regional-preferences-region', newRegion);
    }
  };

  const handleSetCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('regional-preferences-currency', newCurrency);
    }
  };

  const handleSetLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('regional-preferences-language', newLanguage);
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    const currencyData = CURRENCIES.find((c) => c.code === currency);
    if (!currencyData) return `${amount}`;

    return `${currencyData.symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Translate
  const translate = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const value: RegionalContext = {
    region,
    currency,
    language,
    setRegion: handleSetRegion,
    setCurrency: handleSetCurrency,
    setLanguage: handleSetLanguage,
    formatCurrency,
    translate,
  };

  return <RegionalContext.Provider value={value}>{children}</RegionalContext.Provider>;
}

// Region Selector Component
export function RegionSelector({ className }: { className?: string }) {
  const { region, setRegion } = useRegionalContext();

  return (
    <Select value={region} onValueChange={setRegion}>
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {REGIONS.map((r) => (
          <SelectItem key={r.code} value={r.code}>
            <div className="flex items-center gap-2">
              <span>{r.flag}</span>
              <span>{r.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Currency Selector Component
export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency } = useRegionalContext();

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <div className="flex items-center gap-2">
              <span>{c.symbol}</span>
              <span>{c.name}</span>
              <Badge variant="outline">{c.code}</Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Language Selector Component
export function LanguageSelector({ className }: { className?: string }) {
  const { language, setLanguage } = useRegionalContext();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            <div className="flex items-center gap-2">
              <span>{l.nativeName}</span>
              <Badge variant="outline">{l.code}</Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Regional Preferences Panel
export function RegionalPreferencesPanel() {
  const { region, currency, language, translate } = useRegionalContext();

  const currentRegion = REGIONS.find((r) => r.code === region);
  const currentCurrency = CURRENCIES.find((c) => c.code === currency);
  const currentLanguage = LANGUAGES.find((l) => l.code === language);

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('regional-preferences-region');
      localStorage.removeItem('regional-preferences-currency');
      localStorage.removeItem('regional-preferences-language');
      window.location.reload();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>{translate('preferences.title')}</CardTitle>
        </div>
        <CardDescription>{translate('preferences.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Settings */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              {translate('region.current')}
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">{currentRegion?.flag}</span>
              <span>{currentRegion?.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              {translate('currency.current')}
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xl">{currentCurrency?.symbol}</span>
              <span>{currentCurrency?.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              {translate('language.current')}
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span>{currentLanguage?.nativeName}</span>
              <Badge variant="outline">{currentLanguage?.code.toUpperCase()}</Badge>
            </div>
          </div>
        </div>

        {/* Selectors */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">{translate('region.select')}</label>
            <RegionSelector />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{translate('currency.select')}</label>
            <CurrencySelector />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{translate('language.select')}</label>
            <LanguageSelector />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleReset} variant="outline">
            {translate('reset.defaults')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact Regional Toolbar (for header/navbar)
export function RegionalToolbar({ className }: { className?: string }) {
  const { region, currency, language } = useRegionalContext();

  const currentRegion = REGIONS.find((r) => r.code === region);
  const currentCurrency = CURRENCIES.find((c) => c.code === currency);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs">
        <span>{currentRegion?.flag}</span>
        <span className="hidden sm:inline">{currentRegion?.code}</span>
      </div>

      <div className="bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs">
        <span>{currentCurrency?.symbol}</span>
        <span className="hidden sm:inline">{currentCurrency?.code}</span>
      </div>

      <div className="bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs">
        <Globe className="h-3 w-3" />
        <span className="hidden sm:inline">{language.toUpperCase()}</span>
      </div>
    </div>
  );
}

// Hook to format prices with current currency
export function useFormattedPrice() {
  const { formatCurrency } = useRegionalContext();
  return formatCurrency;
}

// Hook to get current region data
export function useCurrentRegion() {
  const { region } = useRegionalContext();
  return REGIONS.find((r) => r.code === region);
}

// Export all region data for use in other components
export { REGIONS, CURRENCIES, LANGUAGES };
