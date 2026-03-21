import { View } from 'ostovjs';
import template from '../templates/app-header.hbs';
import SettingsView from './SettingsView';
import TldrView from './TldrView';
import ChatView from './ChatView';
import LanguageSelectorView from './LanguageSelectorView';
import OpenAIService from '../services/openai';
import { setLocale } from '../../shared/i18n';
import type { SupportedLocale } from '../../shared/i18n/locales';
import type SettingsModel from '../models/SettingsModel';
import type PageModel from '../models/PageModel';
import type MessagesCollection from '../models/MessagesCollection';

interface AppViewOptions {
  settingsModel: SettingsModel;
  pageModel: PageModel;
  messagesCollection: MessagesCollection;
}

class AppView extends View {
  private settingsModel!: SettingsModel;
  declare pageModel: PageModel;
  private messagesCollection!: MessagesCollection;
  private openai!: OpenAIService;
  private settingsView!: SettingsView;
  private tldrView!: TldrView;
  private chatView!: ChatView;
  private langSelectorView!: LanguageSelectorView;
  private _settingsVisible = false;

  constructor(options: AppViewOptions) {
    super({
      ...options,
      el: '#app',
      events: {
        'click [data-action=summarize]': 'onSummarize',
        'click [data-action=toggle-settings]': 'onToggleSettings',
      },
    });
  }

  initialize(options: AppViewOptions) {
    this.settingsModel = options.settingsModel;
    this.pageModel = options.pageModel;
    this.messagesCollection = options.messagesCollection;

    this.openai = new OpenAIService(this.settingsModel);

    this.settingsView = new SettingsView({ model: this.settingsModel });
    this.tldrView = new TldrView({ model: this.pageModel });
    this.chatView = new ChatView({ collection: this.messagesCollection });
    this.langSelectorView = new LanguageSelectorView({ model: this.settingsModel });

    this.listenTo(this.chatView, 'ask', this.onAskQuestion);
    this.listenTo(this.settingsModel, 'saved', this.onSettingsSaved);
    this.listenTo(this.langSelectorView, 'locale-changed', this.onLocaleChanged);

    this._settingsVisible = !this.settingsModel.hasApiKey();
  }

  render() {
    this._settingsVisible = !this.settingsModel.hasApiKey();

    const el = this.el as HTMLElement;
    el.innerHTML = template({
      hasApiKey: this.settingsModel.hasApiKey(),
      settingsVisible: this._settingsVisible,
      hasTldr: this.pageModel.hasTldr(),
    });

    el.querySelector('[data-region=settings]')!.appendChild(
      this.settingsView.render().el as HTMLElement
    );
    el.querySelector('[data-region=tldr]')!.appendChild(
      this.tldrView.render().el as HTMLElement
    );
    el.querySelector('[data-region=chat]')!.appendChild(
      this.chatView.render().el as HTMLElement
    );
    el.querySelector('[data-region=lang-selector]')!.appendChild(
      this.langSelectorView.render().el as HTMLElement
    );

    return this;
  }

  onSettingsSaved() {
    const el = this.el as HTMLElement;
    const btn = el.querySelector<HTMLButtonElement>('[data-action=summarize]');
    if (btn) btn.disabled = !this.settingsModel.hasApiKey();
  }

  onLocaleChanged(locale: string) {
    setLocale(locale as SupportedLocale);
    this.render();
  }

  onToggleSettings() {
    this._settingsVisible = !this._settingsVisible;
    const el = this.el as HTMLElement;
    const settingsRegion = el.querySelector<HTMLElement>('[data-region=settings]')!;
    settingsRegion.style.display = this._settingsVisible ? '' : 'none';
  }

  async onSummarize() {
    const el = this.el as HTMLElement;

    if (!this.settingsModel.hasApiKey()) {
      this._settingsVisible = true;
      el.querySelector<HTMLElement>('[data-region=settings]')!.style.display = '';
      return;
    }

    if (this.pageModel.get('loading')) return;

    if (!this.pageModel.hasContent()) {
      this.pageModel.set('error', 'No page content available. Open this from the extension popup.');
      return;
    }

    this.pageModel.set({ loading: true, error: '', tldr: '' });

    try {
      const language = this.settingsModel.get('summaryLanguage');
      const tldr = await this.openai.generateTldrStream(
        this.pageModel.get('content'),
        this.pageModel.get('title'),
        language,
        (text) => {
          if (this.pageModel.get('loading')) {
            this.pageModel.set({ loading: false, tldr: text }, { silent: true });
            this.tldrView.render();
          } else {
            this.tldrView.updateContent(text);
          }
        }
      );
      this.pageModel.set({ tldr, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.pageModel.set({ error: message, loading: false });
    }
  }

  async onAskQuestion(question: string) {
    this.messagesCollection.add({ role: 'user', content: question });
    this.chatView.setDisabled(true);

    const assistantMsg = this.messagesCollection.add({ role: 'assistant', content: '...' });

    try {
      const language = this.settingsModel.get('summaryLanguage');
      const messagesForApi = this.messagesCollection.toOpenAIFormat().slice(0, -1);

      const answer = await this.openai.askFollowUpStream(
        messagesForApi,
        this.pageModel.get('content'),
        this.pageModel.get('tldr'),
        language,
        (text) => {
          (assistantMsg as any).set('content', text, { silent: true });
          const lastView = this.chatView.getLastMessageView();
          if (lastView) lastView.updateContent(text);
          this.chatView.scrollToBottom();
        }
      );
      (assistantMsg as any).set('content', answer);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      (assistantMsg as any).set('content', `Error: ${message}`);
    }

    this.chatView.setDisabled(false);
    const el = this.el as HTMLElement;
    el.querySelector<HTMLTextAreaElement>('[data-input=question]')?.focus();
  }
}

export default AppView;
