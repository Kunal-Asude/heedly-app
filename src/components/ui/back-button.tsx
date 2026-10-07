import { type Href, useRouter } from 'expo-router';
import { Pressable, type StyleProp, StyleSheet, Text, type ViewStyle } from 'react-native';

import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';

type Props = {
  /** Where to go when there is no previous screen, e.g. after a deep link. */
  fallback: Href;
  style?: StyleProp<ViewStyle>;
};

/**
 * The ‹ chevron used across the app. Always returns to the previous screen;
 * `fallback` is only for when nothing came before.
 */
export function BackButton({ fallback, style }: Props) {
  const router = useRouter();
  const theme = useAppTheme();
  const { isDark } = useThemeMode();

  const handlePress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      accessibilityRole="button"
      accessibilityLabel="Go back">
      <Text style={[styles.chevron, { color: isDark ? theme.ink.muted : 'rgba(74, 58, 57, 0.62)' }]}>
        ‹
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  chevron: {
    fontSize: 30,
    lineHeight: 30,
  },
});
