# Handoff: heedly — Dawn, Dusk & True Black

Three themes for the heedly app and website. **Dawn** (light, default), **Dusk** (dark), and **True Black / OLED** (accessibility mode for severe light sensitivity).

heedly is for people with chronic energy-limiting conditions (ME/CFS, Long COVID, POTS, fibromyalgia). Guiding principle: **radically low cognitive load** — users may have brain fog, migraine, and photophobia. No theme uses neon, harsh glare, or pure-white text on black.

---

## What this bundle is

The HTML files in `reference/` are **design references** — prototypes showing intended look and behaviour, not production code. Recreate the themes in the target codebase using its existing theming mechanism (CSS custom properties under a `[data-theme]` / `.dark` scope, Tailwind variants, a theme object — whatever is already there). Map the token files onto that mechanism. **Do not ship the HTML.**

**Fidelity: high.** Every colour, gradient, opacity, border and radius is final and sampled from the approved frames. Reproduce values exactly.

## The three themes at a glance

| | Dawn | Dusk | True Black |
|---|---|---|---|
| Scope attr | *(default)* | `[data-theme="dusk"]` | `[data-theme="oled"]` |
| Page background | warm cream + grain | plum base + soft blooms | flat `#000000` |
| Cards | cream, soft shadow | plum gradient, shadow + lit edge | flat `#16111B` + 1px hairline |
| Primary text | warm ink | `#F3E7E1` | `#E9DDD6` |
| Primary CTA | coral gradient | purple gradient | deep plum gradient |
| Shadows / blur | yes | yes | **none** |
| Orb | light glass | dark glass, luminous liquid | dark glass, dim ember |

Layout, spacing, type sizes, radii, iconography and copy are **identical across all three**. Only colour and surface treatment differ. A theme switch must never reflow the page.

## Theme selection

- Dawn is the default. Dusk follows `prefers-color-scheme: dark` unless the user has chosen a theme.
- True Black is **never automatic** — it is an explicit accessibility choice in Settings → Appearance, offered as a third option alongside Light and Dark. It is not "Dusk but darker"; treat it as its own theme.
- Persist the choice per-account, not per-device.

## Token files

| File | Theme |
|---|---|
| `tokens/colors.css`, `tokens/surfaces.css` | Dawn (light) |
| `tokens/dusk.css` | Dusk — scoped `[data-theme="dusk"]` |
| `tokens/oled.css` | True Black — scoped `[data-theme="oled"]` |
| `tokens/typography.css`, `tokens/fonts.css` | shared by all three |

Same token names across themes wherever a counterpart exists, so components never branch on theme.

---

# Dawn (light)

The established light theme — see `tokens/colors.css` / `tokens/surfaces.css` and `design-system-readme.md`. Reference: `reference/Aubade - Dawn (light).html`.

---

# Dusk (dark)

Reference: `reference/Aubade - Dusk (dark).html`. Locked frames: Today (Steady / Caution / Rest day), First days, Onboarding. Everything else derives from them.

### Background
Flat near-black plum base with soft coloured blooms. No grain in Dusk.
```css
background:
  radial-gradient(55% 30% at 6% 7%, rgba(62,52,88,0.9) 0%, rgba(62,52,88,0) 70%),
  radial-gradient(58% 30% at 96% 8%, rgba(69,49,45,0.9) 0%, rgba(69,49,45,0) 70%),
  radial-gradient(70% 34% at 50% 44%, rgba(74,55,66,0.75) 0%, rgba(74,55,66,0) 72%),
  radial-gradient(130% 30% at 50% 103%, rgba(53,43,40,1) 0%, rgba(53,43,40,0) 78%),
  #191320;
```

### Ink
| Role | Value |
|---|---|
| Headings, body | `#F3E7E1` |
| Secondary / labels | `#C7B4BF` |
| Body-soft | `rgba(199,180,191,0.81)` |
| Muted | `rgba(199,180,191,0.68)` |
| Faint (decorative only) | `rgba(199,180,191,0.41)` |

Never pure white. Caveats and disclaimers stay at readable weight — never faint.

