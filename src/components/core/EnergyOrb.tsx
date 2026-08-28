import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Path,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
} from "react-native-svg";

import { useAppTheme, useThemeMode } from "@/contexts/ThemeContext";

const AnimatedG = Animated.createAnimatedComponent(G);

export type EnergyOrbState =
  | "empty"
  | "wearableRead"
  | "steady"
  | "caution"
  | "rest";

export interface BubbleConfig {
  w: number;
  leftPercent: number;
  dur: number;
  delay: number;
}

export interface EnergyOrbProps extends ViewProps {
  state?: EnergyOrbState;
  /**
   * Alias for state to support existing usages
   */
  waterState?: EnergyOrbState;
  size?: number;
  bubbles?: BubbleConfig[];
  style?: ViewStyle | ViewStyle[];
  animated?: boolean;
  showHalo?: boolean;
}

/**
 * Exact state configs from Aubade - Today.html / Aubade - Dusk (dark).html (STATES array + buildWater).
 * Fill levels and tint RGB triplets are identical across Dawn and Dusk.
 */
interface StateConfig {
  fillLevel: number;
  topRgb: string;
  botRgb: string;
  alphaTop: number;
  alphaBot: number;
}

const STATE_CONFIGS: Record<EnergyOrbState, StateConfig> = {
  steady: {
    // STATES[0]: fill "70", tintTop "142 206 196", tintBot "74 172 184", alpha ".20", aBot = .30
    fillLevel: 70,
    topRgb: "rgb(142, 206, 196)",
    botRgb: "rgb(74, 172, 184)",
    alphaTop: 0.2,
    alphaBot: 0.3,
  },
  caution: {
    // STATES[1]: fill "50", tintTop "250 198 170", tintBot "243 176 142", alpha ".20", aBot = .30
    fillLevel: 50,
    topRgb: "rgb(250, 198, 170)",
    botRgb: "rgb(243, 176, 142)",
    alphaTop: 0.2,
    alphaBot: 0.3,
  },
  rest: {
    // STATES[2]: fill "30", tintTop "224 110 146", tintBot "188 62 104", alpha ".22", aBot = .32
    fillLevel: 30,
    topRgb: "rgb(224, 110, 146)",
    botRgb: "rgb(188, 62, 104)",
    alphaTop: 0.22,
    alphaBot: 0.32,
  },
  wearableRead: {
    // First-day wearable read uses steady fill
    fillLevel: 70,
    topRgb: "rgb(142, 206, 196)",
    botRgb: "rgb(74, 172, 184)",
    alphaTop: 0.2,
    alphaBot: 0.3,
  },
  empty: {
    fillLevel: 0,
    topRgb: "transparent",
    botRgb: "transparent",
    alphaTop: 0,
    alphaBot: 0,
  },
};

/**
 * Today screen bubbles (smaller sizes and gentle, slower rise)
 * Source: Aubade - Dusk (dark).html / Aubade - Today.html
 */
/**
 * Rising bubbles: 2 bubbles, first starts immediately, second starts 1s later.
 * Sized and timed for brisk, smooth rise from bottom to top of the sphere.
 */
const TODAY_BUBBLES: BubbleConfig[] = [
  { w: 13, leftPercent: 43, dur: 3600, delay: 0 },
  { w: 10, leftPercent: 57, dur: 3800, delay: 1000 },
];

const DEFAULT_BUBBLES: BubbleConfig[] = [
  { w: 13, leftPercent: 43, dur: 3600, delay: 0 },
  { w: 10, leftPercent: 57, dur: 3800, delay: 1000 },
];

// ─── Outer Halo ──────────────────────────────────────────────────────────────

/**
 * Theme-aware soft ambient outer halo (.orb::before).
 * Uses a generous 2.2x canvas and full Rect fill to guarantee zero sharp edges or clipping.
 */
