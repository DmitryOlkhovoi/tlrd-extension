chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'OPEN_TLDR') {
    (async () => {
      try {
        await chrome.storage.session.set({ pendingPageContent: message.content });
        const params = new URLSearchParams({
          title: message.title || '',
          url: message.url || '',
        });

        await chrome.tabs.create({
          url: chrome.runtime.getURL(`src/app/app.html?${params.toString()}`),
        });

        sendResponse({ ok: true });
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        sendResponse({ ok: false, error });
      }
    })();

    return true; // keep message channel open for async sendResponse
  }
});
