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
- Moving between screens (`yesterday` → `energy` → `body` → `noting` → `saved`) auto-persists updates to draft storage.
- The period question is a bottom sheet on `noting`, not a screen of its own. It opens when the `period` tag is selected, and from the CYCLE row on `saved` (`openPeriod=true`). Without the `period` tag, Save goes straight to `saved`.
- `period.tsx` exists in the route directory but **no route reaches it**; the sheet in `noting.tsx` is what collects the answer.
- An unexpected app reload, background kill, or device restart restores the in-progress draft without loss of user selections.
- First-time users (`fd-empty`) skip `yesterday` and begin directly at `energy`.
- Tapping "I'm in a crash" on `energy` or `body` shortcuts directly to `saved` with crash flags preserved.

#### 3. After Completion
- On the Saved screen, tapping **"Back to today"** commits the completed check-in **through the native bridge into SQLite** (`HeedlyNative.saveCheckIn`, and `saveVerdict` when a yesterday answer exists), indexed by the recorded date (`YYYY-MM-DD`). **Nothing is written before that tap.**
- `created_at` and `edited_at` are stamped by the storage layer, not sent by the app (ADR-0017). `completedAt`/`updatedAt` remain app-side bookkeeping with no storage destination.
- The active draft `@heedly/checkin_draft` is cleared.
- ⚠️ `@heedly/checkin_history` and `@heedly/last_checkin_date` are **not** written. `persistCheckInToHistory` has no call site outside its own file (source-verified), and the AsyncStorage manifest was observed empty after every completed check-in during the 2026-09-07 verification runs on the iPhone 17 Pro Simulator.

#### 4. Review
- Once the day's check-in is completed, the Today screen adapts its primary CTA to **"Review today's check-in"**.
- Tapping routes directly to `/(check-in)/saved`, populating the completed record for inspection without restarting the check-in flow.

#### 5. Edit Individual Answers
- On `saved.tsx`, the user taps an individual answer row (e.g., ENERGY).
- The target screen opens with the current answer pre-selected.
- The user adjusts the answer and proceeds back to `saved.tsx`.
- Edits accumulate in a separate draft layer held by `CheckInContext` (`beginEdit` / `commitEdit` / `cancelEdit`). A deliberate forward move commits them; **Back discards them**. Screens read `currentEntry`, which is the edit draft when one is open and the active entry otherwise.
- Removing the `period` tag while editing also clears `periodInfo`, so no `period:*` tag is written for that check-in. Verified on the iPhone 17 Pro Simulator, 2026-09-28: removing the tag left `headache` as the only row for that date and deleted `period:day-4`.
- The edited field updates immediately while **all unrelated answers remain untouched** (e.g. changing Energy does not clear Body, Tags, or Cycle). Verified at runtime on the iPhone 17 Pro Simulator, 2026-09-07 (run R6): changing only Energy left `body_level` and both `check_in_tag` rows unchanged.
- Tapping "Back to today" updates the existing row for that date. `created_at` is preserved and `edited_at` is stamped by storage when content actually changed; an unchanged re-save writes nothing and leaves `edited_at` NULL (ADR-0017, observed in R6 and P3-C).

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

**Completion is persisted.** `src/app/index.tsx` reads `ONBOARDING_COMPLETE_KEY`
and redirects to `/(tabs)` when it is `'true'`, otherwise to `/(onboarding)`.
`ready.tsx` writes that key and `START_DATE_KEY`; both are `erase` under
`STORAGE_KEY_POLICY`, so "Delete all my data" sends the person through onboarding
again.

⚠️ The native ingestion phase is **separate state** and the two can disagree.
Deleting data clears the key and the `backfill_state` row together, but a person
who connects Apple Health and then stops before `ready.tsx` is left `.ready`
natively while the interface still treats them as new.

```
/(onboarding)/index  [Welcome — EnergyOrb(empty, 152px) + wordmark]
  → "Get started" → router.push('/(onboarding)/connect')

/(onboarding)/connect  [Select wearable device]
  → user taps wearable card (toggles selectedDevice)
  → "Continue" → await HeedlyNative.connectHealthKit()
       rows > 0                      → router.push('/(onboarding)/conditions')
       rows 0, a tank already exists → router.push('/(onboarding)/conditions')
       rows 0, no tank               → NoDataSheet
       throw                         → NoDataSheet, different message
  → "Continue without Apple Health" in sheet → router.push('/(onboarding)/conditions')

/(onboarding)/conditions  [Select health conditions — multi-select chips]
  → "Continue" → router.push('/(onboarding)/ready')

/(onboarding)/ready  [heedly is ready — EnergyOrb(empty, 152px)]
  → "Go to today" → router.replace('/(tabs)')
```

