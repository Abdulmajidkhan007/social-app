import React, { useEffect, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';
import { PostCard } from '../../components/feed/PostCard';
import { StoryTray } from '../../components/stories/StoryTray';
import { PostSkeleton } from '../../components/shared/SkeletonLoader';
import { useFeedStore } from '../../store/feedStore';
import { useNotificationsStore } from '../../store/notificationsStore';
import { useMessagesStore } from '../../store/messagesStore';
import { api } from '../../services/api';
import { Badge } from '../../components/shared/Badge';
import type { Post } from '../../types';
import { APP_NAME } from '../../constants';

export default function HomeScreen() {
  const { colors, isDark, fontWeights, fontSizes } = useTheme();
  const router = useRouter();

  const {
    posts,
    storyGroups,
    isLoading,
    isRefreshing,
    hasMore,
    cursor,
    setPosts,
    appendPosts,
    setStoryGroups,
    toggleLike,
    toggleSave,
    setLoading,
    setRefreshing,
    setHasMore,
  } = useFeedStore();

  const { unreadCount: notifCount, setNotifications } = useNotificationsStore();
  const { chats, setChats } = useMessagesStore();
  const messageCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, stories, notifications, chatsData] = await Promise.all([
        api.feed.getPosts(),
        api.feed.getStoryGroups(),
        api.notifications.getNotifications(),
        api.messages.getChats(),
      ]);
      setPosts(postsRes.data);
      setStoryGroups(stories);
      setNotifications(notifications);
      setChats(chatsData);
      setHasMore(postsRes.hasMore, postsRes.nextCursor);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const [postsRes, stories] = await Promise.all([
        api.feed.getPosts(),
        api.feed.getStoryGroups(),
      ]);
      setPosts(postsRes.data);
      setStoryGroups(stories);
      setHasMore(postsRes.hasMore, postsRes.nextCursor);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setLoading(true);
    try {
      const res = await api.feed.getPosts(cursor);
      appendPosts(res.data);
      setHasMore(res.hasMore, res.nextCursor);
    } finally {
      setLoading(false);
    }
  }, [hasMore, isLoading, cursor]);

  useEffect(() => {
    loadFeed();
  }, []);

  const handleLike = useCallback(
    async (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      toggleLike(postId);
      if (post.isLiked) {
        await api.feed.unlikePost(postId);
      } else {
        await api.feed.likePost(postId);
      }
    },
    [posts, toggleLike]
  );

  const handleSave = useCallback(
    async (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      toggleSave(postId);
      if (post.isSaved) {
        await api.feed.unsavePost(postId);
      } else {
        await api.feed.savePost(postId);
      }
    },
    [posts, toggleSave]
  );

  const renderHeader = () => (
    <View>
      <StoryTray groups={storyGroups} />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </View>
  );

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onSave={handleSave}
      onComment={(id) => router.push(`/post/${id}`)}
      onShare={() => {}}
    />
  );

  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    return (
      <View style={styles.footer}>
        <PostSkeleton />
        <PostSkeleton />
      </View>
    );
  };

  if (isLoading && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {renderNavBar()}
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </SafeAreaView>
    );
  }

  function renderNavBar() {
    return (
      <View
        style={[
          styles.navbar,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <Text
          style={[
            styles.logoText,
            { color: colors.text, fontSize: fontSizes['2xl'], fontWeight: fontWeights.extrabold },
          ]}
        >
          {APP_NAME}
        </Text>
        <View style={styles.navActions}>
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={styles.navBtn}
          >
            <View>
              <Ionicons name="heart-outline" size={26} color={colors.icon} />
              {notifCount > 0 && <Badge count={notifCount} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/messages')}
            style={styles.navBtn}
          >
            <View>
              <Ionicons name="paper-plane-outline" size={24} color={colors.icon} />
              {messageCount > 0 && <Badge count={messageCount} />}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {renderNavBar()}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: 0.5,
  },
  logoText: { letterSpacing: -0.5 },
  navActions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  navBtn: { padding: 4 },
  divider: { height: 0.5 },
  footer: {},
});
