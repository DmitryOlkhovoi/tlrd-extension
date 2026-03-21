chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'OPEN_TLDR') {
    chrome.storage.session.set({ pendingPageContent: message.content }).then(() => {
      const params = new URLSearchParams({
        title: message.title || '',
        url: message.url || '',
      });

      chrome.tabs.create({
        url: chrome.runtime.getURL(`src/app/app.html?${params.toString()}`),
      });
    });
  }
});
