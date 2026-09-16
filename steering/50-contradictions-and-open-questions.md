# Contradictions and Open Questions — heedly-app

> Unresolved conflicts between code, docs, and apparent intent.
> Every entry has: what the code does / what's claimed / intent / severity.

---

## ~~trueBlack Theme Exists But Is Not Wired~~ ✅ RESOLVED

**Was:** `trueBlackTheme` was defined in tokens but not wired in `ThemeContext.tsx`, and the `isTrueBlack` toggle in Settings was disconnected.

**Resolution (2026-08-31):**
- Tokens updated verbatim from design handoff files (`tokens/oled.css`, `reference/Aubade - True Black (OLED).html`).
- `ThemeContext.tsx` updated with `isTrueBlack` preference loading and persistence to `@heedly/is_true_black`.
- 3-way theme resolution active: Dawn (light), Dusk (dark), and True Black (OLED) when `isDark && isTrueBlack`.
- All app screens (Today, Patterns, Your Data, Settings, Check-in flows: Plan, Plan Result, Yesterday, Energy, Body, Noting, Period, Saved, and Onboarding) and core components (`EnergyOrb`, `DawnBackground`, `NotificationTile`, `SettingsCard`, `PatternCard`, `DataCard`) updated with exact OLED specifications.
- TypeScript check (`npx tsc --noEmit`) passes cleanly with 0 errors.

---

## Check-In Data Is Storage-Backed; Other Features Remain Mock (No Backend API)

**Code:** Completed check-ins are persisted to **SQLite through the native bridge** (`HeedlyNative.saveCheckIn` / `getCheckIn` / `saveVerdict`), not to AsyncStorage. `appStorage` retains only the in-progress **draft** (`@heedly/checkin_draft`). `@heedly/checkin_history` and `@heedly/last_checkin_date` remain defined in `checkinStorage.ts` but are never written — `persistCheckInToHistory` has no call site (source-verified 2026-09-07). Other data hooks (`useForecast`, `useUserSettings`, `useNotes`, `usePatterns`) continue to initialize from hardcoded constants in `src/data/mock/`.

**Implication:** User answers persist locally in the engine's SQLite store, which is what the engine reads. Drafts remain on AsyncStorage. Forecast status and pattern data remain local mock representations.

**Severity:** Medium architectural boundary. Any task wiring check-in data or forecast to a remote cloud API will require network synchronization. Local client persistence is complete.

---

## No Onboarding Completion Guard

**Code:** `src/app/index.tsx` always redirects to `/(onboarding)`. There is no AsyncStorage check for "has_onboarded" or any equivalent.

**Implication:** Every cold launch starts at the onboarding welcome screen. Returning users see onboarding again every time. This is clearly not intended production behavior.

