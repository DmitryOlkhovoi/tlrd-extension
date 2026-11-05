import { Model } from 'ostovjs';
import { isSummaryLanguage, isSupportedLocale } from '../../shared/i18n/locales';
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

  async load(): Promise<void> {
    try {
      const data = await chrome.storage.local.get(['apiKey', 'model', 'summaryLanguage', 'uiLanguage']);
      if (typeof data.apiKey === 'string') this.set('apiKey', data.apiKey, { silent: true });
      if (AVAILABLE_MODELS.some((model) => model.id === data.model)) {
        this.set('model', data.model as string, { silent: true });
      }
      if (isSummaryLanguage(data.summaryLanguage)) {
        this.set('summaryLanguage', data.summaryLanguage, { silent: true });
      }
      if (isSupportedLocale(data.uiLanguage)) {
        this.set('uiLanguage', data.uiLanguage, { silent: true });
      }
    } catch {
    } finally {
      this.trigger('loaded');
    }
  }

  async persist(): Promise<void> {
    try {
      await chrome.storage.local.set({
        apiKey: this.get('apiKey'),
        model: this.get('model'),
        summaryLanguage: this.get('summaryLanguage'),
        uiLanguage: this.get('uiLanguage'),
      });
      this.trigger('saved');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.trigger('save-error', message);
    }
  }

  hasApiKey(): boolean {
    return Boolean(this.get('apiKey'));
  }
}

export default SettingsModel;
