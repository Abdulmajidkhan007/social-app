import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { AppHeader } from '../components/shared/AppHeader';
import { EmptyState } from '../components/shared/EmptyState';
import { mockPosts } from '../services/mock/posts';
import type { Post } from '../types';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 3) / 3;

export default function SavedScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [saved, setSaved] = useState<Post[]>([]);

  useEffect(() => {
    setSaved(mockPosts.filter((p) => p.isSaved));
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader title="Saved" showBack />
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="Nothing saved yet"
            subtitle="Save posts by tapping the bookmark icon"
          />
        }
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
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { gap: 2 },
  gridItem: { overflow: 'hidden' },
});
