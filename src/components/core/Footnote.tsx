import { useTheme } from "@/constants/themes";
import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

export interface FootnoteProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

/**
 * Readable footnote — quiet but never faint; caveats must stay legible.
 */
export function Footnote({ children, style, ...rest }: FootnoteProps) {
  const theme = useTheme();

  return (
    <Text
      style={[styles.footnote, { color: theme.ink.muted }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  footnote: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },
});
