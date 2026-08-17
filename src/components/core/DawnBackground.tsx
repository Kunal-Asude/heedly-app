import { useTheme } from "@/constants/themes";
import { StyleSheet, View, ViewProps } from "react-native";
import Svg, {
    Defs,
    Rect,
    Stop,
    LinearGradient as SvgLinearGradient,
    RadialGradient as SvgRadialGradient,
} from "react-native-svg";

/**
 * Exact Aubade / Heedly Whole UI Dawn Background Theme
 * Recreates the 5-layer radial + linear gradient stack from surfaces.css:
 *
 * background:
 *   radial-gradient(95% 55% at 72% 8%, #fbcdb4 0%, rgba(251,205,180,0) 60%),
 *   radial-gradient(85% 50% at 16% 26%, #ecd2e6 0%, rgba(236,210,230,0) 58%),
 *   radial-gradient(120% 65% at 50% 102%, #ffd8bd 0%, rgba(255,216,189,0) 62%),
 *   radial-gradient(130% 80% at 50% 60%, rgba(255,243,233,0.5) 0%, rgba(255,243,233,0) 70%),
 *   linear-gradient(178deg, #f4e9e1 0%, #f7ded1 48%, #f6e2d6 100%);
 */
export function DawnBackground({ style, ...rest }: ViewProps) {
  const theme = useTheme();

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
          {/* Base Layer: linear-gradient */}
          <SvgLinearGradient id="dawnBase" x1="0%" y1="0%" x2="5%" y2="100%">
            <Stop
              offset="0%"
              stopColor={theme.components.background.dawnBase.start}
              stopOpacity="1"
            />
            <Stop
              offset="48%"
              stopColor={theme.components.background.dawnBase.middle}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={theme.components.background.dawnBase.end}
              stopOpacity="1"
            />
          </SvgLinearGradient>

          {/* Layer 1: Rose peach at 72% 8% (288, 64) */}
          <SvgRadialGradient
            id="dawnRadial1"
            cx="288"
            cy="64"
            r="260"
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0%"
              stopColor={theme.components.background.dawnRadial1.color}
              stopOpacity="0.9"
            />
            <Stop
              offset="60%"
              stopColor={theme.components.background.dawnRadial1.color}
              stopOpacity="0"
            />
          </SvgRadialGradient>

          {/* Layer 2: Lilac haze at 16% 26% (64, 208) */}
          <SvgRadialGradient
            id="dawnRadial2"
            cx="64"
            cy="208"
            r="260"
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0%"
              stopColor={theme.components.background.dawnRadial2.color}
              stopOpacity="0.95"
            />
            <Stop
              offset="60%"
              stopColor={theme.components.background.dawnRadial2.color}
              stopOpacity="0"
            />
          </SvgRadialGradient>

          {/* Layer 3: Peach glow at 50% 102% (200, 816) */}
          <SvgRadialGradient
            id="dawnRadial3"
            cx="200"
            cy="816"
            r="320"
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0%"
              stopColor={theme.components.background.dawnRadial3.color}
              stopOpacity="0.9"
            />
            <Stop
              offset="65%"
              stopColor={theme.components.background.dawnRadial3.color}
              stopOpacity="0"
            />
          </SvgRadialGradient>

          {/* Layer 4: Soft center warmth at 50% 60% (200, 480) */}
          <SvgRadialGradient
            id="dawnRadial4"
            cx="200"
            cy="480"
            r="300"
            gradientUnits="userSpaceOnUse"
          >
            <Stop
              offset="0%"
              stopColor={theme.components.background.dawnRadial4.color}
              stopOpacity="0.6"
            />
            <Stop
              offset="70%"
              stopColor={theme.components.background.dawnRadial4.color}
              stopOpacity="0"
            />
          </SvgRadialGradient>
        </Defs>

        {/* 5-Layer Composite Stack */}
        <Rect x="0" y="0" width="400" height="800" fill="url(#dawnBase)" />
        <Rect x="0" y="0" width="400" height="800" fill="url(#dawnRadial1)" />
        <Rect x="0" y="0" width="400" height="800" fill="url(#dawnRadial2)" />
        <Rect x="0" y="0" width="400" height="800" fill="url(#dawnRadial3)" />
        <Rect x="0" y="0" width="400" height="800" fill="url(#dawnRadial4)" />
      </Svg>
    </View>
  );
}
