import { Collection } from 'ostovjs';
import MessageModel, { type MessageAttributes } from './MessageModel';

class MessagesCollection extends Collection<MessageModel> {
  constructor(models?: MessageModel[], options?: Record<string, unknown>) {
    super(models, options);
    this.model = MessageModel;
  }

  toOpenAIFormat(): MessageAttributes[] {
    return this.models.map((msg) => ({
      role: msg.get('role'),
      content: msg.get('content'),
    }));
  }
}

export default MessagesCollection;
