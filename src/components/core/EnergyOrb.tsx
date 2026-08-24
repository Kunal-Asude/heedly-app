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
  LinearGradient as SvgLinearGradient,
  Path,
  RadialGradient as SvgRadialGradient,
  Stop,
} from "react-native-svg";

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
}

/**
 * Exact state configs from Aubade - Today.html (STATES array + buildWater)
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
    // STATES[0]: fill "70", tintTop "142 206 196", tintBot "74 172 184", alpha ".20"
    fillLevel: 70,
    topRgb: "rgb(142, 206, 196)",
    botRgb: "rgb(74, 172, 184)",
    alphaTop: 0.2,
    alphaBot: 0.3,
  },
  caution: {
    // STATES[1]: fill "50", tintTop "250 198 170", tintBot "243 176 142", alpha ".20"
    fillLevel: 50,
    topRgb: "rgb(250, 198, 170)",
    botRgb: "rgb(243, 176, 142)",
    alphaTop: 0.2,
    alphaBot: 0.3,
  },
  rest: {
    // STATES[2]: fill "30", tintTop "224 110 146", tintBot "188 62 104", alpha ".22"
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
 * Today screen bubbles (faster floating speed and smooth continuous rise)
 */
const TODAY_BUBBLES: BubbleConfig[] = [
  { w: 18, leftPercent: 42, dur: 2900, delay: 100 },
  { w: 14, leftPercent: 58, dur: 3300, delay: 900 },
  { w: 11, leftPercent: 50, dur: 3600, delay: 1700 },
  { w: 9, leftPercent: 45, dur: 3100, delay: 2400 },
];

/**
 * Default bubbles from orb.jsx (faster rise speed)
 */
const DEFAULT_BUBBLES: BubbleConfig[] = [
  { w: 16, leftPercent: 44, dur: 3000, delay: 200 },
  { w: 12, leftPercent: 56, dur: 3400, delay: 1200 },
];

/**
 * Soft Warm Outer Halo matching .orb::before in Aubade - Today.html:
 * background: radial-gradient(circle at 50% 58%, rgba(255,206,170,0.45), rgba(247,200,210,0.2) 45%, transparent 70%);
 * filter: blur(16px);
 * inset: -22%;
 */
function OuterHalo({ size }: { size: number }) {
  const haloSize = size * 1.44;
  return (
    <View
      style={[
        styles.haloContainer,
        {
          width: haloSize,
          height: haloSize,
          top: -size * 0.22,
          left: -size * 0.22,
        },
      ]}
      pointerEvents="none"
    >
      <Svg width={haloSize} height={haloSize} viewBox="0 0 366 366">
        <Defs>
          <SvgRadialGradient
            id="haloGrad"
            cx="183"
            cy="212"
            r="183"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#FFE0CC" stopOpacity={0.4} />
            <Stop offset="45%" stopColor="#F7D4DD" stopOpacity={0.18} />
            <Stop offset="70%" stopColor="#F7D4DD" stopOpacity={0} />
            <Stop offset="100%" stopColor="#F7D4DD" stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>
        <Circle cx="183" cy="183" r="183" fill="url(#haloGrad)" />
      </Svg>
    </View>
  );
}

/**
 * Glass Sphere matching .glass and .glass::after in Aubade - Today.html:
 * Exact layered radial gradients matching CSS:
 *  - Core: #f8d2bf -> #f0bba6 68% -> #e8b29c 100%
 *  - Warm bottom glow: radial-gradient(115% 105% at 50% 80%, rgba(255,222,178,0.95), rgba(255,222,178,0) 52%)
 *  - Lilac top-left glow: radial-gradient(120% 120% at 33% 26%, rgba(224,205,236,0.82), rgba(224,205,236,0) 58%)
 *  - Blush right glow: radial-gradient(125% 120% at 67% 33%, rgba(247,190,176,0.66), rgba(247,190,176,0) 62%)
 *  - White milky veil (.glass::after): radial-gradient(circle at 50% 32%, rgba(255,255,255,0.38), transparent 55%)
 *  - Top inner rim highlight & left side light (replaces inset box-shadows)
 *  - Bottom warm depth shadow (replaces inset 0 -12px 34px rgba(214,142,112,0.26))
 */
