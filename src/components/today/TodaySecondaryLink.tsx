import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/constants/themes";

interface TodaySecondaryLinkProps {
  text?: string;
  isLink?: boolean;
  onPress?: () => void;
}

export function TodaySecondaryLink({
  text,
  isLink = false,
  onPress,
}: TodaySecondaryLinkProps) {
  const theme = useTheme();

  return (
    <View style={styles.secondarySlot}>
      {text ? (
        isLink ? (
          <Pressable
            style={({ pressed }) => [
              styles.linkContainer,
              pressed && styles.pressed,
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={text}
          >
            <Text style={[styles.linkText, { color: theme.coral.terracotta }]}>
              {text}
            </Text>
          </Pressable>
        ) : (
          <Text style={[styles.staticText, { color: theme.ink.soft }]}>
            {text}
          </Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  secondarySlot: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 8,
  },

  linkContainer: {
    alignSelf: "center",
  },

  linkText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 16,
    textDecorationLine: "underline",
  },

  staticText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 16,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.8,
  },
});
