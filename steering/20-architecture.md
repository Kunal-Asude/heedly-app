# Architecture — heedly-app

> The "city": subsystem ownership, dependency direction, allowed/forbidden paths, state ownership.
> Claims are verified-in-code unless tagged **(inferred)**.

---

## Dependency Direction

```
src/app/ (screens)
  → src/components/ (UI components)
  → src/hooks/data/ (data hooks)
  → src/contexts/ (ThemeContext)
  → src/constants/themes/ (design tokens)
  → src/utils/storage.ts (persistence)
  → src/types/ (type definitions)
  → src/data/mock/ (mock data — temporary, to be replaced by API)
  → src/services/ (side-effecting services: notifications)
```

**Forbidden paths:**
- `src/types/` must not import from `src/components/`, `src/hooks/`, `src/app/`, or `src/data/`.
- `src/data/mock/` must not import from `src/hooks/` or `src/app/`.
- `src/constants/themes/` must not import from `src/contexts/`, `src/hooks/`, or `src/app/`.
- `src/utils/` must not import from `src/hooks/` or `src/app/`.
- Screens (`src/app/`) must not import directly from `src/data/mock/` — they must go through `src/hooks/data/`.

---

## Routing

### Route Groups
- `(onboarding)` — Stack navigator, no tab bar. Entry: `/(onboarding)/index.tsx`. Redirect from root `index.tsx`.
- `(tabs)` — Custom tab bar, persistent navigation. Layout owned by `src/components/app-tabs.tsx`.
- `(check-in)` — Stack navigator, no tab bar. Entered from Today CTA or notification.
- `paywall` — Single screen, `slide_from_right` animation, reachable from Settings.

