import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SkeletonProps {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height, borderRadius = 8, style }: SkeletonProps) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function PostSkeleton() {
  const { colors, spacing } = useTheme();
  return (
    <View style={[styles.postSkeleton, { borderBottomColor: colors.border }]}>
      <View style={styles.header}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={styles.headerText}>
          <Skeleton width={120} height={12} />
          <Skeleton width={80} height={10} style={{ marginTop: 6 }} />
        </View>
      </View>
      <Skeleton width="100%" height={300} borderRadius={0} />
      <View style={styles.actions}>
        <Skeleton width={80} height={12} />
        <Skeleton width={60} height={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
  postSkeleton: {
    marginBottom: 8,
    borderBottomWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  headerText: {
    gap: 6,
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    gap: 16,
  },
});
