interface PageData {
  title: string;
  url: string;
  content: string;
}

function extractPageContent(): string {
  // Use the broadest semantic container, not just the first article
  const containerSelectors = [
    '[role="main"]',
    'main',
    '#content',
    '.content',
  ];

  let contentEl: Element | null = null;

  for (const selector of containerSelectors) {
    contentEl = document.querySelector(selector);
    if (contentEl) break;
  }

  if (!contentEl) {
    contentEl = document.body;
  }

  const clone = contentEl.cloneNode(true) as HTMLElement;

  const removable = clone.querySelectorAll(
    'script, style, noscript, svg, nav, header, footer, aside, .sidebar, .nav, .menu, .ad, .advertisement, [role="navigation"], [role="banner"], [role="complementary"], [hidden]'
  );
  removable.forEach((el) => el.remove());

  return (clone.textContent || '').replace(/\s+/g, ' ').trim();
}

function getPageData(): PageData {
  return {
    title: document.title,
    url: window.location.href,
    content: extractPageContent(),
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'EXTRACT_CONTENT') {
    sendResponse(getPageData());
  }
});
