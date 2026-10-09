import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

export interface GlowDotProps {
  color: string;
  /** Diameter of the solid center dot. */
  size?: number;
  /** Width of the halo ring on each side of the dot. */
  ring?: number;
  /** Opacity of the halo ring (design: rgba(dot, 0.16)). */
  haloOpacity?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * State dot with its soft halo ring — the `.dot` glow used on badges and pills.
 */
export function GlowDot({
  color,
  size = 7,
  ring = 4,
  haloOpacity = 0.16,
  style,
}: GlowDotProps) {
  const outer = size + ring * 2;

  return (
    <View
      style={[
        styles.container,
        { width: outer, height: outer, borderRadius: outer / 2 },
        style,
      ]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: outer / 2, backgroundColor: color, opacity: haloOpacity },
        ]}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
