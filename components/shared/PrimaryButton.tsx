import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'filled' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'filled',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
}: PrimaryButtonProps) {
  const { colors, radius, fontWeights, fontSizes } = useTheme();

  const heights = { sm: 36, md: 48, lg: 56 };
  const fontSizeMap = { sm: fontSizes.sm, md: fontSizes.md, lg: fontSizes.lg };

  const bgColor =
    variant === 'filled'
      ? disabled
        ? colors.border
        : colors.primary
      : 'transparent';

  const textColor =
    variant === 'filled'
      ? colors.primaryText
      : disabled
      ? colors.textTertiary
      : colors.primary;

  const borderColor = variant === 'outline' ? colors.primary : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          height: heights[size],
          backgroundColor: bgColor,
          borderRadius: radius.md,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          borderColor,
          alignSelf: fullWidth ? 'stretch' : 'auto',
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontSize: fontSizeMap[size],
              fontWeight: fontWeights.semibold,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  label: {
    letterSpacing: 0.2,
  },
});
