import { Model } from 'ostovjs';

export interface MessageAttributes {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class MessageModel extends Model<MessageAttributes> {
  defaults() {
    return {
      role: 'user' as const,
      content: '',
    };
  }
}

export default MessageModel;
