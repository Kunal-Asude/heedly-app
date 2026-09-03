# Behavior — heedly-app

> Key flows traced from real code. State transitions, events, failure/recovery.
> "→" means navigation/call transition. "(param: value)" means URL param passed forward.

---

## Flow 1: Daily Check-In

### User Experience Lifecycle

#### 1. Before Completion
- The user taps **"Check in for yesterday"** on the Today screen (or enters via daily reminder notification).
- If an unfinished draft exists in `@heedly/checkin_draft`, its selections are automatically restored.

#### 2. During Check-In
- Moving between screens (`yesterday` → `energy` → `body` → `noting` → `period` → `saved`) auto-persists updates to draft storage.
- An unexpected app reload, background kill, or device restart restores the in-progress draft without loss of user selections.
- First-time users (`fd-empty`) skip `yesterday` and begin directly at `energy`.
- Tapping "I'm in a crash" on `energy` or `body` shortcuts directly to `saved` with crash flags preserved.

#### 3. After Completion
- On the Saved screen, tapping **"Back to today"** commits the completed check-in to `@heedly/checkin_history` indexed by the recorded date (`YYYY-MM-DD`).
- Sets `completedAt` and `updatedAt` ISO timestamps.
- The active draft `@heedly/checkin_draft` is cleared.
- `@heedly/last_checkin_date` is updated with the recorded date.

#### 4. Review
- Once the day's check-in is completed, the Today screen adapts its primary CTA to **"Review today's check-in"**.
- Tapping routes directly to `/(check-in)/saved`, populating the completed record for inspection without restarting the check-in flow.

#### 5. Edit Individual Answers
- On `saved.tsx`, the user taps an individual answer row (e.g., ENERGY).
- The target screen opens with the current answer pre-selected.
- The user adjusts the answer and proceeds back to `saved.tsx`.
- The edited field updates immediately while **all unrelated answers remain untouched** (e.g. changing Energy does not clear Body, Tags, or Cycle).
- Tapping "Back to today" updates the existing historical date entry with a new `updatedAt` timestamp without creating duplicate records or modifying `completedAt`.

