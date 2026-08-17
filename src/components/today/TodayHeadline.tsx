import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/constants/themes";

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
        <Text style={[styles.darkText, { color: theme.ink.display }]}>
          {headline1}
        </Text>
        <Text
          style={[
            isAccent ? styles.accentText : styles.darkText,
            {
              color: isAccent ? theme.coral.terracotta : theme.ink.display,
            },
          ]}
        >
          {headline2}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headlineSlot: {
    minHeight: 66,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 8,
  },

  headingText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 34,
    lineHeight: 42,
    textAlign: "center",
    letterSpacing: -1.0,
  },

  darkText: {
    // Color applied dynamically in component
  },

  accentText: {
    // Color applied dynamically in component
  },
});
