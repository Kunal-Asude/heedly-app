import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';
import { useUserSettings } from '@/hooks/data';
import { sendTestCautionHeadsUpNotification } from '@/services/notifications';

// ─── Options ──────────────────────────────────────────────────────────────────

const HORMONAL_OPTIONS = [
  'Cycling regularly',
  'Cycling irregularly',
  'Hormonal birth control',
  'Pregnant',
  'Postpartum',
  'Peri/menopausal',
  'HRT',
  'N/A',
  'Prefer not to say',
];

// ─── Custom Toggle Component (.sx-toggle) ─────────────────────────────────────

type CustomToggleProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

function CustomToggle({ value, onValueChange }: CustomToggleProps) {
  const { isDark, isTrueBlack } = useThemeMode();

  const onColors: [string, string, string] = isDark
    ? isTrueBlack
      ? ['#B85F47', '#B85F47', '#B85F47']
      : ['#634256', '#8A5D7C', '#9E768E']
    : ['#f0a07e', '#e88970', '#e0735f'];

  const trackInactiveBg = isDark
    ? isTrueBlack
      ? '#16111B'
      : 'rgba(46, 33, 50, 0.95)'
    : 'rgba(120, 90, 90, 0.2)';

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={styles.toggleTouchArea}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}>
      {value ? (
        <LinearGradient
          colors={onColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.toggleTrack,
            isDark && isTrueBlack && {
              borderColor: 'rgba(255, 255, 255, 0.07)',
              borderWidth: 1,
            },
          ]}>
          <View
            style={[
              styles.toggleThumb,
              styles.toggleThumbActive,
              isDark && isTrueBlack && { backgroundColor: '#E9DDD6' },
            ]}
          />
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.toggleTrack,
            {
              backgroundColor: trackInactiveBg,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              borderWidth: isDark ? 1 : 0,
            },
          ]}>
          <View style={[styles.toggleThumb, styles.toggleThumbInactive]} />
        </View>
      )}
    </Pressable>
  );
}

// ─── Settings Card Component (.sx-card with subtle gradient / flat OLED) ─────

