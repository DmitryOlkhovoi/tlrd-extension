import { View } from 'ostovjs';
import template from '../templates/language-selector.hbs';
import { SUMMARY_LANGUAGES, UI_LANGUAGES } from '../../shared/i18n/locales';
import type SettingsModel from '../models/SettingsModel';

class LanguageSelectorView extends View {
  declare model: SettingsModel;

  constructor(options: { model: SettingsModel }) {
    super({
      ...options,
      tagName: 'div',
      className: 'lang-selector',
      events: {
        'change [data-action=change-summary-lang]': 'onChangeSummaryLang',
        'change [data-action=change-ui-lang]': 'onChangeUiLang',
      },
    });
  }

  render() {
    const summaryLang = this.model.get('summaryLanguage');
    const uiLang = this.model.get('uiLanguage');

    (this.el as HTMLElement).innerHTML = template({
      summaryLanguages: SUMMARY_LANGUAGES.map((l) => ({
        ...l,
        selected: l.code === summaryLang,
      })),
      uiLanguages: UI_LANGUAGES.map((l) => ({
        ...l,
        selected: l.code === uiLang,
      })),
    });
    return this;
  }

  onChangeSummaryLang(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.model.set('summaryLanguage', value);
    this.model.persist();
  }

  onChangeUiLang(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.model.set('uiLanguage', value);
    this.model.persist();
    this.trigger('locale-changed', value);
  }
}

export default LanguageSelectorView;
