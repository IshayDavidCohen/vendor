import { useEffect, useState } from 'react';
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

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && !isOnboarded && !inOnboarding) {
      router.replace('/onboarding');
    } else if (user && isOnboarded && (inAuthGroup || inOnboarding)) {
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
