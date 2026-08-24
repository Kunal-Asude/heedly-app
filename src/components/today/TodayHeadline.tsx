import { StyleSheet, Text, View } from "react-native";

import { CORAL, Fonts, INK } from "@/constants/theme";

interface TodayHeadlineProps {
  headline1: string;
  headline2: string;
  isAccent?: boolean;
}

export function TodayHeadline({
  headline1,
  headline2,
  isAccent = true,
}: TodayHeadlineProps) {
  return (
    <View style={styles.headlineSlot}>
      <Text style={styles.headingText} numberOfLines={2}>
        <Text style={styles.darkText}>
          {headline1}
        </Text>
        <Text
          style={isAccent ? styles.accentText : styles.darkText}
        >
          {headline2}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headlineSlot: {
    minHeight: 60,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 6,
  },

  // .editorial: Comfortaa 400, 33px, line-height 38px (1.16), letter-spacing -0.01em (-0.33), color #463332
  headingText: {
    fontFamily: Fonts.display.regular,
    fontSize: 33,
    lineHeight: 38,
    textAlign: "center",
    letterSpacing: -0.33,
  },

  darkText: {
    color: INK.display,
  },

  // .editorial em: #b0532f (CORAL.terracottaDeep)
  accentText: {
    color: CORAL.terracottaDeep,
  },
});
