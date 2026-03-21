import type SettingsModel from '../models/SettingsModel';
import type { MessageAttributes } from '../models/MessageModel';
import type { SummaryLanguage } from '../../shared/i18n/locales';
import { LANGUAGE_NAMES } from '../../shared/i18n/locales';

function getLanguageInstruction(language: SummaryLanguage): string {
  if (language === 'original') {
    return 'Respond in the same language as the page content.';
  }
  return `Respond in ${LANGUAGE_NAMES[language]}.`;
}

function getTldrSystemPrompt(language: SummaryLanguage): string {
  return `You are a concise summarizer. Given the text content of a web page, produce a clear and informative TLDR summary.

If the page is a single article or post: focus on the key points, main arguments, and important details. Aim for 3-6 sentences.

If the page is a list of posts, a feed, or an index page: provide a brief overview of what the page contains, mention the main topics and notable items. Don't summarize only the first post — cover the whole page.

Use plain language. ${getLanguageInstruction(language)}`;
}

function getChatSystemPrompt(language: SummaryLanguage): string {
  const langInstruction = language === 'original'
    ? 'Respond in the same language as the TLDR summary above.'
    : `Respond in ${LANGUAGE_NAMES[language]}.`;
  return `You are a helpful assistant discussing a web page the user just read. You have access to the page content and its TLDR summary. Answer follow-up questions about the content clearly and concisely. ${langInstruction}`;
}

interface ChatMessage {
  role: string;
  content: string;
}

class OpenAIService {
  private settings: SettingsModel;

  constructor(settingsModel: SettingsModel) {
    this.settings = settingsModel;
  }

  async generateTldrStream(
    pageContent: string,
    pageTitle: string,
    language: SummaryLanguage,
    onChunk: (text: string) => void
  ): Promise<string> {
    const messages: ChatMessage[] = [
      { role: 'system', content: getTldrSystemPrompt(language) },
      {
        role: 'user',
        content: `Page title: "${pageTitle}"\n\nPage content:\n${pageContent.slice(0, 12000)}`,
      },
    ];

    return this._chatStream(messages, onChunk);
  }

  async askFollowUpStream(
    chatMessages: MessageAttributes[],
    pageContent: string,
    pageTldr: string,
    language: SummaryLanguage,
    onChunk: (text: string) => void
  ): Promise<string> {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `${getChatSystemPrompt(language)}\n\nPage TLDR:\n${pageTldr}\n\nFull page content (truncated):\n${pageContent.slice(0, 8000)}`,
    };

    return this._chatStream([systemMessage, ...chatMessages], onChunk);
  }

  private async _chatStream(
    messages: ChatMessage[],
    onChunk: (text: string) => void
  ): Promise<string> {
    const apiKey = this.settings.get('apiKey');
    if (!apiKey) throw new Error('API key not configured');

    const model = this.settings.get('model');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, stream: true }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI API error: ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            onChunk(fullText);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }

    return fullText;
  }
}

export default OpenAIService;
