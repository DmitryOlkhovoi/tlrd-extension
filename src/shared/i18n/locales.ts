export type SupportedLocale = 'en' | 'zh' | 'es' | 'hi' | 'ar' | 'fr' | 'pt' | 'ru' | 'ja' | 'de';
export type SummaryLanguage = SupportedLocale | 'original';

export interface LanguageOption {
  code: string;
  nativeLabel: string;
}

export const SUMMARY_LANGUAGES: LanguageOption[] = [
  { code: 'original', nativeLabel: 'Original' },
  { code: 'en', nativeLabel: 'English' },
  { code: 'zh', nativeLabel: '中文' },
  { code: 'es', nativeLabel: 'Español' },
  { code: 'hi', nativeLabel: 'हिन्दी' },
  { code: 'ar', nativeLabel: 'العربية' },
  { code: 'fr', nativeLabel: 'Français' },
  { code: 'pt', nativeLabel: 'Português' },
  { code: 'ru', nativeLabel: 'Русский' },
  { code: 'ja', nativeLabel: '日本語' },
  { code: 'de', nativeLabel: 'Deutsch' },
];

export const UI_LANGUAGES: LanguageOption[] = SUMMARY_LANGUAGES.filter((l) => l.code !== 'original');

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Chinese',
  es: 'Spanish',
  hi: 'Hindi',
  ar: 'Arabic',
  fr: 'French',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  de: 'German',
};
