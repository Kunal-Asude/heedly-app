import React from "react";
import {
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
} from "react-native";

import { useTheme } from "@/constants/themes";

export interface QuietLinkProps extends Omit<PressableProps, "style"> {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

/**
 * Quiet terracotta underlined text link.
 */
export function QuietLink({
  children,
  style,
  textStyle,
  ...rest
}: QuietLinkProps) {
  const theme = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.linkBtn,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      {...rest}
    >
      {typeof children === "string" ? (
        <Text
          style={[
            styles.linkText,
            { color: theme.coral.terracotta },
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linkBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignSelf: "center",
  },

  pressed: {
    opacity: 0.75,
  },

  linkText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 13,
    textDecorationLine: "underline",
    letterSpacing: 0.1,
  },
});
