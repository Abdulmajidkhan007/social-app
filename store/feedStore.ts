import { create } from 'zustand';
import type { Post, StoryGroup } from '../types';

interface FeedStore {
  posts: Post[];
  storyGroups: StoryGroup[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  cursor?: string;
  setPosts: (posts: Post[]) => void;
  appendPosts: (posts: Post[]) => void;
  setStoryGroups: (groups: StoryGroup[]) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setHasMore: (hasMore: boolean, cursor?: string) => void;
}

export const useFeedStore = create<FeedStore>((set) => ({
  posts: [],
  storyGroups: [],
  isLoading: false,
  isRefreshing: false,
  hasMore: true,
  cursor: undefined,
  setPosts: (posts) => set({ posts }),
  appendPosts: (posts) => set((s) => ({ posts: [...s.posts, ...posts] })),
  setStoryGroups: (storyGroups) => set({ storyGroups }),
  toggleLike: (postId) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
            }
          : p
      ),
    })),
  toggleSave: (postId) =>
    set((s) => ({
      posts: s.posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              isSaved: !p.isSaved,
              savesCount: p.isSaved ? p.savesCount - 1 : p.savesCount + 1,
            }
          : p
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
  setHasMore: (hasMore, cursor) => set({ hasMore, cursor }),
}));
