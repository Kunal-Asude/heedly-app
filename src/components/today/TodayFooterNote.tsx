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
                  { borderBottomColor: `${theme.coral.terracottaDeep}90` },
                ]}
              >
                <Text
                  style={[
                    styles.planningText,
                    { color: theme.coral.terracottaDeep },
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
  footerSlot: {
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 2,
    marginBottom: 4,
  },

  linkContainer: {
    alignSelf: "center",
  },

  linkUnderlineWrapper: {
    borderBottomWidth: 1.2,
    paddingBottom: 0,
    alignSelf: "center",
  },

  // Planning link text (15.5px, lowered underline)
  planningText: {
    fontSize: 15.5,
    fontWeight: "500",
    lineHeight: 22,
    textAlign: "center",
    textDecorationLine: "none",
    letterSpacing: 0,
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