### Surfaces — three tiers, chosen by role
| Token | Value | Use |
|---|---|---|
| `--surface-card` | `#3E2F44` | flat card |
| `--surface-card-deep` | `#2E2738` | recessed panel, stat tiles |
| `--surface-glass` | `rgba(51,37,56,0.72)` + `blur(22px) saturate(160%)` | tab bar, sheets, and ALL unselected controls |
| `--surface-well` | `rgba(25,19,32,0.55)` | inset rows on a gradient card |

Borders `rgba(255,255,255,0.09)` on cards, `rgba(199,180,191,0.14)` on glass. Divider `rgba(85,68,91,0.3)`.

### The two gradients
```css
/* card fill — always horizontal. outlook card, settings, patterns, notes */
--grad-card:      linear-gradient(90deg, #2E2738 0%, #433143 50%, #664949 100%);
--grad-card-soft: linear-gradient(90deg, rgba(46,39,56,0.7) 0%, rgba(67,49,67,0.7) 50%, rgba(102,73,73,0.7) 100%);
/* primary action — the only place this purple appears */
--grad-cta:       linear-gradient(90deg, #634256 0%, #8A5D7C 50%, #9E768E 100%);
```
CTA: text `#FFF6F1`, height 54–58px, radius 27–29px, shadow `0 8px 20px rgba(0,0,0,0.29), inset 0 1px 1px rgba(255,255,255,0.09)`. Press `scale(0.985)`. Never use the purple decoratively.

### Selected state — ONE treatment everywhere
```css
background: rgba(226,122,108,0.17);
border: 1px solid rgba(255,255,255,0.09);
box-shadow: 0 3px 8px rgba(0,0,0,0.36), inset 0 1px 1px rgba(255,255,255,0.09);
```
Active nav item, selected chips/tags/dates/segments, connected states, selected plan. **No solid coral fills, no coral borders** — explicitly rejected.

### Accents & states
Links and key words `#E8907A` (hover `#F0A28C`).

| State | Dot / UI | Tint bg |
|---|---|---|
| Steady | `#86C4B4` | `rgba(134,196,180,0.18)` |
| Caution | `#E8A87C` | `rgba(232,168,124,0.18)` |
| Rest day | `#E27A6C` | `rgba(226,122,108,0.16)` |

State is **never signalled by colour alone** — always word + colour.

### Icon badges — dark pairs only
```css
/* sage */ background: radial-gradient(circle at 38% 32%, #4A6B55, #33503F); color: #C6DFCB;
/* rust */ background: linear-gradient(135deg, #8A4B3C 0%, #7A4234 52%, #6B3A2E 100%); color: #F3D9CD;
```
No pale cream circles anywhere in Dusk.

---

# True Black / OLED (accessibility)

Reference: `reference/Aubade - True Black (OLED).html`. Tokens: `tokens/oled.css`.

**Intent: minimum emitted light.** On an OLED panel, `#000000` pixels are off. The theme's job is to emit as little light as possible while staying legible. The rule for every decision: *black, quiet, flat, legible.*

### Absolute rules
1. **Nothing glows, blooms, or gradients** — except the primary button (one gradient) and the orb's internal ember.
2. **No shadows and no `backdrop-filter`** anywhere. Containers are defined by a hairline, not by elevation.
3. **No pure white and no pure black text.** Ink is dimmed cream.
4. Layout, spacing, sizes and copy are unchanged from Dawn/Dusk.

### Background & surfaces
```css
background: #000000;   /* flat. no blooms, no grain, no gradient */
```
Every container — forecast card, sleep row, tab bar, sheets, popovers, tiles, controls:
```css
background: #16111B;                     /* flat, single fill */
border: 1px solid rgba(255,255,255,0.07); /* the hairline that defines it */
box-shadow: none;
```
The frosted-glass tier collapses into this one value; blur is off.

### Ink
| Role | Value |
|---|---|
| Primary text (incl. greeting) | `#E9DDD6` |
| Secondary text | `#A8979E` |
| Tertiary / meta | `#9A8A91` |
| Faint (decorative only) | `rgba(168,151,158,0.55)` |

`#E9DDD6` on `#000000` ≈ 15:1. Never raise this — brighter defeats the purpose of the mode.

### Primary button — one style for every CTA
```css
background: linear-gradient(135deg, #574049 0%, #241A20 100%);
color: #EADCD4;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.06); /* faint lit top edge */
border: none;
```
Reads as a lit, dimensional pill — brighter toward the upper-left, sinking into shadow at the lower-right — while staying quiet and dark, and clearly warmer and lighter than the `#16111B` cards and tab bar. Applies to *every* primary CTA: "How is it going?", "Start your first check-in", "Continue", "Next", "Save", "Go to today", the paywall CTA. No glow.

