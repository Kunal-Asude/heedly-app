import { useTheme } from "@/constants/themes";
import { LinearGradient } from "expo-linear-gradient";
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
  const cardTokens = theme.components.forecastCard;

  if (!forecast && !learningNote) {
    return null;
  }

  // Resolve state dot colors to theme-specific state palette
  const getResolvedState = (item: ForecastDay) => {
    const valLower = item.value.toLowerCase();
    const dotLower = item.dotColor.toLowerCase();
    if (
      valLower.includes("steady") ||
      dotLower.includes("7e9b6a") ||
      dotLower.includes("86c4b4")
    ) {
      return theme.states.steady;
    }
    if (
      valLower.includes("caution") ||
      dotLower.includes("d99843") ||
      dotLower.includes("e8a87c")
    ) {
      return theme.states.caution;
    }
    if (
      valLower.includes("rest") ||
      dotLower.includes("e0735f") ||
      dotLower.includes("e27a6c")
    ) {
      return theme.states.rest;
    }
    return {
      color: item.dotColor,
      ring: `${item.dotColor}38`,
      bg: `${item.dotColor}24`,
    };
  };

  const renderForecastContent = () => {
    if (!forecast) return null;
    return forecast.map((item, idx) => {
      const stateObj = getResolvedState(item);
      return (
        <View key={item.dayLabel} style={styles.forecastColumnGroup}>
          {idx > 0 && (
            <View
              style={[
                styles.forecastDivider,
                { backgroundColor: cardTokens.divider },
              ]}
            />
          )}
          <View style={styles.forecastColumn}>
            <Text
              style={[
                styles.forecastLabel,
                { color: cardTokens.labelColor },
              ]}
            >
              {item.dayLabel}
            </Text>
            <View style={styles.forecastStatusRow}>
              {/* State dot with soft translucent outer halo, subtle ring, and solid center */}
              <View
                style={[
                  styles.dotHaloRing,
                  {
                    backgroundColor: stateObj.bg || `${stateObj.color}24`,
                    borderColor: stateObj.ring || `${stateObj.color}38`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.dotCenter,
                    { backgroundColor: stateObj.color },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.forecastValue,
                  { color: cardTokens.valueColor },
                ]}
              >
                {item.value}
              </Text>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={forecast ? styles.forecastSlot : styles.learningNoteSlot}>
      {forecast ? (
        <View
          style={[
            styles.forecastCardShadow,
            {
              shadowColor: cardTokens.shadowColor,
              shadowOpacity: cardTokens.shadowOpacity,
            },
          ]}
        >
          {cardTokens.gradient ? (
            <LinearGradient
              colors={cardTokens.gradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[
                styles.forecastCard,
                {
                  borderColor: cardTokens.border,
                },
              ]}
            >
              {renderForecastContent()}
            </LinearGradient>
          ) : (
            <View
              style={[
                styles.forecastCard,
                {
                  backgroundColor: cardTokens.background,
                  borderColor: cardTokens.border,
                },
              ]}
            >
              {renderForecastContent()}
            </View>
          )}
        </View>
      ) : learningNote ? (
        <View style={styles.learningNoteContainer}>
          <Text
            style={[
              styles.learningNoteText,
              { color: theme.components.supportingText.noteColor },
            ]}
          >
            {learningNote}
          </Text>
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

  forecastCardShadow: {
    flex: 1,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 3,
  },

  // .outlook: border-radius 22px, padding 14px 6px
  forecastCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    overflow: "hidden",
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
    alignSelf: "center",
  },

  // .day .dlabel: 10.5px, 600, letter-spacing 0.07em, uppercase
  forecastLabel: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 0.73,
    textTransform: "uppercase",
  },

  forecastStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  // State dot outer translucent halo + subtle ring
  dotHaloRing: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // State dot inner solid center
  dotCenter: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  // .day .dword: 13.5px, 600, letter-spacing -0.01em
  forecastValue: {
    fontSize: 13.5,
    fontWeight: "600",
    letterSpacing: -0.13,
  },

  learningNoteContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    width: "100%",
  },

  // .fd-note: 14px, weight 500, line-height 21.5px (1.55), matching reference design
  learningNoteText: {
    fontSize: 14,
    lineHeight: 21.5,
    fontWeight: "500",
    letterSpacing: -0.05,
    textAlign: "center",
    maxWidth: 320,
  },
});
