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
