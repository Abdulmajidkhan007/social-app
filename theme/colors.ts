export const palette = {
  white: '#FFFFFF',
  black: '#000000',

  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  dark50: '#1C1C1E',
  dark100: '#2C2C2E',
  dark200: '#3A3A3C',
  dark300: '#48484A',
  dark400: '#636366',

  violet400: '#A78BFA',
  violet500: '#8B5CF6',
  violet600: '#7C3AED',

  pink400: '#F472B6',
  pink500: '#EC4899',

  orange400: '#FB923C',
  orange500: '#F97316',

  red500: '#EF4444',
  green500: '#22C55E',
  blue500: '#3B82F6',
  yellow500: '#EAB308',
} as const;

export const gradients = {
  primary: ['#8B5CF6', '#EC4899', '#F97316'] as string[],
  story: ['#F97316', '#EC4899', '#8B5CF6'] as string[],
  reel: ['#000000', 'transparent'] as string[],
  overlay: ['transparent', 'rgba(0,0,0,0.6)'] as string[],
} as const;

export const lightColors: AppColors = {
  background: palette.white,
  surface: palette.gray50,
  surfaceSecondary: palette.gray100,
  border: palette.gray200,
  borderSecondary: palette.gray300,

  text: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray500,
  textInverse: palette.white,

  primary: palette.violet500,
  primaryText: palette.white,

  icon: palette.gray800,
  iconSecondary: palette.gray500,
  iconInverse: palette.white,

  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  tabActive: palette.black,
  tabInactive: palette.gray500,

  error: palette.red500,
  success: palette.green500,
  warning: palette.orange500,

  skeleton: palette.gray200,
  skeletonHighlight: palette.gray100,

  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.3)',
} as const;

export const darkColors: AppColors = {
  background: palette.black,
  surface: palette.dark50,
  surfaceSecondary: palette.dark100,
  border: palette.dark200,
  borderSecondary: palette.dark300,

  text: palette.white,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  textInverse: palette.black,

  primary: palette.violet400,
  primaryText: palette.white,

  icon: palette.white,
  iconSecondary: palette.gray400,
  iconInverse: palette.black,

  tabBar: palette.black,
  tabBarBorder: palette.dark200,
  tabActive: palette.white,
  tabInactive: palette.dark400,

  error: palette.red500,
  success: palette.green500,
  warning: palette.orange400,

  skeleton: palette.dark100,
  skeletonHighlight: palette.dark200,

  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.5)',
} as const;

export type AppColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  borderSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  primary: string;
  primaryText: string;
  icon: string;
  iconSecondary: string;
  iconInverse: string;
  tabBar: string;
  tabBarBorder: string;
  tabActive: string;
  tabInactive: string;
  error: string;
  success: string;
  warning: string;
  skeleton: string;
  skeletonHighlight: string;
  overlay: string;
  overlayLight: string;
};
