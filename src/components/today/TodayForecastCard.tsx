import { useTheme } from "@/constants/themes";
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
  const theme = useTheme();

  if (!forecast && !learningNote) {
    return null;
  }

  return (
    <View style={forecast ? styles.forecastSlot : styles.learningNoteSlot}>
      {forecast ? (
        <View
          style={[
            styles.forecastCard,
            {
              backgroundColor: theme.components.forecastCard.background,
              borderColor: theme.components.forecastCard.border,
              shadowColor: theme.components.forecastCard.shadowColor,
            },
          ]}
        >
          {forecast.map((item, idx) => (
            <View key={item.dayLabel} style={styles.forecastColumnGroup}>
              {idx > 0 && (
                <View
                  style={[
                    styles.forecastDivider,
                    {
                      backgroundColor: theme.components.forecastCard.divider,
                    },
                  ]}
                />
              )}
              <View style={styles.forecastColumn}>
                <Text
                  style={[
                    styles.forecastLabel,
                    { color: theme.components.forecastCard.labelColor },
                  ]}
                >
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
    height: 66,
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

  forecastCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 2,
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
    gap: 6,
  },

  forecastDivider: {
    width: 1,
    height: 30,
    alignSelf: "center",
  },

  forecastLabel: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 11.5,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  forecastStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  forecastDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },

  forecastValue: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 17,
    lineHeight: 20,
    color: "#4F3C3A",
  },

  learningNoteContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  learningNoteText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 17,
    lineHeight: 24,
    color: "rgba(55, 40, 39, 0.72)",
    textAlign: "center",
    maxWidth: 290,
  },
});
