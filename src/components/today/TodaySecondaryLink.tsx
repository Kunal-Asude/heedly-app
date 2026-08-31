import { useTheme } from "@/constants/themes";
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
                { borderBottomColor: `${theme.coral.terracotta}90` },
              ]}
            >
              <Text
                style={[
                  styles.linkText,
                  { color: theme.coral.terracotta },
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
    borderBottomWidth: 1.2,
    paddingBottom: 0,
    alignSelf: "center",
  },

  // Secondary action link (15.5px, lowered underline)
  linkText: {
    fontSize: 15.5,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0,
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
