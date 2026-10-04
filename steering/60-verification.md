# Verification — heedly-app

> What verification actually exists. Do not claim gates that don't exist.

---

## Automated Tests

**No automated tests exist in this repository.**

- No Jest config (`jest.config.js`, `jest.config.ts`)
- No Vitest config
- No test files (`*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`)
- No testing library dependencies in `package.json`

This was verified by filesystem search. The Expo README mentions Jest as an option but it is not set up.

**Scope:** this statement covers `heedly-app` only. The Swift core in the sibling
repository has **609 passing tests** (2026-10-03) — Engine 223, Storage 279,
Health 35, Ingest 72 — covering the engine, storage, exposure–lag estimation, the
weekly stability gate and HealthKit ingestion, but nothing in this app's screens.

⚠️ The absence of a runner here is now a blocker rather than a gap: the Patterns
copy layer (`src/copy/patterns.ts`) is pure TypeScript and was verified only by
one-off execution on 2026-10-02, not by a committed suite.

---

## Type Checking (TypeScript)

**TypeScript strict mode is enabled** (`"strict": true` in `tsconfig.json`).

This provides the following compile-time guarantees:
- All `DesignTokens` fields must be present in every theme implementation (interface completeness).
- `TodayStatusMode` is a typed union — invalid status strings are caught at build time.
- Check-in hook return shapes are typed — consumers get type errors on invalid property access.
- `expo-router` typed routes are enabled (`"typedRoutes": true` in `app.json`) — route strings are validated at build time where typed routes are used.

**How to run type check:**
```bash
npx tsc --noEmit
```

There is no automated CI that runs this. It must be run manually.

---

## Lint

ESLint is configured via `eslint.config.js` using `eslint-config-expo/flat`.

**How to run:**
```bash
npm run lint
# or: npx expo lint
```

No CI runs this automatically.

---

## Build Verification

The only way to verify the app compiles and runs is:
```bash
npx expo start
# or: npm run ios / npm run android
```

No automated build verification or CI pipeline exists.

---

## What Is NOT Verified

| Concern | Status |
|---|---|
| Runtime behavior of check-in flow | No automated test |
| Theme rendering correctness | No snapshot test |
| Notification delivery | Manual testing only |
| Storage persistence across restarts | Manual testing only |
| EnergyOrb animation correctness | No test — complex SVG component |
| Navigation flow completeness | No E2E test |
| Cross-platform (iOS vs Android) parity | No automated test |
| Dark mode visual correctness | No automated test |
| Today orb / tank band correctness | Depends on the native engine. Simulator-only; no physical device |
| Patterns tab correctness | Depends on the native engine. Observed on the iPhone 17 Pro Simulator (iOS 26.5) on 2026-10-02 and 2026-10-03 against the SQLite database and the rendered cards. **No physical device, no TestFlight.** The copy layer itself has no committed test |
| HealthKit permission-upgrade flow (Exercise Minutes) | **Not verified on a physical device and not verified through TestFlight.** TestFlight is configured; that is not the same as verified |

---

## Gates That Would Break the App

These are TypeScript-enforced gates (compiler errors, not runtime guards):

1. **Incomplete `DesignTokens` implementation** in a new theme — TypeScript will error on missing fields.
2. **Invalid `TodayStatusMode` string** passed to typed route params — TypeScript catches these.
3. **Missing required props** on `TodayScreenLayout` / `LearningScreenLayout` — TypeScript errors.

These are the only automated guardrails. Everything else requires human review or manual testing.

---

## Recommended Tests to Add (Not Implemented)

> (inferred priorities — not Steering fact, but useful context for planning)

1. Unit tests for `useCheckInConfig`, `useForecast`, `useUserSettings` — verify mock data shape matches types.
2. Integration tests for check-in flow navigation — verify param passing across all screens.
3. Snapshot tests for `EnergyOrb` per state (steady/caution/rest/empty/wearableRead) in both light and dark themes.
4. Type-checking CI step (`tsc --noEmit`) on every PR.
