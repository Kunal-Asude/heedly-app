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
  - The `isTrueBlack` boolean (OLED mode preference)
  - The resolved `DesignTokens` object (Dawn, Dusk, or True Black)
  - The `isDark` boolean
  - Persistence of both `themeMode` (`@heedly/theme_mode`) and `isTrueBlack` (`@heedly/is_true_black`) to AsyncStorage

### Two Hooks — Use Correctly
| Hook | Import path | Returns | Use for |
|---|---|---|---|
| `useTheme()` | `@/constants/themes` | `DesignTokens` | Components that only need tokens |
| `useAppTheme()` | `@/contexts/ThemeContext` | `DesignTokens` | Same as above; canonical hook per context docs |
| `useThemeMode()` | `@/contexts/ThemeContext` | `{ themeMode, setThemeMode, isTrueBlack, setTrueBlack, isDark, isLoaded }` | Settings screen, layout decisions, theme toggles |

**Note:** `useTheme()` from `@/constants/themes` is a thin wrapper around `useAppTheme()`. Both are correct. The old `@/hooks/use-theme.ts` file (which returned the simplified `Colors` object) was **deleted** (2026-08-28). Its renamed replacement `useLegacyTheme()` in `use-legacy-theme.ts` is only for Expo template scaffolding components. See [40-conventions.md §Theme Consumption](40-conventions.md#theme-consumption-pattern) for the full rule.

### Theme Resolution
```
isDark = themeMode === "dark" || (themeMode === "system" && systemScheme === "dark")

Resolution:
  !isDark                 → lightTheme (Dawn)
  isDark && !isTrueBlack  → darkTheme (Dusk)
  isDark && isTrueBlack   → trueBlackTheme (OLED)
```

For non-React execution contexts (such as background services and notification schedulers), `src/utils/getActiveTheme.ts` provides a standalone async resolver that reads persisted AsyncStorage keys directly.

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
- Check-in answers: transitioning from URL parameter bus to storage-backed `CheckInContext` and `checkinStorage`.

---

## Check-In State & Persistence Architecture

### Overview
The check-in subsystem architecture follows a decoupled, persistent data flow:
```
Check-in screens (yesterday, energy, body, noting, period, saved)
    ↓
CheckInContext (`src/contexts/CheckInContext.tsx`)
    ↓
Active Check-In State (in-memory React state)
    ↓
AsyncStorage persistence (`appStorage` in `src/utils/storage.ts`)
```

Check-in answer data must **not** be passed between screens through route/query parameters. The `CheckInContext` serves as the shared state bus for the active check-in.

### Two Persistence Concepts

#### A. Draft Storage
- **Key**: `@heedly/checkin_draft`
- **Type**: `Partial<CheckInEntry>`
- **Purpose**:
  - Stores an in-progress, unfinished check-in step-by-step.
  - Survives reloads (Metro hot/cold reload), app backgrounding, and operating system termination.
  - Automatically restored when the user re-enters the check-in flow or reopens the app.
  - Cleared upon successful submission on the Saved screen.

#### B. History Storage
- **Key**: `@heedly/checkin_history`
- **Type**: `Record<string, CheckInEntry>` (dictionary keyed by date string `YYYY-MM-DD`)
- **Purpose**:
  - Stores completed, final check-ins.
  - Keyed by the date being recorded (e.g., `{"2026-09-01": {...}}`).
  - Forms the durable foundation for historical views, weekly pattern trends, doctor-ready notes, and backend synchronization.

#### Convenience Reference
- **Key**: `@heedly/last_checkin_date`
- **Purpose**: Fast reference string (`YYYY-MM-DD`) to the most recently completed check-in date for instant query checks without loading the full history dictionary. It is **not** the primary source of historical check-in data.

### Date Semantics — Very Important
`CheckInEntry.date` represents the **DATE THE CHECK-IN IS ABOUT**. It does **NOT** represent the submission timestamp.

In Heedly, daily check-ins are retrospective ("Check in for yesterday"):
- If a user submits a check-in on **September 2** about **September 1**:
  - `date` = `"2026-09-01"`
  - `completedAt` = `"2026-09-02T08:30:00.000Z"`
  - `updatedAt` = `"2026-09-02T08:30:00.000Z"`

**Why this distinction matters:**
- **History & Trends**: Physiological correlations (e.g. HRV, sleep, pacing) must align with the day the symptoms and activities occurred, not the morning after.
- **Editing**: Modifying answers must update the record for the day that was lived, preserving the original `completedAt` timestamp.
- **Patterns**: Multi-day rollups require accurate calendar day alignment.
- **Future Backend Sync**: Retrospective timestamps prevent 24-hour offset discrepancies when syncing with wearables (Oura, Apple Health) or server databases.

### Check-In State Modes
`CheckInContext` manages two distinct operational modes:

1. **NEW CHECK-IN Mode**:
   - Entry: Today screen → "Check in for yesterday"
   - Flow: Initialize active entry for target date → update draft on each step → complete on Saved screen → save to `@heedly/checkin_history` → clear `@heedly/checkin_draft`.
2. **EDIT EXISTING CHECK-IN Mode**:
   - Entry: Today screen → "Review today's check-in"
   - Flow: Load existing record from `@heedly/checkin_history` into active state → user edits a specific answer (e.g., Energy) → returns to Saved screen → saves back to the **same historical date key** → updates `updatedAt` while preserving `completedAt` → **does not create a duplicate historical entry**.

### Hydration & Restoration
- When `CheckInProvider` mounts, it hydrates from `appStorage` to restore any existing draft and verify whether the check-in for the target date has already been completed.
- Exposes `isHydrating: boolean`. Screens must not assume empty/default answers while hydration is in progress.

### Layer Responsibilities
- **Screens (`src/app/(check-in)/`)**: Display current active values, invoke `updateEntry()`, handle UI interactions. Screens do not own persistent check-in state.
- **Context (`src/contexts/CheckInContext.tsx`)**: Owns active state, distinguishes NEW vs EDIT modes, restores state from storage, coordinates writes.
- **Storage Service (`src/services/checkinStorage.ts`)**: Handles `appStorage` read/write operations, manages key schemas, contains zero UI logic.
- **Types (`src/types/checkin.ts`)**: Defines the domain model (`CheckInEntry`, `CheckInConfig`, etc.).

### URL Parameter Rule
- **Check-in answer data must NOT be passed via route or query parameters** (no `energyIndex`, `bodyIndex`, `yesterdayId`, `tags`, or `periodInfo` in the URL).
- **Navigation-only parameters** representing UI/routing control remain permitted (e.g. `openPeriod=true`, `isFirstTime=true`).
- **Rule**: Navigation parameters describe navigation/modal UI state; `CheckInContext` describes check-in domain data.

### Current Implementation Status
- **Status**: **Fully Implemented**.
- **Services & Context**: `src/services/checkinStorage.ts` and `src/contexts/CheckInContext.tsx` are active. `CheckInProvider` wraps the app in `src/app/_layout.tsx`.
- **Screen Migration**: All screens (`yesterday.tsx`, `energy.tsx`, `body.tsx`, `noting.tsx`, `period.tsx`, `saved.tsx`) read and persist via `useCheckIn()`.
- **Answer URL Parameters**: Completely eliminated. Only UI-control parameters (`openPeriod=true`, `isFirstTime=true`) are permitted.
- **Data Deletion**: `resetAllData()` is wired into `src/app/(tabs)/your-data.tsx` to clear `@heedly/checkin_history`, `@heedly/checkin_draft`, `@heedly/last_checkin_date`, and reset Today CTA.

---

## Storage

`appStorage` (`src/utils/storage.ts`) is the only abstraction over AsyncStorage. Direct `AsyncStorage` imports elsewhere are a layering violation. Consumers:
- `ThemeContext` & `getActiveTheme` (`@heedly/theme_mode`, `@heedly/is_true_black`)
- `checkinStorage` (`@heedly/checkin_draft`, `@heedly/checkin_history`, `@heedly/last_checkin_date`)

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
