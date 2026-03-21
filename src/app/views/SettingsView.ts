import { View } from 'ostovjs';
import template from '../templates/settings.hbs';
import { t } from '../../shared/i18n';
import { AVAILABLE_MODELS } from '../models/SettingsModel';
import type SettingsModel from '../models/SettingsModel';

class SettingsView extends View {
  declare model: SettingsModel;
  private _status = '';
  private _statusType = '';

  constructor(options: { model: SettingsModel }) {
    super({
      ...options,
      tagName: 'div',
      className: 'settings',
      events: {
        'click [data-action=save]': 'onSave',
        'keydown #api-key': 'onKeydown',
        'change [data-action=change-model]': 'onChangeModel',
      },
    });
  }

  initialize() {
    this.listenTo(this.model, 'saved', this.onSaved);
    this.listenTo(this.model, 'loaded', this.render);
  }

  render() {
    const currentModel = this.model.get('model');
    (this.el as HTMLElement).innerHTML = template({
      apiKey: this.model.get('apiKey'),
      status: this._status,
      statusType: this._statusType,
      models: AVAILABLE_MODELS.map((m) => ({
        ...m,
        selected: m.id === currentModel,
      })),
    });
    return this;
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') this.onSave();
  }

  onSave() {
    const input = (this.el as HTMLElement).querySelector<HTMLInputElement>('#api-key');
    const key = input?.value.trim();

    if (!key) {
      this._status = t('app.settings.required');
      this._statusType = 'error';
      this.render();
      return;
    }

    this.model.set('apiKey', key);
    this.model.persist();
  }

  onChangeModel(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.model.set('model', value);
    this.model.persist();
  }

  onSaved() {
    this._status = t('app.settings.saved');
    this._statusType = 'saved';
    this.render();

    setTimeout(() => {
      this._status = '';
      this.render();
    }, 2000);
  }
}

export default SettingsView;