function GlassSphere({ size }: { size: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 254 254">
        <Defs>
          <ClipPath id="glassClip">
            <Circle cx="127" cy="127" r="127" />
          </ClipPath>

          {/* 1. Peach Core: soft, airy base with subtle 1-shade depth */}
          <SvgRadialGradient
            id="glassCore"
            cx="127"
            cy="127"
            r="180"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#f9e5da" stopOpacity={1} />
            <Stop offset="65%" stopColor="#f4d1c1" stopOpacity={1} />
            <Stop offset="100%" stopColor="#ebbca9" stopOpacity={1} />
          </SvgRadialGradient>

          {/* 2. Warm Bottom Glow: soft creamy golden warmth */}
          <SvgRadialGradient
            id="glassBottomGlow"
            cx="127"
            cy="203.2"
            r="280"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ffe6c4" stopOpacity={0.88} />
            <Stop offset="52%" stopColor="#ffe6c4" stopOpacity={0} />
            <Stop offset="100%" stopColor="#ffe6c4" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 3. Soft Lilac Top Edge: luminous soft lavender-lilac */}
          <SvgRadialGradient
            id="glassLilac"
            cx="83.82"
            cy="66.04"
            r="305"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ebdcf4" stopOpacity={0.88} />
            <Stop offset="58%" stopColor="#ebdcf4" stopOpacity={0} />
            <Stop offset="100%" stopColor="#ebdcf4" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 4. Blush Base/Right: soft warm blush */}
          <SvgRadialGradient
            id="glassBlush"
            cx="170.18"
            cy="83.82"
            r="311"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#fcd2c6" stopOpacity={0.62} />
            <Stop offset="62%" stopColor="#fcd2c6" stopOpacity={0} />
            <Stop offset="100%" stopColor="#fcd2c6" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 5. Frosted Milky Veil: adds soft light glaze evenly */}
          <SvgRadialGradient
            id="glassVeil"
            cx="127"
            cy="81.28"
            r="160"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.42} />
            <Stop offset="58%" stopColor="#ffffff" stopOpacity={0} />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 6. Soft Inner Top Rim Highlight */}
          <SvgRadialGradient
            id="topRim"
            cx="127"
            cy="0"
            r="160"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.6} />
            <Stop offset="35%" stopColor="#ffffff" stopOpacity={0.28} />
            <Stop offset="70%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 7. Soft Inner Left Light */}
          <SvgRadialGradient
            id="leftLight"
            cx="0"
            cy="127"
            r="150"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.28} />
            <Stop offset="50%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* 8. Soft Inner Bottom Warm Shadow */}
          <SvgRadialGradient
            id="bottomDepth"
            cx="127"
            cy="254"
            r="130"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#d68e70" stopOpacity={0.21} />
            <Stop offset="60%" stopColor="#d68e70" stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>

        <G clipPath="url(#glassClip)">
          {/* Base Peach Core */}
          <Circle cx="127" cy="127" r="127" fill="url(#glassCore)" />
          {/* Warm Bottom Glow */}
          <Circle cx="127" cy="127" r="127" fill="url(#glassBottomGlow)" />
          {/* Soft Lilac Top Edge */}
          <Circle cx="127" cy="127" r="127" fill="url(#glassLilac)" />
          {/* Blush Right */}
          <Circle cx="127" cy="127" r="127" fill="url(#glassBlush)" />
          {/* Milky Veil */}
          <Circle cx="127" cy="127" r="127" fill="url(#glassVeil)" />
          {/* Inner Highlights & Shadows */}
          <Circle cx="127" cy="127" r="127" fill="url(#topRim)" />
          <Circle cx="127" cy="127" r="127" fill="url(#leftLight)" />
          <Circle cx="127" cy="127" r="127" fill="url(#bottomDepth)" />
        </G>
      </Svg>
    </View>
  );
}

