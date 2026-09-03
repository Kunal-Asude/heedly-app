import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { CheckInProvider } from '@/contexts/CheckInContext';
import { AppThemeProvider, useThemeMode } from '@/contexts/ThemeContext';

// ⚠️ TEMPORARY — bridge spike. Delete once a real screen consumes native data.
import HeedlyNative from '@heedly/native';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isDark } = useThemeMode();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(check-in)" />
        <Stack.Screen
          name="paywall"
          options={{
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const router = useRouter();

  const [loaded, error] = useFonts({
    'Comfortaa-Regular': require('../../assets/fonts/Comfortaa-Regular.ttf'),
    'Comfortaa-Medium': require('../../assets/fonts/Comfortaa-Medium.ttf'),
    'Comfortaa-SemiBold': require('../../assets/fonts/Comfortaa-SemiBold.ttf'),
    'Comfortaa-Bold': require('../../assets/fonts/Comfortaa-Bold.ttf'),
    'HankenGrotesk-Medium': require('../../assets/fonts/HankenGrotesk-Medium.ttf'),
    'HankenGrotesk-SemiBold': require('../../assets/fonts/HankenGrotesk-SemiBold.ttf'),
    'HankenGrotesk-Bold': require('../../assets/fonts/HankenGrotesk-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // ⚠️ TEMPORARY — bridge spike. Proves a value crosses from Swift into
  // JavaScript, and that HeedlyEngine is callable from the native module.
  // Delete this block once a real screen consumes native data.
  useEffect(() => {
    try {
      console.log('[BRIDGE] contract version:', HeedlyNative.getContractVersion());
      console.log('[BRIDGE] engine smoke test:', HeedlyNative.engineSmokeTest());
    } catch (e) {
      console.log('[BRIDGE] FAILED:', e);
    }
  }, []);

  useEffect(() => {
    // 1. Handle notification click when app is already open or in background
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.screen === 'check-in') {
        router.push('/(check-in)/yesterday' as any);
      } else {
        // Default / caution heads-up notification -> go directly to Today page
        router.replace('/(tabs)');
      }
    });

    // 2. Handle notification click on cold launch
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        if (data?.screen === 'check-in') {
          router.push('/(check-in)/yesterday' as any);
        } else {
          router.replace('/(tabs)');
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <AppThemeProvider initialMode="system">
      <CheckInProvider>
        <RootNavigator />
      </CheckInProvider>
    </AppThemeProvider>
  );
}

