# Specification — heedly-app

> The "law": invariants, guarantees, allowed/forbidden behaviors, failure contracts.
> Every claim here is verified-in-code unless tagged **(inferred)**.

---

## Theme Invariants

### The Three Themes
- **Three** themes exist: `light` (Dawn), `dark` (Dusk), `trueBlack`.
- `trueBlack` is defined at `src/constants/themes/trueBlack.ts` and exported from `src/constants/themes/index.ts` but is **not wired into `ThemeContext`**.
- `ThemeContext` resolves only to `lightTheme` or `darkTheme`. `trueBlack` is unreachable at runtime. See [50-contradictions.md](50-contradictions-and-open-questions.md#trueblack-theme-exists-but-is-not-wired).

### Theme Contract
- `DesignTokens` interface (`src/constants/themes/tokens.ts`) is the **canonical contract** every theme must satisfy completely.
- Every theme file (`light.ts`, `dark.ts`, `trueBlack.ts`) must implement `DesignTokens` in full. Partial implementations are a type error.
- `dark.ts` comment: *"DO NOT hardcode any of these values inside individual screens."* This is the design intent, even if not perfectly followed everywhere (see [50-contradictions.md](50-contradictions-and-open-questions.md#hardcoded-colors-in-screens)).

### `DesignTokens` Shape
The interface has these top-level keys (all required):
`typography`, `radii`, `ink`, `coral`, `states`, `surfaces`, `borders`, `accents`, `shadows`, `components`

`components` includes: `header`, `cta`, `badge`, `supportingText`, `tabBar`, `forecastCard`, `energyOrb`, `background`, `onboarding`

`components.energyOrb.glass` is the most complex sub-structure: ~20 fields controlling the SVG glass-sphere rendering. Values must come from design handoff, not guessed.

### Theme Persistence
- User preference is persisted to `AsyncStorage` under the key `@heedly/theme_mode`.
- On cold start, `ThemeContext` loads the stored mode and updates state. Until loaded, `isLoaded = false`.
- Valid stored values: `"light"`, `"dark"`, `"system"`. Any other value is ignored; default (`"system"`) is used.

### Font Stack
Two custom font families are required for the app to render correctly:
- `Comfortaa` (Regular, Medium, SemiBold, Bold) — display/editorial typography
- `HankenGrotesk` (Medium, SemiBold, Bold) — wordmark brand usage only
- System font (SF Pro on iOS, `sans-serif` on Android) — body, labels, buttons, UI chrome

Fonts are loaded in `RootLayout` via `useFonts`. `SplashScreen.hideAsync()` is called only after `loaded || error`. If fonts fail to load (`error` truthy), the splash still hides — the app falls back to system fonts.

---

## Design Token Invariants

- `components.background.type` must be `"gradient"` for Dawn and `"solid"` for Dusk (verified in light/dark themes).
- All `EnergyOrb` state configs (`steady`, `caution`, `rest`, `wearableRead`, `learning`) must be present in the `glass` sub-token of every theme.
- The `cta.gradient` field is typed as `[string, string, ...string[]]` (at least 2 stops). Passing a single-stop array is a TypeScript error.
- `onboarding.chip.selectedGradient` is typed `readonly [string, string]` (exactly 2 stops).

---

## EnergyOrb Invariants

- `EnergyOrb` is located at `src/components/core/EnergyOrb.tsx` (~1100 lines).
- Accepts `state` or `waterState` (alias for backward compat). When both provided, `state` takes precedence.
- Valid states: `"empty" | "wearableRead" | "steady" | "caution" | "rest"`.
- `STATE_CONFIGS` inside `EnergyOrb.tsx` are verbatim from design handoff HTML/CSS and must not be changed without a new design handoff.
- `animated` prop defaults to `true`. When `AccessibilityInfo.isReduceMotionEnabled()` resolves true, animations are skipped.
- The component reads theme via `useAppTheme()` (directly from `ThemeContext`) and `useThemeMode()` — NOT from `useTheme()` from `constants/themes`.

---

## Check-In Flow Invariants

- Check-in state is carried entirely via Expo Router URL params (`useLocalSearchParams`). **There is no shared check-in state store** (no context, no global state).
- All params are strings (Expo Router limitation). Boolean params use the string `'true'` / `'false'`.
- The canonical params object passed between check-in screens:
  - `yesterdayIndex` (string: '1'|'2'|'3'), `yesterdayLabel` (string)
  - `energyIndex` (string: '0'–'4'), `energyLabel` (string)
  - `bodyIndex` (string: '0'–'4'), `bodyLabel` (string)
  - `tags` (string: pipe-separated `' · '`)
  - `periodInfo` (string, e.g. `'Day 3'` or absent)
  - `isFirstTime` ('true'|'false'), `isEditing` ('true'|'false'), `isCrash` ('true'|'false')
- The `isEditing` flag changes navigation: screens route back to `/(check-in)/saved` instead of advancing the flow.
- The `isCrash` flag, when `'true'`, tells the Saved screen to show a crash confirmation UI.
- Check-in answers are **never persisted** to `AsyncStorage` or any backend. On app restart, all check-in state is lost.

---

## Notification Routing Contract

Two notification types are handled:
1. `data.screen === 'check-in'` → navigate to `/(check-in)/yesterday`
2. All other / undefined `data.screen` → `router.replace('/(tabs)')`

This routing is handled in `_layout.tsx` via both `addNotificationResponseReceivedListener` (app active/background) and `getLastNotificationResponseAsync` (cold launch).

The notifications service (`src/services/notifications.ts`) configures foreground display with `shouldShowAlert: true`, `shouldSetBadge: false`.

---

## Status Mode Invariants

- `TodayStatusMode`: `"fd-empty" | "fd-wearable" | "steady" | "caution" | "rest"`
- `fd-empty` and `fd-wearable` are "learning states" — they render `LearningScreenLayout`, not `TodayScreenLayout`.
- `steady`, `caution`, `rest` are "forecast states" — they render `TodayScreenLayout`.
- The "Why" modal is available only for `caution` and `rest` states.
- The `ForecastData.statusConfigs` record must contain an entry for every `TodayStatusMode` — a missing key is a runtime null-deref.

---

## Storage Guarantee

`appStorage` (`src/utils/storage.ts`) provides a platform-transparent key/value store:
- Web: `localStorage` → in-memory fallback
- Native: `AsyncStorage` → in-memory fallback
- **All errors are silently swallowed.** Storage calls must never crash the app.
- In-memory fallback means data may be lost on process restart.
- Only one key is currently stored: `@heedly/theme_mode`.

---

## Failure Conditions

| Condition | Current handling |
|---|---|
| Font load fails | Splash hides; app continues with system fonts |
| AsyncStorage unavailable | Silently falls back to in-memory store |
| localStorage unavailable (web) | Silently falls back to in-memory store |
| Notification permission denied | Functions return `null`; no error thrown |
| `statusConfigs[mode]` missing | Runtime null-deref — no guard exists |
| Check-in back navigation when `canGoBack() === false` | Falls back to `router.replace('/(tabs)')` |
| No wearable selected during onboarding | UI proceeds (no validation enforced) |
| Paywall subscribe action | No-op; routes back |
