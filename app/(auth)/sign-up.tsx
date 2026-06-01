import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';
import { TextField } from '../../components/shared/TextField';
import { PrimaryButton } from '../../components/shared/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

export default function SignUpScreen() {
  const { colors, fontSizes, fontWeights } = useTheme();
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (username.trim().length < 3) e.username = 'Username must be at least 3 characters';
    if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, token } = await api.auth.signUp(username, email, password);
      setUser(user, token);
      router.replace('/(tabs)/');
    } catch {
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.logo,
                { color: colors.text, fontSize: 40, fontWeight: fontWeights.extrabold },
              ]}
            >
              Lumina
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: fontSizes.md }]}>
              Create your account
            </Text>
          </View>

          <View style={styles.form}>
            {errors.general && (
              <View
                style={[
                  styles.errorBanner,
                  { backgroundColor: colors.error + '18', borderColor: colors.error + '30' },
                ]}
              >
                <Text style={[{ color: colors.error, fontSize: fontSizes.sm }]}>
                  {errors.general}
                </Text>
              </View>
            )}
            <TextField
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              label="Username"
              error={errors.username}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              label="Email"
              error={errors.email}
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
            />
            <TextField
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 characters"
              label="Password"
              error={errors.password}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />
            <Text style={[styles.terms, { color: colors.textTertiary, fontSize: fontSizes.xs }]}>
              By signing up you agree to our{' '}
              <Text style={{ color: colors.primary }}>Terms</Text> and{' '}
              <Text style={{ color: colors.primary }}>Privacy Policy</Text>
            </Text>
            <PrimaryButton label="Create Account" onPress={handleSignUp} loading={loading} />
          </View>

          <View style={styles.footer}>
            <Text style={[{ color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
              <Text
                style={[
                  { color: colors.primary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
                ]}
              >
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingVertical: 40, gap: 32 },
  header: { alignItems: 'center', gap: 8 },
  logo: { letterSpacing: -1 },
  subtitle: {},
  form: { gap: 16 },
  errorBanner: { padding: 12, borderRadius: 8, borderWidth: 1 },
  terms: { lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
