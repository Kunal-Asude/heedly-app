import { useTheme } from "@/constants/themes";
import { StyleSheet, View, ViewProps } from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

/**
 * Atmosphere Background Component
 *
 * Theme-aware background rendering:
 * - Dawn: 5-layer composite (linear base + 4 warm pastel radial blooms)
 * - Dusk: 5-layer composite (deep plum #191320 base + 4 atmospheric radial blooms:
 *         top-left violet, top-right terracotta, center plum transition, bottom warm wash)
 *
 * Sourced directly from surfaces.css (--grad-dawn) and dusk.css (--grad-dusk).
 */
interface DawnBackgroundProps extends ViewProps {
  /**
   * Whether the screen displays the orb.
   * When false, the center background glow behind the orb is omitted.
   * Defaults to true.
   */
  hasOrb?: boolean;
  showOrbGlow?: boolean;
}

export function DawnBackground({
  style,
  hasOrb = true,
  showOrbGlow,
  ...rest
}: DawnBackgroundProps) {
  const theme = useTheme();
  const bg = theme.components.background;
  const showCenterGlow = showOrbGlow !== undefined ? showOrbGlow : hasOrb;

  const isLinearBase = bg.type === "gradient" && !!bg.baseLinear;

  return (
    <View
      style={[StyleSheet.absoluteFill, style]}
      pointerEvents="none"
      {...rest}
    >
      <Svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 400 800"
      >
        <Defs>
          {/* Base Layer: linear-gradient for Dawn */}
          {isLinearBase && bg.baseLinear && (
            <SvgLinearGradient id="bgBase" x1="0%" y1="0%" x2="5%" y2="100%">
              <Stop
                offset="0%"
                stopColor={bg.baseLinear.start}
                stopOpacity={1}
              />
              <Stop
                offset="48%"
                stopColor={bg.baseLinear.middle}
                stopOpacity={1}
              />
              <Stop
                offset="100%"
                stopColor={bg.baseLinear.end}
                stopOpacity={1}
              />
            </SvgLinearGradient>
          )}

          {/* Radial Bloom 1 — Smooth multi-stop diffused falloff */}
          <SvgRadialGradient
            id="bgRadial1"
            cx={String(bg.radial1.cx)}
            cy={String(bg.radial1.cy)}
            r={String(bg.radial1.r)}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={bg.radial1.color} stopOpacity={bg.radial1.opacity} />
            <Stop offset="30%" stopColor={bg.radial1.color} stopOpacity={bg.radial1.opacity * 0.78} />
            <Stop offset="55%" stopColor={bg.radial1.color} stopOpacity={bg.radial1.opacity * 0.48} />
            <Stop offset="75%" stopColor={bg.radial1.color} stopOpacity={bg.radial1.opacity * 0.22} />
            <Stop offset="90%" stopColor={bg.radial1.color} stopOpacity={bg.radial1.opacity * 0.06} />
            <Stop offset="100%" stopColor={bg.radial1.color} stopOpacity={0} />
          </SvgRadialGradient>

          {/* Radial Bloom 2 — Smooth multi-stop diffused falloff */}
          <SvgRadialGradient
            id="bgRadial2"
            cx={String(bg.radial2.cx)}
            cy={String(bg.radial2.cy)}
            r={String(bg.radial2.r)}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={bg.radial2.color} stopOpacity={bg.radial2.opacity} />
            <Stop offset="30%" stopColor={bg.radial2.color} stopOpacity={bg.radial2.opacity * 0.78} />
            <Stop offset="55%" stopColor={bg.radial2.color} stopOpacity={bg.radial2.opacity * 0.48} />
            <Stop offset="75%" stopColor={bg.radial2.color} stopOpacity={bg.radial2.opacity * 0.22} />
            <Stop offset="90%" stopColor={bg.radial2.color} stopOpacity={bg.radial2.opacity * 0.06} />
            <Stop offset="100%" stopColor={bg.radial2.color} stopOpacity={0} />
          </SvgRadialGradient>

          {/* Radial Bloom 3 — Smooth multi-stop diffused falloff (Center orb glow) */}
          {showCenterGlow && (
            <SvgRadialGradient
              id="bgRadial3"
              cx={String(bg.radial3.cx)}
              cy={String(bg.radial3.cy)}
              r={String(bg.radial3.r)}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor={bg.radial3.color} stopOpacity={bg.radial3.opacity} />
              <Stop offset="30%" stopColor={bg.radial3.color} stopOpacity={bg.radial3.opacity * 0.78} />
              <Stop offset="55%" stopColor={bg.radial3.color} stopOpacity={bg.radial3.opacity * 0.48} />
              <Stop offset="75%" stopColor={bg.radial3.color} stopOpacity={bg.radial3.opacity * 0.22} />
              <Stop offset="90%" stopColor={bg.radial3.color} stopOpacity={bg.radial3.opacity * 0.06} />
              <Stop offset="100%" stopColor={bg.radial3.color} stopOpacity={0} />
            </SvgRadialGradient>
          )}

          {/* Radial Bloom 4 — Smooth multi-stop diffused falloff */}
          <SvgRadialGradient
            id="bgRadial4"
            cx={String(bg.radial4.cx)}
            cy={String(bg.radial4.cy)}
            r={String(bg.radial4.r)}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={bg.radial4.color} stopOpacity={bg.radial4.opacity} />
            <Stop offset="30%" stopColor={bg.radial4.color} stopOpacity={bg.radial4.opacity * 0.78} />
            <Stop offset="55%" stopColor={bg.radial4.color} stopOpacity={bg.radial4.opacity * 0.48} />
            <Stop offset="75%" stopColor={bg.radial4.color} stopOpacity={bg.radial4.opacity * 0.22} />
            <Stop offset="90%" stopColor={bg.radial4.color} stopOpacity={bg.radial4.opacity * 0.06} />
            <Stop offset="100%" stopColor={bg.radial4.color} stopOpacity={0} />
          </SvgRadialGradient>
        </Defs>

        {/* 5-Layer Composite Stack */}
        {isLinearBase ? (
          <Rect x="0" y="0" width="400" height="800" fill="url(#bgBase)" />
        ) : (
          <Rect x="0" y="0" width="400" height="800" fill={bg.baseColor} />
        )}
        <Rect x="0" y="0" width="400" height="800" fill="url(#bgRadial1)" />
        <Rect x="0" y="0" width="400" height="800" fill="url(#bgRadial2)" />
        {showCenterGlow && <Rect x="0" y="0" width="400" height="800" fill="url(#bgRadial3)" />}
        <Rect x="0" y="0" width="400" height="800" fill="url(#bgRadial4)" />
      </Svg>
    </View>
  );
}