function OuterHalo({
  size,
  state,
  isDark,
  glass,
}: {
  size: number;
  state: EnergyOrbState;
  isDark: boolean;
  glass: ReturnType<typeof useAppTheme>["components"]["energyOrb"]["glass"];
}) {
  const haloSize = size * 2.2;
  const haloOffset = -size * 0.6;

  let haloCenterY: number; // in SVG units (500 viewBox)
  let innerColor: string;
  let innerAlpha: number;
  let midColor: string;
  let midAlpha: number;

  if (isDark) {
    if (state === "rest") {
      // .s-rest .orb::before — circle at 50% 78%
      haloCenterY = 320;
      innerColor = glass.restHaloInnerColor;
      innerAlpha = glass.restHaloInnerAlpha;
      midColor = glass.restHaloMidColor;
      midAlpha = glass.restHaloMidAlpha;
    } else if (state === "empty") {
      // .ob-orb .orb::before — circle at 50% 70%
      haloCenterY = 295;
      innerColor = glass.brandHaloInnerColor;
      innerAlpha = glass.brandHaloInnerAlpha;
      midColor = glass.brandHaloMidColor;
      midAlpha = glass.brandHaloMidAlpha;
    } else {
      // steady / caution / wearableRead
      haloCenterY = 300;
      innerColor = glass.haloInnerColor;
      innerAlpha = glass.haloInnerAlpha;
      midColor = glass.haloMidColor;
      midAlpha = glass.haloMidAlpha;
    }
  } else {
    // Dawn: same halo for all states — circle at 50% 58%
    haloCenterY = 265;
    innerColor = glass.haloInnerColor;
    innerAlpha = glass.haloInnerAlpha;
    midColor = glass.haloMidColor;
    midAlpha = glass.haloMidAlpha;
  }

  return (
    <View
      style={[
        styles.haloContainer,
        {
          width: haloSize,
          height: haloSize,
          top: haloOffset,
          left: haloOffset,
        },
      ]}
      pointerEvents="none"
    >
      <Svg width={haloSize} height={haloSize} viewBox="0 0 500 500">
        <Defs>
          <SvgRadialGradient
            id="haloGrad"
            cx="250"
            cy={String(haloCenterY)}
            r="235"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={innerColor} stopOpacity={innerAlpha} />
            <Stop offset="25%" stopColor={innerColor} stopOpacity={innerAlpha * 0.68} />
            <Stop offset="45%" stopColor={midColor} stopOpacity={midAlpha} />
            <Stop offset="65%" stopColor={midColor} stopOpacity={midAlpha * 0.35} />
            <Stop offset="82%" stopColor={midColor} stopOpacity={midAlpha * 0.08} />
            <Stop offset="95%" stopColor={midColor} stopOpacity={0} />
            <Stop offset="100%" stopColor={midColor} stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>
        <Rect x="0" y="0" width="500" height="500" fill="url(#haloGrad)" />
      </Svg>
    </View>
  );
}

// ─── Dawn Glass Sphere ────────────────────────────────────────────────────────

/**
 * Dawn (light theme) glass sphere — warm peach core + lilac + blush accents.
 * Source: Aubade - Today.html .glass / .glass::after CSS.
 * Preserves exact Dawn appearance unchanged.
 */
