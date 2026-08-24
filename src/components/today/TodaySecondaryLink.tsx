import { Pressable, StyleSheet, Text, View } from "react-native";

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
            <Text style={styles.linkText}>
              {text}
            </Text>
          </Pressable>
        ) : (
          <Text style={styles.staticText}>
            {text}
          </Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  secondarySlot: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 6,
    marginBottom: 4,
  },

  linkContainer: {
    alignSelf: "center",
  },

  // .qlink: 13px, 500, color rgba(176,83,52,0.78), letter-spacing 0.01em, underline
  linkText: {
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.13,
    color: "rgba(176, 83, 52, 0.78)",
    textDecorationLine: "underline",
  },

  staticText: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(74, 58, 57, 0.66)",
    textAlign: "center",
  },

  pressed: {
    opacity: 0.75,
  },
});
