import type { Chat, Message } from '../../types';
import { mockUsers } from './users';

const msg = (
  id: string,
  senderId: string,
  text: string,
  minutesAgo: number,
  isRead = true
): Message => ({
  id,
  senderId,
  text,
  isRead,
  createdAt: new Date(Date.now() - minutesAgo * 60000).toISOString(),
});

export const mockMessages: Record<string, Message[]> = {
  chat1: [
    msg('msg1', 'u1', 'Hey! Love your latest photos 🔥', 120, true),
    msg('msg2', 'me', 'Thanks so much! Means a lot coming from you', 115, true),
    msg('msg3', 'u1', 'That golden hour shot was insane. How did you get that light?', 110, true),
    msg('msg4', 'me', 'Just got lucky honestly, was in the right spot at the right time', 100, true),
    msg('msg5', 'u1', 'We should collab sometime!', 5, false),
  ],
  chat2: [
    msg('msg6', 'u2', 'Did you see my new collection? 🎨', 480, true),
    msg('msg7', 'me', 'Just checked it out! The colors are gorgeous', 470, true),
    msg('msg8', 'u2', 'Thank you!! Working on the next one already', 460, true),
    msg('msg9', 'u2', 'Sent you a link to an exclusive preview 👀', 30, false),
  ],
  chat3: [
    msg('msg10', 'u5', 'Made that ramen you suggested — life changing', 2880, true),
    msg('msg11', 'me', 'Haha told you!! Best comfort food ever', 2870, true),
    msg('msg12', 'u5', 'You should come to my next pop-up dinner', 1440, true),
  ],
};

export const mockChats: Chat[] = [
  {
    id: 'chat1',
    participant: mockUsers[0],
    lastMessage: mockMessages['chat1'][mockMessages['chat1'].length - 1],
    unreadCount: 1,
    updatedAt: mockMessages['chat1'][mockMessages['chat1'].length - 1].createdAt,
  },
  {
    id: 'chat2',
    participant: mockUsers[1],
    lastMessage: mockMessages['chat2'][mockMessages['chat2'].length - 1],
    unreadCount: 1,
    updatedAt: mockMessages['chat2'][mockMessages['chat2'].length - 1].createdAt,
  },
  {
    id: 'chat3',
    participant: mockUsers[4],
    lastMessage: mockMessages['chat3'][mockMessages['chat3'].length - 1],
    unreadCount: 0,
    updatedAt: mockMessages['chat3'][mockMessages['chat3'].length - 1].createdAt,
  },
];