**Severity:** Medium. Likely an intentional simplification for prototype/dev phase. Do not add a persistence guard without confirming intent (the guard would need to interact with actual user account state, which doesn't exist yet).

---

## Settings State Is Not Persisted

**Code:** Settings screen initializes all toggles from `MOCK_USER_SETTINGS` via `useUserSettings()`. Toggle state changes update local `useState` only. `updateSetting()` from `useUserSettings` updates in-memory state within that hook instance only — not persisted to AsyncStorage, not broadcast to other components.

**Exception:** `themeMode` and `isTrueBlack` are persisted — because they go through `ThemeContext` which explicitly writes to AsyncStorage (`@heedly/theme_mode` and `@heedly/is_true_black`).

**Severity:** Medium. For prototype, acceptable. Any task that "saves a setting" must define where it persists (AsyncStorage key, shape) and whether `useUserSettings` needs to become a context with persistence.

---

## ~~Hardcoded Colors in Screens~~ ✅ RESOLVED

**Was:** `noting.tsx`, `period.tsx`, and `paywall.tsx` contained module-level `const COLORS = { ... }` objects with hardcoded Dawn color values.

**Resolution (2026-08-31):**
- `paywall.tsx`, `noting.tsx`, and `period.tsx` were migrated to full dynamic theme support (Dawn, Dusk, and True Black OLED).
- TypeScript check (`npx tsc --noEmit`) passes cleanly with 0 errors.

---

## ~~`use-theme.ts` Hook — Legacy Path~~ ✅ RESOLVED

**Was:** `src/hooks/use-theme.ts` exported a `useTheme()` returning the `Colors` object (shape: `{ text, background, backgroundElement, backgroundSelected, textSecondary }`). The canonical `useTheme()` in `src/constants/themes/index.ts` returns `DesignTokens`. Same name, different return shapes, different import paths — a silent-wrong-answer trap.

**Resolution (2026-08-28):**
- `src/hooks/use-theme.ts` → **deleted**.
- `src/hooks/use-legacy-theme.ts` created — same logic, renamed export to `useLegacyTheme()`, with a doc comment clearly marking it as Expo template scaffolding and pointing to the canonical hook.
- 4 callers updated: `explore.tsx`, `themed-text.tsx`, `themed-view.tsx`, `collapsible.tsx` now import `useLegacyTheme` from `@/hooks/use-legacy-theme`.
- TypeScript (`tsc --noEmit`) passes. Lint clean. Zero remaining imports of the old path.

**Still true (not contradictions, just acknowledged state):**
- The entire scaffolding island (`explore.tsx`, `ThemedText`, `ThemedView`, `Collapsible`, `hint-row.tsx`, `use-legacy-theme.ts`, `use-color-scheme.ts`, `use-color-scheme.web.ts`) is unreachable in the heedly product (`explore` route has `href: null` in `app-tabs.tsx`). This is recognized dead code for the product; a future cleanup could delete it all.
- `use-color-scheme.ts` and `use-color-scheme.web.ts` are still present — they are only imported by `use-legacy-theme.ts`. They can be deleted if the entire scaffolding island is removed in a future cleanup pass.

---

## Paywall Is a Stub

**Code:** `handleSubscribe` in `paywall.tsx` calls `handleBack()`. No payment, no subscription logic exists.

**Severity:** Low for current phase. Major risk for future: do not add real payment logic without a full security and store-compliance review (App Store in-app purchase requirements, receipt validation, etc.).

---

## Notification Scheduling Is Development-Only

**Code:** Both `sendTestCautionHeadsUpNotification` and `sendDailyCheckInReminder` use a 2-second `TIME_INTERVAL` trigger. They are labeled "test" in the function names.

**Intent (inferred):** Real daily reminders should use a `DAILY` calendar trigger at a user-specified time (stored in `settings.reminderTime`). The infrastructure is not wired.

**Severity:** Medium. Do not treat these functions as production-ready notification scheduling.

---

## `your-data.tsx` — Navigation Relationship Unclear

**Code:** `your-data.tsx` exists in `(tabs)` with `href: null` in the tab bar options (it is hidden from tab bar). It can only be reached programmatically. No screen in the current codebase contains a `router.push('/(tabs)/your-data')` call.

**Severity:** Low. Screen may be reachable from a future deep-link or from Settings "Your Data" row. Currently unreachable in normal user flow.

---

## ~~Check-In Display Fallbacks Were Persisted As Real Answers~~ ✅ RESOLVED

Three related defects, all the same mechanism: UI state that existed only so a
control had something to show was written into storage, or onto the summary, as
though the person had answered. All three were confirmed by reproduction at
runtime, not by reading code.

**Was — P1 (`energy.tsx`, `body.tsx`).** `selectedIndex` served two purposes at
once: which option is highlighted, and what the person answered. It seeds to `2`
so the picker is not blank. `handleNext` and `handleCrashPress` wrote it
unconditionally, so advancing or tapping "I'm in a crash" past an untouched
picker stored `toLevel(2) = 3` — a **middle** answer for a question nobody
answered, which passes `CHECK (energy_level BETWEEN 1 AND 5)` and so failed
silently.

**Was — P2 (`noting.tsx`).** `selectedTags` — the one set that is both rendered
and stored — was seeded from `MOCK_INITIAL_SELECTED_TAGS`
(`social interaction`, `screens`, `warm room`) whenever the entry had no tags.
Nothing then distinguished seeded members from chosen ones, so all four exits via
`navigateToSaved` wrote them, and `handleToggleTag` carried them along with the
first genuine tap. It also affected editing: a stored check-in with no tags
hydrates as `tags: []`, hit the same fallback, and had the three defaults
silently *added* on save.

**Was — P3 (`saved.tsx`).** The summary substituted
`'okay'`/`'middling'`, `'tender'`, a rating of `3`, and the literal
`'social · screens · warm room'` when stored values were absent — asserting
answers the database did not hold. A display defect, not corruption. Revealed
rather than caused by the P1/P2 fixes: before them the screen and the store were
wrong together.

**Resolution (2026-09-07):**
- `handleNext` and `handleCrashPress` no longer write the level in either screen; `handleSelectLevel` already records a real choice as it is made.
- `initialTags` seeds only from `activeEntry.tags ?? []`. No replacement visual default was introduced.
- `saved.tsx` shows `skipped` with five empty dots for an unanswered level, and `nothing noted` for no tags. Rows stay visible because each is the edit affordance. The three accessibility labels interpolate the same corrected values.
- `npx tsc --noEmit` and `npx expo lint` both exit 0. **These proved nothing** — they passed cleanly on the broken code at every stage, which is why every claim below rests on runtime evidence instead.

**Verified through the real UI plus read-only SQLite from a separate process:**
R1 (unanswered Next → NULL/NULL/0 tags), R2 (real levels and tags persist
exactly), R3 (Skip path), R4 (toggling a tag off leaves only the remaining one),
R6 (editing a level preserves Body and both tags; `created_at` held, `edited_at`
stamped), R7-A/B/C (crash paths unaffected by the `handleNext` change), and
P3-A/B/C (unanswered displays honestly; real answers still display; an
unanswered check-in round-trips through edit without manufacturing values).

⚠️ **Not fully closed — do not read this entry as complete coverage:**
- **Crash while editing was never exercised.** Tapping "I'm in a crash" inside an edit flow is the one crash path with no runtime evidence.
- **No standalone period test.** `period:day-N` encoding was only ever exercised alongside real exposure tags (R2, R4).
- **Every positive control used equal Energy and Body values** (5/5, 4/4, 4/4), so an Energy/Body field swap has never been ruled out.
- **VoiceOver was never run.** The corrected accessibility labels are source-verified only.
- **A further eight-test regression pass was specified and never executed** — no UI automation is available in this environment.
- **Two historical observations remain unexplained** and are not resolved by this entry: an earlier manual test recorded 0 tag rows where the seeding should have produced three, and a completed check-in stored exactly the three chosen tags rather than those plus the three defaults.

---

## No Automated Protection Against These Regressions

**Code:** There is no `test` script in `package.json` and no test files anywhere in the repository (see `60-verification.md`).

**Implication:** The P1/P2/P3 fixes above are protected only by the manual runs listed in that entry. Re-introducing any of them would pass `tsc` and `expo lint` silently, exactly as the original defects did.

**Severity:** Medium-high for this specific area. The defects wrote plausible, in-range values that no constraint rejects.

---

## Open Questions (Cannot Be Determined From Code)

1. **True user lifecycle:** What happens when a user "onboards" in production? Is there an account, an auth token, a server-side user ID? Nothing in the codebase suggests an answer.
2. **AI insights feature:** `isAiInsights` setting exists. No AI inference code exists anywhere. Where does AI-driven pattern analysis live?
3. **Weekly recap notification:** `isWeeklyRecap` setting exists. No scheduling or content generation for weekly recaps exists.
4. **Wearable data integration:** The connect screen and `DeviceId` type suggest Oura, Apple Watch, etc. No SDK calls, OAuth flows, or Health kit integration exists.
5. **Subscription model:** `paywall.tsx` shows annual/monthly plans. No pricing, entitlement checking, or RevenueCat/StoreKit integration exists.
