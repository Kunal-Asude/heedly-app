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
    iconFocused: "house" as SymbolName,
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
    iconFocused: "doc.text" as SymbolName,
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

  const currentRouteName = currentRoute?.name;
  // When in settings, highlight Today tab as active
  const effectiveActiveTab = currentRouteName === "settings" ? "index" : currentRouteName;

  return (
    <View
      style={[
        styles.tabBarOuter,
        { bottom: insets.bottom > 0 ? insets.bottom - 2 : 12 },
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
        {TABS.map((tabConfig) => {
          const isFocused = tabConfig.name === effectiveActiveTab;

          const handlePress = () => {
            if (tabConfig.name === "index" && currentRouteName === "settings") {
              navigation.navigate("index");
              return;
            }
            const matchingRoute = state.routes.find(
              (r: any) => r.name === tabConfig.name
            );
            if (matchingRoute) {
              const event = navigation.emit({
                type: "tabPress",
                target: matchingRoute.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(tabConfig.name);
              }
            } else {
              navigation.navigate(tabConfig.name);
            }
          };

          return (
            <Pressable
              key={tabConfig.name}
              style={[
                styles.tabItem,
                isFocused && [
                  styles.tabItemFocused,
                  {
                    backgroundColor: theme.components.tabBar.selectedPill,
                    borderColor: theme.components.tabBar.selectedPill,
                    shadowColor: theme.components.tabBar.shadowColor,
                  },
                ],
              ]}
              onPress={handlePress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={tabConfig.label}
            >
              <SymbolView
                name={isFocused ? tabConfig.iconFocused : tabConfig.icon}
                size={20}
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
        })}
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
    left: 20,
    right: 20,
    zIndex: 100,
    alignItems: "center",
  },

  tabBarContainer: {
    width: "100%",
    maxWidth: 390,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 5,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },

  tabItem: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 8,
    borderRadius: 18,
    margin: 4
  },

  tabItemFocused: {
    borderWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },

  tabLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  tabLabelFocused: {
    fontWeight: "600",
  },
});