### Date Semantics
- Check-ins are retrospective: the stored `date` represents the **day being recorded** (e.g., yesterday's date `2026-09-01`), NOT the submission date (`2026-09-02`).
- Submission timing is captured by `completedAt` and `updatedAt`.

### Implementation Status
- **Status**: **Fully Implemented and Active**.
- State is managed centrally via `CheckInContext` (`src/contexts/CheckInContext.tsx`) and backed by `appStorage` (`src/services/checkinStorage.ts`).
- URL parameters are no longer used for check-in answers.
- `resetAllData()` in `CheckInContext` is connected to the "Delete data" action in `your-data.tsx`, purging storage and returning the Today screen to its initial state.

**Failure recovery:** Back navigation from `yesterday` when `canGoBack() === false` → `router.replace('/(tabs)')`.

---

## Flow 2: Onboarding

**No persistence of completion state.** Every cold launch starts here (`src/app/index.tsx` redirects unconditionally to `/(onboarding)`).

```
/(onboarding)/index  [Welcome — EnergyOrb(empty, 152px) + wordmark]
  → "Get started" → router.push('/(onboarding)/connect')

/(onboarding)/connect  [Select wearable device]
  → user taps wearable card (toggles selectedDevice)
  → "Continue" → shows NoDataSheet bottom sheet
  → "Proceed anyway" in sheet → router.push('/(onboarding)/conditions')

/(onboarding)/conditions  [Select health conditions — multi-select chips]
  → "Continue" → router.push('/(onboarding)/ready')

/(onboarding)/ready  [heedly is ready — EnergyOrb(empty, 152px)]
  → "Go to today" → router.replace('/(tabs)')
```

**State:** wearable selection and conditions are local `useState` within each screen — not persisted, not passed forward.

**Failure:** No validation. All steps can proceed with nothing selected.

---

## Flow 3: Today Screen Status Display

**Today screen** (`src/app/(tabs)/index.tsx`) resolves the current status mode in this priority:

```
1. customMode (set by tapping the status badge — dev/debug cycle)
2. validParamMode (from URL param ?mode=)
3. Default: "fd-empty"
```

Based on `statusMode`:
- `fd-empty` | `fd-wearable` → renders `LearningScreenLayout`
- `steady` | `caution` | `rest` → renders `TodayScreenLayout`

`useForecast(statusMode)` provides `statusConfigs` (all 5 modes) and `whyModalConfigs` (caution + rest only).

**"Why" modal** opens when user presses the secondary link on caution/rest. It is a slide-up `Modal` (React Native), rendered inline in the screen. Data comes from `whyModalConfigs[whyModalType]`.

**Footer press** for "Planning something this week?" → `router.push('/(check-in)/plan')`.

---

## Flow 4: Notification Routing and Themed Attachments
 
**Handled in `src/app/_layout.tsx` `RootLayout` component and `src/services/notifications.ts`.**
 
Two cases for routing:
1. **App active/background**: `addNotificationResponseReceivedListener` fires → reads `data.screen` → routes.
2. **Cold launch**: `getLastNotificationResponseAsync()` → reads `data.screen` → routes.
 
```
data.screen === 'check-in'  → router.push('/(check-in)/yesterday')
otherwise                   → router.replace('/(tabs)')
```
 
**Theme-Wise Orb Attachments:**
When scheduling a notification (`sendTestCautionHeadsUpNotification` or `sendDailyCheckInReminder` in `src/services/notifications.ts`), the active theme is resolved asynchronously via `getActiveTheme()` (reads `@heedly/theme_mode` and `@heedly/is_true_black` from AsyncStorage). The matching static orb image (`orb_oled.jpg`, `orb_dusk.jpg`, or `orb_dawn.jpg`) is attached to the notification payload.
 
**Listener cleanup:** subscription is removed on unmount via `return () => subscription.remove()`.
 
---
 
## Flow 5: Settings and Theme Change
 
```
/(tabs)/settings
  - reads: useUserSettings() for toggle initial values
  - reads: useThemeMode() for { themeMode, setThemeMode, isTrueBlack, setTrueBlack, isDark }
  - reads: useAppTheme() for resolved tokens
 
User taps theme segment (Light/Dark/System):
  → setThemeMode(mode)  [ThemeContext.setThemeMode]
  → persists to AsyncStorage under @heedly/theme_mode
  → ThemeContext re-renders with new resolvedTheme
  → entire tree re-renders with new tokens
 
User toggles True Black:
  → setTrueBlack(val)   [ThemeContext.setTrueBlack]
  → persists to AsyncStorage under @heedly/is_true_black
  → ThemeContext switches resolvedTheme to trueBlackTheme (if isDark)
  → entire tree re-renders with OLED tokens
```

Other settings toggles (reminders, AI insights, etc.) are local state only. Not persisted. See [50-contradictions.md](50-contradictions-and-open-questions.md#settings-state-is-not-persisted).

---

## Flow 6: Plan Check-In (Optional)

```
/(tabs) [steady] → footer note "Planning something this week?" → router.push('/(check-in)/plan')

/(check-in)/plan
  → user selects a day + activity type
  → router.push('/(check-in)/plan-result', { dayName, activityLabel })

/(check-in)/plan-result
  → reads defaultPlanningPrediction from useCheckInConfig()
  → renders forecast prediction for selected day
  → "Back to Today" → router.replace('/(tabs)')
```

---

## State Transition: EnergyOrb

`EnergyOrb` (`src/components/core/EnergyOrb.tsx`) manages its own animation state internally:

```
Mount → initialize Reanimated shared values (bobY, wavePhase, haloOpacity, etc.)
  → if animated && !reduceMotion:
      start withRepeat(withTiming) loops for bob + wave
      start withDelay/withSequence for initial entrance halo
  → if !animated || reduceMotion:
      static render (no animations started)
```

`state` prop change → React re-render → `STATE_CONFIGS[state]` selects new fill level and tint colors → SVG re-renders.

**No cleanup issue observed** — Reanimated shared values are garbage collected with the component.

---

## App Bootstrap Sequence

```
1. SplashScreen.preventAutoHideAsync()  [module level, before any render]
2. RootLayout renders
3. useFonts() begins loading 7 custom fonts
4. Notifications.addNotificationResponseReceivedListener() registered
5. Notifications.getLastNotificationResponseAsync() called
6. AppThemeProvider mounts → begins AsyncStorage read for saved theme
7. ThemeContext.isLoaded = false initially
8. RootNavigator renders (inside AppThemeProvider)
9. AnimatedSplashOverlay renders
10. Stack renders → initial route = /(onboarding) (via index.tsx redirect)
11. Font load completes (or errors) → SplashScreen.hideAsync()
12. AsyncStorage read resolves → ThemeContext updates themeMode → isLoaded = true
```

**Note:** Steps 11 and 12 may complete in either order. The UI is visible (splash hidden) before theme preference is confirmed loaded. There is no loading gate in the UI for `isLoaded`.
