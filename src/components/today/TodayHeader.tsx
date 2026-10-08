import { Fonts } from "@/constants/theme";
import { useTheme } from "@/constants/themes";
import { SymbolView } from "@/components/ui/symbol";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface TodayHeaderProps {
  dateText?: string;
  greeting?: string;
  /** Sets the name after "Hello," in Comfortaa, as on the forecast screens (.hello em). */
  accentName?: boolean;
  onSettingsPress?: () => void;
}

export function TodayHeader({
  dateText,
  greeting = "Hello.",
  accentName = false,
  onSettingsPress,
}: TodayHeaderProps) {
  const theme = useTheme();
  const headerTokens = theme.components.header;
  const commaIndex = accentName ? greeting.indexOf(",") : -1;

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerTextBlock}>
        <Text style={[styles.dateText, { color: headerTokens.dateColor }]}>
          {dateText}
        </Text>
        <Text style={[styles.greeting, { color: headerTokens.greetingColor }]}>
          {commaIndex === -1 ? (
            greeting
          ) : (
            <>
              {greeting.slice(0, commaIndex + 1)}
              <Text style={styles.greetingName}>{greeting.slice(commaIndex + 1)}</Text>
            </>
          )}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.settingsButton,
          {
            backgroundColor: headerTokens.settingsBg,
            borderColor: headerTokens.settingsBorder,
            shadowColor: headerTokens.settingsShadowColor,
          },
          pressed && styles.pressed,
        ]}
        onPress={onSettingsPress}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Settings"
      >
        <SymbolView
          name="gearshape"
          size={20}
          tintColor={headerTokens.settingsIconColor}
        />
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
    height: 56,
    marginTop: 8,
    marginBottom: 4,
    zIndex: 10,
  },

  headerTextBlock: {
    flex: 1,
  },

  // .date: 11.5px, letter-spacing 0.18em, uppercase, 600, margin: 0 0 7px
  dateText: {
    fontSize: 11.5,
    fontWeight: "600",
    letterSpacing: 2.07,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  // .hello: 25px, 600, letter-spacing -0.01em
  greeting: {
    fontSize: 25,
    fontWeight: "600",
    letterSpacing: -0.25,
    lineHeight: 30,
  },

  // .hello em: Comfortaa 500
  greetingName: {
    fontFamily: Fonts.display.medium,
    fontWeight: "normal",
  },

  // .settings: 40x40, radius 20
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2,
  },

  pressed: {
    opacity: 0.8,
  },
});
