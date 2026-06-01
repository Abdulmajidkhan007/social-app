import type { StoryGroup, Story } from '../../types';
import { mockUsers } from './users';

const makeStory = (
  id: string,
  user: (typeof mockUsers)[0],
  seed: string,
  isViewed: boolean
): Story => ({
  id,
  author: user,
  media: {
    id: `sm${id}`,
    uri: `https://picsum.photos/seed/${seed}/400/700`,
    type: 'image',
    width: 400,
    height: 700,
  },
  duration: 5000,
  isViewed,
  viewsCount: Math.floor(Math.random() * 5000) + 100,
  createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
  expiresAt: new Date(Date.now() + 86400000).toISOString(),
});

export const mockStoryGroups: StoryGroup[] = [
  {
    user: mockUsers[0],
    stories: [
      makeStory('s1', mockUsers[0], 'story1a', false),
      makeStory('s2', mockUsers[0], 'story1b', false),
    ],
    hasUnviewed: true,
  },
  {
    user: mockUsers[1],
    stories: [makeStory('s3', mockUsers[1], 'story2a', false)],
    hasUnviewed: true,
  },
  {
    user: mockUsers[2],
    stories: [
      makeStory('s4', mockUsers[2], 'story3a', true),
      makeStory('s5', mockUsers[2], 'story3b', true),
    ],
    hasUnviewed: false,
  },
  {
    user: mockUsers[3],
    stories: [makeStory('s6', mockUsers[3], 'story4a', false)],
    hasUnviewed: true,
  },
  {
    user: mockUsers[4],
    stories: [makeStory('s7', mockUsers[4], 'story5a', true)],
    hasUnviewed: false,
  },
  {
    user: mockUsers[5],
    stories: [makeStory('s8', mockUsers[5], 'story6a', false)],
    hasUnviewed: true,
  },
];
