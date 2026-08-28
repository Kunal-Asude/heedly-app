# Behavior — heedly-app

> Key flows traced from real code. State transitions, events, failure/recovery.
> "→" means navigation/call transition. "(param: value)" means URL param passed forward.

---

## Flow 1: Daily Check-In (Recurring User)

**Entry points:**
- A. CTA button on Today screen when `statusMode !== 'fd-empty'` → `router.push('/(check-in)/yesterday')`
- B. Notification tap with `data.screen === 'check-in'` → `router.push('/(check-in)/yesterday')`

**Happy path (no editing, no period):**

```
/(check-in)/yesterday
  → user selects option (lighter/same/heavier)
  → router.push('/(check-in)/energy', params: { yesterdayIndex, yesterdayLabel, isFirstTime: 'false' })

/(check-in)/energy
  → user selects energy level (0–4)
  → router.push('/(check-in)/body', params: { ...prev, energyIndex, energyLabel })

/(check-in)/body
  → user selects body level (0–4)
  → router.push('/(check-in)/noting', params: { ...prev, bodyIndex, bodyLabel })

/(check-in)/noting
  → user selects tags, optionally logs period day
  → router.push('/(check-in)/saved', params: { ...prev, tags, periodInfo })

/(check-in)/saved
  → displays summary of all answers
  → "Done" → router.replace('/(tabs)')
  → Edit links set isEditing: 'true' and push back to target screen
```

**First-time flow (fd-empty CTA):**

```
/(tabs) [fd-empty] → CTA → router.push('/(check-in)/energy', { isFirstTime: 'true' })
  (skips yesterday screen)
  → energy → body → noting → saved → /(tabs)
```

**Crash shortcut:**

```
/(check-in)/energy
  → "I'm crashing" press → router.push('/(check-in)/saved', { isCrash: 'true', energyIndex, energyLabel })
  (skips body and noting)
```

**Editing flow:**

```
/(check-in)/saved
  → tap any "edit" link → push to target screen with { ...currentParams, isEditing: 'true' }
/(check-in)/[any screen in edit mode]
  → select → router.push('/(check-in)/saved', { ...params })  (returns immediately)
```

**State changes:** URL params only. No persistent storage written.

**Failure:** Back navigation from `yesterday` when `canGoBack() === false` → `router.replace('/(tabs)')`.

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

## Flow 4: Notification Routing

**Handled in `src/app/_layout.tsx` `RootLayout` component.**

Two cases:
1. **App active/background**: `addNotificationResponseReceivedListener` fires → reads `data.screen` → routes.
2. **Cold launch**: `getLastNotificationResponseAsync()` → reads `data.screen` → routes.

```
data.screen === 'check-in'  → router.push('/(check-in)/yesterday')
otherwise                   → router.replace('/(tabs)')
```

**Listener cleanup:** subscription is removed on unmount via `return () => subscription.remove()`.

**Known gap:** `getLastNotificationResponseAsync` is called on every mount (not just fresh installs). If the last notification response is stale, the app will re-navigate on every hot reload. This is a development artifact.

---

## Flow 5: Settings and Theme Change

```
/(tabs)/settings
  - reads: useUserSettings() for toggle initial values
  - reads: useThemeMode() for { themeMode, setThemeMode, isDark }
  - reads: useAppTheme() for resolved tokens

User taps theme segment (Light/Dark/System):
  → setThemeMode(mode)  [ThemeContext.setThemeMode]
  → persists to AsyncStorage under @heedly/theme_mode
  → ThemeContext re-renders with new resolvedTheme
  → entire tree re-renders with new tokens

User toggles True Black:
  → setIsTrueBlack(val)  [local useState only]
  → NOT wired to ThemeContext — has no effect on rendered theme
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
