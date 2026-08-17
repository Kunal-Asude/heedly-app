import { useEffect } from "react";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";
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
    Stop,
    LinearGradient as SvgLinearGradient,
    RadialGradient as SvgRadialGradient
} from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);

export type EnergyOrbState =
  | "empty"
  | "wearableRead"
  | "steady"
  | "caution"
  | "rest";

export interface EnergyOrbProps extends ViewProps {
  state?: EnergyOrbState;
  /**
   * Alias for state to support existing usages
   */
  waterState?: EnergyOrbState;
  size?: number;
  style?: ViewStyle | ViewStyle[];
}

const STATE_CONFIGS: Record<
  string,
  {
    fillLevel: number;
    topColor: string;
    botColor: string;
    topOpacity: number;
    botOpacity: number;
    crestColor: string;
  }
> = {
  steady: {
    fillLevel: 70,
    topColor: "#9DCEB8",
    botColor: "#7EAF98",
    topOpacity: 0.92,
    botOpacity: 0.95,
    crestColor: "rgba(255, 255, 255, 0.55)",
  },
  caution: {
    fillLevel: 45,
    topColor: "#F5CCA0",
    botColor: "#E6A86E",
    topOpacity: 0.92,
    botOpacity: 0.95,
    crestColor: "rgba(255, 255, 255, 0.55)",
  },
  rest: {
    fillLevel: 26,
    topColor: "#F2B5B0",
    botColor: "#DC908B",
    topOpacity: 0.92,
    botOpacity: 0.95,
    crestColor: "rgba(255, 255, 255, 0.55)",
  },
  wearableRead: {
    fillLevel: 70,
    topColor: "#8CA28F",
    botColor: "#3EAC54",
    topOpacity: 0.94,
    botOpacity: 0.96,
    crestColor: "rgba(255, 255, 255, 0.65)",
  },
  empty: {
    fillLevel: 0,
    topColor: "transparent",
    botColor: "transparent",
    topOpacity: 0,
    botOpacity: 0,
    crestColor: "transparent",
  },
};

/**
 * Animated Bubble component — floats up continuously matching CSS keyframes `@keyframes rise`.
 */
function FloatingBubble({
  size,
  leftPercent,
  delayMs,
  durationMs,
  riseDistance,
}: {
  size: number;
  leftPercent: number;
  delayMs: number;
  durationMs: number;
  riseDistance: number;
}) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    translateY.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(-riseDistance, {
          duration: durationMs,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );

    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(0.8, { duration: durationMs * 0.15 }),
          withTiming(0.45, { duration: durationMs * 0.7 }),
          withTiming(0, { duration: durationMs * 0.15 }),
        ),
        -1,
        false,
      ),
    );

    scale.value = withDelay(
      delayMs,
      withRepeat(
        withTiming(1.1, {
          duration: durationMs,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: `${leftPercent}%`,
        },
        animatedStyle,
      ]}
    />
  );
}

/**
 * Native Glass Shell Atmosphere — Exact GlossyOrb SVG Gradients & Shading
 */
function GlassAtmosphere({ size }: { size: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 300 300">
        <Defs>
          <ClipPath id="glassSphereClip">
            <Circle cx="150" cy="150" r="145" />
          </ClipPath>

          {/* Base sphere shading — light top-left, warm shadow bottom-right (lighter palette) */}
          <SvgRadialGradient id="sphereBase" cx="38%" cy="32%" r="75%">
            <Stop offset="0%" stopColor="#fbf3faff" stopOpacity="1" />
            <Stop offset="40%" stopColor="#fbf0e2" stopOpacity="1" />
            <Stop offset="75%" stopColor="#f6ddc7" stopOpacity="1" />
            <Stop offset="100%" stopColor="#f0c0b9ff" stopOpacity="1" />
          </SvgRadialGradient>

          {/* Big soft highlight, mid-right */}
          <SvgRadialGradient id="highlight1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <Stop offset="60%" stopColor="#ffffff" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </SvgRadialGradient>

          {/* Small sharp highlight, upper-left */}
          <SvgRadialGradient id="highlight2" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <Stop offset="70%" stopColor="#ffffff" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </SvgRadialGradient>

          {/* Warm glow, lower area */}
          <SvgRadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#fff8e7" stopOpacity="0.8" />
            <Stop offset="60%" stopColor="#fff0cf" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#fff0cf" stopOpacity="0" />
          </SvgRadialGradient>
        </Defs>

        <G clipPath="url(#glassSphereClip)">
          {/* Main orb */}
          <Circle cx="150" cy="150" r="145" fill="url(#sphereBase)" />

          {/* Big highlight mid-right */}
          <Circle cx="185" cy="150" r="55" fill="url(#highlight1)" />

          {/* Small highlight upper-left */}
          <Circle cx="105" cy="105" r="18" fill="url(#highlight2)" />

          {/* Lower warm glow */}
          <Circle cx="120" cy="195" r="35" fill="url(#glow)" />

          {/* Tiny extra sparkle */}
          <Circle cx="150" cy="205" r="6" fill="#ffffff" opacity={0.6} />
        </G>
      </Svg>
    </View>
  );
}

