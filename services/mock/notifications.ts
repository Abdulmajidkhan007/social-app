import type { Notification } from '../../types';
import { mockUsers } from './users';
import { mockPosts } from './posts';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    actor: mockUsers[0],
    post: { id: mockPosts[5].id, media: mockPosts[5].media },
    message: 'liked your photo',
    isRead: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'n2',
    type: 'follow',
    actor: mockUsers[2],
    message: 'started following you',
    isRead: false,
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'n3',
    type: 'comment',
    actor: mockUsers[1],
    post: { id: mockPosts[0].id, media: mockPosts[0].media },
    message: 'commented: "Absolutely stunning! The light is incredible 😍"',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'n4',
    type: 'like',
    actor: mockUsers[3],
    post: { id: mockPosts[1].id, media: mockPosts[1].media },
    message: 'liked your photo',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n5',
    type: 'mention',
    actor: mockUsers[4],
    post: { id: mockPosts[2].id, media: mockPosts[2].media },
    message: 'mentioned you in a comment',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'n6',
    type: 'follow',
    actor: mockUsers[5],
    message: 'started following you',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'n7',
    type: 'like',
    actor: mockUsers[1],
    post: { id: mockPosts[3].id, media: mockPosts[3].media },
    message: 'and 47 others liked your photo',
    isRead: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];
