import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../shared/Avatar';
import { type Post } from '../../types';
import { timeAgo, formatCount } from '../../utils';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PostCard = React.memo(function PostCard({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
}: PostCardProps) {
  const { colors, fontSizes, fontWeights, spacing } = useTheme();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleProfilePress = () => {
    router.push(`/profile/${post.author.username}`);
  };

  const handlePostPress = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <View style={[styles.card, { borderBottomColor: colors.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.authorRow}
          onPress={handleProfilePress}
          activeOpacity={0.8}
        >
          <Avatar uri={post.author.avatarUrl} size="md" />
          <View style={styles.authorInfo}>
            <View style={styles.nameRow}>
              <Text
                style={[
                  styles.username,
                  { color: colors.text, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
                ]}
              >
                {post.author.username}
              </Text>
              {post.author.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
              )}
            </View>
            {post.location && (
              <Text
                style={[styles.location, { color: colors.textSecondary, fontSize: fontSizes.xs }]}
              >
                {post.location}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moreButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>

      {/* Media */}
      {post.media.length === 1 ? (
        <TouchableOpacity onPress={handlePostPress} activeOpacity={0.98}>
          <Image
            source={{ uri: post.media[0].uri }}
            style={[styles.image, { width: SCREEN_WIDTH }]}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <View>
          <FlatList
            data={post.media}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              setActiveIndex(
                Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH)
              );
            }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={handlePostPress} activeOpacity={0.98}>
                <Image
                  source={{ uri: item.uri }}
                  style={[styles.image, { width: SCREEN_WIDTH }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />
          {/* Dots indicator */}
          <View style={styles.dotsContainer}>
            {post.media.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      i === activeIndex ? colors.primary : colors.border,
                    width: i === activeIndex ? 16 : 6,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            onPress={() => onLike(post.id)}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name={post.isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={post.isLiked ? colors.error : colors.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onComment(post.id)}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={24} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onShare(post.id)}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="paper-plane-outline" size={24} color={colors.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => onSave(post.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={post.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={post.isSaved ? colors.text : colors.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <View style={styles.meta}>
        <Text
          style={[
            styles.likesCount,
            { color: colors.text, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
          ]}
        >
          {formatCount(post.likesCount)} likes
        </Text>
      </View>

      {/* Caption */}
      <View style={styles.captionWrapper}>
        <Text
          style={[styles.caption, { color: colors.text, fontSize: fontSizes.sm }]}
          numberOfLines={3}
        >
          <Text style={{ fontWeight: fontWeights.semibold }}>
            {post.author.username}{' '}
          </Text>
          {post.caption}
        </Text>
      </View>

      {/* Comments link */}
      {post.commentsCount > 0 && (
        <TouchableOpacity onPress={handlePostPress} style={styles.commentsLink}>
          <Text
            style={[styles.commentsText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}
          >
            View all {formatCount(post.commentsCount)} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Time */}
      <Text
        style={[
          styles.time,
          { color: colors.textTertiary, fontSize: fontSizes.xs },
        ]}
      >
        {timeAgo(post.createdAt)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 4,
    borderBottomWidth: 0.5,
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  authorInfo: {
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {},
  location: {},
  moreButton: {
    padding: 4,
  },
  image: {
    height: 375,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  actionBtn: {},
  meta: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  likesCount: {},
  captionWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  caption: {
    lineHeight: 20,
  },
  commentsLink: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
  commentsText: {},
  time: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
