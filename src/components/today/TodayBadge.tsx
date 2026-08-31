import { useTheme } from "@/constants/themes";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TodayBadgeProps {
  isFirstDay?: boolean;
  indicatorText: string;
  indicatorDotColor: string;
  onPress?: () => void;
}

export function TodayBadge({
  isFirstDay = false,
  indicatorText,
  indicatorDotColor,
  onPress,
}: TodayBadgeProps) {
  const theme = useTheme();
  const badgeTokens = theme.components.badge;

  // Resolve state dot color to theme-specific state palette
  const dotColorLower = indicatorDotColor.toLowerCase();
  let resolvedDotColor = indicatorDotColor;
  if (
    dotColorLower.includes("7e9b6a") ||
    dotColorLower.includes("86c4b4") ||
    dotColorLower.includes("steady")
  ) {
    resolvedDotColor = theme.states.steady.color;
  } else if (
    dotColorLower.includes("d99843") ||
    dotColorLower.includes("e8a87c") ||
    dotColorLower.includes("caution")
  ) {
    resolvedDotColor = theme.states.caution.color;
  } else if (
    dotColorLower.includes("e0735f") ||
    dotColorLower.includes("e27a6c") ||
    dotColorLower.includes("rest")
  ) {
    resolvedDotColor = theme.states.rest.color;
  }

  return (
    <View style={styles.badgeSlot}>
      {isFirstDay ? (
        /* .fd-chip: padding 5px 12px 5px 11px, radius 20, solid 6px dot */
        <Pressable
          onPress={onPress}
          style={[
            styles.learningChip,
            {
              backgroundColor: badgeTokens.learning.background,
              borderColor: badgeTokens.learning.border,
            },
          ]}
        >
          <View
            style={[
              styles.learningDotCenter,
              { backgroundColor: badgeTokens.learning.dot },
            ]}
          />
          <Text
            style={[
              styles.learningText,
              { color: badgeTokens.learning.text },
            ]}
          >
            LEARNING
          </Text>
        </Pressable>
      ) : (
        /* .state: single tidy line, composite dot with halo ring */
        <Pressable onPress={onPress} style={styles.standardBadgeRow}>
          <View
            style={[
              styles.statusDotHalo,
              {
                backgroundColor: `${resolvedDotColor}2E`,
                borderColor: `${resolvedDotColor}38`,
              },
            ]}
          >
            <View
              style={[
                styles.statusDotCenter,
                { backgroundColor: resolvedDotColor },
              ]}
            />
          </View>
          <Text
            style={[
              styles.standardBadgeText,
              { color: badgeTokens.statusText },
            ]}
          >
            {indicatorText}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeSlot: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: -2,
    marginBottom: 6,
  },

  // .fd-chip: padding 5px 12px 5px 11px, radius 20px, gap 7px per design handoff
  learningChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 5,
    paddingLeft: 11,
    paddingRight: 12,
    borderRadius: 20,
    borderWidth: 1,
  },

  // .fd-chip i: 6x6 solid dot, border-radius 50%
  learningDotCenter: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // .fd-chip span: 10.5px, 700, letter-spacing 0.16em (1.68), uppercase
  learningText: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1.68,
    textTransform: "uppercase",
    lineHeight: 14,
  },

  standardBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // .state .dot outer translucent halo ring: 16x16, radius 8
  statusDotHalo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // .state .dot inner solid center: 7x7, radius 3.5
  statusDotCenter: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  // .state .label: 15px, 600
  standardBadgeText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.15,
  },
});
