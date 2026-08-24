import { StyleSheet, Text, View } from "react-native";

interface TodaySupportingTextProps {
  text?: string;
}

export function TodaySupportingText({ text }: TodaySupportingTextProps) {
  return (
    <View style={styles.supportingSlot}>
      {text ? (
        <Text style={styles.supportingText}>
          {text}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  supportingSlot: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    marginBottom: 6,
  },

  // .fd-micro: 14px, 500, color rgba(74,58,57,0.7), letter-spacing -0.005em, text-align center
  supportingText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: -0.07,
    color: "rgba(74, 58, 57, 0.7)",
    textAlign: "center",
  },
});
