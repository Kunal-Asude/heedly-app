import { Tabs } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  barBg: 'rgba(255, 251, 248, 0.82)',
  barBorder: 'rgba(212, 184, 174, 0.35)',
  selectedPill: 'rgba(255, 255, 255, 0.7)',
  selectedText: '#C0634A',
  unselectedText: '#a38778',
};

// ─── Tab configuration ────────────────────────────────────────────────────────

type SymbolName = SymbolViewProps['name'];

type TabConfig = {
  name: string;
  label: string;
  icon: SymbolName;
  iconFocused: SymbolName;
};

const TABS: TabConfig[] = [
  { name: 'index', label: 'Today', icon: 'house' as SymbolName, iconFocused: 'house.fill' as SymbolName },
  { name: 'patterns', label: 'Patterns', icon: 'waveform.path.ecg' as SymbolName, iconFocused: 'waveform.path.ecg' as SymbolName },
  { name: 'notes', label: 'Notes', icon: 'doc.text' as SymbolName, iconFocused: 'doc.text.fill' as SymbolName },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

function HeedlyTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarOuter, { paddingBottom: insets.bottom > 0 ? insets.bottom - 8 : 8 }]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: { key: string; name: string }, index: number) => {
          const tabConfig = TABS.find((t) => t.name === route.name);
          if (!tabConfig) return null;

          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const handlePress = () => {
            const event = navigation.emit({
              type: 'tabPress',
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
              style={[styles.tabItem, isFocused && styles.tabItemFocused]}
              onPress={handlePress}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? tabConfig.label}>
              <SymbolView
                name={isFocused ? tabConfig.iconFocused : tabConfig.icon}
                size={22}
                tintColor={isFocused ? COLORS.selectedText : COLORS.unselectedText}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? COLORS.selectedText : COLORS.unselectedText },
                  isFocused && styles.tabLabelFocused,
                ]}>
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
      tabBar={(props: any) => <HeedlyTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="patterns" options={{ title: 'Patterns' }} />
      <Tabs.Screen name="notes" options={{ title: 'Notes' }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.four,
    paddingTop: 8,
  },

  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.barBg,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.barBorder,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 26,
  },

  tabItemFocused: {
    backgroundColor: COLORS.selectedPill,
  },

  tabLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
  },

  tabLabelFocused: {
    fontFamily: 'AvenirNext-DemiBold',
  },
});
