import { useTheme } from "@/constants/themes";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
          end={{ x: 1, y: 1 }}
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
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ctaSlot: {
    alignSelf: "stretch",
  },

  buttonWrapper: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 30,
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

  // .cta: 17px, 600, letter-spacing -0.01em
  buttonText: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.17,
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