function DawnGlassSphere({
  size,
  glass,
}: {
  size: number;
  glass: ReturnType<typeof useAppTheme>["components"]["energyOrb"]["glass"];
}) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 254 254">
        <Defs>
          <ClipPath id="dawnGlassClip">
            <Circle cx="127" cy="127" r="127" />
          </ClipPath>

          {/* 1. Peach Core */}
          <SvgRadialGradient
            id="dawnGlassCore"
            cx="127"
            cy="127"
            r="180"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={glass.coreInner} stopOpacity={glass.coreInnerAlpha} />
            <Stop offset="65%" stopColor={glass.coreMid} stopOpacity={glass.coreMidAlpha} />
            <Stop offset="100%" stopColor={glass.coreOuter} stopOpacity={glass.coreOuterAlpha} />
          </SvgRadialGradient>

          {/* 2. Warm Bottom Glow */}
          <SvgRadialGradient
            id="dawnGlassBottomGlow"
            cx="127"
            cy="203.2"
            r="280"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={glass.steadyGlowColor} stopOpacity={glass.steadyGlowAlpha} />
            <Stop offset="52%" stopColor={glass.steadyGlowColor} stopOpacity={0} />
            <Stop offset="100%" stopColor={glass.steadyGlowColor} stopOpacity={0} />
          </SvgRadialGradient>

          {/* 3. Soft Lilac Top Edge */}
          <SvgRadialGradient
            id="dawnGlassLilac"
            cx="83.82"
            cy="66.04"
            r="305"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ebdcf4" stopOpacity={0.88} />
            <Stop offset="58%" stopColor="#ebdcf4" stopOpacity={0} />
            <Stop offset="100%" stopColor="#ebdcf4" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 4. Blush Right */}
          <SvgRadialGradient
            id="dawnGlassBlush"
            cx="170.18"
            cy="83.82"
            r="311"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#fcd2c6" stopOpacity={0.62} />
            <Stop offset="62%" stopColor="#fcd2c6" stopOpacity={0} />
            <Stop offset="100%" stopColor="#fcd2c6" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 5. Frosted Milky Veil */}
          <SvgRadialGradient
            id="dawnGlassVeil"
            cx="127"
            cy="81.28"
            r="160"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={glass.veilAlpha} />
            <Stop offset="58%" stopColor="#ffffff" stopOpacity={0} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 6. Top Inner Rim Highlight */}
          <SvgRadialGradient
            id="dawnTopRim"
            cx="127"
            cy="0"
            r="160"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={glass.rimColor} stopOpacity={glass.rimTopAlpha} />
            <Stop offset="35%" stopColor={glass.rimColor} stopOpacity={glass.rimTopAlpha * 0.56} />
            <Stop offset="70%" stopColor={glass.rimColor} stopOpacity={0} />
          </SvgRadialGradient>

          {/* 7. Left Side Light */}
          <SvgRadialGradient
            id="dawnLeftLight"
            cx="0"
            cy="127"
            r="150"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={glass.rimColor} stopOpacity={glass.rimSideAlpha} />
            <Stop offset="50%" stopColor={glass.rimColor} stopOpacity={0} />
          </SvgRadialGradient>

          {/* 8. Bottom Warm Depth Shadow */}
          <SvgRadialGradient
            id="dawnBottomDepth"
            cx="127"
            cy="254"
            r="130"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#d68e70" stopOpacity={glass.rimBotAlpha} />
            <Stop offset="60%" stopColor="#d68e70" stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>

        <G clipPath="url(#dawnGlassClip)">
          <Circle cx="127" cy="127" r="127" fill="url(#dawnGlassCore)" />
          <Circle cx="127" cy="127" r="127" fill="url(#dawnGlassBottomGlow)" />
          <Circle cx="127" cy="127" r="127" fill="url(#dawnGlassLilac)" />
          <Circle cx="127" cy="127" r="127" fill="url(#dawnGlassBlush)" />
          <Circle cx="127" cy="127" r="127" fill="url(#dawnGlassVeil)" />
          <Circle cx="127" cy="127" r="127" fill="url(#dawnTopRim)" />
          <Circle cx="127" cy="127" r="127" fill="url(#dawnLeftLight)" />
          <Circle cx="127" cy="127" r="127" fill="url(#dawnBottomDepth)" />
        </G>
      </Svg>
    </View>
  );
}

// ─── Dusk Glass Sphere ────────────────────────────────────────────────────────

/**
 * Dusk (dark theme) glass sphere — dark translucent plum headspace.
 *
 * Source: Aubade - Dusk (dark).html & dusk.css
 *   --orb-glass: radial-gradient(circle at 50% 46%,
 *     rgba(58,42,63,0.58), rgba(52,38,58,0.62) 68%, rgba(44,32,50,0.7) 100%)
 *   --orb-rim:
 *     inset 0 -10px 30px rgba(233,214,226,0.12),
 *     inset 0  12px 30px rgba(233,214,226,0.18),
 *     inset 0 0 0 1.5px rgba(233,214,226,0.26),  ← crisp 1.5px hairline rim
 *     inset 6px 0 24px rgba(255,255,255,0.07)
 *   --orb-veil: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.12), transparent 55%)
 *
 * State-specific bottom glow:
 *   steady:  radial-gradient(120% 85% at 50% 110%, rgba(213,233,198,0.28), rgba(213,233,198,0) 52%)
 *   caution: radial-gradient(120% 80% at 50% 112%, rgba(250,198,170,0.26), rgba(250,198,170,0) 50%)
 *   rest:    radial-gradient(130% 65% at 50% 118%, rgba(232,132,140,0.24), rgba(232,132,140,0) 46%)
 *   empty:   --orb-ember: radial-gradient(95% 70% at 50% 98%,
 *              rgba(232,180,154,0.5), rgba(232,180,154,0.16) 45%, rgba(232,180,154,0) 68%)
 */
