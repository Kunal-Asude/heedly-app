import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { CheckInProvider } from '@/contexts/CheckInContext';
import { NameProvider } from '@/contexts/NameContext';
import { AppThemeProvider, useThemeMode } from '@/contexts/ThemeContext';
import { reconcileDailyReminder } from '@/services/dailyReminder';
import { syncHeadsUpPreference } from '@/services/headsUp';
import { syncTrackingStartDate } from '@/services/trackingStart';

// ⚠️ TEMPORARY — bridge spike. Delete once a real screen consumes native data.
import HeedlyNative from '@/services/heedlyNative';

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

  // Carries installs that predate the native copy over on their next launch.
  useEffect(() => {
    void syncTrackingStartDate();
    void syncHeadsUpPreference();
    void reconcileDailyReminder();
  }, []);

  useEffect(() => {
    // Notification responses only exist on device. On web, expo-notifications
    // has no getLastNotificationResponse and nothing can ever be tapped.
    if (Platform.OS === 'web') return;

    // A first-ever check-in has no previous day to rate, so it opens at the
    // energy question. This runs above CheckInProvider, so it asks the store.
    const openCheckIn = async () => {
      let firstDay: string | null = null;
      try {
        firstDay = await HeedlyNative.getFirstCheckInDay();
      } catch {
        firstDay = null;
      }
      if (firstDay === null) {
        router.push({
          pathname: '/(check-in)/energy',
          params: { isFirstTime: 'true' },
        } as any);
      } else {
        router.push('/(check-in)/yesterday' as any);
      }
    };

    // 1. Handle notification click when app is already open or in background
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.screen === 'check-in') {
        void openCheckIn();
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
          void openCheckIn();
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
      <NameProvider>
        <CheckInProvider>
          <RootNavigator />
        </CheckInProvider>
      </NameProvider>
    </AppThemeProvider>
  );
}

