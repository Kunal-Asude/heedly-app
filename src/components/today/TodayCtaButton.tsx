import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { CORAL } from "@/constants/theme";

interface TodayCtaButtonProps {
  label: string;
  onPress: () => void;
}

export function TodayCtaButton({ label, onPress }: TodayCtaButtonProps) {
  return (
    <View style={styles.ctaSlot}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonWrapper,
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <LinearGradient
          colors={[CORAL.light, CORAL.mid, CORAL.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>{label}</Text>
          <View style={styles.arrowContainer}>
            <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
              <Path
                d="M8 5l7 7-7 7"
                stroke="#fff8f4"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ctaSlot: {
    height: 58,
    justifyContent: "center",
    alignSelf: "stretch",
    marginBottom: 8,
  },

  // .cta: height 58, radius 29, gradient, shadow 0 8px 20px rgba(110,86,86,0.16)
  buttonWrapper: {
    width: "100%",
    height: 58,
    borderRadius: 29,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  // .cta text: 16.5px, 600, #fff8f4
  buttonText: {
    color: "#fff8f4",
    fontSize: 16.5,
    fontWeight: "600",
    letterSpacing: -0.15,
    textAlign: "center",
  },

  arrowContainer: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
