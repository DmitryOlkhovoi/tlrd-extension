import type { SupportedLocale } from './locales';

// Chrome i18n uses underscores, our keys use dots
function keyToMessageName(key: string): string {
  return key.replace(/\./g, '_');
}

let overrideLocale: SupportedLocale | null = null;

// Fallback translations for when chrome.i18n is not available or locale override is active
let fallbackTranslations: Record<string, string> | null = null;

export async function setLocale(locale: SupportedLocale): Promise<void> {
  overrideLocale = locale;
  fallbackTranslations = null;

  try {
    const translations = await import(`./translations/${locale}.ts`);
    if (overrideLocale === locale) {
      fallbackTranslations = translations.default;
    }
  } catch {
    if (overrideLocale === locale) {
      fallbackTranslations = null;
    }
  }
}

export function getLocale(): SupportedLocale {
  if (overrideLocale) return overrideLocale;
  const uiLocale = chrome.i18n.getUILanguage().split('-')[0];
  return (uiLocale || 'en') as SupportedLocale;
}

export function t(key: string): string {
  const msgName = keyToMessageName(key);

  // If user has overridden the locale, use fallback translations
  if (overrideLocale && fallbackTranslations) {
    return fallbackTranslations[key] ?? (chrome.i18n.getMessage(msgName) || key);
  }

  // Default: use Chrome's i18n API
  return chrome.i18n.getMessage(msgName) || key;
}
