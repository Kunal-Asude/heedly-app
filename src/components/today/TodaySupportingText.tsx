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

  // .fd-micro: 14.5px, weight 500, line-height 21px, letter-spacing -0.005em
  supportingText: {
    fontSize: 14.5,
    fontWeight: "500",
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 320,
    letterSpacing: -0.07,
  },
});
