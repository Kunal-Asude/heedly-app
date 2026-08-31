# Aubade — heedly design system

Design system for **heedly**, an iOS app for people with chronic energy-limiting conditions (ME/CFS, Long COVID, POTS, Fibromyalgia). heedly does energy pacing and crash (PEM) prediction. Guiding principle: **radically low cognitive load** — users may have brain fog, light sensitivity, blurred vision. Everything is calm, legible, uncluttered.

Sources: the app screens in this project (`Aubade - Today.html`, `Aubade - Home.html`, `Aubade - Caution.html`, `Aubade - Rest Day.html` and their JSX modules `checkin.jsx`, `settings.jsx`, `patterns.jsx`, `notes.jsx`, `onboarding.jsx`, `yourdata.jsx`, `orb.jsx`) plus the brand brief supplied in-session.

## CONTENT FUNDAMENTALS
- Voice: **"quiet guardian"** — warm, calm, a friend noticing things, never an algorithm scoring you. Tender on Caution/Rest days; a light playful wink allowed only on Steady days. No fitness-app language, no toxic positivity, never imply the user should "push."
- Brand name is always lowercase **"heedly"**, even at sentence start.
- Second person ("you"), first-person-plural for the product ("We don't sell your data" — present tense, never say "never").
- Reassurance lines are part of the voice: "You can do this lying down." appears on every check-in screen.
- Energy states are exactly **Steady / Caution / Rest day** — no other words. State is never signaled by color alone: always word + color (and/or shape).
- Caveats and disclaimers stay at readable weight — never faint footnotes. Notes/report keeps "not a diagnostic instrument."
- Privacy copy is load-bearing: no account; data local on device with encrypted iCloud backup (never "your account"); "Manage subscription" (not "pause"); AI insights optional, anonymized patterns only.
- No emoji. Headlines ≤5 words with one key word in coral (e.g. "How did **yesterday land?**").

