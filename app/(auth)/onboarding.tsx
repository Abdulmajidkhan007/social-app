import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/shared/PrimaryButton';
import { useTheme } from '../../hooks/useTheme';
import { StatusBar } from 'expo-status-bar';

const { height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const { fontSizes, fontWeights, spacing } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: 'https://picsum.photos/seed/onboard/800/1200' }}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.95)']}
          locations={[0.3, 0.6, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.content} edges={['bottom', 'top']}>
          <View style={styles.top}>
            <Text style={[styles.logo, { fontSize: 48, fontWeight: fontWeights.extrabold }]}>
              Lumina
            </Text>
            <Text style={[styles.tagline, { fontSize: fontSizes.lg }]}>
              Share your world in a new light
            </Text>
          </View>

          <View style={styles.bottom}>
            <PrimaryButton
              label="Get started"
              onPress={() => router.replace('/(auth)/sign-up')}
              size="lg"
            />
            <PrimaryButton
              label="Log in"
              onPress={() => router.replace('/(auth)/sign-in')}
              variant="ghost"
              size="lg"
            />
            <Text style={[styles.terms, { fontSize: fontSizes.xs }]}>
              By continuing you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  top: {
    marginTop: 80,
    gap: 12,
  },
  logo: {
    color: '#fff',
    letterSpacing: -1,
  },
  tagline: {
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
  },
  bottom: {
    gap: 12,
  },
  terms: {
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 8,
  },
  link: {
    color: 'rgba(255,255,255,0.8)',
    textDecorationLine: 'underline',
  },
});