### Selected state
Flat `rgba(190,106,92,0.14)` with the standard hairline. No shadow, no lit edge.

### Energy states — dimmed
| State | Dot / label | Tile fill |
|---|---|---|
| Steady | `#6E9678` | same colour @ 14% |
| Caution | `#C29A5F` | same colour @ 14% |
| Rest day | `#BE6A5C` | same colour @ 14% |

Tiles are a **flat** fill of their colour at ~14% over the card — never a gradient. Coral italic headline accent: `#C97B60`.

### Icon badges — flat
```css
/* sage */ background: #2C4235; color: #9FB8A6;
/* rust */ background: #5A3128; color: #D8BFB4;
```

### The orb in True Black
Same structure as Dusk — headspace, single wave line, fill level — dimmed to embers. **The outer halo is removed entirely.**

```css
/* glass (headspace above the waterline) */
background: radial-gradient(circle at 50% 46%, rgba(14,10,17,0.86), rgba(10,7,13,0.9) 68%, rgba(6,4,8,0.94) 100%);
box-shadow: inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 10px 24px rgba(255,255,255,0.03);
/* veil */   radial-gradient(circle at 50% 32%, rgba(255,255,255,0.045), transparent 55%)
/* blooms */ radial-gradient(circle at 40% 35%, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 60%, transparent 72%)
```

The liquid is **not** a top-to-bottom two-tone fill (that is the Dusk recipe). It is a single deep state colour as a radial ember anchored at the bottom edge of the sphere, fading out well before the waterline — nothing reaches the rim:
```
radialGradient  cx = VB/2   cy = VB * 0.99   r = VB * 0.92   (userSpaceOnUse)
  0%    rgb(<ember>) @ 0.62
  42%   rgb(<ember>) @ 0.20
  68%   rgb(<ember>) @ 0.05
  100%  rgb(<ember>) @ 0
```
| State | Ember rgb | Fill |
|---|---|---|
| Steady | `96 140 112` (deep sage) | 70% |
| Caution | `160 110 58` (deep amber) | 50% |
| Rest day | `150 72 86` (deep rose) | 30% |

Wave line: `stroke rgba(233,221,214,0.16)` width 1.4, plus an echo 6px below at `0.04` width 1.2 — both in the same transform group so they move as one surface.

Brand orb (Welcome, First day, paywall, app icon, notification): same glass, no waterline, dimmed ember `rgba(150,88,58,…)` at the lower core.

### Orb animation — what may and may not move
This is a hard spec; getting it wrong is a bug users will report.

**Never animated:**
- **The fill level.** The waterline height is data (70 / 50 / 30%). It must not move one pixel — no draining, filling or rising.
- **The position of the internal ember.** The light concentration stays anchored; it must not drift, roam or slosh.

**Allowed, all slow, subtle and seamlessly looping:**
- Wave surface: horizontal drift of **exactly one wave period** (11s) plus a ±1.1-unit symmetric bob of the wave *shape* only, at the fixed waterline height.
- Bubbles: gentle slow drift, rising only within their own liquid (never up into the headspace).
- Whole-orb breath: 6s ease-in-out, `scale(1) → scale(1.015)` — position and level unaffected.

Every loop must be seamless: end state identical to start, or a smooth back-and-forth. No visible restart or jump. If an element can't loop seamlessly, it stays still.

**Implementation note (performance).** Do not animate a `clipPath` or a mask to make the wave. An animated clip defeats layer caching and re-rasterises the whole clipped area every frame, per orb — with a dozen orbs on screen it saturates the main thread. The working construction is: a **static** liquid body path filled with the ember gradient (level and glow fixed by construction), then an animated near-black "headspace" path painted **over** it whose lower edge is the drifting wave curve. Ordinary fill animation, no re-rasterisation. See `buildWater()` in the OLED reference.

Respect `prefers-reduced-motion`: disable breath, drift, bob and bubbles.

---

## New screen: "No data coming through"

