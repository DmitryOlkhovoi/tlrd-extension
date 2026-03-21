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

pageModel.set({ title: pageTitle, url: pageUrl }, { silent: true });

let appView: AppView | null = null;
let autoSummarized = false;

function tryAutoSummarize() {
  if (autoSummarized || !appView) return;
  if (!settingsModel.hasApiKey() || !pageModel.hasContent()) return;
  autoSummarized = true;
  appView.onSummarize();
}

chrome.storage.session.get('pendingPageContent').then((data) => {
  if (data.pendingPageContent) {
    pageModel.set('content', data.pendingPageContent);
    chrome.storage.session.remove('pendingPageContent');
    tryAutoSummarize();
  }
});

settingsModel.on('loaded', () => {
  setLocale(settingsModel.get('uiLanguage') as SupportedLocale);

  appView = new AppView({
    settingsModel,
    pageModel,
    messagesCollection,
  });
  appView.render();
  tryAutoSummarize();
});
