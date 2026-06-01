import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { HEADER_HEIGHT } from '../../constants';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  right?: React.ReactNode;
  onBackPress?: () => void;
  transparent?: boolean;
}

export function AppHeader({
  title,
  showBack = false,
  showLogo = false,
  right,
  onBackPress,
  transparent = false,
}: AppHeaderProps) {
  const { colors, fontSizes, fontWeights } = useTheme();
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.header,
        {
          height: HEADER_HEIGHT,
          backgroundColor: transparent ? 'transparent' : colors.background,
          borderBottomColor: transparent ? 'transparent' : colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={28} color={colors.icon} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        {showLogo ? (
          <Text
            style={[
              styles.logo,
              { color: colors.text, fontSize: fontSizes['2xl'] },
            ]}
          >
            Lumina
          </Text>
        ) : title ? (
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontSize: fontSizes.lg,
                fontWeight: fontWeights.semibold,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
  },
  left: {
    width: 56,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    width: 56,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 4,
  },
  logo: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    letterSpacing: -0.3,
  },
});