Onboarding → **Connect your wearable**. Shown when the user taps a device tile, completes the iOS Health permission step, and **no data arrives**. This one state covers *both* denied permission and genuinely no data — the app cannot distinguish them, so the screen must not attribute a cause.

**Rules**
- Must **not** claim the wearable is connected. The tapped tile drops to a neutral "No data yet" state — never the connected treatment.
- Must **not** imply data is on its way. No spinners, no "syncing", no "we'll let you know".
- Not an error. No red, no alert icon, no "failed" or "unable to" language.
- Explain the **mechanism**, not the cause: wearable → Apple Health → heedly.

**Presentation.** A bottom sheet over the Connect screen; the screen behind drops to 50% opacity (True Black: 45%) under the standard scrim. Dismissing returns to the grid so another device can be tried or the step skipped. The sheet uses each theme's existing sheet surface — the same one the check-in and settings sheets use:

| Theme | Sheet | Scrim |
|---|---|---|
| Dawn | `#fbf3ec`, `0 -12px 34px rgba(120,90,90,0.22)` | `rgba(74,58,57,0.34)` + `blur(2px)` |
| Dusk | `rgba(51,37,56,0.72)` + `blur(22px) saturate(160%)` | `rgba(18,10,20,0.55)` + `blur(2px)` |
| True Black | flat `#16111B`, 1px `rgba(255,255,255,0.07)` top, no shadow | `rgba(0,0,0,0.66)`, **no blur** |

**Copy — exact, do not reword**
> **No data coming through.** *("coming through." carries the theme's accent colour)*
>
> heedly reads your **Oura** data through **Apple Health**, and nothing has arrived yet.
>
> 1. In **Apple Health → Sharing → Apps → heedly**, turn on sleep, heart rate and activity.
> 2. Open the **Oura app** once so it writes today's data across.
>
> `[ Open Apple Health ]`  ·  Check again

The device name is dynamic — substitute whichever tile the user tapped, in both the body line and step 2. Step numerals are a 23px circle filled with the theme's coral tint at 14–20%, numeral in the theme's coral. "Open Apple Health" is the standard primary button; "Check again" is the standard tertiary text button.

Reference: the `nodata` case in `reference/onboarding.jsx` and the `.nd-*` rules in each reference page.

---

## Shared across all themes

### Typography
- **Comfortaa** 400–500 for headlines, editorial lines, screen titles.
- System SF Pro stack for body and UI. **Hanken Grotesk** only for the "heedly" wordmark.
- Eyebrows: 11px, uppercase, 0.16–0.22em tracking, 600, muted ink.
- Brand name is always lowercase **heedly**.

### Radii
`--r-pill: 999px; --r-cta: 30px; --r-card: 22px; --r-tile: 16px; --r-input: 12px;` — identical in all three themes.

### Motion
Transitions 0.15–0.2s ease; press `scale(0.975–0.985)`; orb breath 6s. Same timings in all themes.

### Accessibility
- Minimum body size 15px; hit targets ≥44px.
- State is always word + colour, never colour alone.
- All three themes tested for AA on body copy; True Black exceeds it comfortably.
- `prefers-reduced-motion` disables all orb motion in every theme.

### Assets
No image assets beyond the wordmark: `assets/heedly-warm-ink.png` / `.svg`. The reference HTML loads it from `uploads/` — repoint or drop that reference when recreating. There is **no logo file**: the mark is the lowercase wordmark plus the code-drawn orb. Do not invent a drawn logo.

In Dusk the wordmark PNG is inverted via `filter: invert(0.9) hue-rotate(175deg) saturate(0.55) brightness(1.08)`. In True Black, prefer the SVG recoloured to `#E9DDD6`.

---

## Files

| Path | What it is |
|---|---|
| `reference/Aubade - Dawn (light).html` | Every app screen in Dawn |
| `reference/Aubade - Dusk (dark).html` | Every app screen in Dusk |
| `reference/Aubade - True Black (OLED).html` | Every app screen in True Black — **source of truth for OLED** |
| `reference/*.jsx` | Screen modules used by the reference pages (`patterns-oled.jsx` is the OLED-recoloured Patterns) |
| `tokens/*.css` | Token sets — see the table above |
| `design-system-readme.md` | Full Aubade design system doc |
| `assets/` | Wordmark |

To open a reference page, keep it in the same folder as the `.jsx` files — they load as siblings.
