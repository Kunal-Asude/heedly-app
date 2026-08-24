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
  return (
    <View style={styles.badgeSlot}>
      {isFirstDay ? (
        /* .fd-chip: padding 5px 12px 5px 11px, radius 20, bg rgba(126,155,106,0.15), border 1px rgba(126,155,106,0.24) */
        <Pressable
          onPress={onPress}
          style={styles.learningChip}
        >
          <View style={styles.learningDot} />
          <Text style={styles.learningText}>
            LEARNING
          </Text>
        </Pressable>
      ) : (
        /* .state: single tidy line, dot 7x7 with subtle halo, label 13px 600 rgba(74,58,57,0.72) */
        <Pressable onPress={onPress} style={styles.standardBadgeRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: indicatorDotColor,
                shadowColor: indicatorDotColor,
              },
            ]}
          />
          <Text style={styles.standardBadgeText}>{indicatorText}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badgeSlot: {
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: -2,
    marginBottom: 6,
  },

  // .fd-chip: padding 5px 12px 5px 11px, radius 20px, bg rgba(126,155,106,0.15), border 1px rgba(126,155,106,0.24)
  learningChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(126, 155, 106, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(126, 155, 106, 0.24)",
  },

  // .fd-chip i: 6x6, radius 50%, bg #7e9b6a, box-shadow 0 0 0 3px rgba(126,155,106,0.18)
  learningDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7e9b6a",
  },

  // .fd-chip span: 10.5px, 700, letter-spacing 0.16em, uppercase, color #5d7a52
  learningText: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1.68,
    textTransform: "uppercase",
    color: "#5d7a52",
  },

  standardBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // .state .dot: 7x7, radius 50%
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 1,
  },

  // .state .label: 13px, 600, letter-spacing 0.02em, color rgba(74,58,57,0.72)
  standardBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.26,
    color: "rgba(74, 58, 57, 0.72)",
  },
});
