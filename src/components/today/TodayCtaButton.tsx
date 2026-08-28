import { useTheme } from "@/constants/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface TodayCtaButtonProps {
  label: string;
  onPress: () => void;
}

export function TodayCtaButton({ label, onPress }: TodayCtaButtonProps) {
  const theme = useTheme();
  const ctaTokens = theme.components.cta;

  return (
    <View style={styles.ctaSlot}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonWrapper,
          {
            shadowColor: ctaTokens.shadowColor,
            shadowOpacity: ctaTokens.shadowOpacity,
          },
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <LinearGradient
          colors={ctaTokens.gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.buttonGradient,
            {
              borderColor: ctaTokens.borderColor,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: ctaTokens.textColor }]}>
            {label}
          </Text>
          <View style={styles.arrowContainer}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M8 5l7 7-7 7"
                stroke={ctaTokens.textColor}
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
    height: 66,
    justifyContent: "center",
    alignSelf: "stretch",
    marginBottom: 8,
  },

  buttonWrapper: {
    width: "100%",
    height: 62,
    borderRadius: 33,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 33,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 1,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: -0.2,
    textAlign: "center",
  },

  arrowContainer: {
    position: "absolute",
    right: 22,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
