import './popup.css';
import { t, setLocale } from '../shared/i18n';
import type { SupportedLocale } from '../shared/i18n/locales';

const settingsSection = document.getElementById('settings-section')!;
const readySection = document.getElementById('ready-section')!;
const apiKeyInput = document.getElementById('api-key-input') as HTMLInputElement;
const saveKeyBtn = document.getElementById('save-key-btn')!;
const keyStatus = document.getElementById('key-status')!;
const summarizeBtn = document.getElementById('summarize-btn') as HTMLButtonElement;
const status = document.getElementById('status')!;
const toggleSettingsBtn = document.getElementById('toggle-settings-btn')!;

function translateUI() {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n!);
  });
}

function showSection(hasKey: boolean) {
  settingsSection.style.display = hasKey ? 'none' : '';
  readySection.style.display = hasKey ? '' : 'none';
}

async function init() {
  const data = await chrome.storage.local.get(['apiKey', 'uiLanguage']);
  const uiLang = (data.uiLanguage || 'en') as SupportedLocale;
  setLocale(uiLang);
  translateUI();
  showSection(Boolean(data.apiKey));
}

saveKeyBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    keyStatus.textContent = t('popup.apiKey.required');
    keyStatus.className = 'popup__status popup__status--error';
    return;
  }

  await chrome.storage.local.set({ apiKey: key });
  keyStatus.textContent = t('popup.apiKey.saved');
  keyStatus.className = 'popup__status popup__status--saved';
  setTimeout(() => showSection(true), 500);
});

apiKeyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveKeyBtn.click();
});

toggleSettingsBtn.addEventListener('click', () => {
  const isVisible = settingsSection.style.display !== 'none';
  settingsSection.style.display = isVisible ? 'none' : '';
});

async function extractContent(tabId: number): Promise<PageData> {
  // Inject content script
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js'],
  });

  // Retry sending message — script may not have registered listener yet
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await chrome.tabs.sendMessage(tabId, { type: 'EXTRACT_CONTENT' });
      if (response?.content) return response as PageData;
    } catch {
      // listener not ready yet
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  throw new Error(t('error.noContent'));
}

interface PageData {
  title: string;
  url: string;
  content: string;
}

summarizeBtn.addEventListener('click', async () => {
  summarizeBtn.disabled = true;
  status.textContent = t('popup.status.extracting');
  status.className = 'popup__status';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error(t('error.noTab'));
    }

    const response = await extractContent(tab.id);

    chrome.runtime.sendMessage({
      type: 'OPEN_TLDR',
      title: response.title,
      url: response.url,
      content: response.content,
    });

    window.close();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    status.textContent = message;
    status.className = 'popup__status popup__status--error';
    summarizeBtn.disabled = false;
  }
});

init();
