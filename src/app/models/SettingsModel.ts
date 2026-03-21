import { Model } from 'ostovjs';
import type { SupportedLocale, SummaryLanguage } from '../../shared/i18n/locales';

interface SettingsAttributes {
  apiKey: string;
  model: string;
  summaryLanguage: SummaryLanguage;
  uiLanguage: SupportedLocale;
}

export const AVAILABLE_MODELS = [
  { id: 'gpt-5.4', label: 'GPT-5.4' },
  { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini' },
  { id: 'gpt-5.4-nano', label: 'GPT-5.4 Nano' },
  { id: 'gpt-4.1', label: 'GPT-4.1' },
  { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { id: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
  { id: 'o3-mini', label: 'o3-mini' },
];

class SettingsModel extends Model<SettingsAttributes> {
  defaults() {
    return {
      apiKey: '',
      model: 'gpt-5.4-mini',
      summaryLanguage: 'original' as SummaryLanguage,
      uiLanguage: 'en' as SupportedLocale,
    };
  }

  initialize() {
    this.load();
  }

  load(): void {
    chrome.storage.local.get(['apiKey', 'model', 'summaryLanguage', 'uiLanguage']).then((data) => {
      if (data.apiKey) this.set('apiKey', data.apiKey as string, { silent: true });
      if (data.model) this.set('model', data.model as string, { silent: true });
      if (data.summaryLanguage) this.set('summaryLanguage', data.summaryLanguage as SummaryLanguage, { silent: true });
      if (data.uiLanguage) this.set('uiLanguage', data.uiLanguage as SupportedLocale, { silent: true });
      this.trigger('loaded');
    });
  }

  persist(): void {
    chrome.storage.local.set({
      apiKey: this.get('apiKey'),
      model: this.get('model'),
      summaryLanguage: this.get('summaryLanguage'),
      uiLanguage: this.get('uiLanguage'),
    }).then(() => {
      this.trigger('saved');
    });
  }

  hasApiKey(): boolean {
    return Boolean(this.get('apiKey'));
  }
}

export default SettingsModel;
