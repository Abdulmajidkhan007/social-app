import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../../components/shared/Avatar';
import { mockStoryGroups } from '../../services/mock/stories';
import { timeAgo } from '../../utils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STORY_DURATION = 5000;

export default function StoryViewerScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { fontSizes, fontWeights } = useTheme();

  const group = mockStoryGroups.find((g) => g.user.id === userId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const story = group?.stories[currentIndex];

  const startProgress = () => {
    progress.setValue(0);
    animRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished) goNext();
    });
  };

  const goNext = () => {
    if (!group) return;
    if (currentIndex < group.stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      router.back();
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    startProgress();
    return () => animRef.current?.stop();
  }, [currentIndex]);

  if (!group || !story) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />
      <Image
        source={{ uri: story.media.uri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      {/* Gradient overlay */}
      <View style={styles.topOverlay} />
      <View style={styles.bottomOverlay} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Progress bars */}
        <View style={styles.progressBars}>
          {group.stories.map((_, i) => (
            <View
              key={i}
              style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.4)' }]}
            >
              {i < currentIndex ? (
                <View style={[styles.progressFill, { backgroundColor: '#fff', flex: 1 }]} />
              ) : i === currentIndex ? (
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: '#fff',
                      width: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              ) : null}
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.authorRow}>
            <Avatar uri={group.user.avatarUrl} size="sm" />
            <Text style={[styles.username, { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }]}>
              {group.user.username}
            </Text>
            <Text style={[styles.time, { fontSize: fontSizes.xs }]}>
              {timeAgo(story.createdAt)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Touch areas */}
        <View style={styles.touchAreas}>
          <TouchableOpacity style={styles.touchArea} onPress={goPrev} activeOpacity={1} />
          <TouchableOpacity style={styles.touchArea} onPress={goNext} activeOpacity={1} />
        </View>

        {/* Reply input */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.replyInput}
          >
            <Text style={[styles.replyPlaceholder, { fontSize: fontSizes.sm }]}>
              Reply to {group.user.username}...
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="paper-plane-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1 },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'transparent',
  },
  progressBars: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 4,
  },
  progressTrack: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1,
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
    gap: 8,
  },
  username: { color: '#fff' },
  time: { color: 'rgba(255,255,255,0.7)' },
  closeBtn: { padding: 4 },
  touchAreas: {
    flex: 1,
    flexDirection: 'row',
  },
  touchArea: { flex: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 16,
    gap: 12,
  },
  replyInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  replyPlaceholder: { color: 'rgba(255,255,255,0.8)' },
  sendBtn: { padding: 4 },
});
