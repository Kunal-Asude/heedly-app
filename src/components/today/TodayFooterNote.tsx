import { Pressable, StyleSheet, Text, View } from "react-native";

interface TodayFooterNoteProps {
  text?: string;
  onPress?: () => void;
}

export function TodayFooterNote({ text, onPress }: TodayFooterNoteProps) {
  const isPlanningLink = text === "Planning something this week?";

  return (
    <View style={styles.footerSlot}>
      {text ? (
        onPress ? (
          <Pressable
            style={({ pressed }) => [pressed && styles.pressed]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={text}
          >
            <Text
              style={isPlanningLink ? styles.planningText : styles.neutralText}
            >
              {text}
            </Text>
          </Pressable>
        ) : (
          <Text
            style={isPlanningLink ? styles.planningText : styles.neutralText}
          >
            {text}
          </Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  footerSlot: {
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 2,
    marginBottom: 4,
  },

  // .qlink.below: 13px, 500, color rgba(176,83,52,0.85), underline
  planningText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    color: "rgba(176, 83, 52, 0.85)",
    textAlign: "center",
    textDecorationLine: "underline",
    letterSpacing: 0.13,
  },

  neutralText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    color: "rgba(74, 58, 57, 0.6)",
    textAlign: "center",
    textDecorationLine: "none",
  },

  pressed: {
    opacity: 0.75,
  },
});
