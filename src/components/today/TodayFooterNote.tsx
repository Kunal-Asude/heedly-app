import { useTheme } from "@/constants/themes";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
            style={({ pressed }) => [styles.linkContainer, pressed && styles.pressed]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={text}
          >
            {isPlanningLink ? (
              <View
                style={[
                  styles.linkUnderlineWrapper,
                  { borderBottomColor: `${theme.coral.terracotta}52` },
                ]}
              >
                <Text
                  style={[
                    styles.planningText,
                    { color: `${theme.coral.terracotta}C7` },
                  ]}
                >
                  {text}
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.neutralText,
                  { color: theme.ink.muted },
                ]}
              >
                {text}
              </Text>
            )}
          </Pressable>
        ) : (
          <Text
            style={[
              styles.neutralText,
              { color: theme.ink.muted },
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
  // .qlink.below: 14px under the CTA, 4px padding around the text
  footerSlot: {
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 14,
  },

  linkContainer: {
    alignSelf: "center",
  },

  linkUnderlineWrapper: {
    borderBottomWidth: 1,
    paddingBottom: 1,
    alignSelf: "center",
  },

  // .qlink: 13px, 500, letter-spacing 0.01em
  planningText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 16,
    textAlign: "center",
    textDecorationLine: "none",
    letterSpacing: 0.13,
  },

  // Neutral footer note (15.5px)
  neutralText: {
    fontSize: 15.5,
    fontWeight: "400",
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: "center",
    textDecorationLine: "none",
  },

  pressed: {
    opacity: 0.75,
  },
});
