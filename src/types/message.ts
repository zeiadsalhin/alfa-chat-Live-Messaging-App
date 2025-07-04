// types/message.ts
export type MessageStatus = 'sent' | 'delivered' | 'seen';

export type ChatMessage = {
  id: string;
  type: 'text' | 'audio';
  content: string;
  userId: string;
  username: string;
  timestamp: number;
  avatar: string;
  status?: MessageStatus;
};
