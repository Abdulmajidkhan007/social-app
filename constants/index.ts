export const APP_NAME = 'Lumina';
export const APP_TAGLINE = 'Share your world';

export const PAGE_SIZE = 12;
export const STORY_DURATION = 5000;
export const REEL_AUTOPLAY_THRESHOLD = 0.8;

export const IMAGE_QUALITY = 0.85;
export const VIDEO_MAX_DURATION = 60;
export const MAX_CAPTION_LENGTH = 2200;
export const MAX_BIO_LENGTH = 150;
export const MAX_COMMENT_LENGTH = 500;

export const AVATAR_SIZES = {
  xs: 24,
  sm: 32,
  md: 44,
  lg: 56,
  xl: 80,
  xxl: 120,
} as const;

export const BOTTOM_TAB_HEIGHT = 60;
export const HEADER_HEIGHT = 56;

export const PICSUM_BASE = 'https://picsum.photos/seed';

export const ROUTES = {
  HOME: '/(tabs)/',
  EXPLORE: '/(tabs)/explore',
  CREATE: '/(tabs)/create',
  REELS: '/(tabs)/reels',
  PROFILE: '/(tabs)/profile',
  SIGN_IN: '/(auth)/sign-in',
  SIGN_UP: '/(auth)/sign-up',
  FORGOT_PASSWORD: '/(auth)/forgot-password',
  ONBOARDING: '/(auth)/onboarding',
  POST_DETAIL: '/post/[id]',
  USER_PROFILE: '/profile/[username]',
  STORY_VIEWER: '/story/[userId]',
  CHAT: '/chat/[id]',
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
  SETTINGS: '/settings',
  EDIT_PROFILE: '/edit-profile',
  SAVED_POSTS: '/saved',
  FOLLOWERS: '/followers/[userId]',
  FOLLOWING: '/following/[userId]',
} as const;
