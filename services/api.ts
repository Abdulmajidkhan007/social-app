import type {
  User,
  Post,
  StoryGroup,
  Reel,
  Comment,
  Notification,
  Chat,
  Message,
  PaginatedResponse,
} from '../types';
import { mockPosts } from './mock/posts';
import { mockUsers, currentUser } from './mock/users';
import { mockStoryGroups } from './mock/stories';
import { mockReels } from './mock/reels';
import { mockNotifications } from './mock/notifications';
import { mockChats, mockMessages } from './mock/messages';
import { getCommentsForPost } from './mock/comments';
import { PAGE_SIZE } from '../constants';

const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms));

export const api = {
  auth: {
    async signIn(email: string, _password: string): Promise<{ user: User; token: string }> {
      await delay();
      return { user: currentUser, token: 'mock-token-xyz' };
    },
    async signUp(username: string, _email: string, _password: string): Promise<{ user: User; token: string }> {
      await delay(800);
      return {
        user: { ...currentUser, username, displayName: username },
        token: 'mock-token-new',
      };
    },
    async signOut(): Promise<void> {
      await delay(300);
    },
    async resetPassword(_email: string): Promise<void> {
      await delay(600);
    },
    async getCurrentUser(): Promise<User> {
      await delay(400);
      return currentUser;
    },
  },

  feed: {
    async getPosts(cursor?: string): Promise<PaginatedResponse<Post>> {
      await delay();
      const page = cursor ? parseInt(cursor) : 0;
      const start = page * PAGE_SIZE;
      const data = mockPosts.slice(start, start + PAGE_SIZE);
      return {
        data,
        nextCursor: data.length === PAGE_SIZE ? String(page + 1) : undefined,
        hasMore: data.length === PAGE_SIZE,
        total: mockPosts.length,
      };
    },
    async getStoryGroups(): Promise<StoryGroup[]> {
      await delay(400);
      return mockStoryGroups;
    },
    async likePost(_postId: string): Promise<void> {
      await delay(200);
    },
    async unlikePost(_postId: string): Promise<void> {
      await delay(200);
    },
    async savePost(_postId: string): Promise<void> {
      await delay(200);
    },
    async unsavePost(_postId: string): Promise<void> {
      await delay(200);
    },
  },

  posts: {
    async getPost(postId: string): Promise<Post | null> {
      await delay(400);
      return mockPosts.find((p) => p.id === postId) ?? null;
    },
    async getComments(postId: string): Promise<Comment[]> {
      await delay(500);
      return getCommentsForPost(postId);
    },
    async addComment(_postId: string, text: string): Promise<Comment> {
      await delay(400);
      return {
        id: `c-${Date.now()}`,
        author: currentUser,
        text,
        likesCount: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
      };
    },
    async createPost(_data: FormData): Promise<Post> {
      await delay(1000);
      return mockPosts[0];
    },
    async deletePost(_postId: string): Promise<void> {
      await delay(400);
    },
  },

  reels: {
    async getReels(cursor?: string): Promise<PaginatedResponse<Reel>> {
      await delay(500);
      const page = cursor ? parseInt(cursor) : 0;
      const data = mockReels.slice(page * 3, page * 3 + 3);
      return {
        data,
        nextCursor: data.length === 3 ? String(page + 1) : undefined,
        hasMore: data.length === 3,
        total: mockReels.length,
      };
    },
  },

  explore: {
    async getTrending(): Promise<Post[]> {
      await delay(500);
      return [...mockPosts].sort(() => Math.random() - 0.5);
    },
    async search(query: string): Promise<{ users: User[]; posts: Post[] }> {
      await delay(400);
      const q = query.toLowerCase();
      return {
        users: mockUsers.filter(
          (u) =>
            u.username.toLowerCase().includes(q) ||
            u.displayName.toLowerCase().includes(q)
        ),
        posts: mockPosts.filter((p) => p.caption.toLowerCase().includes(q)),
      };
    },
  },

  users: {
    async getUser(username: string): Promise<User | null> {
      await delay(400);
      return mockUsers.find((u) => u.username === username) ?? null;
    },
    async getUserPosts(userId: string): Promise<Post[]> {
      await delay(500);
      return mockPosts.filter((p) => p.author.id === userId);
    },
    async follow(_userId: string): Promise<void> {
      await delay(300);
    },
    async unfollow(_userId: string): Promise<void> {
      await delay(300);
    },
    async getFollowers(_userId: string): Promise<User[]> {
      await delay(400);
      return mockUsers.slice(0, 4);
    },
    async getFollowing(_userId: string): Promise<User[]> {
      await delay(400);
      return mockUsers.slice(1, 5);
    },
    async updateProfile(_data: Partial<User>): Promise<User> {
      await delay(600);
      return currentUser;
    },
    async getSuggestedUsers(): Promise<User[]> {
      await delay(400);
      return mockUsers.filter((u) => !u.isFollowing && u.id !== 'me').slice(0, 4);
    },
  },

  notifications: {
    async getNotifications(): Promise<Notification[]> {
      await delay(500);
      return mockNotifications;
    },
    async markAllRead(): Promise<void> {
      await delay(300);
    },
  },

  messages: {
    async getChats(): Promise<Chat[]> {
      await delay(500);
      return mockChats;
    },
    async getMessages(chatId: string): Promise<Message[]> {
      await delay(400);
      return mockMessages[chatId] ?? [];
    },
    async sendMessage(chatId: string, text: string): Promise<Message> {
      await delay(300);
      return {
        id: `msg-${Date.now()}`,
        senderId: 'me',
        text,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
    },
  },
};
