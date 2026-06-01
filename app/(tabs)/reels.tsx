import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ViewToken,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../../components/shared/Avatar';
import { formatCount } from '../../utils';
import { mockReels } from '../../services/mock/reels';
import type { Reel } from '../../types';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

function ReelItem({ reel, isActive }: { reel: Reel; isActive: boolean }) {
  const { colors, fontSizes, fontWeights } = useTheme();
  const router = useRouter();
  const [liked, setLiked] = useState(reel.isLiked);
  const [saved, setSaved] = useState(reel.isSaved);
  const [muted, setMuted] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likesCount);

  const handleLike = () => {
    setLiked((l) => !l);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <View style={styles.reelContainer}>
      <StatusBar style="light" />
      {/* Background image as video placeholder */}
      <Image
        source={{ uri: reel.thumbnailUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* Dark overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bottomGradient} />
      </View>

      {/* Mute button */}
      <TouchableOpacity
        style={styles.muteBtn}
        onPress={() => setMuted((m) => !m)}
      >
        <Ionicons
          name={muted ? 'volume-mute' : 'volume-medium'}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Right actions */}
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.actionItem} onPress={handleLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={28}
            color={liked ? '#FF3B30' : '#fff'}
          />
          <Text style={[styles.actionCount, { color: '#fff', fontSize: fontSizes.xs }]}>
            {formatCount(likesCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionItem}
          onPress={() => router.push(`/post/${reel.id}`)}
        >
          <Ionicons name="chatbubble-outline" size={26} color="#fff" />
          <Text style={[styles.actionCount, { color: '#fff', fontSize: fontSizes.xs }]}>
            {formatCount(reel.commentsCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="paper-plane-outline" size={26} color="#fff" />
          <Text style={[styles.actionCount, { color: '#fff', fontSize: fontSizes.xs }]}>
            {formatCount(reel.sharesCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem} onPress={() => setSaved((s) => !s)}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={26}
            color={saved ? '#fff' : '#fff'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Audio disc */}
        <View style={styles.audioDisc}>
          <Image
            source={{ uri: reel.author.avatarUrl }}
            style={styles.discImage}
          />
        </View>
      </View>

      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        <TouchableOpacity
          style={styles.authorRow}
          onPress={() => router.push(`/profile/${reel.author.username}`)}
          activeOpacity={0.8}
        >
          <Avatar uri={reel.author.avatarUrl} size="sm" />
          <Text
            style={[
              styles.authorName,
              { color: '#fff', fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
            ]}
          >
            {reel.author.username}
          </Text>
          <View style={styles.followPill}>
            <Text style={[styles.followText, { fontSize: fontSizes.xs }]}>Follow</Text>
          </View>
        </TouchableOpacity>

        <Text
          style={[styles.caption, { color: '#fff', fontSize: fontSizes.sm }]}
          numberOfLines={2}
        >
          {reel.caption}
        </Text>

        {reel.audioTitle && (
          <View style={styles.audioRow}>
            <Ionicons name="musical-notes" size={14} color="#fff" />
            <Text
              style={[styles.audioTitle, { color: '#fff', fontSize: fontSizes.xs }]}
              numberOfLines={1}
            >
              {reel.audioTitle}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function ReelsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  });

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        data={mockReels}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        renderItem={({ item, index }) => (
          <ReelItem reel={item} isActive={index === activeIndex} />
        )}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.55,
    backgroundColor: 'transparent',
  },
  muteBtn: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightActions: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    alignItems: 'center',
    gap: 20,
  },
  actionItem: { alignItems: 'center', gap: 4 },
  actionCount: { fontWeight: '600' },
  audioDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    marginTop: 8,
  },
  discImage: { width: '100%', height: '100%' },
  bottomInfo: {
    position: 'absolute',
    bottom: 80,
    left: 12,
    right: 72,
    gap: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {},
  followPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
  followText: { color: '#fff', fontWeight: '600' },
  caption: { lineHeight: 20 },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  audioTitle: {},
});