/**
 * Animated SVG Water Wave component — exact formula from buildWater(st) in Aubade - Today.html.
 * Includes horizontal wave drift ('4.8s') and vertical floating bob ('3.6s').
 */
function WaterWave({ state = "steady" }: { state?: EnergyOrbState }) {
  const driftAnim = useSharedValue(0);
  const bobAnim = useSharedValue(0);

  const cfg = STATE_CONFIGS[state] || STATE_CONFIGS.steady;

  useEffect(() => {
    // Faster horizontal drift (4.8s duration)
    driftAnim.value = withRepeat(
      withTiming(1, { duration: 4800, easing: Easing.linear }),
      -1,
      false,
    );

    // Faster vertical bob (3.6s cycle duration)
    bobAnim.value = withRepeat(
      withSequence(
        withTiming(2.5, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  const waveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: driftAnim.value * -120 },
      { translateY: bobAnim.value },
    ],
  }));

  // Build wave path matching buildWater(st) from Aubade - Today.html
  const VB = 240;
  const BOTTOM = 320;
  const P = 120;
  const A = 8.5;
  const xStart = -2 * P;
  const xEnd = VB + 2 * P;
  const B = (1 - cfg.fillLevel / 100) * VB;

  let waveEdge = `M ${xStart} ${B}`;
  for (let x = xStart; x < xEnd; x += P) {
    waveEdge += ` C ${x + P * 0.25} ${B + A} ${x + P * 0.25} ${B + A} ${x + P * 0.5} ${B} S ${x + P * 0.75} ${B - A} ${x + P} ${B}`;
  }

  const fillPath = `${waveEdge} L ${xEnd} ${BOTTOM} L ${xStart} ${BOTTOM} Z`;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${VB} ${VB}`}>
        <Defs>
          <ClipPath id="liquidSphereClip">
            <Circle cx={VB / 2} cy={VB / 2} r={VB / 2 - 0.5} />
          </ClipPath>
          <SvgLinearGradient
            id="liquidGrad"
            x1="0"
            y1={B}
            x2="0"
            y2={VB}
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0"
              stopColor={cfg.topColor}
              stopOpacity={cfg.topOpacity}
            />
            <Stop
              offset="1"
              stopColor={cfg.botColor}
              stopOpacity={cfg.botOpacity}
            />
          </SvgLinearGradient>
        </Defs>
        <G clipPath="url(#liquidSphereClip)">
          {/* @ts-ignore */}
          <AnimatedG style={waveAnimatedStyle}>
            <Path d={fillPath} fill="url(#liquidGrad)" />
            <Path
              d={waveEdge}
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity={0.65}
              strokeWidth={1.8}
            />
          </AnimatedG>
        </G>
      </Svg>
    </View>
  );
}

/**
 * Reusable Signature Native EnergyOrb Component matching Aubade & Heedly design.
 * Pure React Native SVG & Gradients (no static PNGs).
 *
 * Supports states: 'steady' | 'caution' | 'rest' | 'wearableRead' | 'empty'.
 */
export function EnergyOrb({
  state = "steady",
  waterState,
  size = 280,
  style,
  ...rest
}: EnergyOrbProps) {
  const effectiveState = waterState ?? state;
  const breatheScale = useSharedValue(1);

  useEffect(() => {
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
  }, [breatheScale]);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheScale.value }],
  }));

  const hasWater = effectiveState !== "empty";

  return (
    <View
      style={[styles.container, { width: size, height: size }, style]}
      {...rest}
    >
      {/* ── Breathing Animated Glass Orb Sphere ─────────────────────── */}
      <Animated.View
        style={[
          styles.orbSphere,
          { width: size, height: size, borderRadius: size / 2 },
          breatheStyle,
        ]}
      >
        {/* Layer 1: Pure SVG Brand Atmosphere (Lavender + Peach + Warm Golden Glow + 3 Luminous Spheres) */}
        <GlassAtmosphere size={size} />

        {/* Layer 2: Clipped Tank/Water SVG Wave Fill (with drift + bob motion & soft opacity) */}
        {hasWater && <WaterWave state={effectiveState} />}

        {/* Layer 3: Floating Rising Bubbles */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <FloatingBubble
            size={7 * (size / 254)}
            leftPercent={44}
            delayMs={400}
            durationMs={5800}
            riseDistance={size * 0.55}
          />
          <FloatingBubble
            size={5 * (size / 254)}
            leftPercent={56}
            delayMs={1800}
            durationMs={6200}
            riseDistance={size * 0.55}
          />
          <FloatingBubble
            size={4 * (size / 254)}
            leftPercent={50}
            delayMs={3400}
            durationMs={5400}
            riseDistance={size * 0.55}
          />
        </View>

        {/* Layer 4: Glass Rim Ring */}
        <View style={styles.glassRimOverlay} pointerEvents="none" />
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  orbSphere: {
    overflow: "hidden",
    shadowColor: "#8C6A6A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 4,
  },

  glassRimOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.45)",
  },

  bubble: {
    position: "absolute",
    bottom: "10%",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
});
