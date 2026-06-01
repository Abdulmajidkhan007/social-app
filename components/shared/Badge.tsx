import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface BadgeProps {
  count: number;
  max?: number;
}

export function Badge({ count, max = 99 }: BadgeProps) {
  const { colors } = useTheme();
  if (count === 0) return null;

  const label = count > max ? `${max}+` : String(count);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.error,
          minWidth: label.length > 1 ? 18 : 16,
        },
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -4,
    right: -6,
  },
  text: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
