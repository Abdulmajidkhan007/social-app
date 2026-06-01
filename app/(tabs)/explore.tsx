import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { SearchBar } from '../../components/shared/SearchBar';
import { Avatar } from '../../components/shared/Avatar';
import { api } from '../../services/api';
import type { Post, User } from '../../types';
import { formatCount } from '../../utils';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 3) / 3;

export default function ExploreScreen() {
  const { colors, isDark, fontSizes, fontWeights } = useTheme();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trending, setTrending] = useState<Post[]>([]);
  const [searchResults, setSearchResults] = useState<{
    users: User[];
    posts: Post[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.explore.getTrending().then(setTrending);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await api.explore.search(query);
        setSearchResults(results);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const renderGridItem = ({ item, index }: { item: Post; index: number }) => {
    const isLarge = index % 7 === 0;
    const size = isLarge ? GRID_SIZE * 2 + 2 : GRID_SIZE;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/post/${item.id}`)}
        style={[styles.gridItem, { width: size, height: size }]}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: item.media[0].uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {item.media.length > 1 && (
          <View style={styles.multiMediaBadge}>
            <Ionicons name="copy-outline" size={14} color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSearchResults = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }

    if (!searchResults) return null;

    return (
      <FlatList
        data={[
          ...searchResults.users.map((u) => ({ type: 'user' as const, data: u })),
          ...searchResults.posts.map((p) => ({ type: 'post' as const, data: p })),
        ]}
        keyExtractor={(item) => `${item.type}-${item.data.id}`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={[{ color: colors.textSecondary, fontSize: fontSizes.md }]}>
              No results for "{query}"
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          if (item.type === 'user') {
            const user = item.data as User;
            return (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => router.push(`/profile/${user.username}`)}
                activeOpacity={0.8}
              >
                <Avatar uri={user.avatarUrl} size="md" />
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text
                      style={[
                        styles.username,
                        { color: colors.text, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
                      ]}
                    >
                      {user.username}
                    </Text>
                    {user.isVerified && (
                      <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                    )}
                  </View>
                  <Text style={[{ color: colors.textSecondary, fontSize: fontSizes.xs }]}>
                    {user.displayName} · {formatCount(user.followersCount)} followers
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }

          const post = item.data as Post;
          return (
            <TouchableOpacity
              style={styles.postSearchItem}
              onPress={() => router.push(`/post/${post.id}`)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: post.media[0].uri }}
                style={styles.postThumb}
                resizeMode="cover"
              />
              <View style={styles.postInfo}>
                <Text
                  style={[
                    { color: colors.text, fontSize: fontSizes.sm },
                  ]}
                  numberOfLines={2}
                >
                  {post.caption}
                </Text>
                <Text style={[{ color: colors.textSecondary, fontSize: fontSizes.xs, marginTop: 4 }]}>
                  by {post.author.username}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[styles.searchHeader, { borderBottomColor: colors.border }]}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search people, tags, places..."
          onFocus={() => setIsSearching(true)}
          onBlur={() => !query && setIsSearching(false)}
        />
      </View>

      {isSearching || query ? (
        renderSearchResults()
      ) : (
        <FlatList
          data={trending}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          renderItem={renderGridItem}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: fontSizes.lg, fontWeight: fontWeights.bold },
              ]}
            >
              Trending
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: {
    padding: 12,
    borderBottomWidth: 0.5,
  },
  sectionTitle: { padding: 16, paddingBottom: 8 },
  row: { gap: 2 },
  gridItem: {
    overflow: 'hidden',
    position: 'relative',
  },
  multiMediaBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  userInfo: { flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  username: {},
  postSearchItem: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  postThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  postInfo: { flex: 1 },
});
