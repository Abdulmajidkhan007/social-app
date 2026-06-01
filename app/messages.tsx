import React, { useEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppHeader } from '../components/shared/AppHeader';
import { Avatar } from '../components/shared/Avatar';
import { EmptyState } from '../components/shared/EmptyState';
import { useMessagesStore } from '../store/messagesStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import type { Chat } from '../types';
import { timeAgo } from '../utils';

export default function MessagesScreen() {
  const { colors, fontSizes, fontWeights } = useTheme();
  const router = useRouter();
  const { chats, setChats, isLoading, setLoading } = useMessagesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    api.messages.getChats().then((data) => {
      setChats(data);
      setLoading(false);
    });
  }, []);

  const renderChat = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={[styles.chatItem, { borderBottomColor: colors.border }]}
      onPress={() => router.push(`/chat/${item.id}`)}
      activeOpacity={0.8}
    >
      <Avatar uri={item.participant.avatarUrl} size="lg" />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.name,
                {
                  color: colors.text,
                  fontSize: fontSizes.sm,
                  fontWeight: item.unreadCount > 0 ? fontWeights.bold : fontWeights.semibold,
                },
              ]}
            >
              {item.participant.username}
            </Text>
            {item.participant.isVerified && (
              <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
            )}
          </View>
          <Text style={[styles.time, { color: colors.textTertiary, fontSize: fontSizes.xs }]}>
            {item.updatedAt ? timeAgo(item.updatedAt) : ''}
          </Text>
        </View>
        {item.lastMessage && (
          <Text
            style={[
              styles.preview,
              {
                color: item.unreadCount > 0 ? colors.text : colors.textSecondary,
                fontSize: fontSizes.sm,
                fontWeight: item.unreadCount > 0 ? fontWeights.semibold : fontWeights.regular,
              },
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.senderId === user?.id ? 'You: ' : ''}
            {item.lastMessage.text}
          </Text>
        )}
      </View>
      {item.unreadCount > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader
        title="Messages"
        showBack
        right={
          <TouchableOpacity style={{ padding: 4 }}>
            <Ionicons name="create-outline" size={24} color={colors.icon} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No messages"
            subtitle="Send a message to start a conversation"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  chatInfo: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: {},
  time: {},
  preview: {},
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
