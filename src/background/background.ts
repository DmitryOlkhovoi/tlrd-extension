chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'OPEN_TLDR') {
    chrome.storage.session.set({ pendingPageContent: message.content }).then(() => {
      const params = new URLSearchParams({
        title: message.title || '',
        url: message.url || '',
      });

      chrome.tabs.create({
        url: chrome.runtime.getURL(`src/app/app.html?${params.toString()}`),
      });

      sendResponse({ ok: true });
    });

    return true; // keep message channel open for async sendResponse
  }
});
