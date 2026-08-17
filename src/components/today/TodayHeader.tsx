import { useTheme } from "@/constants/themes";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TodayHeaderProps {
  dateText?: string;
  greeting?: string;
  onSettingsPress?: () => void;
}

export function TodayHeader({
  dateText = "TUESDAY · 10 JUNE",
  greeting = "Hello, Sam.",
  onSettingsPress,
}: TodayHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerTextBlock}>
        <Text style={[styles.dateText, { color: theme.ink.muted }]}>
          {dateText}
        </Text>
        <Text style={[styles.greeting, { color: theme.ink.display }]}>
          {greeting}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.settingsButton,
          pressed && styles.pressed,
        ]}
        onPress={onSettingsPress}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Settings"
      >
        <SymbolView name="gearshape" size={18} tintColor={theme.ink.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    alignSelf: "stretch",
    height: 62,
    marginTop: 16,
    marginBottom: 6,
    zIndex: 10,
  },

  headerTextBlock: {
    flex: 1,
  },

  dateText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 14,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  greeting: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 32,
    lineHeight: 42,
  },

  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  pressed: {
    opacity: 0.8,
  },
});