function DuskGlassSphere({
  size,
  state,
  glass,
}: {
  size: number;
  state: EnergyOrbState;
  glass: ReturnType<typeof useAppTheme>["components"]["energyOrb"]["glass"];
}) {
  let glowColor: string;
  let glowAlpha: number;
  let glowCenterY = 279.4; // 110% of 254
  let glowRadius = 158.5;  // 52% of 254 * 1.2
  let glowStopPercent = "52%";
  let isEmber = false;

  if (state === "empty") {
    isEmber = true;
    glowColor = glass.emberColor;
    glowAlpha = glass.emberAlpha0;
  } else if (state === "caution") {
    glowColor = glass.cautionGlowColor;
    glowAlpha = glass.cautionGlowAlpha;
    glowCenterY = 284.48; // 112% of 254
    glowRadius = 152.4;   // 50% of 254 * 1.2
    glowStopPercent = "50%";
  } else if (state === "rest") {
    glowColor = glass.restGlowColor;
    glowAlpha = glass.restGlowAlpha;
    glowCenterY = 299.72; // 118% of 254
    glowRadius = 151.9;   // 46% of 254 * 1.3
    glowStopPercent = "46%";
  } else {
    // steady & wearableRead
    glowColor = glass.steadyGlowColor;
    glowAlpha = glass.steadyGlowAlpha;
    glowCenterY = 279.4; // 110% of 254
    glowRadius = 158.5;  // 52% of 254 * 1.2
    glowStopPercent = "52%";
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 254 254">
        <Defs>
          <ClipPath id="duskGlassClip">
            <Circle cx="127" cy="127" r="127" />
          </ClipPath>

          {/* 1. Dark Plum Core Headspace (--orb-glass: circle at 50% 46%) */}
          <SvgRadialGradient
            id="duskGlassCore"
            cx="127"
            cy="116.84" // 46% of 254
            r="137"     // Exact circle radius from center to farthest boundary
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={glass.coreInner} stopOpacity={glass.coreInnerAlpha} />
            <Stop offset="68%" stopColor={glass.coreMid} stopOpacity={glass.coreMidAlpha} />
            <Stop offset="100%" stopColor={glass.coreOuter} stopOpacity={glass.coreOuterAlpha} />
          </SvgRadialGradient>

          {/* 2. Per-State Bottom Glow / Ember */}
          {isEmber ? (
            // --orb-ember: warm bottom core glow
            <SvgRadialGradient
              id="duskGlassGlow"
              cx="127"
              cy="242"
              r="185"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={glowColor} stopOpacity={0.62} />
              <Stop offset="35%" stopColor={glowColor} stopOpacity={0.32} />
              <Stop offset="65%" stopColor={glowColor} stopOpacity={0.10} />
              <Stop offset="100%" stopColor={glowColor} stopOpacity={0} />
            </SvgRadialGradient>
          ) : (
            // Steady / Caution / Rest bottom glow
            <SvgRadialGradient
              id="duskGlassGlow"
              cx="127"
              cy={String(glowCenterY)}
              r={String(glowRadius)}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={glowColor} stopOpacity={glowAlpha} />
              <Stop offset={glowStopPercent} stopColor={glowColor} stopOpacity={0} />
              <Stop offset="100%" stopColor={glowColor} stopOpacity={0} />
            </SvgRadialGradient>
          )}

          {/* 3. Frosted Veil (--orb-veil: circle at 50% 30%, transparent 55%) */}
          <SvgRadialGradient
            id="duskGlassVeil"
            cx="127"
            cy="76.2" // 30% of 254
            r="139.7" // 55% of 254
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={glass.veilAlpha} />
            <Stop offset="55%" stopColor="#ffffff" stopOpacity={0} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 4. Top Inner Rim Highlight (--orb-rim: inset 0 12px 30px rgba(233,214,226,0.18)) */}
          <SvgRadialGradient
            id="duskRimTop"
            cx="127"
            cy="0"
            r="140"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.26} />
            <Stop offset="50%" stopColor={glass.rimColor} stopOpacity={glass.rimTopAlpha} />
            <Stop offset="100%" stopColor={glass.rimColor} stopOpacity={0} />
          </SvgRadialGradient>

          {/* 5. Bottom Inner Shadow (--orb-rim: inset 0 -10px 30px rgba(233,214,226,0.12)) */}
          <SvgRadialGradient
            id="duskRimBot"
            cx="127"
            cy="254"
            r="130"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={glass.rimColor} stopOpacity={glass.rimBotAlpha} />
            <Stop offset="100%" stopColor={glass.rimColor} stopOpacity={0} />
          </SvgRadialGradient>

          {/* 6. Left Side Light (--orb-rim: inset 6px 0 24px rgba(255,255,255,0.07)) */}
          <SvgRadialGradient
            id="duskRimSide"
            cx="0"
            cy="127"
            r="120"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={glass.rimSideAlpha} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 7. Luminous Gradient Hairline Rim Stroke */}
          <SvgLinearGradient id="duskRimStroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.52} />
            <Stop offset="25%" stopColor={glass.rimColor} stopOpacity={0.36} />
            <Stop offset="60%" stopColor={glass.rimColor} stopOpacity={0.18} />
            <Stop offset="85%" stopColor={glass.emberColor} stopOpacity={0.32} />
            <Stop offset="100%" stopColor={glass.emberColor} stopOpacity={0.46} />
          </SvgLinearGradient>

          {/* 8. Soft Edge Rim Bloom */}
          <SvgLinearGradient id="duskRimStrokeSoft" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.25} />
            <Stop offset="30%" stopColor={glass.rimColor} stopOpacity={0.15} />
            <Stop offset="70%" stopColor={glass.rimColor} stopOpacity={0.08} />
            <Stop offset="100%" stopColor={glass.emberColor} stopOpacity={0.22} />
          </SvgLinearGradient>
        </Defs>

        <G clipPath="url(#duskGlassClip)">
          {/* Layer 1: Dark plum core headspace */}
          <Circle cx="127" cy="127" r="127" fill="url(#duskGlassCore)" />
          {/* Layer 2: State-specific bottom glow / ember */}
          <Circle cx="127" cy="127" r="127" fill="url(#duskGlassGlow)" />
          {/* Layer 3: Frosted veil */}
          <Circle cx="127" cy="127" r="127" fill="url(#duskGlassVeil)" />
          {/* Layer 4: Top diffuse rim highlight */}
          <Circle cx="127" cy="127" r="127" fill="url(#duskRimTop)" />
          {/* Layer 5: Bottom diffuse rim shadow */}
          <Circle cx="127" cy="127" r="127" fill="url(#duskRimBot)" />
          {/* Layer 6: Left side light */}
          <Circle cx="127" cy="127" r="127" fill="url(#duskRimSide)" />
          {/* Layer 7: Soft outer rim halo glow */}
          <Circle
            cx="127"
            cy="127"
            r="125.8"
            fill="none"
            stroke="url(#duskRimStrokeSoft)"
            strokeWidth={2.4}
          />
          {/* Layer 8: Exact crisp hairline glass rim */}
          <Circle
            cx="127"
            cy="127"
            r="126.3"
            fill="none"
            stroke="url(#duskRimStroke)"
            strokeWidth={1.4}
          />
        </G>
      </Svg>
    </View>
  );
}