function SettingsCard({
  children,
  isDark,
  isTrueBlack = false,
}: {
  children: React.ReactNode;
  isDark: boolean;
  isTrueBlack?: boolean;
}) {
  if (isDark && isTrueBlack) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: '#16111B',
            borderColor: 'rgba(255, 255, 255, 0.07)',
            shadowOpacity: 0,
            elevation: 0,
          },
        ]}>
        {children}
      </View>
    );
  }

  const cardGradientColors: [string, string, string] = isDark
    ? ['rgba(50, 35, 54, 0.88)', 'rgba(62, 43, 65, 0.85)', 'rgba(82, 54, 72, 0.82)']
    : ['rgba(252, 246, 240, 0.92)', 'rgba(255, 250, 245, 0.95)', 'rgba(255, 238, 230, 0.95)'];

  return (
    <LinearGradient
      colors={cardGradientColors}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 1, y: 0.7 }}
      style={[
        styles.card,
        {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.85)',
          shadowColor: isDark ? '#000000' : '#BE968C',
          shadowOpacity: isDark ? 0.24 : 0.08,
        },
      ]}>
      {children}
    </LinearGradient>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useUserSettings();
  const theme = useAppTheme();

  // Theme selector & True Black wired to the global ThemeContext
  const { themeMode, setThemeMode, isDark, isTrueBlack, setTrueBlack } = useThemeMode();

  // Other local control states
  const [isReduceMotion, setIsReduceMotion] = useState(settings.isReduceMotion);
  const [isAiInsights, setIsAiInsights] = useState(settings.isAiInsights);
  const [isHormonalOptionsOpen, setIsHormonalOptionsOpen] = useState(false);
  const [selectedHormonalContext, setSelectedHormonalContext] = useState('Cycling regularly');
  const [isCycleNotTypical, setIsCycleNotTypical] = useState(settings.isCycleNotTypical);
  const [isDailyReminder, setIsDailyReminder] = useState(settings.isDailyReminder);
  const [isHarderDaysReminder, setIsHarderDaysReminder] = useState(settings.isHarderDaysReminder);
  const [isWeeklyRecap, setIsWeeklyRecap] = useState(settings.isWeeklyRecap);


  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // ── Derived theme-aware style values ────────────────────────────────────────

  // Back chevron color
  const backChevronColor = isDark ? theme.ink.muted : 'rgba(74, 58, 57, 0.62)';

  // Version text color
  const versionColor = isDark ? theme.ink.faint : 'rgba(74, 58, 57, 0.42)';

  // Section labels / eyebrows
  const eyebrowColor = isDark ? 'rgba(199, 180, 191, 0.65)' : 'rgba(74, 58, 57, 0.55)';

  // Main heading
  const mainHeadingColor = isDark ? '#F3E7E1' : theme.ink.display;

  // Group header labels
  const groupHeaderColor = isDark ? 'rgba(199, 180, 191, 0.65)' : 'rgba(74, 58, 57, 0.55)';

  // Row title: #F3E7E1 in dark
  const rowTitleColor = isDark ? '#F3E7E1' : '#4f3c3a';

  // Row description: rgba(199,180,191,0.72) in dark
  const rowDescColor = isDark
    ? 'rgba(199, 180, 191, 0.72)'
    : 'rgba(74, 58, 57, 0.65)';

  // Divider: subtle divider
  const dividerColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(120, 90, 90, 0.1)';

  // Chevron right
  const chevronColor = isDark ? 'rgba(199, 180, 191, 0.45)' : 'rgba(74, 58, 57, 0.34)';

  // Segmented control track
  const segTrackBg = isDark ? 'rgba(28, 19, 32, 0.85)' : 'rgba(120, 90, 90, 0.08)';

  // Segmented control inactive text
  const segInactiveText = isDark
    ? 'rgba(199, 180, 191, 0.65)'
    : 'rgba(74, 58, 57, 0.55)';

  // Segmented active pill
  const segActiveTextColor = '#FFF6F1';

  // Change link / coral accent
  const coralAccentColor = isDark ? (isTrueBlack ? '#C97B60' : '#E8907A') : theme.coral.terracotta;

  // Hormonal select button
  const hormSelectBg = isDark
    ? 'rgba(82, 52, 68, 0.65)'
    : 'rgba(244, 164, 126, 0.16)';
  const hormSelectBorder = isDark
    ? 'rgba(226, 122, 108, 0.28)'
    : 'rgba(224, 115, 95, 0.25)';
  const hormSelectTextColor = isDark ? '#F3E7E1' : '#4f3c3a';
  const hormChevColor = isDark
    ? 'rgba(226, 122, 108, 0.72)'
    : 'rgba(176, 83, 52, 0.65)';

  // Hormonal option rows
  const hormOptionBg = isDark
    ? 'rgba(46, 33, 50, 0.8)'
    : 'rgba(255, 252, 248, 0.7)';
  const hormOptionBorder = isDark
    ? 'rgba(255, 255, 255, 0.06)'
    : 'rgba(120, 90, 90, 0.14)';
  const hormOptionSelectedBg = isDark
    ? 'rgba(226, 122, 108, 0.22)'
    : 'rgba(224, 115, 95, 0.12)';
  const hormOptionSelectedBorder = isDark
    ? 'rgba(226, 122, 108, 0.45)'
    : 'rgba(224, 115, 95, 0.42)';
  const hormRadioDotBorder = isDark
    ? 'rgba(199, 180, 191, 0.5)'
    : 'rgba(74, 58, 57, 0.3)';
  const hormOptionTextColor = isDark ? 'rgba(199, 180, 191, 0.85)' : '#5a4644';
  const hormOptionSelectedTextColor = isDark ? '#F3E7E1' : '#4f3c3a';

  // Time/value text
  const valueTextColor = isDark ? '#F3E7E1' : '#4f3c3a';

  // Preview link
  const previewLinkColor = isDark ? (isTrueBlack ? '#C97B60' : '#E8907A') : 'rgba(176, 83, 52, 0.85)';

  // Plus badge
  const plusBadgeBg = isDark
    ? 'rgba(226, 122, 108, 0.18)'
    : 'rgba(244, 164, 126, 0.18)';

  return (
    <View style={styles.root}>
      {/* Background — theme-aware atmosphere */}
      <DawnBackground />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}>

        {/* ── Top Header (.sx-nav) ──────────────────────────────────────── */}
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Today">
            <Text style={[styles.backChevron, { color: backChevronColor }]}>‹</Text>
          </Pressable>
          <Text style={[styles.versionText, { color: versionColor }]}>V1.0</Text>
        </View>

        {/* .sx-eyebrow */}
        <Text style={[styles.sectionLabel, { color: eyebrowColor }]}>SETTINGS</Text>

        {/* .sx-title */}
        <Text style={[styles.mainHeading, { color: mainHeadingColor }]}>Your heedly</Text>

        {/* ── 1. APPEARANCE (.sx-sec) ───────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>APPEARANCE</Text>

        <SettingsCard isDark={isDark} isTrueBlack={isTrueBlack}>
          {/* Theme Row */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Theme</Text>
              {/* Segmented Control (.sx-seg) */}
              <View style={[styles.segmentedTrack, { backgroundColor: segTrackBg }]}>
                {/* System */}
                <Pressable
                  style={styles.segmentBtnWrapper}
                  onPress={() => setThemeMode('system')}>
                  {themeMode === 'system' ? (
                    <View
                      style={[
                        styles.segmentBtnActive,
                        {
                          backgroundColor: isDark
                            ? isTrueBlack
                              ? 'rgba(190, 106, 92, 0.14)'
                              : '#5C3E50'
                            : '#E0735F',
                          borderColor: isDark && isTrueBlack ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                          borderWidth: isDark && isTrueBlack ? 1 : 0,
                        },
                      ]}>
                      <Text style={[styles.segmentTextActive, { color: segActiveTextColor }]}>System</Text>
                    </View>
                  ) : (
                    <View style={styles.segmentBtnInactive}>
                      <Text style={[styles.segmentTextInactive, { color: segInactiveText }]}>System</Text>
                    </View>
                  )}
                </Pressable>

                {/* Light */}
                <Pressable
                  style={styles.segmentBtnWrapper}
                  onPress={() => setThemeMode('light')}>
                  {themeMode === 'light' ? (
                    <View
                      style={[
                        styles.segmentBtnActive,
                        {
                          backgroundColor: isDark
                            ? isTrueBlack
                              ? 'rgba(190, 106, 92, 0.14)'
                              : '#5C3E50'
                            : '#E0735F',
                          borderColor: isDark && isTrueBlack ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                          borderWidth: isDark && isTrueBlack ? 1 : 0,
                        },
                      ]}>
                      <Text style={[styles.segmentTextActive, { color: segActiveTextColor }]}>Light</Text>
                    </View>
                  ) : (
                    <View style={styles.segmentBtnInactive}>
                      <Text style={[styles.segmentTextInactive, { color: segInactiveText }]}>Light</Text>
                    </View>
                  )}
                </Pressable>

                {/* Dark */}
                <Pressable
                  style={styles.segmentBtnWrapper}
                  onPress={() => setThemeMode('dark')}>
                  {themeMode === 'dark' ? (
                    <View
                      style={[
                        styles.segmentBtnActive,
                        {
                          backgroundColor: isDark
                            ? isTrueBlack
                              ? 'rgba(190, 106, 92, 0.14)'
                              : '#5C3E50'
                            : '#E0735F',
                          borderColor: isDark && isTrueBlack ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                          borderWidth: isDark && isTrueBlack ? 1 : 0,
                        },
                      ]}>
                      <Text style={[styles.segmentTextActive, { color: segActiveTextColor }]}>Dark</Text>
                    </View>
                  ) : (
                    <View style={styles.segmentBtnInactive}>
                      <Text style={[styles.segmentTextInactive, { color: segInactiveText }]}>Dark</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              {themeMode === 'system'
                ? "Follows your device's light or dark setting automatically."
                : themeMode === 'light'
                ? "Always light, whatever your device does."
                : "Always dark, whatever your device does."}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* True black (OLED) */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>True black (OLED)</Text>
              <CustomToggle value={isTrueBlack} onValueChange={setTrueBlack} />
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              For severe light sensitivity. Flattens dark mode to near-pure black. Applies whenever dark mode is on.
            </Text>
          </View>


          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Reduce motion */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Reduce motion</Text>
              <CustomToggle value={isReduceMotion} onValueChange={setIsReduceMotion} />
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              Softer transitions, no drifting backgrounds
            </Text>
          </View>
        </SettingsCard>

        {/* ── 2. WEARABLE (.sx-sec) ─────────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>WEARABLE</Text>

        <SettingsCard isDark={isDark} isTrueBlack={isTrueBlack}>
          {/* Connected Wearable */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>{settings.connectedWearableName}</Text>
              <Pressable
                style={({ pressed }) => [styles.changeLink, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Change wearable">
                <View style={styles.greenDot} />
                <Text style={[styles.changeText, { color: coralAccentColor }]}>Change</Text>
                <Text style={[styles.changeChev, { color: isDark ? 'rgba(232,144,122,0.6)' : 'rgba(176, 83, 52, 0.5)' }]}>›</Text>
              </Pressable>
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              {settings.connectedWearableStatus}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Add another */}
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Add another wearable">
            <View style={styles.rowBetween}>
              <View style={styles.addAnotherLeft}>
                <View style={[styles.plusBadge, { backgroundColor: plusBadgeBg }]}>
                  <SymbolView name="plus" size={15} tintColor={coralAccentColor} />
                </View>
                <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Add another</Text>
              </View>
              <Text style={[styles.chevronRight, { color: chevronColor }]}>›</Text>
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor, paddingLeft: 42 }]}>
              Apple Watch, Garmin, Whoop, Apple Health …
            </Text>
          </Pressable>
        </SettingsCard>

        {/* ── 3. AI INSIGHTS (.sx-sec) ─────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>AI INSIGHTS</Text>

        <SettingsCard isDark={isDark} isTrueBlack={isTrueBlack}>
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>AI insights</Text>
              <CustomToggle value={isAiInsights} onValueChange={setIsAiInsights} />
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              {"On: short anonymized patterns (never your raw data) are sent to generate warmer, plain-language insights. Off: the same patterns are shown using on-device wording. Either way, pattern detection always runs on your phone."}
            </Text>
          </View>
        </SettingsCard>

        {/* ── 4. HORMONAL CONTEXT (.sx-sec) ────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>HORMONAL CONTEXT</Text>

        <SettingsCard isDark={isDark} isTrueBlack={isTrueBlack}>
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: rowTitleColor, marginBottom: 12 }]}>Cycle & hormones</Text>
            {/* Selection Dropdown Button (.sx-select) */}
            <Pressable
              style={({ pressed }) => [
                styles.cycleSelectButton,
                {
                  backgroundColor: hormSelectBg,
                  borderColor: hormSelectBorder,
                },
                pressed && styles.pressed,
              ]}
              onPress={() => setIsHormonalOptionsOpen(!isHormonalOptionsOpen)}
              accessibilityRole="button"
              accessibilityLabel={`Hormonal context: ${selectedHormonalContext}`}>
              <Text style={[styles.cycleSelectButtonText, { color: hormSelectTextColor }]}>{selectedHormonalContext}</Text>
              <Text style={[styles.cycleSelectChev, { color: hormChevColor }]}>{isHormonalOptionsOpen ? '▲' : '›'}</Text>
            </Pressable>

            {/* Expandable Options List (.sx-opts) */}
            {isHormonalOptionsOpen && (
              <View style={styles.hormonalOptionsContainer}>
                {HORMONAL_OPTIONS.map((opt) => {
                  const isSelected = selectedHormonalContext === opt;
                  return (
                    <Pressable
                      key={opt}
                      style={[
                        styles.hormonalOptionRow,
                        {
                          backgroundColor: isSelected ? hormOptionSelectedBg : hormOptionBg,
                          borderColor: isSelected ? hormOptionSelectedBorder : hormOptionBorder,
                        },
                      ]}
                      onPress={() => {
                        setSelectedHormonalContext(opt);
                        setIsHormonalOptionsOpen(false);
                      }}>
                      <View
                        style={[
                          styles.hormonalRadioDot,
                          {
                            borderColor: isSelected ? theme.coral.primary : hormRadioDotBorder,
                            backgroundColor: isSelected ? theme.coral.primary : 'transparent',
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.hormonalOptionText,
                          { color: isSelected ? hormOptionSelectedTextColor : hormOptionTextColor },
                          isSelected && { fontWeight: '600' },
                        ]}>
                        {opt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Don't predict phase from periods toggle */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { flex: 1, marginRight: 12, color: rowTitleColor }]}>
                {"Don't predict phase from my periods"}
              </Text>
              <CustomToggle value={isCycleNotTypical} onValueChange={setIsCycleNotTypical} />
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              For irregular or atypical cycles.
            </Text>
          </View>
        </SettingsCard>

        {/* ── 5. SUBSCRIPTION (.sx-sec) ────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>SUBSCRIPTION</Text>

        <SettingsCard isDark={isDark} isTrueBlack={isTrueBlack}>
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => router.push('/paywall' as any)}
            accessibilityRole="button"
            accessibilityLabel="Manage subscription">
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Manage subscription</Text>
              <Text style={[styles.chevronRight, { color: chevronColor }]}>›</Text>
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              Update your plan or cancel anytime in the App Store. Your history stays on your phone either way.
            </Text>
          </Pressable>
        </SettingsCard>

        {/* ── 6. PRIVACY (.sx-sec) ─────────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>PRIVACY</Text>

        <SettingsCard isDark={isDark} isTrueBlack={isTrueBlack}>
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => router.push('/(tabs)/your-data' as any)}
            accessibilityRole="button"
            accessibilityLabel="Your data">
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Your data</Text>
              <Text style={[styles.chevronRight, { color: chevronColor }]}>›</Text>
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              See everything heedly keeps, where it lives, and who sees it.
            </Text>
          </Pressable>
        </SettingsCard>

        {/* ── 7. NOTIFICATIONS (.sx-sec) ───────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>NOTIFICATIONS</Text>

        <SettingsCard isDark={isDark} isTrueBlack={isTrueBlack}>
          {/* Daily check-in reminder */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Daily check-in reminder</Text>
              <CustomToggle value={isDailyReminder} onValueChange={setIsDailyReminder} />
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              A gentle nudge to check in — you pick the time.
            </Text>
          </View>

          {isDailyReminder && (
            <>
              <View style={[styles.divider, { backgroundColor: dividerColor }]} />
              {/* Reminder time */}
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Reminder time 9:00 AM">
                <View style={styles.rowBetween}>
                  <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Reminder time</Text>
                  <View style={styles.rightValueRow}>
                    <Text style={[styles.timeValueText, { color: valueTextColor }]}>9:00 AM</Text>
                    <Text style={[styles.chevronRight, { color: chevronColor }]}>›</Text>
                  </View>
                </View>
              </Pressable>
            </>
          )}

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Heads-up before harder days */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Heads-up before harder days</Text>
              <CustomToggle
                value={isHarderDaysReminder}
                onValueChange={(val) => {
                  setIsHarderDaysReminder(val);
                  if (val) {
                    sendTestCautionHeadsUpNotification();
                  }
                }}
              />
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              heedly lets you know when the next few days look heavier, so you can plan ahead.
            </Text>
            <Pressable
              onPress={async () => {
                const id = await sendTestCautionHeadsUpNotification();
                if (id) {
                  Alert.alert(
                    'Heads-up notification sent',
                    'A real notification will arrive in 2 seconds. Pull down notification center or lock your device to see it!',
                    [{ text: 'OK' }]
                  );
                } else {
                  Alert.alert('Permission required', 'Please enable notifications for Heedly in iOS Settings.');
                }
              }}
              style={({ pressed }) => [styles.previewLinkRow, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Send test heads-up notification">
              <Text style={[styles.previewLinkText, { color: previewLinkColor }]}>Send test heads-up notification ›</Text>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Weekly recap */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: rowTitleColor }]}>Weekly recap</Text>
              <CustomToggle value={isWeeklyRecap} onValueChange={setIsWeeklyRecap} />
            </View>
            <Text style={[styles.rowDescription, { color: rowDescColor }]}>
              A short summary of what heedly noticed this week.
            </Text>
          </View>
        </SettingsCard>

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 22,
  },

  pressed: {
    opacity: 0.75,
  },

  // ── Header (.sx-nav) ────────────────────────────────────────────────────

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    marginBottom: 12,
  },

  backButton: {
    width: 36,
    height: 36,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
  },

  versionText: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.46,
  },

  // .sx-eyebrow: 11px, 600, 0.2em, uppercase
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  // .sx-title: Comfortaa 400, 31px, lineHeight 36px
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  // ── Group Headers & Cards (.sx-sec & .sx-card) ───────────────────────────

  // .sx-sec: 11px, 600, letter-spacing 0.16em, uppercase
  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginTop: 22,
    marginBottom: 10,
    paddingLeft: 4,
  },

  // .sx-card: radius 22px, subtle gradient, soft shadow
  card: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 18,
    marginBottom: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 3,
  },

  // .sx-row: padding 14px 0
  row: {
    paddingVertical: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // .sx-row-title: 15.5px, 600, letter-spacing -0.01em
  rowTitle: {
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    lineHeight: 21,
  },

  // .sx-row-desc: 13.5px, 400, line-height 19.5px
  rowDescription: {
    fontSize: 13.5,
    fontWeight: '400',
    lineHeight: 19.5,
    marginTop: 6,
  },

  divider: {
    height: 1,
  },

  chevronRight: {
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 4,
  },

  // ── Segmented Control (.sx-seg) ──────────────────────────────────────────

  segmentedTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    padding: 3,
    gap: 2,
  },

  segmentBtnWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },

  segmentBtnActive: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  segmentBtnInactive: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  segmentTextInactive: {
    fontSize: 13,
    fontWeight: '500',
  },

  segmentTextActive: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Wearable Row ─────────────────────────────────────────────────────────

  changeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#86C4B4',
    marginRight: 2,
  },

  changeText: {
    fontSize: 14,
    fontWeight: '600',
  },

  changeChev: {
    fontSize: 16,
  },

  addAnotherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  plusBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hormonal Context (.sx-select & .sx-opts) ─────────────────────────────

  cycleSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    height: 52,
    paddingHorizontal: 18,
    marginTop: 4,
    marginBottom: 4,
  },

  cycleSelectButtonText: {
    fontSize: 15.5,
    fontWeight: '600',
    letterSpacing: -0.15,
  },

  cycleSelectChev: {
    fontSize: 19,
    fontWeight: '400',
  },

  hormonalOptionsContainer: {
    marginTop: 10,
    gap: 6,
  },

  hormonalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  hormonalRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },

  hormonalOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // ── Notifications Row ────────────────────────────────────────────────────

  rightValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeValueText: {
    fontSize: 14.5,
    fontWeight: '600',
  },

  previewLinkRow: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 4,
  },

  previewLinkText: {
    fontSize: 13.5,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  // ── Custom Toggle Switch Styles (.sx-toggle) ─────────────────────────────

  toggleTouchArea: {
    padding: 2,
  },

  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },

  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  toggleThumbInactive: {
    alignSelf: 'flex-start',
  },

  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
