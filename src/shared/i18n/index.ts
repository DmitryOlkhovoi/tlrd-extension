import en from './translations/en';
import zh from './translations/zh';
import es from './translations/es';
import hi from './translations/hi';
import ar from './translations/ar';
import fr from './translations/fr';
import pt from './translations/pt';
import ru from './translations/ru';
import ja from './translations/ja';
import de from './translations/de';
import type { SupportedLocale } from './locales';

const translations: Record<SupportedLocale, Record<string, string>> = {
  en, zh, es, hi, ar, fr, pt, ru, ja, de,
};

let currentLocale: SupportedLocale = 'en';

export function setLocale(locale: SupportedLocale): void {
  currentLocale = locale;
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function t(key: string): string {
  return translations[currentLocale]?.[key] ?? translations['en'][key] ?? key;
}
