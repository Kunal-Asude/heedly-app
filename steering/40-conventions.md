# Conventions — heedly-app

> Durable conventions agents must preserve. Verified in code unless tagged **(inferred)**.

---

## Naming

### Files and Directories
- Route files: `kebab-case.tsx` (matches Expo Router convention). e.g. `plan-result.tsx`, `your-data.tsx`.
- Component files: `PascalCase.tsx`. e.g. `EnergyOrb.tsx`, `TodayHeader.tsx`.
- Hook files: `use-kebab-case.ts` for general hooks; `useCamelCase.ts` for data hooks inside `src/hooks/data/`.
- Type files: `kebab-case.ts` in `src/types/`. e.g. `checkin.ts`, `forecast.ts`.
- Theme files: `camelCase.ts` in `src/constants/themes/`. e.g. `dark.ts`, `trueBlack.ts`.
- Mock data files: `mockCamelCase.ts` in `src/data/mock/`. e.g. `mockForecast.ts`.

### Exports
- Each directory with multiple files has an `index.ts` barrel re-exporting everything. Always update the barrel when adding a new file to these directories.
- Named exports preferred over default exports for components inside `src/components/`. Screen components in `src/app/` use `export default` (required by Expo Router).

### Aliases
- `@/` maps to `src/`. Always use `@/` imports inside `src/`. Never use relative `../` imports that cross directory boundaries.

---

## Theme Consumption Pattern

**Correct — use in any component that needs design tokens:**
```tsx
import { useTheme } from '@/constants/themes';
const theme = useTheme();
// Use: theme.ink.display, theme.coral.primary, etc.
```

**Correct — use when you also need isDark or setThemeMode:**
```tsx
import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';
const theme = useAppTheme();
const { isDark, setThemeMode } = useThemeMode();
```

**Forbidden — do NOT create a second hook named `useTheme` anywhere in the codebase:**
This caused a real naming-collision bug. `src/hooks/use-theme.ts` (deleted 2026-08-28) exported a `useTheme()` with the same name as the canonical hook but a completely different return shape (`Colors` object vs `DesignTokens`). See `50-contradictions-and-open-questions.md §resolved`.

**Expo template scaffolding only — use `useLegacyTheme` if touching scaffolding files:**
```tsx
import { useLegacyTheme } from '@/hooks/use-legacy-theme';
const theme = useLegacyTheme();
// Returns Colors shape: { text, background, backgroundElement, backgroundSelected, textSecondary }
// Only for: ThemedText, ThemedView, Collapsible, explore.tsx — Expo starter scaffolding
// Do NOT use in any heedly product screen or component.
```

**Forbidden — hardcoding theme values without reading from tokens:**
```tsx
// DO NOT DO THIS in theme-aware screens
color: '#F3E7E1'  // should be theme.ink.display
```

### Exception — Allowed Hardcoded Colors
`paywall.tsx`, `noting.tsx`, and `period.tsx` have module-level `const COLORS = {...}` objects with Dawn-only values. These are recognized technical debt (see [50-contradictions.md](50-contradictions-and-open-questions.md#hardcoded-colors-in-screens)). New screens must use theme tokens. Existing screens should migrate when touched for other reasons.

---

## Check-In Screen Pattern

Every check-in screen must:
1. Read all upstream params via `useLocalSearchParams<{ ... }>()` with explicit type annotation.
2. Pass all params forward by spreading `...params` when navigating to the next screen.
3. Override specific params as needed (e.g., `yesterdayIndex: yesterdayIdx`).
4. Handle `isEditing === 'true'` — route back to `/(check-in)/saved` instead of advancing.
5. Handle `canGoBack()` — fall back to `router.replace('/(tabs)')` if no back stack.

---

## Background Component Pattern

Every screen uses `<DawnBackground />` (or `<DawnBackground hasOrb={false} />`) as the first child of the root `<View>`. This component is `pointerEvents="none"` and `StyleSheet.absoluteFill` — it must never receive user events.

```tsx
<View style={styles.root}>
  <DawnBackground />          // always first
  <SafeAreaView ...>
    {/* screen content */}
  </SafeAreaView>
</View>
```

---

## StyleSheet Pattern

All styles use `StyleSheet.create({...})` defined at module level (outside the component). No inline style objects except for dynamic theme-token values, which are provided as `style={[styles.base, { color: theme.ink.display }]}`.

Shadow props follow platform conventions:
- iOS: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
- Android: `elevation`

Both are set together for cross-platform support.

---

## Typography

| Use case | Font family |
|---|---|
| Screen titles, headings, editorial | `Fonts.display.regular` / `.medium` / `.semiBold` / `.bold` (Comfortaa) |
| Brand wordmark only | `Fonts.wordmark.medium` / `.semiBold` / `.bold` (HankenGrotesk) |
| Body, labels, buttons, tabs, footnotes | System font (no explicit fontFamily — React Native default) |

Import: `import { Fonts } from '@/constants/theme';`

---

## Accessibility

- Interactive elements use `accessibilityRole` and `accessibilityLabel`.
- `accessibilityRole="button"` on `Pressable` elements.
- `accessibilityRole="tab"` on tab bar items.
- `accessibilityRole="switch"` on toggle controls.
- EnergyOrb respects `AccessibilityInfo.isReduceMotionEnabled()` — no animation when true.

---

## Expo Router Conventions

- **Do not use `useRouter()` for back navigation when `isEditing`** — always `router.push('/(check-in)/saved', {...params})` to preserve param state.
- Use `router.replace()` (not `router.push()`) when navigating away from onboarding or check-in completion — prevents back-navigation into the flow.
- Type-safe routes: `app.json` has `typedRoutes: true`. Use typed route strings. When using dynamic/templated routes, cast with `as any` only where the type system cannot infer the route (document with a comment).

---

## Comment Style

Comments in theme files follow the CSS-variable annotation pattern:
```ts
display: "#F3E7E1",   // --ink-display: #F3E7E1
```
This links each value back to its design-handoff CSS variable. Preserve these annotations when editing theme files.

Inline comments in component files use `// ── Section name ───` separator lines (dash-prefixed em-dash). Preserve this style in new sections.

---

## Design Token Comments in Screens

Screens reference design-handoff HTML/CSS via comments like:
```
// ── Design tokens (from Aubade Dawn HTML) ─────────────────────────────────────
// ── Exact Atmosphere Background (Aubade - Dusk (dark).html) ────────────────
```
When values come from a design handoff, annotate their source. This is the primary traceability mechanism.
