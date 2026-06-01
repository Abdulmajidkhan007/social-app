import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppHeader } from '../components/shared/AppHeader';
import { Avatar } from '../components/shared/Avatar';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  value?: boolean;
  onToggle?: (val: boolean) => void;
  danger?: boolean;
  subtitle?: string;
}

function SettingsRow({ icon, label, onPress, value, onToggle, danger, subtitle }: SettingsRowProps) {
  const { colors, fontSizes } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress && onToggle === undefined}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.iconWrapper, { backgroundColor: danger ? colors.error + '20' : colors.surface }]}>
        <Ionicons name={icon} size={20} color={danger ? colors.error : colors.icon} />
      </View>
      <View style={styles.rowContent}>
        <Text
          style={[
            styles.rowLabel,
            {
              color: danger ? colors.error : colors.text,
              fontSize: fontSizes.md,
            },
          ]}
        >
          {label}
        </Text>
        {subtitle && (
          <Text style={[{ color: colors.textTertiary, fontSize: fontSizes.xs, marginTop: 2 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {onToggle !== undefined ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor="#fff"
        />
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={18} color={colors.iconSecondary} />
      ) : null}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { colors, fontSizes, fontWeights } = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  const SECTIONS = [
    {
      title: 'Account',
      rows: [
        {
          icon: 'person-outline' as const,
          label: 'Edit Profile',
          onPress: () => router.push('/edit-profile'),
        },
        {
          icon: 'lock-closed-outline' as const,
          label: 'Password & Security',
          onPress: () => {},
        },
        {
          icon: 'shield-checkmark-outline' as const,
          label: 'Privacy',
          subtitle: settings.privateAccount ? 'Private account' : 'Public account',
          onPress: () => {},
        },
        {
          icon: 'bookmark-outline' as const,
          label: 'Saved Posts',
          onPress: () => router.push('/saved'),
        },
      ],
    },
    {
      title: 'Appearance',
      rows: [
        {
          icon: 'moon-outline' as const,
          label: 'Dark Mode',
          value: settings.theme === 'dark',
          onToggle: (val: boolean) => updateSettings({ theme: val ? 'dark' : 'light' }),
        },
        {
          icon: 'phone-portrait-outline' as const,
          label: 'Use System Theme',
          value: settings.theme === 'system',
          onToggle: (val: boolean) =>
            updateSettings({ theme: val ? 'system' : 'light' }),
        },
      ],
    },
    {
      title: 'Notifications',
      rows: [
        {
          icon: 'notifications-outline' as const,
          label: 'Push Notifications',
          value: settings.notificationsEnabled,
          onToggle: (val: boolean) => updateSettings({ notificationsEnabled: val }),
        },
        {
          icon: 'eye-outline' as const,
          label: 'Show Activity Status',
          value: settings.showActivityStatus,
          onToggle: (val: boolean) => updateSettings({ showActivityStatus: val }),
        },
      ],
    },
    {
      title: 'Support',
      rows: [
        { icon: 'help-circle-outline' as const, label: 'Help Center', onPress: () => {} },
        { icon: 'information-circle-outline' as const, label: 'About', onPress: () => {} },
      ],
    },
    {
      title: '',
      rows: [
        {
          icon: 'log-out-outline' as const,
          label: 'Sign Out',
          onPress: handleSignOut,
          danger: true,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader title="Settings" showBack />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        {user && (
          <TouchableOpacity
            style={[styles.profileCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/edit-profile')}
            activeOpacity={0.8}
          >
            <Avatar uri={user.avatarUrl} size="lg" />
            <View style={styles.profileInfo}>
              <Text style={[styles.displayName, { color: colors.text, fontSize: fontSizes.md, fontWeight: fontWeights.semibold }]}>
                {user.displayName}
              </Text>
              <Text style={[{ color: colors.textSecondary, fontSize: fontSizes.sm }]}>
                @{user.username}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.iconSecondary} />
          </TouchableOpacity>
        )}

        {SECTIONS.map((section, si) => (
          <View key={si} style={styles.section}>
            {section.title ? (
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.textSecondary, fontSize: fontSizes.xs },
                ]}
              >
                {section.title.toUpperCase()}
              </Text>
            ) : null}
            <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {section.rows.map((row, ri) => (
                <SettingsRow key={ri} {...row} />
              ))}
            </View>
          </View>
        ))}

        <Text style={[styles.version, { color: colors.textTertiary, fontSize: fontSizes.xs }]}>
          Lumina v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  profileInfo: { flex: 1 },
  displayName: {},
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: {
    marginBottom: 8,
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowLabel: {},
  version: {
    textAlign: 'center',
    paddingVertical: 24,
  },
});
