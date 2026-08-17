import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/constants/themes";

interface TodayCtaButtonProps {
  label: string;
  onPress: () => void;
}

export function TodayCtaButton({ label, onPress }: TodayCtaButtonProps) {
  const theme = useTheme();

  return (
    <View style={styles.ctaSlot}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.coral.primary,
            shadowColor: theme.shadows.cta.shadowColor,
          },
          pressed && styles.buttonPressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  ctaSlot: {
    height: 62,
    justifyContent: "center",
    alignSelf: "stretch",
    marginBottom: 10,
  },

  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 18,
    letterSpacing: -0.2,
  },
});
