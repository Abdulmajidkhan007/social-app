import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { PostSkeleton } from '../../components/shared/SkeletonLoader';
import { EmptyState } from '../../components/shared/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import type { Post } from '../../types';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 3) / 3;

type ProfileTab = 'posts' | 'reels' | 'saved';

export default function ProfileScreen() {
  const { colors, isDark, fontSizes } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.users.getUserPosts(user.id).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [user]);

  const tabs: { key: ProfileTab; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'posts', icon: 'grid-outline', activeIcon: 'grid' },
    { key: 'reels', icon: 'play-circle-outline', activeIcon: 'play-circle' },
    { key: 'saved', icon: 'bookmark-outline', activeIcon: 'bookmark' },
  ];

  if (!user) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.username, { color: colors.text, fontSize: 18, fontWeight: '700' }]}>
          {user.username}
        </Text>
        <View style={styles.topActions}>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.topBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.topBtn}>
            <Ionicons name="menu-outline" size={26} color={colors.icon} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={activeTab === 'posts' ? posts : []}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <ProfileHeader
              user={user}
              isOwnProfile
              onEditProfile={() => router.push('/edit-profile')}
            />
            {/* Tab bar */}
            <View style={[styles.tabBar, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    activeTab === tab.key && {
                      borderBottomColor: colors.text,
                      borderBottomWidth: 1.5,
                    },
                  ]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Ionicons
                    name={activeTab === tab.key ? tab.activeIcon : tab.icon}
                    size={24}
                    color={activeTab === tab.key ? colors.icon : colors.iconSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletonGrid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.skeletonItem,
                    { backgroundColor: colors.skeleton, width: GRID_SIZE, height: GRID_SIZE },
                  ]}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="images-outline"
              title="No posts yet"
              subtitle="Share your first photo or video"
              actionLabel="Create Post"
              onAction={() => router.push('/(tabs)/create')}
            />
          )
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
            {item.media.length > 1 && (
              <View style={styles.multiIcon}>
                <Ionicons name="copy-outline" size={12} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: 0.5,
  },
  username: {},
  topActions: { flexDirection: 'row', gap: 4 },
  topBtn: { padding: 4 },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0,
  },
  gridRow: { gap: 2 },
  gridItem: { overflow: 'hidden', position: 'relative' },
  multiIcon: { position: 'absolute', top: 6, right: 6 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 2 },
  skeletonItem: { margin: 1 },
});
