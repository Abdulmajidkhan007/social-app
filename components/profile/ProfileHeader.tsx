import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../shared/Avatar';
import { PrimaryButton } from '../shared/PrimaryButton';
import type { User } from '../../types';
import { formatCount } from '../../utils';
import { useRouter } from 'expo-router';

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onEditProfile?: () => void;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  onFollow,
  onMessage,
  onEditProfile,
}: ProfileHeaderProps) {
  const { colors, fontSizes, fontWeights, spacing, radius } = useTheme();
  const router = useRouter();

  const stats = [
    { label: 'Posts', value: formatCount(user.postsCount) },
    { label: 'Followers', value: formatCount(user.followersCount) },
    { label: 'Following', value: formatCount(user.followingCount) },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topRow}>
        <Avatar uri={user.avatarUrl} size="xxl" />
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <TouchableOpacity
              key={stat.label}
              style={styles.statItem}
              onPress={() => {
                if (stat.label === 'Followers')
                  router.push(`/followers/${user.id}`);
                else if (stat.label === 'Following')
                  router.push(`/following/${user.id}`);
              }}
            >
              <Text
                style={[
                  styles.statValue,
                  { color: colors.text, fontSize: fontSizes.lg, fontWeight: fontWeights.bold },
                ]}
              >
                {stat.value}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: colors.textSecondary, fontSize: fontSizes.xs },
                ]}
              >
                {stat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Name and bio */}
      <View style={styles.bioSection}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.displayName,
              { color: colors.text, fontSize: fontSizes.md, fontWeight: fontWeights.semibold },
            ]}
          >
            {user.displayName}
          </Text>
          {user.isVerified && (
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          )}
        </View>
        {user.bio && (
          <Text
            style={[styles.bio, { color: colors.text, fontSize: fontSizes.sm, lineHeight: 20 }]}
          >
            {user.bio}
          </Text>
        )}
        {user.website && (
          <Text
            style={[
              styles.website,
              { color: colors.primary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
            ]}
          >
            {user.website}
          </Text>
        )}
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        {isOwnProfile ? (
          <>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Edit Profile"
                onPress={onEditProfile ?? (() => {})}
                variant="outline"
                size="sm"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  borderColor: colors.border,
                  borderRadius: radius.sm,
                },
              ]}
            >
              <Ionicons name="person-add-outline" size={18} color={colors.icon} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label={user.isFollowing ? 'Following' : 'Follow'}
                onPress={onFollow ?? (() => {})}
                variant={user.isFollowing ? 'outline' : 'filled'}
                size="sm"
              />
            </View>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                label="Message"
                onPress={onMessage ?? (() => {})}
                variant="outline"
                size="sm"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.iconButton,
                {
                  borderColor: colors.border,
                  borderRadius: radius.sm,
                },
              ]}
            >
              <Ionicons name="person-add-outline" size={18} color={colors.icon} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {},
  statLabel: {},
  bioSection: {
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  displayName: {},
  bio: {},
  website: {},
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
