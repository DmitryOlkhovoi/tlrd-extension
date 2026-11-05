import Handlebars from 'handlebars/runtime';
import { t, setLocale } from '../shared/i18n';
import type { SupportedLocale } from '../shared/i18n/locales';
import SettingsModel from './models/SettingsModel';
import PageModel from './models/PageModel';
import MessagesCollection from './models/MessagesCollection';
import AppView from './views/AppView';
import './styles/input.css';

Handlebars.registerHelper('t', (key: string) => t(key));

const settingsModel = new SettingsModel();
const pageModel = new PageModel();
const messagesCollection = new MessagesCollection();

const params = new URLSearchParams(window.location.search);
const pageTitle = params.get('title') || '';
const pageUrl = params.get('url') || '';
const pendingContentKey = params.get('contentKey') || 'pendingPageContent';

pageModel.set({ title: pageTitle, url: pageUrl }, { silent: true });

let appView: AppView | null = null;
let autoSummarized = false;

function tryAutoSummarize() {
  if (autoSummarized || !appView) return;
  if (!settingsModel.hasApiKey() || !pageModel.hasContent()) return;
  autoSummarized = true;
  appView.onSummarize();
}

chrome.storage.session.get(pendingContentKey).then((data) => {
  if (data[pendingContentKey]) {
    pageModel.set('content', data[pendingContentKey] as string);
    chrome.storage.session.remove(pendingContentKey);
    tryAutoSummarize();
  }
}).catch((err) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  pageModel.set('error', message);
});

settingsModel.on('loaded', async () => {
  await setLocale(settingsModel.get('uiLanguage') as SupportedLocale);

  appView = new AppView({
    settingsModel,
    pageModel,
    messagesCollection,
  });
  appView.render();
  tryAutoSummarize();
});
