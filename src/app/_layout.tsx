import { DarkTheme, DefaultTheme, ThemeProvider, Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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

