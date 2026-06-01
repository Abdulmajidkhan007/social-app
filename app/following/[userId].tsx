import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { AppHeader } from '../../components/shared/AppHeader';
import { Avatar } from '../../components/shared/Avatar';
import { PrimaryButton } from '../../components/shared/PrimaryButton';
import { EmptyState } from '../../components/shared/EmptyState';
import { api } from '../../services/api';
import type { User } from '../../types';
import { formatCount } from '../../utils';

export default function FollowingScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { colors, fontSizes, fontWeights } = useTheme();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    api.users.getFollowing(userId).then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, [userId]);

  const handleUnfollow = (targetId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u
      )
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader title="Following" showBack />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="people-outline" title="Not following anyone" subtitle="Accounts this user follows will show up here" />
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.item, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              style={styles.left}
              onPress={() => router.push(`/profile/${item.username}`)}
            >
              <Avatar uri={item.avatarUrl} size="md" />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={[styles.username, { color: colors.text, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }]}>
                    {item.username}
                  </Text>
                  {item.isVerified && (
                    <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
                  )}
                </View>
                <Text style={[{ color: colors.textSecondary, fontSize: fontSizes.xs }]}>
                  {item.displayName} · {formatCount(item.followersCount)} followers
                </Text>
              </View>
            </TouchableOpacity>
            <PrimaryButton
              label={item.isFollowing ? 'Following' : 'Follow'}
              onPress={() => handleUnfollow(item.id)}
              variant={item.isFollowing ? 'outline' : 'filled'}
              size="sm"
              fullWidth={false}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  username: {},
});
