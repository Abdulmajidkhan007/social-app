import React, { useEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppHeader } from '../components/shared/AppHeader';
import { Avatar } from '../components/shared/Avatar';
import { EmptyState } from '../components/shared/EmptyState';
import { useNotificationsStore } from '../store/notificationsStore';
import { api } from '../services/api';
import type { Notification } from '../types';
import { timeAgo } from '../utils';

const NOTIF_ICONS: Record<string, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  like: { name: 'heart', color: '#FF3B30' },
  comment: { name: 'chatbubble', color: '#007AFF' },
  follow: { name: 'person-add', color: '#34C759' },
  mention: { name: 'at', color: '#FF9500' },
  tag: { name: 'pricetag', color: '#5856D6' },
  story_reaction: { name: 'heart', color: '#FF2D55' },
  live: { name: 'radio', color: '#FF3B30' },
};

export default function NotificationsScreen() {
  const { colors, fontSizes, fontWeights } = useTheme();
  const router = useRouter();
  const { notifications, isLoading, setNotifications, markAllRead, setLoading } = useNotificationsStore();

  useEffect(() => {
    setLoading(true);
    api.notifications.getNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
    return () => {
      markAllRead();
    };
  }, []);

  const renderItem = ({ item }: { item: Notification }) => {
    const iconConfig = NOTIF_ICONS[item.type] ?? NOTIF_ICONS.like;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            backgroundColor: item.isRead ? colors.background : colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
        activeOpacity={0.7}
        onPress={() => {
          if (item.post) router.push(`/post/${item.post.id}`);
          else router.push(`/profile/${item.actor.username}`);
        }}
      >
        <View style={styles.avatarWrapper}>
          <Avatar uri={item.actor.avatarUrl} size="md" />
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: iconConfig.color },
            ]}
          >
            <Ionicons name={iconConfig.name} size={10} color="#fff" />
          </View>
        </View>
        <Text
          style={[styles.message, { color: colors.text, fontSize: fontSizes.sm, flex: 1 }]}
          numberOfLines={2}
        >
          <Text style={{ fontWeight: fontWeights.semibold }}>
            {item.actor.username}{' '}
          </Text>
          {item.message}
          <Text style={{ color: colors.textTertiary }}> · {timeAgo(item.createdAt)}</Text>
        </Text>
        {item.post && (
          <Image
            source={{ uri: item.post.media[0].uri }}
            style={[styles.postThumb, { borderColor: colors.border }]}
            resizeMode="cover"
          />
        )}
        {!item.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader
        title="Notifications"
        showBack
        right={
          notifications.some((n) => !n.isRead) ? (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={[{ color: colors.primary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="No notifications"
            subtitle="When someone likes, comments, or follows you, you'll see it here."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  avatarWrapper: { position: 'relative' },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  message: { lineHeight: 20 },
  postThumb: {
    width: 44,
    height: 44,
    borderRadius: 4,
    borderWidth: 0.5,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