/**
 * Animated SVG Water Wave component — exact translation of buildWater(st) from Aubade - Today.html.
 * Features:
 *  - SVG viewBox "0 0 240 240"
 *  - Wave period P = 120, Amplitude A = 9
 *  - Fill path with userSpaceOnUse linearGradient (topColor alphaTop -> botColor alphaBot)
 *  - Secondary background wave stroke (opacity 0.14, width 2, drifting -P to 0 over 13s)
 *  - Foreground wave stroke (opacity 0.40, width 1.4, drifting 0 to -P over 9s) + vertical bob (2.5px over 5.5s)
 */
function WaterWave({
  state = "steady",
  reduceMotion = false,
}: {
  state?: EnergyOrbState;
  reduceMotion?: boolean;
}) {
  const fgDrift = useSharedValue(0);
  const bgDrift = useSharedValue(0);
  const bobAnim = useSharedValue(0);

  const cfg = STATE_CONFIGS[state] || STATE_CONFIGS.steady;

  useEffect(() => {
    if (reduceMotion) {
      fgDrift.value = 0;
      bgDrift.value = 0;
      bobAnim.value = 0;
      return;
    }

    // Foreground wave drift: '0 0' to '-120 0' over 9s
    fgDrift.value = withRepeat(
      withTiming(1, { duration: 9000, easing: Easing.linear }),
      -1,
      false,
    );

    // Background wave drift: '-120 0' to '0 0' over 13s
    bgDrift.value = withRepeat(
      withTiming(1, { duration: 13000, easing: Easing.linear }),
      -1,
      false,
    );

    // Bob motion: 0 -> 2.5 -> 0 over 5.5s with spline easing (0.4 0 0.6 1)
    bobAnim.value = withRepeat(
      withSequence(
        withTiming(2.5, {
          duration: 2750,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        }),
        withTiming(0, {
          duration: 2750,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        }),
      ),
      -1,
      false,
    );
  }, [bgDrift, bobAnim, fgDrift, reduceMotion]);

  const fgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: fgDrift.value * -120 },
      { translateY: bobAnim.value },
    ],
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -120 + bgDrift.value * 120 }],
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
          {/* Background subtle drift stroke: stroke-opacity="0.14" stroke-width="2" */}
          {/* @ts-ignore */}
          <AnimatedG style={bgAnimatedStyle}>
            <Path
              d={waveEdge}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={0.14}
              strokeWidth={2}
            />
          </AnimatedG>

          {/* Foreground main water fill + crest stroke: stroke-opacity="0.4" stroke-width="1.4" */}
          {/* @ts-ignore */}
          <AnimatedG style={fgAnimatedStyle}>
            <Path d={fillPath} fill={`url(#waterGrad-${state})`} />
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

/**
 * Animated Bubble matching .bubble and @keyframes rise in Aubade - Today.html:
 * background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.25) 70%, transparent)
 * rise animation: 0% -> opacity 0, scale 0.9 | 15% -> opacity 0.8 | 85% -> opacity 0.5 | 100% -> translateY(-150px) scale 1.1 opacity 0
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
  const riseDistance = 150 * scaleFactor;

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
          withTiming(0.8, { duration: bubble.dur * 0.15 }),
          withTiming(0.5, { duration: bubble.dur * 0.7 }),
          withTiming(0, { duration: bubble.dur * 0.15 }),
        ),
        -1,
        false,
      ),
    );

    scale.value = withDelay(
      bubble.delay,
      withRepeat(
        withTiming(1.1, {
          duration: bubble.dur,
          easing: Easing.linear,
        }),
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
          bottom: "6%",
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

/**
 * Bubbles layer clipped to orb circle
 */
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