// ─── Water Wave ───────────────────────────────────────────────────────────────

/**
 * Animated SVG Water Wave — exact translation of buildWater(st) from Aubade - Today.html.
 *
 * Source: buildWater(st)
 *  - Linear gradient (x1=0, y1=B, x2=0, y2=VB) from topColor (alphaTop) to botColor (alphaBot)
 *  - Liquid fill path
 *  - Secondary ripple line at translate(0 6) with stroke-opacity 0.10, stroke-width 1.2
 *  - Main crest line with stroke-opacity 0.40, stroke-width 1.4
 *  - Both lines drift + bob in the same animated group
 */
function WaterWave({
  state = "steady",
  reduceMotion = false,
}: {
  state?: EnergyOrbState;
  reduceMotion?: boolean;
}) {
  const fgDrift = useSharedValue(0);
  const bobAnim = useSharedValue(0);

  const cfg = STATE_CONFIGS[state] || STATE_CONFIGS.steady;

  useEffect(() => {
    if (reduceMotion) {
      fgDrift.value = 0;
      bobAnim.value = 0;
      return;
    }

    // Drift: '0 0' to '-120 0' over 13s linear (gentler horizontal wave motion)
    fgDrift.value = withRepeat(
      withTiming(1, { duration: 13000, easing: Easing.linear }),
      -1,
      false,
    );

    // Bob motion: 0 -> 2.5 -> 0 over 7.5s with spline easing (0.4 0 0.6 1)
    bobAnim.value = withRepeat(
      withSequence(
        withTiming(2.5, {
          duration: 3750,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        }),
        withTiming(0, {
          duration: 3750,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        }),
      ),
      -1,
      false,
    );
  }, [bobAnim, fgDrift, reduceMotion]);

  const waveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: fgDrift.value * -120 },
      { translateY: bobAnim.value },
    ],
  }));

  // Wave parameters matching buildWater(st) exactly:
  const VB = 240;
  const BOTTOM = 320;
  const P = 120;
  const A = 9;
  const xStart = -2 * P;
  const xEnd = VB + 2 * P;
  const B = (1 - cfg.fillLevel / 100) * VB;

  // Build continuous sine-like cubic Bezier wave edge
  let waveEdge = `M ${xStart} ${B}`;
  for (let x = xStart; x < xEnd; x += P) {
    waveEdge += ` C ${x + P * 0.25} ${B + A} ${x + P * 0.25} ${B + A} ${x + P * 0.5} ${B} S ${x + P * 0.75} ${B - A} ${x + P} ${B}`;
  }

  // Ripple line 6px below (translate 0 6)
  const B_ripple = B + 6;
  let rippleEdge = `M ${xStart} ${B_ripple}`;
  for (let x = xStart; x < xEnd; x += P) {
    rippleEdge += ` C ${x + P * 0.25} ${B_ripple + A} ${x + P * 0.25} ${B_ripple + A} ${x + P * 0.5} ${B_ripple} S ${x + P * 0.75} ${B_ripple - A} ${x + P} ${B_ripple}`;
  }

  const fillPath = `${waveEdge} L ${xEnd} ${BOTTOM} L ${xStart} ${BOTTOM} Z`;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${VB} ${VB}`}>
        <Defs>
          <ClipPath id="liquidClip">
            <Circle cx={VB / 2} cy={VB / 2} r={VB / 2} />
          </ClipPath>
          <SvgLinearGradient
            id={`waterGrad-${state}`}
            x1="0"
            y1={B}
            x2="0"
            y2={VB}
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0"
              stopColor={cfg.topRgb}
              stopOpacity={cfg.alphaTop}
            />
            <Stop
              offset="1"
              stopColor={cfg.botRgb}
              stopOpacity={cfg.alphaBot}
            />
          </SvgLinearGradient>
        </Defs>

        <G clipPath="url(#liquidClip)">
          {/* Main water wave animated group (drift + bob) */}
          {/* @ts-ignore */}
          <AnimatedG style={waveAnimatedStyle}>
            {/* Liquid fill */}
            <Path d={fillPath} fill={`url(#waterGrad-${state})`} />
            {/* Faint ripple line 6px below: stroke-opacity="0.10" stroke-width="1.2" */}
            <Path
              d={rippleEdge}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.1}
              strokeWidth={1.2}
            />
            {/* Single surface crest line: stroke-opacity="0.40" stroke-width="1.4" */}
            <Path
              d={waveEdge}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.4}
              strokeWidth={1.4}
            />
          </AnimatedG>
        </G>
      </Svg>
    </View>
  );
}