### Initial Route
`src/app/index.tsx` always redirects to `/(onboarding)`. There is no persisted "has onboarded" flag — **every cold launch starts at onboarding**. See [50-contradictions.md](50-contradictions-and-open-questions.md#no-onboarding-completion-guard).

### Tab Bar Visibility Rules
The custom `HeedlyTabBar` component renders `null` (hides) on these routes:
- `notes`
- `your-data`
- `explore`
- Any route with `tabBarStyle.display === 'none'` in options
- Any route with `href: null` in options

When `settings` tab is active, the `Today` tab pill is highlighted (effective active tab = `"index"`).

---

## Theme System

### Ownership
- `ThemeContext` (`src/contexts/ThemeContext.tsx`) is the **single owner** of:
  - The current `themeMode` (`"light" | "dark" | "system"`)
  - The resolved `DesignTokens` object
  - The `isDark` boolean
  - Persistence of `themeMode` to AsyncStorage

### Two Hooks — Use Correctly
| Hook | Import path | Returns | Use for |
|---|---|---|---|
| `useTheme()` | `@/constants/themes` | `DesignTokens` | Components that only need tokens |
| `useAppTheme()` | `@/contexts/ThemeContext` | `DesignTokens` | Same as above; canonical hook per context docs |
| `useThemeMode()` | `@/contexts/ThemeContext` | `{ themeMode, setThemeMode, isDark, isLoaded }` | Settings screen, layout decisions, `isDark` conditionals |

**Note:** `useTheme()` from `@/constants/themes` is a thin wrapper around `useAppTheme()`. Both are correct. The old `@/hooks/use-theme.ts` file (which returned the simplified `Colors` object) was **deleted** (2026-08-28). Its renamed replacement `useLegacyTheme()` in `use-legacy-theme.ts` is only for Expo template scaffolding components. See [40-conventions.md §Theme Consumption](40-conventions.md#theme-consumption-pattern) for the full rule.

### Theme Resolution
```
ThemeContext.themeMode
  "light"  → lightTheme (DesignTokens)
  "dark"   → darkTheme  (DesignTokens)
  "system" → systemScheme === "dark" ? darkTheme : lightTheme
```
`trueBlack` is never resolved at runtime (see [50-contradictions.md](50-contradictions-and-open-questions.md#trueblack-theme-exists-but-is-not-wired)).

### Provider Position
`AppThemeProvider` wraps `RootNavigator` in `src/app/_layout.tsx`. This means ThemeContext is available to all routes. `ThemeProvider` from expo-router is a child of `AppThemeProvider`, fed by `isDark`.

---

## Data Layer

### Mock-First Architecture
All data in the app currently comes from `src/data/mock/`. The data hooks (`src/hooks/data/`) are thin wrappers that initialize React `useState` from mock constants. There is no real API, no network call, no cache, no real persistence of user data.

### Hook → Mock Mapping
| Hook | Mock constant | Type |
|---|---|---|
| `useForecast(mode)` | `MOCK_FORECAST_DATA` | `ForecastData` |
| `useCheckInConfig()` | `MOCK_CHECKIN_CONFIG` | `CheckInConfig` |
| `useUserSettings()` | `MOCK_USER_CONTEXT_DATA` | `UserContextData` |
| `useNotes()` | `MOCK_NOTES_DATA` | `NotesData` |
| `usePatterns()` | `MOCK_PATTERNS_DATA` | `PatternsData` |

### State Ownership
- `useForecast`, `useNotes`, `usePatterns`, `useCheckInConfig`: state is **read-only** to callers. No mutation is exposed.
- `useUserSettings`: exposes `updateSetting<K>(key, value)` which mutates in-memory state only (not persisted, not broadcast to other hook instances).
- Check-in answers: owned entirely by URL params — no hook, no context.

---

## Check-In URL Parameter Bus

Check-in screens communicate entirely through Expo Router URL params — effectively a URL-param state bus. Each screen reads its inbound params via `useLocalSearchParams` and passes them forward (spreading `...params`) to the next screen in the stack.

**All params are strings.** Components must parse `Number(params.energyIndex)`, compare `params.isFirstTime === 'true'`, etc.

**No validation is performed** on incoming params. A missing `energyIndex` defaults silently (screen uses a fallback).

---

## Storage

`appStorage` (`src/utils/storage.ts`) is the only abstraction over AsyncStorage. Direct `AsyncStorage` imports elsewhere would be a layering violation. Currently only ThemeContext uses it.

---

## Components: Ownership Boundaries

### `src/components/core/`
Reusable, theme-agnostic primitives. Must not import from `src/app/`. Must not have navigation logic.
- `EnergyOrb` — complex SVG animation component; reads theme directly via `useAppTheme()`
- `DawnBackground` — full-bleed SVG atmospheric background; reads theme
- `Button`, `Card`, `Eyebrow`, `Footnote`, `QuietLink`, `StateBadge`, `Toggle`, `NotificationTile` — UI atoms

### `src/components/today/`
Composition layer for the Today tab. Orchestrated by `TodayScreenLayout` and `LearningScreenLayout`. These components own their internal layout and token resolution; the screen (`src/app/(tabs)/index.tsx`) passes data and callbacks.

### `src/components/app-tabs.tsx`
Owns the custom tab bar. Navigation logic lives here (which tabs to show, which routes to highlight). This component holds the canonical `TABS` config array.

### `src/components/themed-text.tsx`, `src/components/themed-view.tsx`
Legacy helpers. Still present and used by collapsible. Use `useTheme()` directly in new components instead.

---

## Services

### `src/services/notifications.ts`
- Sets the notification handler (foreground display config) at module load time (side effect on import).
- Exports: `requestNotificationPermissions`, `sendTestCautionHeadsUpNotification`, `sendDailyCheckInReminder`.
- No scheduling logic for recurring/daily reminders exists yet — current functions fire a 2-second one-shot.
- No notification cancellation API exists.

---

## Constants: `src/constants/theme.ts` (legacy compat layer)

This file re-exports everything from the themes system plus backward-compat named exports:
`INK`, `CORAL`, `STATES`, `OAT`, `SURFACES`, `BORDERS`, `SHADOWS`, `RADII`, `TYPOGRAPHY` — all are **light theme values only**.

Also exports: `Fonts` (font family strings), `Spacing` (fixed scale), `BottomTabInset`, `MaxContentWidth`.

The `Colors` export maps to a simplified 5-key object — **not** the full DesignTokens. Do not use `Colors` in new heedly code. It is kept for the Expo scaffolding island only (`useLegacyTheme` in `src/hooks/use-legacy-theme.ts`).

---

## Scripts

- `scripts/reset-project.js` — moves `src/app/` content to `app-example/` and creates a blank app directory. Development utility only, not part of any CI pipeline.
