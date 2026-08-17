import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/constants/themes";

interface TodayFooterNoteProps {
  text?: string;
  onPress?: () => void;
}

export function TodayFooterNote({ text, onPress }: TodayFooterNoteProps) {
  const theme = useTheme();
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
              style={[
                isPlanningLink ? styles.planningText : styles.neutralText,
                {
                  color: isPlanningLink
                    ? theme.coral.terracotta
                    : theme.ink.muted,
                  textDecorationColor: isPlanningLink
                    ? theme.coral.terracotta
                    : "transparent",
                },
              ]}
            >
              {text}
            </Text>
          </Pressable>
        ) : (
          <Text
            style={[
              isPlanningLink ? styles.planningText : styles.neutralText,
              {
                color: isPlanningLink
                  ? theme.coral.terracotta
                  : theme.ink.muted,
                textDecorationColor: isPlanningLink
                  ? theme.coral.terracotta
                  : "transparent",
              },
            ]}
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
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 2,
    marginBottom: 8,
    paddingBottom: 1,
  },

  planningText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 17,
    lineHeight: 22,
    textAlign: "center",
    textDecorationLine: "underline",
  },

  neutralText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 17,
    lineHeight: 22,
    textAlign: "center",
    textDecorationLine: "none",
  },

  pressed: {
    opacity: 0.8,
  },
});
