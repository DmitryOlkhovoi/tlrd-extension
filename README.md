# TLDR - AI Page Summarizer

A Chrome extension that generates concise TLDR summaries of any web page using OpenAI. Ask follow-up questions in a dedicated tab with full chat interface.

## Features

- **Instant TLDR** - One-click page summarization with streaming output
- **Follow-up Chat** - Ask questions about the page content in a conversational interface
- **Multi-language** - Summarize in 10 languages: English, Chinese, Spanish, Hindi, Arabic, French, Portuguese, Russian, Japanese, German
- **Localized UI** - Full interface translation for all supported languages
- **Model Selection** - Choose from GPT-5.4, GPT-5.4 Mini, GPT-5.4 Nano, GPT-4.1 family, and o3-mini
- **Streaming** - Responses appear in real-time as they're generated
- **Auto-summarize** - Opens a dedicated tab and starts summarizing immediately

## Architecture

Built with [OstovJS](https://ostovjs.org/) (Backbone-like MVC framework), Handlebars templates (precompiled at build time), and Tailwind CSS with BEM methodology.

```
src/
  app/                    # Main application (opens in new tab)
    models/               # OstovJS Models (Settings, Page, Message, Collection)
    views/                # OstovJS Views (App, Settings, TLDR, Chat, Message, LanguageSelector)
    templates/            # Handlebars templates (.hbs)
    styles/               # Tailwind CSS + BEM (@apply approach)
    services/             # OpenAI API service with streaming
  popup/                  # Extension popup (API key + summarize button)
  background/             # Service worker
  content/                # Content script (page text extraction)
  shared/
    i18n/                 # Internationalization (10 languages)
```

## Setup

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode (rebuild on changes)
npm run dev

# Type check
npm run typecheck
```

## Install in Chrome

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder
5. Click the extension icon, enter your [OpenAI API key](https://platform.openai.com/api-keys)
6. Navigate to any page and click **Summarize**

## Tech Stack

- **Framework** - [OstovJS](https://ostovjs.org/) (Models, Views, Collections, Events)
- **Templates** - Handlebars (precompiled, CSP-safe)
- **Styling** - Tailwind CSS 3 + BEM + `@apply`
- **Language** - TypeScript
- **Bundler** - Vite
- **API** - OpenAI Chat Completions (streaming)
- **Platform** - Chrome Extension Manifest V3

## License

MIT
