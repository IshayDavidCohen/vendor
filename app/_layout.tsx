import { useEffect } from 'react';
import { View, Text, Platform, ActivityIndicator } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { useAuthStore } from '@/stores/auth.store';
import { Colors } from '@/constants/theme';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

/**
 * Root layout — font loading + auth-based navigation guard.
 *
 * Route access rules:
 * ┌─────────────────────────┬──────────────────────────────────────┐
 * │ State                   │ Allowed routes                      │
 * ├─────────────────────────┼──────────────────────────────────────┤
 * │ Unauthenticated         │ (marketing), (auth)                 │
 * │ Authenticated, !onboard │ onboarding                          │
 * │ Authenticated, onboard  │ (app)                               │
 * └─────────────────────────┴──────────────────────────────────────┘
 *
 * The (marketing) group is the public landing page — no auth required.
 * When real auth replaces BYPASS_AUTH, this guard works unchanged.
 */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans: PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    DMSans: DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Bold': DMSans_700Bold,
  });

  const fontsReady = fontsLoaded || fontError != null;

  const user = useAuthStore(s => s.user);
  const isOnboarded = useAuthStore(s => s.isOnboarded);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (fontsReady && Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsReady]);

  useEffect(() => {
    if (!fontsReady) return;

    const firstSegment = segments[0];
    const inAuthGroup = firstSegment === '(auth)';
    const inOnboarding = firstSegment === 'onboarding';
    const inMarketing = firstSegment === '(marketing)';

    if (!user && !inAuthGroup && !inMarketing) {
      // Unauthenticated user trying to access protected route → landing page.
      // We send to the landing page (not login) because the landing page IS
      // the public entry point and has its own "Sign In" CTA.
      router.replace('/(marketing)/landing');
    } else if (user && !isOnboarded && !inOnboarding) {
      // Authenticated but hasn't completed onboarding
      router.replace('/onboarding');
    } else if (user && isOnboarded && (inAuthGroup || inOnboarding || inMarketing)) {
      // Fully authenticated user on a public/auth page → send to app
      router.replace('/(app)/dashboard');
    }
  }, [user, isOnboarded, fontsReady, segments]);

  if (!fontsReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 16, color: Colors.mutedForeground }}>
          Loading Vendor...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Slot />
      <Toast />
    </View>
  );
}
