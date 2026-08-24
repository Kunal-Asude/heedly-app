import { Tabs } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/constants/themes";

// ─── Tab configuration ────────────────────────────────────────────────────────

type SymbolName = SymbolViewProps["name"];

type TabConfig = {
  name: string;
  label: string;
  icon: SymbolName;
  iconFocused: SymbolName;
};

const TABS: TabConfig[] = [
  {
    name: "index",
    label: "Today",
    icon: "house" as SymbolName,
    iconFocused: "house.fill" as SymbolName,
  },
  {
    name: "patterns",
    label: "Patterns",
    icon: "waveform.path.ecg" as SymbolName,
    iconFocused: "waveform.path.ecg" as SymbolName,
  },
  {
    name: "notes",
    label: "Notes",
    icon: "doc.text" as SymbolName,
    iconFocused: "doc.text.fill" as SymbolName,
  },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

function HeedlyTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const currentRoute = state.routes[state.index];
  const focusedOptions = descriptors[currentRoute?.key]?.options;

  // Do not render tab bar on notes, your-data, explore, or hidden routes
  if (
    currentRoute?.name === "notes" ||
    currentRoute?.name === "your-data" ||
    currentRoute?.name === "explore" ||
    focusedOptions?.tabBarStyle?.display === "none" ||
    focusedOptions?.href === null
  ) {
    return null;
  }

  return (
    <View
      style={[
        styles.tabBarOuter,
        { bottom: insets.bottom > 0 ? insets.bottom + 6 : 16 },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.tabBarContainer,
          {
            backgroundColor: theme.components.tabBar.background,
            borderColor: theme.components.tabBar.border,
            shadowColor: theme.components.tabBar.shadowColor,
          },
        ]}
      >
        {state.routes.map(
          (route: { key: string; name: string }, index: number) => {
            const tabConfig = TABS.find((t) => t.name === route.name);
            if (!tabConfig) return null;

            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const handlePress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                style={[
                  styles.tabItem,
                  isFocused && [
                    styles.tabItemFocused,
                    {
                      backgroundColor: theme.components.tabBar.selectedPill,
                      borderColor: theme.components.tabBar.selectedPill,
                    },
                  ],
                ]}
                onPress={handlePress}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={
                  options.tabBarAccessibilityLabel ?? tabConfig.label
                }
              >
                <SymbolView
                  name={isFocused ? tabConfig.iconFocused : tabConfig.icon}
                  size={22}
                  tintColor={
                    isFocused
                      ? theme.components.tabBar.selectedText
                      : theme.components.tabBar.unselectedText
                  }
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused
                        ? theme.components.tabBar.selectedText
                        : theme.components.tabBar.unselectedText,
                    },
                    isFocused && styles.tabLabelFocused,
                  ]}
                >
                  {tabConfig.label}
                </Text>
              </Pressable>
            );
          },
        )}
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props: any) => <HeedlyTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Today" }} />
      <Tabs.Screen name="patterns" options={{ title: "Patterns" }} />
      <Tabs.Screen
        name="notes"
        options={{
          title: "Notes",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen
        name="your-data"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBarOuter: {
    position: "absolute",
    left: 18,
    right: 18,
    zIndex: 100,
    alignItems: "center",
  },

  tabBarContainer: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 32,
    borderWidth: 1,
    padding: 8,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
  },

  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingVertical: 17,
    paddingHorizontal: 14,
    borderRadius: 26,
  },

  tabItemFocused: {
    borderWidth: 1,
    shadowColor: "#8C6E66",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  tabLabel: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 17,
    lineHeight: 20,
  },

  tabLabelFocused: {
    fontFamily: "AvenirNext-DemiBold",
  },
});
