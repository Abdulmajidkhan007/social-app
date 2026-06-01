export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  coverUrl?: string;
  website?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  isFollowing: boolean;
  isFollowedBy: boolean;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  uri: string;
  type: 'image' | 'video';
  width: number;
  height: number;
  duration?: number;
  thumbnailUri?: string;
}

export interface Post {
  id: string;
  author: User;
  caption: string;
  media: MediaAsset[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  location?: string;
  createdAt: string;
}

export interface Story {
  id: string;
  author: User;
  media: MediaAsset;
  duration: number;
  isViewed: boolean;
  viewsCount: number;
  createdAt: string;
  expiresAt: string;
}

export interface StoryGroup {
  user: User;
  stories: Story[];
  hasUnviewed: boolean;
}

export interface Reel {
  id: string;
  author: User;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  audioTitle?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  likesCount: number;
  isLiked: boolean;
  replies?: Comment[];
  createdAt: string;
}

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'tag'
  | 'story_reaction'
  | 'live';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: User;
  post?: Pick<Post, 'id' | 'media'>;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  media?: MediaAsset;
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface FollowRelation {
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  showActivityStatus: boolean;
  privateAccount: boolean;
  twoFactorEnabled: boolean;
  language: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
  total: number;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