// ─── Bubbles ──────────────────────────────────────────────────────────────────

/**
 * Animated Bubble — appearance is identical in Dawn and Dusk.
 * Source: .bubble in Aubade - Today.html / Aubade - Dusk (dark).html
 */
function SingleBubble({
  bubble,
  orbSize,
  reduceMotion,
}: {
  bubble: BubbleConfig;
  orbSize: number;
  reduceMotion: boolean;
}) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  const scaleFactor = orbSize / 254;
  const bubbleSize = bubble.w * scaleFactor;
  // Rise all the way from the bottom of the sphere to the top rim
  const riseDistance = 248 * scaleFactor;

  useEffect(() => {
    if (reduceMotion) {
      opacity.value = 0.4;
      translateY.value = -riseDistance * 0.4;
      scale.value = 1.0;
      return;
    }

    translateY.value = withDelay(
      bubble.delay,
      withRepeat(
        withTiming(-riseDistance, {
          duration: bubble.dur,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );

    opacity.value = withDelay(
      bubble.delay,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: bubble.dur * 0.15, easing: Easing.out(Easing.quad) }),
          withTiming(0.55, { duration: bubble.dur * 0.70, easing: Easing.linear }),
          withTiming(0, { duration: bubble.dur * 0.15, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );

    scale.value = withDelay(
      bubble.delay,
      withRepeat(
        withSequence(
          withTiming(1.0, { duration: bubble.dur * 0.15 }),
          withTiming(1.15, { duration: bubble.dur * 0.85, easing: Easing.linear }),
        ),
        -1,
        false,
      ),
    );
  }, [bubble.delay, bubble.dur, opacity, reduceMotion, riseDistance, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bubbleWrapper,
        {
          width: bubbleSize,
          height: bubbleSize,
          left: `${bubble.leftPercent}%`,
          bottom: "3%",
        },
        animatedStyle,
      ]}
    >
      <Svg width={bubbleSize} height={bubbleSize} viewBox="0 0 100 100">
        <Defs>
          <SvgRadialGradient id="bubbleGrad" cx="35%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.98} />
            <Stop offset="40%" stopColor="#ffffff" stopOpacity={0.65} />
            <Stop offset="75%" stopColor="#ffffff" stopOpacity={0.25} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>
        <Circle cx="50" cy="50" r="50" fill="url(#bubbleGrad)" />
      </Svg>
    </Animated.View>
  );
}

function BubblesLayer({
  bubbles,
  orbSize,
  reduceMotion,
}: {
  bubbles: BubbleConfig[];
  orbSize: number;
  reduceMotion: boolean;
}) {
  return (
    <View style={styles.clippedLayer} pointerEvents="none">
      {bubbles.map((b, i) => (
        <SingleBubble
          key={i}
          bubble={b}
          orbSize={orbSize}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}

// ─── Specular Blooms ──────────────────────────────────────────────────────────

/**
 * Top specular blooms (.blooms .b1 / .b2 / .b3).
 *
 * Source: Aubade - Dusk (dark).html / .blooms span
 *   background: radial-gradient(circle at 40% 35%, rgba(255,255,255,0.95), rgba(255,255,255,0.15) 60%, transparent 72%)
 *   b1: 54×54, top 30% (76.2px), left 55% (139.7px) → center (166.7, 103.2), radius 27
 *   b2: 30×30, top 62% (157.5px), left 30% (76.2px)  → center (91.2, 172.5),  radius 15, opacity 0.85
 *   b3: 18×18, top 24% (61.0px), left 34% (86.4px)  → center (95.4, 70.0),   radius 9,  opacity 0.70
 */
function BloomsLayer({ size }: { size: number }) {
  const isSmall = size < 200;

  return (
    <View style={styles.clippedLayer} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 254 254">
        <Defs>
          {/* b1 gradient — Soft 3D spherical bloom with reduced opacity */}
          <SvgRadialGradient id="bloomGrad1" cx="38%" cy="32%" r="65%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.80} />
            <Stop offset="25%" stopColor="#ffffff" stopOpacity={0.65} />
            <Stop offset="50%" stopColor="#ffffff" stopOpacity={0.34} />
            <Stop offset="75%" stopColor="#ffffff" stopOpacity={0.10} />
            <Stop offset="90%" stopColor="#ffffff" stopOpacity={0.02} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* b2 gradient — Medium spherical bloom with reduced opacity */}
          <SvgRadialGradient id="bloomGrad2" cx="38%" cy="32%" r="65%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.75} />
            <Stop offset="25%" stopColor="#ffffff" stopOpacity={0.58} />
            <Stop offset="50%" stopColor="#ffffff" stopOpacity={0.28} />
            <Stop offset="75%" stopColor="#ffffff" stopOpacity={0.08} />
            <Stop offset="90%" stopColor="#ffffff" stopOpacity={0.02} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* b3 gradient — Top-left spherical bloom with reduced opacity */}
          <SvgRadialGradient id="bloomGrad3" cx="38%" cy="32%" r="65%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.72} />
            <Stop offset="25%" stopColor="#ffffff" stopOpacity={0.52} />
            <Stop offset="50%" stopColor="#ffffff" stopOpacity={0.24} />
            <Stop offset="75%" stopColor="#ffffff" stopOpacity={0.06} />
            <Stop offset="90%" stopColor="#ffffff" stopOpacity={0.02} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

        </Defs>

        {isSmall ? (
          /* Small orb (e.g. 152px onboarding / learning): keep configured sizes and positions */
          <G>
            <Circle cx={186} cy={120} r={50} fill="url(#bloomGrad1)" />
            <Circle cx={82} cy={188} r={28} fill="url(#bloomGrad2)" />
            <Circle cx={86} cy={78} r={19} fill="url(#bloomGrad3)" />
          </G>
        ) : (
          /* Bigger orb (e.g. 254px Today screen): exact sizes and positions of the 3 spheres */
          <G>
            {/* Large right sphere bloom */}
            <Circle cx={166} cy={104} r={32} fill="url(#bloomGrad1)" />
            {/* Bottom-left sphere bloom */}
            <Circle cx={90} cy={168} r={18} fill="url(#bloomGrad2)" />
            {/* Top-left sphere bloom */}
            <Circle cx={94} cy={72} r={10} fill="url(#bloomGrad3)" />
          </G>
        )}
      </Svg>
    </View>
  );
}

// ─── EnergyOrb Component ──────────────────────────────────────────────────────

/**
 * Reusable Signature EnergyOrb Component — theme-aware (Dawn + Dusk).
 * Sourced directly from Aubade - Today.html & Aubade - Dusk (dark).html.
 *
 * Dawn: warm peach/cream glass sphere.
 * Dusk: dark translucent plum glass headspace per the design handoff:
 *   - --orb-glass dark core
 *   - --orb-rim (1.5px hairline rim + subtle top/bottom highlights)
 *   - --orb-veil subtle white veil
 *   - State-specific bottom glow (steady / caution / rest)
 *   - --orb-ember for brand/empty/wearableRead variant
 *   - State-specific outer halo
 *
 * All color values are read from theme tokens.
 */
export function EnergyOrb({
  state = "steady",
  waterState,
  size = 254,
  bubbles,
  style,
  animated = true,
  showHalo = true,
  ...rest
}: EnergyOrbProps) {
  const effectiveState = waterState ?? state;
  const breatheScale = useSharedValue(1);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Read theme tokens
  const theme = useAppTheme();
  const { isDark } = useThemeMode();
  const orbGlass = theme.components.energyOrb.glass;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      (enabled) => {
        setReduceMotion(enabled);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion || !animated) {
      breatheScale.value = 1;
      return;
    }

    // 8.5-second breathing cycle: 0% / 100% -> scale(1) | 50% -> scale(1.025)
    breatheScale.value = withRepeat(
      withSequence(
        withTiming(1.025, {
          duration: 4250,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1.0, { duration: 4250, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [animated, breatheScale, reduceMotion]);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheScale.value }],
  }));

  const hasWater = effectiveState !== "empty";

  // Use state-appropriate bubble set
  const activeBubbles =
    bubbles || (hasWater ? TODAY_BUBBLES : DEFAULT_BUBBLES);

  return (
    <View
      style={[styles.container, { width: size, height: size }, style]}
      {...rest}
    >
      {/* ── Soft Outer Halo (.orb::before) — theme + state aware ────────── */}
      {showHalo && (
        <OuterHalo
          size={size}
          state={effectiveState}
          isDark={isDark}
          glass={orbGlass}
        />
      )}

      {/* ── Breathing Animated Glass Orb Sphere (.orb) ──────────────────── */}
      <Animated.View
        style={[
          styles.orbSphere,
          { width: size, height: size, borderRadius: size / 2 },
          breatheStyle,
        ]}
      >
        {/* Layer 1: Glass Sphere (.glass + .glass::after) — Dawn or Dusk */}
        {isDark ? (
          <DuskGlassSphere size={size} state={effectiveState} glass={orbGlass} />
        ) : (
          <DawnGlassSphere size={size} glass={orbGlass} />
        )}

        {/* Layer 2: Liquid Water Wave (.liquid .water-host) */}
        {hasWater && (
          <WaterWave
            state={effectiveState}
            reduceMotion={reduceMotion || !animated}
          />
        )}

        {/* Layer 3: Rising Bubbles (.liquid .bubble) */}
        <BubblesLayer
          bubbles={activeBubbles}
          orbSize={size}
          reduceMotion={reduceMotion || !animated}
        />

        {/* Layer 4: Specular Blooms (.blooms .b1 / .b2 / .b3) */}
        <BloomsLayer size={size} />
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  haloContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },

  orbSphere: {
    position: "relative",
    overflow: "hidden",
    zIndex: 1,
  },

  clippedLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9999,
    overflow: "hidden",
  },

  bubbleWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
