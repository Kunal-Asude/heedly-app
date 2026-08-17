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
  const steadyState = theme.states.steady;

  return (
    <View style={styles.badgeSlot}>
      {isFirstDay ? (
        <Pressable
          onPress={onPress}
          style={[
            styles.learningChip,
            {
              backgroundColor: steadyState.bg,
              borderColor: steadyState.ring,
            },
          ]}
        >
          <View
            style={[styles.learningDot, { backgroundColor: steadyState.color }]}
          />
          <Text style={[styles.learningText, { color: steadyState.ink }]}>
            LEARNING
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={onPress} style={styles.standardBadgeRow}>
          <View
            style={[styles.statusDot, { backgroundColor: indicatorDotColor }]}
          />
          <Text style={styles.standardBadgeText}>{indicatorText}</Text>
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
    marginBottom: 8,
  },

  learningChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
  },

  learningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  learningText: {
    fontFamily: "AvenirNext-Bold",
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },

  standardBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  standardBadgeText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 17,
    color: "#785344",
  },
});
