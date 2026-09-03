# Steering Index — heedly-app

## What This System Is

heedly is an Expo 57 / React Native mobile app (iOS-first) for people with ME/CFS, Long COVID, POTS, Fibromyalgia, and related conditions. It is a **design-prototype / MVP stage** app — all data is mocked; no backend exists. The core value loop is: onboard → daily energy check-in → view today's forecast status → review weekly patterns/notes → adjust settings/notifications. The app is themed ("Dawn" light, "Dusk" dark) with a pixel-matched design system sourced from design-handoff HTML/CSS files.

---

## Subsystem Map

| Subsystem | Where It Lives | Steering Coverage |
|---|---|---|
| Routing / Navigation | `src/app/` (Expo Router file-based) | [20-architecture.md §Routing](20-architecture.md#routing) |
| Theme System | `src/contexts/ThemeContext.tsx`, `src/constants/themes/` | [20-architecture.md §Theme](20-architecture.md#theme-system), [10-specification.md §Theme](10-specification.md#theme-invariants) |
| Data Layer (mock) | `src/data/mock/`, `src/hooks/data/`, `src/types/` | [20-architecture.md §Data](20-architecture.md#data-layer), [50-contradictions.md](50-contradictions-and-open-questions.md) |
| Check-In Flow | `src/app/(check-in)/` | [30-behavior.md §Check-In](30-behavior.md#flow-1-daily-check-in) |
| Onboarding Flow | `src/app/(onboarding)/` | [30-behavior.md §Onboarding](30-behavior.md#flow-2-onboarding) |
| Today Screen | `src/app/(tabs)/index.tsx`, `src/components/today/` | [30-behavior.md §Today](30-behavior.md#flow-3-today-screen-status-display) |
| Design Tokens | `src/constants/themes/tokens.ts`, `src/constants/themes/{light,dark,trueBlack}.ts` | [10-specification.md §Tokens](10-specification.md#design-token-invariants) |
| Notifications | `src/services/notifications.ts` | [30-behavior.md §Notifications](30-behavior.md#flow-4-notification-routing) |
| Settings | `src/app/(tabs)/settings.tsx` | [30-behavior.md §Settings](30-behavior.md#flow-5-settings-and-theme-change) |
| Storage | `src/utils/storage.ts` | [20-architecture.md §Storage](20-architecture.md#storage) |

---

## Quick-Routing Table

| Touching… | Read first |
|---|---|
| Theme colors / visual tokens | [10-specification.md §Theme Invariants](10-specification.md#theme-invariants) + [20-architecture.md §Theme System](20-architecture.md#theme-system) |
| Any check-in screen | [30-behavior.md §Check-In Flow](30-behavior.md#flow-1-daily-check-in) + [20-architecture.md §Check-In Params](20-architecture.md#check-in-url-parameter-bus) |
| Themes & OLED mode | [10-specification.md §Theme Invariants](10-specification.md#theme-invariants) + [20-architecture.md §Theme System](20-architecture.md#theme-system) |
| Data hooks / mock data | [20-architecture.md §Data Layer](20-architecture.md#data-layer) + [50-contradictions.md §Mock-as-Prod](50-contradictions-and-open-questions.md#all-data-is-mock-no-real-backend-wired) |
| Notifications | [30-behavior.md §Notifications](30-behavior.md#flow-4-notification-routing) + [10-specification.md §Notification Contract](10-specification.md#notification-routing-contract) |
| EnergyOrb component | [10-specification.md §EnergyOrb](10-specification.md#energyorb-invariants) |
| Paywall / subscription | [50-contradictions.md §Paywall](50-contradictions-and-open-questions.md#paywall-is-a-stub) |
| Adding a new tab | [20-architecture.md §Tab Bar](20-architecture.md#tab-bar-visibility-rules) |
| Settings toggles | [50-contradictions.md §Settings State](50-contradictions-and-open-questions.md#settings-state-is-not-persisted) |

---

## Steering Files

| File | Responsibility |
|---|---|
| [10-specification.md](10-specification.md) | Law: invariants, guarantees, forbidden behaviors, failure contracts |
| [20-architecture.md](20-architecture.md) | City: subsystem ownership, dependency direction, allowed/forbidden paths |
| [30-behavior.md](30-behavior.md) | Motion: traced end-to-end flows, state transitions, failure/recovery |
| [40-conventions.md](40-conventions.md) | Conventions agents must preserve: naming, patterns, style |
| [50-contradictions-and-open-questions.md](50-contradictions-and-open-questions.md) | Unresolved conflicts between code, docs, and apparent intent |
| [60-verification.md](60-verification.md) | What verification actually exists (do not invent gates) |

---

## Stop Conditions — Halt and Ask a Human When:

1. **Ownership is unclear**: a change touches both the theme system and screen-level hardcoded colors simultaneously — the migration boundary is not settled.
2. **Mock→real API transition**: any data hook is being wired to a real backend. The mock contract and real contract may diverge in shape.
3. **Backend API synchronization**: client-side check-in persistence is storage-backed (`CheckInContext` + `checkinStorage`). Any future integration with a remote cloud backend must define API sync contracts.
4. **Paywall / subscription actions**: `handleSubscribe` is a no-op stub. Do not implement payment logic without explicit spec.
5. **New route group**: adding a new `(group)` requires understanding which routes get the DawnBackground, which share ThemeContext, and whether the tab bar should render.
6. **EnergyOrb design changes**: values are verbatim from design-handoff HTML/CSS. Changes require designer approval or updated handoff.

---

## Steering Maintenance Rules

- **Commit alongside code**: every PR that changes architecture, data contracts, flows, or conventions must update the relevant Steering file(s) in the same commit. Steering drift is a bug.
- **Harvest after each session**: at the end of a coding session, extract durable knowledge into Steering; discard task-specific noise. Do not carry task specs into Steering.
- **Weekly review**: on a recurring cadence, review all Steering files against current code. Check for: staleness vs. current code, accuracy of invariants, new contradictions. Use a capable model for this review.
- **Success criterion**: Steering is accurate, minimal, and high-signal. A future agent given a task should be able to locate relevant context in ≤2 file reads without loading screen code.
