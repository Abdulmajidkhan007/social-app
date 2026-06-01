import type { Comment } from '../../types';
import { mockUsers } from './users';

export const mockComments: Record<string, Comment[]> = {
  p1: [
    {
      id: 'c1',
      author: mockUsers[1],
      text: 'Absolutely stunning! The light is incredible 😍',
      likesCount: 47,
      isLiked: false,
      replies: [
        {
          id: 'c1r1',
          author: mockUsers[0],
          text: 'Thank you so much! 🙏 Caught it just in time',
          likesCount: 12,
          isLiked: false,
          createdAt: '2026-05-31T19:00:00Z',
        },
      ],
      createdAt: '2026-05-31T18:45:00Z',
    },
    {
      id: 'c2',
      author: mockUsers[2],
      text: 'This is why I wake up early 🌅',
      likesCount: 23,
      isLiked: true,
      createdAt: '2026-05-31T19:10:00Z',
    },
    {
      id: 'c3',
      author: mockUsers[4],
      text: 'What camera were you shooting with?',
      likesCount: 8,
      isLiked: false,
      createdAt: '2026-05-31T20:00:00Z',
    },
    {
      id: 'c4',
      author: mockUsers[3],
      text: 'The colors!! 🧡🌅 Saved this immediately',
      likesCount: 34,
      isLiked: false,
      createdAt: '2026-05-31T20:30:00Z',
    },
  ],
  p2: [
    {
      id: 'c5',
      author: mockUsers[2],
      text: 'This collection is fire 🔥 The second piece is my favorite',
      likesCount: 56,
      isLiked: false,
      createdAt: '2026-05-31T14:30:00Z',
    },
    {
      id: 'c6',
      author: mockUsers[5],
      text: 'As a fellow artist, the composition here is chef\'s kiss 👌',
      likesCount: 29,
      isLiked: true,
      createdAt: '2026-05-31T15:00:00Z',
    },
  ],
};

export const getCommentsForPost = (postId: string): Comment[] =>
  mockComments[postId] ?? [];
