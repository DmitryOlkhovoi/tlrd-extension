import { View } from 'ostovjs';
import template from '../templates/chat.hbs';
import MessageView from './MessageView';
import type MessageModel from '../models/MessageModel';
import type MessagesCollection from '../models/MessagesCollection';

class ChatView extends View {
  declare collection: MessagesCollection;
  private _disabled = false;
  private _lastMessageView: MessageView | null = null;

  constructor(options: { collection: MessagesCollection }) {
    super({
      ...options,
      tagName: 'div',
      className: 'chat',
      events: {
        'click [data-action=send]': 'onSend',
        'keydown [data-input=question]': 'onKeydown',
      },
    });
  }

  initialize() {
    this.listenTo(this.collection, 'add', this.onMessageAdded);
  }

  render() {
    const el = this.el as HTMLElement;
    el.innerHTML = template({
      hasMessages: this.collection.length > 0,
      disabled: this._disabled,
    });

    const messagesEl = el.querySelector('[data-region=messages]')!;
    this.collection.models.forEach((msg: MessageModel) => {
      const view = new MessageView({ model: msg });
      messagesEl.appendChild(view.render().el as HTMLElement);
    });

    return this;
  }

  onMessageAdded(msg: MessageModel) {
    const el = this.el as HTMLElement;
    const messagesEl = el.querySelector('[data-region=messages]')!;
    const emptyEl = messagesEl.querySelector('.chat__empty');
    if (emptyEl) emptyEl.remove();

    const view = new MessageView({ model: msg });
    messagesEl.appendChild(view.render().el as HTMLElement);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    this._lastMessageView = view;
  }

  getLastMessageView(): MessageView | null {
    return this._lastMessageView;
  }

  scrollToBottom() {
    const el = this.el as HTMLElement;
    const messagesEl = el.querySelector('[data-region=messages]');
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.onSend();
    }
  }

  onSend() {
    if (this._disabled) return;

    const el = this.el as HTMLElement;
    const input = el.querySelector<HTMLTextAreaElement>('[data-input=question]');
    const question = input?.value.trim();
    if (!question) return;

    if (input) input.value = '';
    this.trigger('ask', question);
  }

  setDisabled(disabled: boolean) {
    this._disabled = disabled;
    const el = this.el as HTMLElement;
    const input = el.querySelector<HTMLTextAreaElement>('[data-input=question]');
    const btn = el.querySelector<HTMLButtonElement>('[data-action=send]');
    if (input) input.disabled = disabled;
    if (btn) btn.disabled = disabled;
  }
}

export default ChatView;
