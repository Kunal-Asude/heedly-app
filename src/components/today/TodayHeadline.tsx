import { useTheme } from "@/constants/themes";
import { StyleSheet, Text, View } from "react-native";

import { Fonts } from "@/constants/theme";

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
  const theme = useTheme();

  return (
    <View style={styles.headlineSlot}>
      <Text style={styles.headingText} numberOfLines={2}>
        <Text style={{ color: theme.ink.display }}>
          {headline1}
        </Text>
        <Text
          style={{
            color: isAccent ? theme.coral.terracotta : theme.ink.display,
          }}
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

  // .editorial: Comfortaa 400, 33px, line-height 38px (1.16), letter-spacing -0.01em (-0.33)
  headingText: {
    fontFamily: Fonts.display.regular,
    fontSize: 33,
    lineHeight: 38,
    textAlign: "center",
    letterSpacing: -0.33,
  },
});
