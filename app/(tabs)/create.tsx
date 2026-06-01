import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { PrimaryButton } from '../../components/shared/PrimaryButton';
import { MAX_CAPTION_LENGTH } from '../../constants';

export default function CreatePostScreen() {
  const { colors, fontSizes, fontWeights, radius } = useTheme();
  const router = useRouter();

  const [media, setMedia] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const pickMedia = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setMedia(result.assets[0].uri);
    }
  };

  const handleShare = async () => {
    if (!media) return;
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1200));
    setLoading(false);
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.icon} />
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontSize: fontSizes.lg, fontWeight: fontWeights.semibold },
          ]}
        >
          New Post
        </Text>
        <TouchableOpacity onPress={handleShare} disabled={!media || loading}>
          {loading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text
              style={[
                styles.shareBtn,
                {
                  color: !media ? colors.textTertiary : colors.primary,
                  fontSize: fontSizes.md,
                  fontWeight: fontWeights.semibold,
                },
              ]}
            >
              Share
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Media picker */}
        <TouchableOpacity
          onPress={pickMedia}
          style={[
            styles.mediaPicker,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
          activeOpacity={0.8}
        >
          {media ? (
            <Image source={{ uri: media }} style={styles.mediaPreview} resizeMode="cover" />
          ) : (
            <View style={styles.mediaPlaceholder}>
              <Ionicons name="image-outline" size={48} color={colors.iconSecondary} />
              <Text style={[styles.addText, { color: colors.textSecondary, fontSize: fontSizes.md }]}>
                Tap to add photo or video
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {media && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: colors.surface }]}
              onPress={pickMedia}
            >
              <Ionicons name="images-outline" size={20} color={colors.icon} />
              <Text style={[{ color: colors.text, fontSize: fontSizes.sm }]}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: colors.surface }]}
              onPress={() => setMedia(null)}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
              <Text style={[{ color: colors.error, fontSize: fontSizes.sm }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Caption */}
        <View style={[styles.captionWrapper, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Write a caption..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.captionInput, { color: colors.text, fontSize: fontSizes.md }]}
            multiline
            maxLength={MAX_CAPTION_LENGTH}
          />
          <Text style={[styles.charCount, { color: colors.textTertiary, fontSize: fontSizes.xs }]}>
            {caption.length}/{MAX_CAPTION_LENGTH}
          </Text>
        </View>

        {/* Options */}
        <View style={[styles.optionsList, { borderTopColor: colors.border }]}>
          {[
            { icon: 'location-outline' as const, label: 'Add Location', value: location, onChange: setLocation },
          ].map((opt) => (
            <View
              key={opt.label}
              style={[styles.optionRow, { borderBottomColor: colors.border }]}
            >
              <Ionicons name={opt.icon} size={20} color={colors.icon} />
              <TextInput
                value={opt.value}
                onChangeText={opt.onChange}
                placeholder={opt.label}
                placeholderTextColor={colors.textTertiary}
                style={[styles.optionInput, { color: colors.text, fontSize: fontSizes.md }]}
              />
              <Ionicons name="chevron-forward" size={18} color={colors.iconSecondary} />
            </View>
          ))}

          {[
            { icon: 'people-outline' as const, label: 'Tag People' },
            { icon: 'pricetag-outline' as const, label: 'Add Tags' },
            { icon: 'accessibility-outline' as const, label: 'Accessibility' },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.label}
              style={[styles.optionRow, { borderBottomColor: colors.border }]}
            >
              <Ionicons name={opt.icon} size={20} color={colors.icon} />
              <Text style={[styles.optionLabel, { color: colors.text, fontSize: fontSizes.md }]}>
                {opt.label}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.iconSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: 0.5,
  },
  title: {},
  shareBtn: {},
  mediaPicker: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    aspectRatio: 1,
  },
  mediaPreview: { width: '100%', height: '100%' },
  mediaPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 40,
  },
  addText: {},
  editActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  captionWrapper: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    padding: 16,
  },
  captionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  charCount: {
    textAlign: 'right',
    marginTop: 8,
  },
  optionsList: {
    borderTopWidth: 0.5,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  optionLabel: {},
  optionInput: { flex: 1 },
});