## VISUAL FOUNDATIONS
- **Palette**: warm dawn — blush, apricot, oat, lilac, coral. Backgrounds are soft atmospheric radial gradients (`--grad-dawn`) with a fractal-noise grain overlay at 0.035 opacity and gentle white blooms.
- **Type**: Comfortaa (rounded display) for headlines/editorial lines/screen titles — regular weight 400–500, no italics (Comfortaa has none; the accent is the coral color alone). System SF Pro stack for all body/UI. Hanken Grotesk only for the wordmark. Small-caps eyebrows: 11px, 0.16–0.2em tracking, uppercase, 600, muted ink.
- **Ink**: warm brown-rose (#463332–#5a4644); muted text is rgba(74,58,57,α) — α 0.7 body-soft, 0.55 muted, 0.38 faint (decorative only).
- **Surfaces**: reading content sits on warm near-opaque cream (#fffdfa cards, rgba(255,252,248,.82)). Frosted glass (blur 18px, saturate 150%) ONLY on the tab bar and bottom sheets — never under reading text.
- **Cards**: radius 22px, 1px warm border rgba(120,90,80,.16) or white glass border, warm shadow (rose-tinted, never gray).
- **Buttons**: primary CTA is the coral gradient `--grad-cta`, 56–60px tall, fully rounded (30px), cream text #fff8f4, inner top highlight, NO glow. Press state: scale(0.975) + reduced shadow. Quiet links are terracotta #b05334 underlined (underline-offset 3px, low-opacity underline that darkens on hover).
- **Pills/chips**: #fffdfa bg, 1.5px warm border, 999px radius; selected = coral gradient tint or full coral gradient.
- **State dots**: 7–9px circle with a 3–4px soft same-hue ring (box-shadow 0 0 0 3px rgba(state,0.16)) always next to the state word.
- **Toggles**: 46×28, off = rgba(120,90,90,.2), on = `--grad-toggle-on`, white knob.
- **Motion**: slow, gentle — orb "breathe" 6s ease-in-out; transitions .15–.2s ease; respects prefers-reduced-motion.
- **The orb (two-orb model)**: in-app states use a fill-and-color gauge orb — fill level + state color (sage Steady, amber Caution, coral Rest day). Marketing/no-state screens (Welcome, Paywall) use the full multi-color logo orb — lavender + peach + warm golden glow, full, no state tint. Implementation lives in `orb.jsx`.
- Layout: 390×844 screens; 28px side margins; floating pill tab bar bottom 30px; generous vertical air.

## ICONOGRAPHY
- Hand-drawn-feel thin-stroke inline SVGs defined in the app JSX (settings gear, chevrons, checks, tab icons) — stroke currentColor, ~1.5–1.8 stroke width, 18–21px. No icon font, no emoji, no unicode-as-icon.
- There is **no logo asset file**: the brand mark is the lowercase "heedly" wordmark (Hanken Grotesk) paired with the multi-color logo orb (drawn in code, `orb.jsx`). Do not invent a drawn logo.

## Index
- `styles.css` — global entry (@imports only)
- `tokens/` — colors.css, typography.css, surfaces.css, fonts.css, **dusk.css** (dark theme)
- `guidelines/` — foundation specimen cards (Design System tab); `dusk-*.card.html` = the Dusk group
- `components/core/` — Button, QuietLink, OptionPill, StateBadge, Card, Toggle, Eyebrow, Footnote
- `ui_kits/heedly/` — Today screen recreation
- App master pages (source of truth): the four `Aubade - *.html` files + JSX modules at root

## DUSK (dark theme)
Approved dark variant of Aubade. Tokens: `tokens/dusk.css`. Source of truth: `Aubade - Today Dusk Dark Mode.html` — the Today (Steady / Caution / Rest day), First days and Onboarding frames are the locked reference; every other screen derives from them.
- **Background**: flat near-black plum #191320 with soft violet/rust/mauve blooms (`--grad-dusk`). No grain, no bright glows.
- **Ink**: warm off-white #F3E7E1 for headings/body, mauve #C7B4BF for secondary, rgba(199,180,191,α) for muted (0.81 / 0.68 / 0.41).
- **Surfaces**: three tiers — flat card #3E2F44, deeper card/recessed panel #2E2738, and frosted plum rgba(51,37,56,0.72) + border rgba(199,180,191,0.14) for the tab bar, sheets and all unselected controls. Inset rows use rgba(25,19,32,0.55).
- **Card gradient**: horizontal plum→mauve→rust `--grad-card` (#2E2738 → #433143 → #664949), at 70% opacity over the base for settings / patterns / notes / planning cards. Always horizontal.
- **Primary action**: purple gradient `--grad-cta` (#634256 → #8A5D7C → #9E768E) — reserved for CTAs and the on-state toggle; never used decoratively.
- **Selected state**: ONE treatment everywhere — coral at 17% (`--surface-selected`) + border rgba(255,255,255,0.09) + soft inset top light. Applies to the active tab, connected wearable, condition chips, check-in tags, planning dates, settings segments, paywall plan.
- **State colors** retuned to the orb liquids: Steady #86C4B4, Caution #E8A87C, Rest day #E27A6C — still word + color, never color alone.
- **Icon badges**: dark pairs only — sage #4A6B55→#33503F with #C6DFCB glyph; rust #8A4B3C→#6B3A2E with #F3D9CD glyph. No pale cream circles.
- **The orb**: one dark-glass material. Headspace above the waterline is translucent plum (`--orb-glass`, ~60% over the background) with a mauve rim light, top veil, and white specular blooms. Liquid below the waterline is the luminous state tint (per-state `--orb-*-top/bot/alpha`, fills 70 / 50 / 30%). Exactly one surface wave line plus a faint echo ripple 6px beneath it. The brand orb (Welcome, Ready, Day 1, Paywall, notification icon) is the same glass with no waterline and a warm #E8B49A ember at the lower core.

## Intentional additions
None — component set is extracted 1:1 from the app screens.
