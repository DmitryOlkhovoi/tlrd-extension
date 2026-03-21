import { View } from 'ostovjs';
import template from '../templates/message.hbs';
import { t } from '../../shared/i18n';
import type MessageModel from '../models/MessageModel';

class MessageView extends View {
  declare model: MessageModel;

  constructor(options: { model: MessageModel }) {
    const role = options.model.get('role');
    super({
      ...options,
      tagName: 'div',
      className: `message message--${role}`,
    });
  }

  render() {
    const role = this.model.get('role');
    (this.el as HTMLElement).innerHTML = template({
      roleLabel: role === 'user' ? t('app.chat.role.user') : t('app.chat.role.assistant'),
      content: this.model.get('content'),
    });
    return this;
  }

  updateContent(text: string) {
    const bubble = (this.el as HTMLElement).querySelector('.message__bubble');
    if (bubble) bubble.textContent = text;
  }
}

export default MessageView;
