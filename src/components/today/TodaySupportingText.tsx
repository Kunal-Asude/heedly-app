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
        <Text
          style={[
            styles.supportingText,
            { color: theme.components.supportingText.noteColor },
          ]}
        >
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

  // Supporting micro text (17px, line-height 25px, matching onboarding description)
  supportingText: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 25,
    textAlign: "center",
    maxWidth: 330,
  },
});
