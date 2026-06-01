import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { AppHeader } from '../components/shared/AppHeader';
import { TextField } from '../components/shared/TextField';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { MAX_BIO_LENGTH } from '../constants';

export default function EditProfileScreen() {
  const { colors, fontSizes, fontWeights, radius } = useTheme();
  const router = useRouter();
  const { user, updateUser } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [website, setWebsite] = useState(user?.website ?? '');
  const [avatarUri, setAvatarUri] = useState(user?.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await api.users.updateProfile({ displayName, username, bio, website });
      updateUser({ displayName, username, bio, website, avatarUrl: avatarUri });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <AppHeader
        title="Edit Profile"
        showBack
        right={
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text
                style={[
                  styles.saveBtn,
                  { color: colors.primary, fontSize: fontSizes.md, fontWeight: fontWeights.semibold },
                ]}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarSection} onPress={pickAvatar} activeOpacity={0.8}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatarUri }} style={[styles.avatar, { borderColor: colors.border }]} />
            <View style={[styles.editOverlay, { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
              <Ionicons name="camera" size={22} color="#fff" />
            </View>
          </View>
          <Text style={[styles.changePhoto, { color: colors.primary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }]}>
            Change Profile Photo
          </Text>
        </TouchableOpacity>

        {/* Form */}
        <View style={styles.form}>
          <TextField
            value={displayName}
            onChangeText={setDisplayName}
            label="Display Name"
            placeholder="Your full name"
            autoCapitalize="words"
          />
          <TextField
            value={username}
            onChangeText={setUsername}
            label="Username"
            placeholder="username"
            autoCapitalize="none"
          />
          <View>
            <TextField
              value={bio}
              onChangeText={setBio}
              label="Bio"
              placeholder="Tell people about yourself..."
              multiline
              maxLength={MAX_BIO_LENGTH}
            />
            <Text
              style={[styles.charCount, { color: colors.textTertiary, fontSize: fontSizes.xs }]}
            >
              {bio.length}/{MAX_BIO_LENGTH}
            </Text>
          </View>
          <TextField
            value={website}
            onChangeText={setWebsite}
            label="Website"
            placeholder="yourwebsite.com"
            keyboardType="default"
            autoCapitalize="none"
          />
        </View>

        {/* Danger zone */}
        <View style={[styles.dangerSection, { borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.dangerBtn}>
            <Text style={[{ color: colors.error, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold }]}>
              Deactivate Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 40 },
  saveBtn: {},
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 0.5,
  },
  editOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhoto: {},
  form: {
    paddingHorizontal: 16,
    gap: 20,
  },
  charCount: { alignSelf: 'flex-end', marginTop: 4 },
  dangerSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 0.5,
    alignItems: 'center',
  },
  dangerBtn: { padding: 12 },
});
