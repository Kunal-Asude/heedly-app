import { StyleSheet, Text, View } from "react-native";

export interface ForecastDay {
  dayLabel: string;
  value: string;
  dotColor: string;
}

interface TodayForecastCardProps {
  forecast?: ForecastDay[];
  learningNote?: string;
}

export function TodayForecastCard({
  forecast,
  learningNote,
}: TodayForecastCardProps) {
  if (!forecast && !learningNote) {
    return null;
  }

  return (
    <View style={forecast ? styles.forecastSlot : styles.learningNoteSlot}>
      {forecast ? (
        <View style={styles.forecastCard}>
          {forecast.map((item, idx) => (
            <View key={item.dayLabel} style={styles.forecastColumnGroup}>
              {idx > 0 && (
                <View style={styles.forecastDivider} />
              )}
              <View style={styles.forecastColumn}>
                <Text style={styles.forecastLabel}>
                  {item.dayLabel}
                </Text>
                <View style={styles.forecastStatusRow}>
                  <View
                    style={[
                      styles.forecastDot,
                      { backgroundColor: item.dotColor },
                    ]}
                  />
                  <Text style={styles.forecastValue}>{item.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : learningNote ? (
        <View style={styles.learningNoteContainer}>
          <Text style={styles.learningNoteText}>{learningNote}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  forecastSlot: {
    height: 80,
    justifyContent: "center",
    alignSelf: "stretch",
    marginTop: 0,
    marginBottom: 2,
  },

  learningNoteSlot: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginTop: 2,
    marginBottom: 0,
  },

  // .outlook: bg rgba(255,255,255,0.42), border 1px rgba(255,255,255,0.6), radius 22px, padding 16px 6px, shadow
  forecastCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    backgroundColor: "rgba(255, 255, 255, 0.42)",
    paddingVertical: 16,
    paddingHorizontal: 6,
    shadowColor: "#BE8C8C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 3,
  },

  forecastColumnGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  forecastColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  forecastDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(120, 90, 90, 0.12)",
    alignSelf: "center",
  },

  // .day .dlabel: 10.5px, 600, letter-spacing 0.07em, color rgba(74,58,57,0.55), uppercase
  forecastLabel: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 0.73,
    textTransform: "uppercase",
    color: "rgba(74, 58, 57, 0.55)",
  },

  forecastStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  // .ddot: 9x9, radius 50%
  forecastDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },

  // .day .dword: 13.5px, 600, color #4f3c3a, letter-spacing -0.01em
  forecastValue: {
    fontSize: 13.5,
    fontWeight: "600",
    letterSpacing: -0.13,
    color: "#4f3c3a",
  },

  learningNoteContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    width: "100%",
  },

  // .fd-note: 14px, line-height 1.55 (21.7px), 500, color rgba(74,58,57,0.66)
  learningNoteText: {
    fontSize: 14,
    lineHeight: 21.7,
    fontWeight: "500",
    color: "rgba(74, 58, 57, 0.66)",
    textAlign: "center",
    maxWidth: 320,
  },
});
