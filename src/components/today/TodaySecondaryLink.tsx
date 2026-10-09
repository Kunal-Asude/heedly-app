import { useTheme } from "@/constants/themes";
import { useThemeMode } from "@/contexts/ThemeContext";
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
  const theme = useTheme();
  const { isTrueBlack } = useThemeMode();
  // OLED .qlink: terracotta at 0.9, underline at 0.37
  const linkAlpha = isTrueBlack ? "E6" : "C7";
  const lineAlpha = isTrueBlack ? "5E" : "52";

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
            <View
              style={[
                styles.linkUnderlineWrapper,
                { borderBottomColor: `${theme.coral.terracotta}${lineAlpha}` },
              ]}
            >
              <Text
                style={[
                  styles.linkText,
                  { color: `${theme.coral.terracotta}${linkAlpha}` },
                ]}
              >
                {text}
              </Text>
            </View>
          </Pressable>
        ) : (
          <Text
            style={[
              styles.staticText,
              { color: theme.components.supportingText.noteColor },
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
  secondarySlot: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
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
  linkText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.13,
    textAlign: "center",
    textDecorationLine: "none",
  },

  // Secondary note text (17px, line-height 25px, matching onboarding description)
  staticText: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "center",
    maxWidth: 330,
  },

  pressed: {
    opacity: 0.75,
  },
});
