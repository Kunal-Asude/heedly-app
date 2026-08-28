/**
 * useLegacyTheme — Expo template scaffolding hook.
 *
 * Returns the simplified `Colors` object ({ text, background, backgroundElement,
 * backgroundSelected, textSecondary }) used by the Expo starter template
 * components (ThemedText, ThemedView, Collapsible, explore.tsx).
 *
 * THIS IS NOT THE CANONICAL THEME HOOK.
 * For all heedly product screens and components, use:
 *   import { useTheme } from '@/constants/themes';
 * which returns the full DesignTokens object from ThemeContext.
 *
 * This hook exists separately to avoid the naming collision that previously
 * existed when src/hooks/use-theme.ts exported a `useTheme()` with a
 * different return shape than the canonical one. See git history and
 * steering/40-conventions.md for context.
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useLegacyTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return Colors[theme];
}
