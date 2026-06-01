import { create } from 'zustand';
import type { Chat, Message } from '../types';

interface MessagesStore {
  chats: Chat[];
  messages: Record<string, Message[]>;
  isLoading: boolean;
  setChats: (chats: Chat[]) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  appendMessage: (chatId: string, message: Message) => void;
  markChatRead: (chatId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMessagesStore = create<MessagesStore>((set) => ({
  chats: [],
  messages: {},
  isLoading: false,
  setChats: (chats) => set({ chats }),
  setMessages: (chatId, messages) =>
    set((s) => ({ messages: { ...s.messages, [chatId]: messages } })),
  appendMessage: (chatId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [chatId]: [...(s.messages[chatId] ?? []), message],
      },
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, lastMessage: message, unreadCount: 0 } : c
      ),
    })),
  markChatRead: (chatId) =>
    set((s) => ({
      chats: s.chats.map((c) =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
