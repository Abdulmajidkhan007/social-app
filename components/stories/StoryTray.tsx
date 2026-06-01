import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from '../shared/Avatar';
import type { StoryGroup } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface StoryTrayProps {
  groups: StoryGroup[];
}

export function StoryTray({ groups }: StoryTrayProps) {
  const { colors, fontSizes } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();

  const handleStoryPress = (userId: string) => {
    router.push(`/story/${userId}`);
  };

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.user.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <TouchableOpacity
          style={styles.storyItem}
          activeOpacity={0.8}
          onPress={() => {}}
        >
          <View style={styles.addStoryWrapper}>
            <View
              style={[
                styles.addStoryContainer,
                { borderColor: colors.border },
              ]}
            >
              {user && (
                <Avatar uri={user.avatarUrl} size="lg" />
              )}
              <View
                style={[
                  styles.addIcon,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="add" size={14} color="#fff" />
              </View>
            </View>
          </View>
          <Text
            style={[styles.label, { color: colors.text, fontSize: fontSizes.xs }]}
            numberOfLines={1}
          >
            Your story
          </Text>
        </TouchableOpacity>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.storyItem}
          onPress={() => handleStoryPress(item.user.id)}
          activeOpacity={0.8}
        >
          <Avatar
            uri={item.user.avatarUrl}
            size="lg"
            hasStory
            isViewed={!item.hasUnviewed}
          />
          <Text
            style={[
              styles.label,
              {
                color: item.hasUnviewed ? colors.text : colors.textSecondary,
                fontSize: fontSizes.xs,
                fontWeight: item.hasUnviewed ? '600' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {item.user.username}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 14,
  },
  storyItem: {
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  addStoryWrapper: {
    position: 'relative',
  },
  addStoryContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  label: {
    textAlign: 'center',
  },
});
