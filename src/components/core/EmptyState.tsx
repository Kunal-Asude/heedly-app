import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/constants/themes";

interface EmptyStateProps {
  title: string;
  body: string;
}

export function EmptyState({ title, body }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.ink.display }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.ink.muted }]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 48,
  },
  title: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 10,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
    textAlign: "center",
  },
});
