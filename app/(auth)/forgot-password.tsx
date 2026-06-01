import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../components/shared/ScreenWrapper';
import { AppHeader } from '../../components/shared/AppHeader';
import { TextField } from '../../components/shared/TextField';
import { PrimaryButton } from '../../components/shared/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
  const { colors, fontSizes, fontWeights, spacing } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Reset Password" showBack />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {sent ? (
            <View style={styles.successState}>
              <View
                style={[
                  styles.successIcon,
                  { backgroundColor: colors.success + '20' },
                ]}
              >
                <Ionicons name="checkmark-circle" size={48} color={colors.success} />
              </View>
              <Text
                style={[
                  styles.successTitle,
                  { color: colors.text, fontSize: fontSizes.xl, fontWeight: fontWeights.bold },
                ]}
              >
                Email Sent
              </Text>
              <Text
                style={[
                  styles.successSubtitle,
                  { color: colors.textSecondary, fontSize: fontSizes.md },
                ]}
              >
                We've sent a reset link to {email}. Check your inbox.
              </Text>
              <PrimaryButton
                label="Back to Sign In"
                onPress={() => router.replace('/(auth)/sign-in')}
              />
            </View>
          ) : (
            <View style={styles.form}>
              <Text
                style={[styles.description, { color: colors.textSecondary, fontSize: fontSizes.md }]}
              >
                Enter the email associated with your account and we'll send you a link to reset your password.
              </Text>
              <TextField
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                label="Email"
                keyboardType="email-address"
                autoComplete="email"
                returnKeyType="done"
                onSubmitEditing={handleSend}
              />
              <PrimaryButton
                label="Send Reset Link"
                onPress={handleSend}
                loading={loading}
                disabled={!email.trim()}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 24 },
  form: { gap: 20 },
  description: { lineHeight: 24 },
  successState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {},
  successSubtitle: { textAlign: 'center', lineHeight: 24 },
});
