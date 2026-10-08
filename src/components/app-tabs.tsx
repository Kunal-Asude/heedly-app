import { Tabs } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { SymbolView } from "@/components/ui/symbol";
import { type ReactNode, useEffect, useState } from "react";
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

// ─── Tab bar space ────────────────────────────────────────────────────────────

// .tabbar: 46px tabs + 9px padding top and bottom + 1px border each side
const TAB_BAR_HEIGHT = 66;
// Gap between the end of scrolled content and the top of the floating bar.
const TAB_BAR_CONTENT_GAP = 10;

function useTabBarBottom() {
  const insets = useSafeAreaInsets();
  return insets.bottom > 0 ? insets.bottom - 2 : 12;
}

/**
 * Height a tab screen's scroll area must stop short of, so content ends above
 * the floating tab bar instead of scrolling behind it. Apply as `marginBottom`
 * on the ScrollView, not as content padding.
 */
export function useTabBarInset() {
  return useTabBarBottom() + TAB_BAR_HEIGHT + TAB_BAR_CONTENT_GAP;
}

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

function HeedlyTabBar({ state, descriptors, navigation }: any) {
  const tabBarBottom = useTabBarBottom();
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
        { bottom: tabBarBottom },
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
                size={21}
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

// ─── Fresh screen on every visit ──────────────────────────────────────────────

/**
 * Tab screens stay mounted when you leave them, so scroll position, open
 * modals and half-typed input would still be there on return. Remount the
 * screen as it loses focus so every visit starts fresh, from the top.
 * Anything that must survive lives in context or storage, not screen state.
 */
function ResetOnBlur({ navigation, children }: { navigation: any; children: ReactNode }) {
  const [visit, setVisit] = useState(0);
  useEffect(() => navigation.addListener("blur", () => setVisit((v) => v + 1)), [navigation]);
  return <View key={visit} style={{ flex: 1 }}>{children}</View>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppTabs() {
  return (
    <Tabs
      // Back returns to the screen the person came from (Your data → Settings),
      // not to the first tab. Covers router.back() and the Android back button.
      backBehavior="history"
      screenLayout={({ navigation, children }: any) => (
        <ResetOnBlur navigation={navigation}>{children}</ResetOnBlur>
      )}
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

  // .tabbar: sized to its tabs, padding 9px 12px, gap 6px, radius 28px
  tabBarContainer: {
    height: TAB_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    borderRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },

  // .tab: min-width 78px, height 46px, padding 0 16px, gap 7px, radius 20px
  tabItem: {
    minWidth: 78,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  tabItemFocused: {
    borderWidth: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },

  // .tab: 13.5px, 600, letter-spacing -0.01em
  tabLabel: {
    fontSize: 13.5,
    fontWeight: "600",
    letterSpacing: -0.14,
  },

  tabLabelFocused: {
    fontWeight: "600",
  },
});
