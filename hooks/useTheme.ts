import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '../theme/colors';
import { spacing, radius, shadow } from '../theme/spacing';
import { fontSizes, fontWeights, textStyles } from '../theme/typography';
import { useSettingsStore } from '../store/settingsStore';

export function useTheme() {
  const systemScheme = useColorScheme();
  const { settings } = useSettingsStore();

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' && systemScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  return {
    colors,
    spacing,
    radius,
    shadow,
    fontSizes,
    fontWeights,
    textStyles,
    isDark,
  };
}