**State:** wearable selection and conditions are local `useState` within each screen — not persisted, not passed forward. The first name and start date written by `ready.tsx` are the exception.

**Failure:** No validation. All steps can proceed with nothing selected.

⚠️ **Zero rows does not mean Apple Health is unreadable.** `connectHealthKit()`
returns rows written by *that call*, so an install already `.ready` with current
anchors legitimately returns 0. The tank check above is what separates "nothing
new" from "nothing there"; it is a narrower signal than the `getConnectionState()`
the contract declares but nothing implements. A real import too sparse to score a
tank still reaches the sheet. **Code-verified; the already-connected path has not
been runtime-verified.**

---

## Flow 3: Today Screen Status Display

**Today screen** (`src/app/(tabs)/index.tsx`) resolves the current status mode in this priority:

```
1. showEmptyState (no check-in has ever been recorded) → "fd-empty"
2. customMode (set by tapping the status badge — __DEV__ builds only)
3. bandMode (the real Tank band, via useTankState)
4. validParamMode (from URL param ?mode= — __DEV__ builds only)
5. Default: "fd-empty"
```

⚠️ `?mode=` is **no longer production navigation.** `saved.tsx` returns with
`router.replace('/(tabs)')` and no query string; no `?mode=` call site remains in
`src/`. `validParamMode` is gated on `__DEV__`, as the badge cycler already was.

⚠️ **`showEmptyState` short-circuits before `bandMode` is consulted**, so an
install holding a real band shows "Early days yet" until the first check-in — while
the orb, which reads `tankOrbState` directly, draws the real level on the same
screen. Observed on the Simulator, 2026-09-30. Not yet resolved; it is a product
question about what that screen should say, not only a branching bug.

Based on `statusMode`:
- `fd-empty` | `fd-wearable` → renders `LearningScreenLayout`
- `steady` | `caution` | `rest` → renders `TodayScreenLayout`

`useTodayChrome(statusMode)` provides `statusConfigs` (all 5 modes) and `whyModalConfigs` (caution + rest only). It was `useForecast(statusMode)` until 2026-10-04, when `useForecast()` became the engine-backed hook and the mock chrome was renamed out of its way.

⚠️ **The orb and the status indicator are engine-driven; the rest is not.** Both
read `useTankState`, refreshed by the `onTankUpdated` event — the orb follows the
tank band, and the indicator names the tank direction (`building` /
`holding steady` / `draining`). With no band the orb is `"empty"`, and with no
direction the indicator falls back to `statusConfigs`.

The indicator's **dot colour follows the direction, not the band** — the orb
answers "where are the reserves now", the badge answers "where are they
heading". The two are allowed to disagree: `good_reserves` + `draining` is a
real state and renders a green orb beside a red dot. Simulator-verified across
all five band/direction combinations on 2026-09-28.

The primary CTA is read from the store like its routing already was
(`isTodayCompleted` → "Review today's check-in"; an unrated previous day →
"Check in for yesterday"); it is **not** taken from `statusConfigs`, whose
`fd-empty` text claims a first check-in whatever the store holds.

**The headline and the three-day forecast row are engine-driven since 2026-10-04**
(Heedly ADR-0038). Both read `useForecast()` → `HeedlyNative.getForecast(startDate)`;
the copy layer is `src/copy/forecast.ts`, and the headline is rendered for
horizon 0 only. `BAND_MODE` — which made the tank band pick the headline, so the
two could never disagree — was deleted.

**They can still contradict the orb, and that is now correct rather than a
defect.** The orb answers "where are the reserves now" and the forecast answers
"how likely is a heavier stretch coming" (§6.1); a healthy orb above a Caution
headline is a reachable state. The one combination that cannot occur is
`nearly_empty` + `steady`. What remains mock on this screen is the surrounding
chrome from `statusConfigs` — see § Data Layer in `20-architecture.md`.

The bridge sends only the qualitative band. The internal 0–100 reserve never
crosses into JavaScript, so it is not available to this app by design.

**"Why" modal** opens when user presses the secondary link on caution/rest. It is a slide-up `Modal` (React Native), rendered inline in the screen. Its body — badge label, heading, subtitle, reassurance — comes from `whyModalConfigs[whyModalType]` and is mock. Its **reason row is engine-driven** since 2026-10-04: one reason, from the forecast's `reasonKey` plus `n` via `src/copy/forecast.ts`. One reason and not a drill-down, per `specs/bridge.ts` — v1 shows the reason and `n`, underlying days are v2.

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
