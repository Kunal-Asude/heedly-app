import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

import { useTheme } from "@/constants/themes";

export interface EyebrowProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

/**
 * Small-caps section eyebrow label — 11px, 0.18em tracking, uppercase, 600 weight.
 */
export function Eyebrow({ children, style, ...rest }: EyebrowProps) {
  const theme = useTheme();

  return (
    <Text style={[styles.eyebrow, { color: theme.ink.muted }, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
});
