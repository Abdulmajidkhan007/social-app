import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { AppHeader } from '../../components/shared/AppHeader';
import { Avatar } from '../../components/shared/Avatar';
import { Skeleton } from '../../components/shared/SkeletonLoader';
import { EmptyState } from '../../components/shared/EmptyState';
import { api } from '../../services/api';
import type { Post, Comment } from '../../types';
import { timeAgo, formatCount } from '../../utils';

const { width } = Dimensions.get('window');

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, fontSizes, fontWeights, radius } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.posts.getPost(id).then((p) => {
      setPost(p);
      setLiked(p?.isLiked ?? false);
      setSaved(p?.isSaved ?? false);
      setLoadingPost(false);
    });
    api.posts.getComments(id).then((c) => {
      setComments(c);
      setLoadingComments(false);
    });
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !id) return;
    setSubmitting(true);
    const comment = await api.posts.addComment(id, newComment);
    setComments((prev) => [...prev, comment]);
    setNewComment('');
    setSubmitting(false);
  };

  if (loadingPost) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <AppHeader showBack title="Post" />
        <View style={styles.loadingSkeleton}>
          <Skeleton width="100%" height={300} borderRadius={0} />
          <View style={{ padding: 16, gap: 12 }}>
            <Skeleton width={200} height={12} />
            <Skeleton width="100%" height={12} />
            <Skeleton width="80%" height={12} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <AppHeader showBack title="Post" />
        <EmptyState icon="alert-circle-outline" title="Post not found" subtitle="This post may have been removed." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader showBack title="Post" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 52}
      >
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* Author */}
              <View style={styles.authorRow}>
                <TouchableOpacity
                  style={styles.authorLeft}
                  onPress={() => router.push(`/profile/${post.author.username}`)}
                >
                  <Avatar uri={post.author.avatarUrl} size="md" />
                  <View>
                    <View style={styles.nameRow}>
                      <Text style={[styles.username, { color: colors.text, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }]}>
                        {post.author.username}
                      </Text>
                      {post.author.isVerified && (
                        <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
                      )}
                    </View>
                    {post.location && (
                      <Text style={[{ color: colors.textSecondary, fontSize: fontSizes.xs }]}>
                        {post.location}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={20} color={colors.icon} />
                </TouchableOpacity>
              </View>

              {/* Image */}
              <Image
                source={{ uri: post.media[0].uri }}
                style={[styles.media, { width }]}
                resizeMode="cover"
              />

              {/* Actions */}
              <View style={styles.actions}>
                <View style={styles.leftActions}>
                  <TouchableOpacity onPress={() => setLiked((l) => !l)} style={styles.actionBtn}>
                    <Ionicons
                      name={liked ? 'heart' : 'heart-outline'}
                      size={26}
                      color={liked ? colors.error : colors.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="chatbubble-outline" size={24} color={colors.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Ionicons name="paper-plane-outline" size={24} color={colors.icon} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setSaved((s) => !s)}>
                  <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>

              {/* Likes */}
              <Text style={[styles.likes, { color: colors.text, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }]}>
                {formatCount(post.likesCount + (liked ? 1 : 0))} likes
              </Text>

              {/* Caption */}
              <View style={styles.caption}>
                <Text style={[{ color: colors.text, fontSize: fontSizes.sm }]}>
                  <Text style={{ fontWeight: fontWeights.semibold }}>{post.author.username} </Text>
                  {post.caption}
                </Text>
              </View>

              {/* Time */}
              <Text style={[styles.time, { color: colors.textTertiary, fontSize: fontSizes.xs }]}>
                {timeAgo(post.createdAt)}
              </Text>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.commentsTitle, { color: colors.text, fontSize: fontSizes.md, fontWeight: fontWeights.semibold }]}>
                Comments
              </Text>
            </View>
          }
          ListEmptyComponent={
            loadingComments ? (
              <View style={{ padding: 16, gap: 16 }}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={styles.skeletonComment}>
                    <Skeleton width={36} height={36} borderRadius={18} />
                    <View style={{ flex: 1, gap: 8 }}>
                      <Skeleton width={100} height={10} />
                      <Skeleton width="100%" height={10} />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyComments}>
                <Text style={[{ color: colors.textSecondary, fontSize: fontSizes.md }]}>
                  No comments yet. Be first!
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <TouchableOpacity onPress={() => router.push(`/profile/${item.author.username}`)}>
                <Avatar uri={item.author.avatarUrl} size="sm" />
              </TouchableOpacity>
              <View style={styles.commentContent}>
                <Text style={[{ color: colors.text, fontSize: fontSizes.sm }]}>
                  <Text style={{ fontWeight: fontWeights.semibold }}>{item.author.username} </Text>
                  {item.text}
                </Text>
                <View style={styles.commentMeta}>
                  <Text style={[{ color: colors.textTertiary, fontSize: fontSizes.xs }]}>
                    {timeAgo(item.createdAt)}
                  </Text>
                  {item.likesCount > 0 && (
                    <Text style={[{ color: colors.textTertiary, fontSize: fontSizes.xs }]}>
                      {item.likesCount} likes
                    </Text>
                  )}
                  <TouchableOpacity>
                    <Text style={[{ color: colors.textTertiary, fontSize: fontSizes.xs }]}>Reply</Text>
                  </TouchableOpacity>
                </View>
                {item.replies && item.replies.length > 0 && (
                  <View style={[styles.replies, { borderLeftColor: colors.border }]}>
                    {item.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyItem}>
                        <Avatar uri={reply.author.avatarUrl} size="xs" />
                        <Text style={[{ color: colors.text, fontSize: fontSizes.xs }]}>
                          <Text style={{ fontWeight: fontWeights.semibold }}>{reply.author.username} </Text>
                          {reply.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.commentLike}>
                <Ionicons
                  name={item.isLiked ? 'heart' : 'heart-outline'}
                  size={16}
                  color={item.isLiked ? colors.error : colors.iconSecondary}
                />
              </TouchableOpacity>
            </View>
          )}
        />

        {/* Comment input */}
        <View
          style={[
            styles.commentInputBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom || 8,
            },
          ]}
        >
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.commentInput,
              {
                color: colors.text,
                backgroundColor: colors.surface,
                fontSize: fontSizes.sm,
              },
            ]}
            returnKeyType="send"
            onSubmitEditing={handleAddComment}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text
                style={[
                  styles.postBtn,
                  {
                    color: newComment.trim() ? colors.primary : colors.textTertiary,
                    fontSize: fontSizes.sm,
                    fontWeight: fontWeights.semibold,
                  },
                ]}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingSkeleton: {},
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  authorLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  username: {},
  media: { height: 375 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: { flexDirection: 'row', gap: 16 },
  actionBtn: {},
  likes: { paddingHorizontal: 12, marginBottom: 4 },
  caption: { paddingHorizontal: 12, paddingBottom: 6 },
  time: { paddingHorizontal: 12, paddingBottom: 12, textTransform: 'uppercase' },
  divider: { height: 0.5, marginHorizontal: 12 },
  commentsTitle: { padding: 12 },
  commentItem: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    alignItems: 'flex-start',
  },
  commentContent: { flex: 1, gap: 4 },
  commentMeta: { flexDirection: 'row', gap: 12 },
  commentLike: { paddingTop: 2 },
  replies: {
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    gap: 8,
  },
  replyItem: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  skeletonComment: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  emptyComments: { padding: 24, alignItems: 'center' },
  commentInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 12,
    borderTopWidth: 0.5,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    maxHeight: 100,
  },
  postBtn: {},
});
