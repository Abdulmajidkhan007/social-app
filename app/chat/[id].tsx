import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../../components/shared/Avatar';
import { useMessagesStore } from '../../store/messagesStore';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import type { Message } from '../../types';
import { timeAgo } from '../../utils';
import { mockChats } from '../../services/mock/messages';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, fontSizes, radius } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useAuthStore();
  const { messages, setMessages, appendMessage, markChatRead } = useMessagesStore();

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const chat = mockChats.find((c) => c.id === id);
  const chatMessages = messages[id ?? ''] ?? [];

  useEffect(() => {
    if (!id) return;
    api.messages.getMessages(id).then((msgs) => {
      setMessages(id, msgs);
      markChatRead(id);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
    }
  }, [chatMessages.length]);

  const handleSend = async () => {
    if (!text.trim() || !id) return;
    const content = text.trim();
    setText('');
    setSending(true);
    const msg = await api.messages.sendMessage(id, content);
    appendMessage(id, msg);
    setSending(false);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  const isMe = (msg: Message) => msg.senderId === 'me' || msg.senderId === currentUser?.id;

  if (!chat) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerUser}
          onPress={() => router.push(`/profile/${chat.participant.username}`)}
        >
          <Avatar uri={chat.participant.avatarUrl} size="sm" />
          <View>
            <Text style={[styles.headerName, { color: colors.text, fontSize: fontSizes.sm, fontWeight: '600' }]}>
              {chat.participant.username}
            </Text>
            <Text style={[{ color: colors.textTertiary, fontSize: fontSizes.xs }]}>
              Active recently
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="videocam-outline" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 56}
      >
        {loading ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item, index }) => {
              const mine = isMe(item);
              const prevMsg = chatMessages[index - 1];
              const showAvatar = !mine && (!prevMsg || isMe(prevMsg));

              return (
                <View
                  style={[
                    styles.msgRow,
                    mine ? styles.msgRowRight : styles.msgRowLeft,
                  ]}
                >
                  {!mine && (
                    <View style={styles.avatarSpace}>
                      {showAvatar && (
                        <Avatar uri={chat.participant.avatarUrl} size="xs" />
                      )}
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      mine
                        ? [styles.bubbleMine, { backgroundColor: colors.primary }]
                        : [styles.bubbleOther, { backgroundColor: colors.surface }],
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        {
                          color: mine ? '#fff' : colors.text,
                          fontSize: fontSizes.sm,
                        },
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* Input */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom || 8,
            },
          ]}
        >
          <TouchableOpacity style={styles.inputExtra}>
            <Ionicons name="camera-outline" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                fontSize: fontSizes.md,
                borderRadius: radius.full,
              },
            ]}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={text.trim() ? handleSend : undefined}
            style={[
              styles.sendBtn,
              { backgroundColor: text.trim() ? colors.primary : colors.surface },
            ]}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons
                name="send"
                size={16}
                color={text.trim() ? '#fff' : colors.iconSecondary}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 56,
    borderBottomWidth: 0.5,
    gap: 8,
  },
  backBtn: { padding: 4 },
  headerUser: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerName: {},
  callBtn: { padding: 8 },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messagesList: { paddingHorizontal: 12, paddingVertical: 12, gap: 4 },
  msgRow: {
    flexDirection: 'row',
    marginVertical: 2,
    alignItems: 'flex-end',
    gap: 6,
  },
  msgRowRight: { justifyContent: 'flex-end' },
  msgRowLeft: { justifyContent: 'flex-start' },
  avatarSpace: { width: 28 },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleMine: { borderBottomRightRadius: 4 },
  bubbleOther: { borderBottomLeftRadius: 4 },
  bubbleText: { lineHeight: 20 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 10,
    borderTopWidth: 0.5,
  },
  inputExtra: { paddingBottom: 10 },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