/**
 * Top Specular Blooms matching reference in Image 2:
 * Soft luminous inner spheres + delicate sparkle accents.
 */
function BloomsLayer({ size }: { size: number }) {
  return (
    <View style={styles.clippedLayer} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 254 254">
        <Defs>
          {/* Main big luminous sphere gradient */}
          <SvgRadialGradient id="bloomBig" cx="40%" cy="36%" r="65%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.95} />
            <Stop offset="45%" stopColor="#ffffff" stopOpacity={0.4} />
            <Stop offset="78%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* Medium soft highlight gradient */}
          <SvgRadialGradient id="bloomMed" cx="40%" cy="36%" r="65%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.9} />
            <Stop offset="50%" stopColor="#ffffff" stopOpacity={0.32} />
            <Stop offset="78%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>

          {/* Small soft highlight gradient */}
          <SvgRadialGradient id="bloomSmall" cx="38%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity={0.85} />
            <Stop offset="55%" stopColor="#ffffff" stopOpacity={0.25} />
            <Stop offset="78%" stopColor="#ffffff" stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>

        {/* 1. Main prominent right luminous sphere (spread further right) */}
        <Circle cx={178} cy={132} r={44} fill="url(#bloomBig)" />

        {/* 2. Lower-left soft warm luminous sphere (spread further down-left) */}
        <Circle cx={88} cy={188} r={25} fill="url(#bloomMed)" />

        {/* 3. Upper-left soft sphere (spread further up-left) */}
        <Circle cx={96} cy={78} r={16} fill="url(#bloomSmall)" />

        {/* 4. Delicate sparkle accents */}
        <Circle cx={148} cy={168} r={2.8} fill="#ffffff" opacity={0.7} />
        <Circle cx={118} cy={212} r={2.0} fill="#ffffff" opacity={0.55} />
      </Svg>
    </View>
  );
}

/**
 * Reusable Signature EnergyOrb Component matching Aubade & Heedly design handoff.
 * Source of truth: orb.jsx & Aubade - Today.html.
 *
 * Supports states: 'steady' | 'caution' | 'rest' | 'wearableRead' | 'empty'.
 * Sizing: Defaults to 254px base size as specified by original design.
 * Motion: 6-second breathing cycle (1 -> 1.025 -> 1) with reduced-motion support.
 */
export function EnergyOrb({
  state = "steady",
  waterState,
  size = 254,
  bubbles,
  style,
  ...rest
}: EnergyOrbProps) {
  const effectiveState = waterState ?? state;
  const breatheScale = useSharedValue(1);
  const [reduceMotion, setReduceMotion] = useState(false);

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
    if (reduceMotion) {
      breatheScale.value = 1;
      return;
    }

    // 6-second breathing cycle: 0% / 100% -> scale(1) | 50% -> scale(1.025)
    breatheScale.value = withRepeat(
      withSequence(
        withTiming(1.025, {
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1.0, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [breatheScale, reduceMotion]);

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
      {/* ── Soft Warm Outer Halo (.orb::before) ─────────────────────────── */}
      <OuterHalo size={size} />

      {/* ── Breathing Animated Glass Orb Sphere (.orb) ──────────────────── */}
      <Animated.View
        style={[
          styles.orbSphere,
          { width: size, height: size, borderRadius: size / 2 },
          breatheStyle,
        ]}
      >
        {/* Layer 1: Glass Sphere (.glass + .glass::after) */}
        <GlassSphere size={size} />

        {/* Layer 2: Liquid Water Wave (.liquid .water-host) */}
        {hasWater && (
          <WaterWave state={effectiveState} reduceMotion={reduceMotion} />
        )}

        {/* Layer 3: Rising Bubbles (.liquid .bubble) */}
        <BubblesLayer
          bubbles={activeBubbles}
          orbSize={size}
          reduceMotion={reduceMotion}
        />

        {/* Layer 4: Specular Blooms (.blooms) */}
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
