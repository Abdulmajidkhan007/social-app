import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { AppHeader } from '../../components/shared/AppHeader';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { EmptyState } from '../../components/shared/EmptyState';
import { Skeleton } from '../../components/shared/SkeletonLoader';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import type { User, Post } from '../../types';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 3) / 3;

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    Promise.all([
      api.users.getUser(username),
      api.users.getUserPosts(username),
    ]).then(([u, p]) => {
      setUser(u);
      setPosts(p);
      setLoading(false);
    });
  }, [username]);

  const handleFollow = async () => {
    if (!user) return;
    if (user.isFollowing) {
      await api.users.unfollow(user.id);
      setUser((u) => u ? { ...u, isFollowing: false, followersCount: u.followersCount - 1 } : u);
    } else {
      await api.users.follow(user.id);
      setUser((u) => u ? { ...u, isFollowing: true, followersCount: u.followersCount + 1 } : u);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <AppHeader showBack title={username} />
        <View style={{ padding: 16, gap: 16 }}>
          <View style={styles.skeletonHeader}>
            <Skeleton width={80} height={80} borderRadius={40} />
            <View style={styles.skeletonStats}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={styles.skeletonStat}>
                  <Skeleton width={40} height={16} />
                  <Skeleton width={50} height={10} />
                </View>
              ))}
            </View>
          </View>
          <Skeleton width={140} height={12} />
          <Skeleton width="90%" height={10} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <AppHeader showBack title="Profile" />
        <EmptyState icon="person-outline" title="User not found" subtitle="This account doesn't exist or has been removed." />
      </SafeAreaView>
    );
  }

  const isOwnProfile = currentUser?.username === user.username;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader
        showBack
        title={user.username}
        right={
          <TouchableOpacity style={{ padding: 4 }}>
            <Ionicons name="ellipsis-horizontal" size={22} color={colors.icon} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <ProfileHeader
            user={user}
            isOwnProfile={isOwnProfile}
            onFollow={handleFollow}
            onMessage={() => router.push('/messages')}
            onEditProfile={() => router.push('/edit-profile')}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="images-outline"
            title="No posts yet"
            subtitle={isOwnProfile ? 'Share your first photo or video' : `${user.username} hasn't posted yet`}
          />
        }
        columnWrapperStyle={styles.gridRow}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/post/${item.id}`)}
            style={[styles.gridItem, { width: GRID_SIZE, height: GRID_SIZE }]}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: item.media[0].uri }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gridRow: { gap: 2 },
  gridItem: { overflow: 'hidden' },
  skeletonHeader: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  skeletonStats: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  skeletonStat: { alignItems: 'center', gap: 6 },
});
