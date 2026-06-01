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

export default function SignInScreen() {
  const { colors, fontSizes, fontWeights, spacing } = useTheme();
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { user, token } = await api.auth.signIn(email, password);
      setUser(user, token);
      router.replace('/(tabs)/');
    } catch {
      setError('Invalid credentials. Please try again.');
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
            <Text
              style={[
                styles.subtitle,
                { color: colors.textSecondary, fontSize: fontSizes.md },
              ]}
            >
              Sign in to your account
            </Text>
          </View>

          <View style={styles.form}>
            {error ? (
              <View
                style={[
                  styles.errorBanner,
                  { backgroundColor: colors.error + '18', borderColor: colors.error + '30' },
                ]}
              >
                <Text style={[styles.errorText, { color: colors.error, fontSize: fontSizes.sm }]}>
                  {error}
                </Text>
              </View>
            ) : null}

            <TextField
              value={email}
              onChangeText={setEmail}
              placeholder="Email or username"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              label="Email"
            />
            <TextField
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              autoComplete="password"
              returnKeyType="done"
              label="Password"
              onSubmitEditing={handleSignIn}
            />
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotBtn}
            >
              <Text
                style={[
                  styles.forgotText,
                  { color: colors.primary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
                ]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
            <PrimaryButton
              label="Sign In"
              onPress={handleSignIn}
              loading={loading}
            />
          </View>

          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <Text style={[styles.orText, { color: colors.textTertiary, fontSize: fontSizes.sm }]}>
              OR
            </Text>
            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary, fontSize: fontSizes.sm }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-up')}>
              <Text
                style={[
                  styles.footerLink,
                  { color: colors.primary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
                ]}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingVertical: 40,
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    letterSpacing: -1,
  },
  subtitle: {},
  form: {
    gap: 16,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorText: {},
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {},
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {},
  footerLink: {},
});
