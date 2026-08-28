# Contradictions and Open Questions — heedly-app

> Unresolved conflicts between code, docs, and apparent intent.
> Every entry has: what the code does / what's claimed / intent / severity.

---

## trueBlack Theme Exists But Is Not Wired

**Code:** `src/constants/themes/trueBlack.ts` and `src/constants/themes/index.ts` export `trueBlackTheme`. `ThemeMode` type includes `"trueBlack"`. `themes` registry object includes `trueBlack: trueBlackTheme`.

**Context:** `ThemeContext.tsx` only resolves to `lightTheme` or `darkTheme`. `AppThemeMode` type is `"light" | "dark" | "system"` — it does not include `"trueBlack"`.

**Settings UI:** `isTrueBlack` setting exists in `UserSettings` and `MOCK_USER_SETTINGS`. Settings screen renders a "True Black" toggle that updates local `useState(isTrueBlack)`. This local state is **never passed to ThemeContext**.

**Intent (inferred):** True Black was planned as a third selectable variant for dark mode (OLED optimization). The theme is defined and the setting UI exists, but the wiring between `isTrueBlack` toggle and `ThemeContext.resolvedTheme` was never implemented.

**Severity:** Medium. The feature is silently broken (toggle does nothing). Code generation agents must NOT attempt to wire it without a human decision on how `isTrueBlack` interacts with `themeMode` (is it a modifier on top of `dark`? a separate mode?).

---

## All Data Is Mock — No Real Backend Wired

**Code:** Every data hook (`useForecast`, `useCheckInConfig`, `useUserSettings`, `useNotes`, `usePatterns`) initializes from a hardcoded constant in `src/data/mock/`. Comments in `useForecast.ts` say: `"In the future, this state/fetcher will be backed by a query/API call"`.

**Implication:** User answers from check-in are never stored. Username shown in Notes is `"Sam"` (hardcoded in mock). Forecast status `"fd-empty"` is the default that any real user would see. Pattern data is fictional.

**Severity:** High architectural gap. Any task that "saves check-in data" or "fetches forecast from API" is a major architectural change requiring new storage/API design. Do not implement without a full spec.

---

## No Onboarding Completion Guard

**Code:** `src/app/index.tsx` always redirects to `/(onboarding)`. There is no AsyncStorage check for "has_onboarded" or any equivalent.

**Implication:** Every cold launch starts at the onboarding welcome screen. Returning users see onboarding again every time. This is clearly not intended production behavior.

**Severity:** Medium. Likely an intentional simplification for prototype/dev phase. Do not add a persistence guard without confirming intent (the guard would need to interact with actual user account state, which doesn't exist yet).

---

## Settings State Is Not Persisted

**Code:** Settings screen initializes all toggles from `MOCK_USER_SETTINGS` via `useUserSettings()`. Toggle state changes update local `useState` only. `updateSetting()` from `useUserSettings` updates in-memory state within that hook instance only — not persisted to AsyncStorage, not broadcast to other components.

**Exception:** `themeMode` is persisted — because it goes through `ThemeContext.setThemeMode()` which explicitly writes to AsyncStorage. This is the only setting that survives a restart.

**Severity:** Medium. For prototype, acceptable. Any task that "saves a setting" must define where it persists (AsyncStorage key, shape) and whether `useUserSettings` needs to become a context with persistence.

---

## Hardcoded Colors in Screens

**Code:** `paywall.tsx`, `noting.tsx`, and `period.tsx` define module-level `const COLORS = { ... }` objects with hardcoded Dawn (light) color values. These screens do not change appearance in dark mode for those elements.

**Dark.ts comment:** *"DO NOT hardcode any of these values inside individual screens."*

**Conflict:** The declared rule in dark.ts is violated by these three screens.

**Severity:** Low (cosmetic). These are known prototype gaps. New screens should not follow this pattern — use `useTheme()` and token values.

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

## Open Questions (Cannot Be Determined From Code)

1. **True user lifecycle:** What happens when a user "onboards" in production? Is there an account, an auth token, a server-side user ID? Nothing in the codebase suggests an answer.
2. **AI insights feature:** `isAiInsights` setting exists. No AI inference code exists anywhere. Where does AI-driven pattern analysis live?
3. **Weekly recap notification:** `isWeeklyRecap` setting exists. No scheduling or content generation for weekly recaps exists.
4. **Wearable data integration:** The connect screen and `DeviceId` type suggest Oura, Apple Watch, etc. No SDK calls, OAuth flows, or Health kit integration exists.
5. **Subscription model:** `paywall.tsx` shows annual/monthly plans. No pricing, entitlement checking, or RevenueCat/StoreKit integration exists.
