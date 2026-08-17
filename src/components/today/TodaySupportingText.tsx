import { useTheme } from "@/constants/themes";
import { StyleSheet, Text, View } from "react-native";

interface TodaySupportingTextProps {
  text?: string;
}

export function TodaySupportingText({ text }: TodaySupportingTextProps) {
  const theme = useTheme();

  return (
    <View style={styles.supportingSlot}>
      {text ? (
        <Text style={[styles.supportingText, { color: theme.ink.soft }]}>
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
    marginBottom: 8,
  },

  supportingText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
  },
});
