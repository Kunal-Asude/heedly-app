import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { SymbolView } from '@/components/ui/symbol';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarInset } from '@/components/app-tabs';
import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useUserSettings } from '@/hooks/data';
import { TimePickerSheet } from '@/components/TimePickerSheet';
import { useSessionState } from '@/hooks/useSessionState';
import {
  DAILY_REMINDER_DEFAULT,
  readDailyReminderEnabled,
  readDailyReminderTime,
  setDailyReminderEnabled,
  setDailyReminderTime,
} from '@/services/dailyReminder';
import { HEADS_UP_DEFAULT, readHeadsUpPreference, setHeadsUpPreference } from '@/services/headsUp';
import { DEFAULT_REMINDER_TIME, formatReminderTime } from '@/utils/reminderTime';
import HeedlyNative from '@/services/heedlyNative';

// ─── Options ──────────────────────────────────────────────────────────────────

// .sx-opt labels, as written in the design. The select capitalises the first letter.
const HORMONAL_OPTIONS = [
  'cycling regularly',
  'cycling irregularly',
  'on hormonal birth control',
  'pregnant',
  'postpartum',
  'perimenopausal or menopausal',
  'on HRT',
  'not applicable',
  'prefer not to say',
];

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const THEME_OPTIONS = [
  { mode: 'system', label: 'System', desc: "Follows your device's light or dark setting automatically." },
  { mode: 'light', label: 'Light', desc: 'Always light, whatever your device does.' },
  { mode: 'dark', label: 'Dark', desc: 'Always dark, whatever your device does.' },
] as const;

// ─── Palette (.sx-* in Aubade - Today / Dusk Dark Mode / OLED) ───────────────

type SxPalette = {
  back: string;
  version: string;
  eyebrow: string;
  title: string;
  section: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardShadowOpacity: number;
  divider: string;
  rowTitle: string;
  rowDesc: string;
  iconBg: string;
  icon: string;
  toggleOff: string;
  toggleOn: [string, string, ...string[]];
  toggleOnDiagonal: boolean;
  knob: string;
  knobShadow: boolean;
  segTrack: string;
  segText: string;
  /** null: the light theme's gradient pill */
  segOnBg: string | null;
  segOnText: string;
  value: string;
  valueChev: string;
  selectBg: string;
  selectBorder: string;
  selectText: string;
  selectChev: string;
  optBg: string;
  optBorder: string;
  optText: string;
  optOnBg: string;
  optOnBorder: string;
  optOnText: string;
  optDot: string;
  optDotOn: string;
  chev: string;
  change: string;
  changeDot: string;
  changeDotRing: string;
  changeChev: string;
  link: string;
};

const SX: Record<'light' | 'dusk' | 'oled', SxPalette> = {
  light: {
    back: 'rgba(74, 58, 57, 0.62)',
    version: 'rgba(74, 58, 57, 0.42)',
    eyebrow: 'rgba(74, 58, 57, 0.5)',
    title: '#463332',
    section: 'rgba(74, 58, 57, 0.5)',
    cardBg: 'rgba(255, 252, 248, 0.72)',
    cardBorder: 'rgba(255, 255, 255, 0.9)',
    cardShadow: '#BE968C',
    cardShadowOpacity: 0.16,
    divider: 'rgba(120, 90, 90, 0.11)',
    rowTitle: '#4f3c3a',
    rowDesc: 'rgba(74, 58, 57, 0.62)',
    iconBg: 'rgba(244, 164, 126, 0.18)',
    icon: '#b0532f',
    toggleOff: 'rgba(120, 90, 90, 0.2)',
    toggleOn: ['#f0a07e', '#e0735f'],
    toggleOnDiagonal: true,
    knob: '#ffffff',
    knobShadow: true,
    segTrack: 'rgba(120, 90, 90, 0.1)',
    segText: 'rgba(74, 58, 57, 0.6)',
    segOnBg: null,
    segOnText: '#fff8f4',
    value: '#4f3c3a',
    valueChev: 'rgba(74, 58, 57, 0.4)',
    selectBg: 'rgba(244, 164, 126, 0.16)',
    selectBorder: 'rgba(224, 115, 95, 0.22)',
    selectText: '#4f3c3a',
    selectChev: 'rgba(176, 83, 52, 0.5)',
    optBg: 'rgba(255, 252, 248, 0.7)',
    optBorder: 'rgba(120, 90, 90, 0.14)',
    optText: '#5a4644',
    optOnBg: 'rgba(224, 115, 95, 0.1)',
    optOnBorder: 'rgba(224, 115, 95, 0.42)',
    optOnText: '#4f3c3a',
    optDot: 'rgba(74, 58, 57, 0.3)',
    optDotOn: '#e0735f',
    chev: 'rgba(74, 58, 57, 0.34)',
    change: 'rgba(176, 83, 52, 0.82)',
    changeDot: '#7e9b6a',
    changeDotRing: 'rgba(126, 155, 106, 0.16)',
    changeChev: 'rgba(176, 83, 52, 0.42)',
    link: 'rgba(176, 83, 52, 0.85)',
  },
  dusk: {
    back: 'rgba(199, 180, 191, 0.84)',
    version: 'rgba(199, 180, 191, 0.57)',
    eyebrow: 'rgba(199, 180, 191, 0.68)',
    title: '#F3E7E1',
    section: 'rgba(199, 180, 191, 0.68)',
    cardBg: '#3E2F44',
    cardBorder: 'rgba(255, 255, 255, 0.09)',
    cardShadow: '#000000',
    cardShadowOpacity: 0.29,
    divider: 'rgba(85, 68, 91, 0.33)',
    rowTitle: '#F3E7E1',
    rowDesc: 'rgba(199, 180, 191, 0.84)',
    iconBg: 'rgba(226, 122, 108, 0.18)',
    icon: '#E8907A',
    toggleOff: 'rgba(46, 39, 56, 0.85)',
    toggleOn: ['#634256', '#8A5D7C', '#9E768E'],
    toggleOnDiagonal: false,
    knob: '#ffffff',
    knobShadow: true,
    segTrack: 'rgba(46, 39, 56, 0.72)',
    segText: 'rgba(199, 180, 191, 0.81)',
    segOnBg: 'rgba(226, 122, 108, 0.17)',
    segOnText: '#F3E7E1',
    value: '#F3E7E1',
    valueChev: 'rgba(199, 180, 191, 0.54)',
    selectBg: 'rgba(226, 122, 108, 0.16)',
    selectBorder: 'rgba(226, 122, 108, 0.22)',
    selectText: '#F3E7E1',
    selectChev: 'rgba(232, 144, 122, 0.57)',
    optBg: 'rgba(51, 37, 56, 0.72)',
    optBorder: 'rgba(199, 180, 191, 0.14)',
    optText: '#F3E7E1',
    optOnBg: 'rgba(226, 122, 108, 0.17)',
    optOnBorder: 'rgba(255, 255, 255, 0.09)',
    optOnText: '#F3E7E1',
    optDot: 'rgba(199, 180, 191, 0.41)',
    optDotOn: '#D9735A',
    chev: 'rgba(199, 180, 191, 0.46)',
    change: 'rgba(232, 144, 122, 0.94)',
    changeDot: '#86C4B4',
    changeDotRing: 'rgba(134, 196, 180, 0.16)',
    changeChev: 'rgba(232, 144, 122, 0.48)',
    link: '#E8907A',
  },
  oled: {
    back: '#A8979E',
    version: '#9A8A91',
    eyebrow: '#9A8A91',
    title: '#E9DDD6',
    section: '#9A8A91',
    cardBg: '#16111B',
    cardBorder: 'rgba(255, 255, 255, 0.07)',
    cardShadow: '#000000',
    cardShadowOpacity: 0.29,
    divider: 'rgba(255, 255, 255, 0.07)',
    rowTitle: '#E9DDD6',
    rowDesc: '#A8979E',
    iconBg: 'rgba(190, 106, 92, 0.14)',
    icon: '#C97B60',
    toggleOff: '#16111B',
    toggleOn: ['#B85F47', '#B85F47'],
    toggleOnDiagonal: false,
    knob: '#E9DDD6',
    knobShadow: false,
    segTrack: '#16111B',
    segText: '#A8979E',
    segOnBg: 'rgba(190, 106, 92, 0.14)',
    segOnText: '#E9DDD6',
    value: '#E9DDD6',
    valueChev: '#9A8A91',
    selectBg: 'rgba(190, 106, 92, 0.14)',
    selectBorder: 'rgba(190, 106, 92, 0.14)',
    selectText: '#E9DDD6',
    selectChev: 'rgba(201, 123, 96, 0.57)',
    optBg: '#16111B',
    optBorder: 'rgba(255, 255, 255, 0.07)',
    optText: '#E9DDD6',
    optOnBg: 'rgba(190, 106, 92, 0.14)',
    optOnBorder: 'rgba(255, 255, 255, 0.07)',
    optOnText: '#E9DDD6',
    optDot: 'rgba(255, 255, 255, 0.07)',
    optDotOn: '#B85F47',
    chev: 'rgba(168, 151, 158, 0.55)',
    change: 'rgba(201, 123, 96, 0.94)',
    changeDot: '#6E9678',
    changeDotRing: 'rgba(110, 150, 120, 0.14)',
    changeChev: 'rgba(201, 123, 96, 0.48)',
    link: '#C97B60',
  },
};

function useSxPalette() {
  const { isDark, isTrueBlack } = useThemeMode();
  return SX[isDark ? (isTrueBlack ? 'oled' : 'dusk') : 'light'];
}

// ─── Custom Toggle Component (.sx-toggle) ─────────────────────────────────────

type CustomToggleProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

function CustomToggle({ value, onValueChange }: CustomToggleProps) {
  const c = useSxPalette();
  const knob = [
    styles.toggleThumb,
    { backgroundColor: c.knob },
    c.knobShadow && styles.toggleThumbShadow,
    value ? styles.toggleThumbActive : styles.toggleThumbInactive,
  ];

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}>
      {value ? (
        <LinearGradient
          colors={c.toggleOn}
          start={c.toggleOnDiagonal ? { x: 0, y: 0 } : { x: 0, y: 0.5 }}
          end={c.toggleOnDiagonal ? { x: 1, y: 1 } : { x: 1, y: 0.5 }}
          style={styles.toggleTrack}>
          <View style={knob} />
        </LinearGradient>
      ) : (
        <View style={[styles.toggleTrack, { backgroundColor: c.toggleOff }]}>
          <View style={knob} />
        </View>
      )}
    </Pressable>
  );
}

// ─── Settings Card Component (.sx-tabbed .sx-card) ────────────────────────────

function SettingsCard({ children }: { children: React.ReactNode }) {
  const c = useSxPalette();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c.cardBg,
          borderColor: c.cardBorder,
          shadowColor: c.cardShadow,
          shadowOpacity: c.cardShadowOpacity,
        },
      ]}>
      {children}
    </View>
  );
}

// .sx-chev: 17px stroke chevron
function Chevron({ color, size = 17 }: { color: string; size?: number }) {
  return <SymbolView name="chevron.right" size={size} tintColor={color} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const { settings, connection, isConnectionLoaded, refreshConnection } = useUserSettings();

  useFocusEffect(
    useCallback(() => {
      void refreshConnection();
    }, [refreshConnection]),
  );

  // Theme selector & True Black wired to the global ThemeContext
  const { themeMode, setThemeMode, isTrueBlack, setTrueBlack } = useThemeMode();

  const wearableName = !isConnectionLoaded
    ? ''
    : !connection
      ? 'Wearable status unavailable'
      : (connection.activeSources[0] ?? 'No wearable connected');

  const wearableStatus = !isConnectionLoaded || !connection
    ? ''
    : connection.backfill.status === 'in_progress'
      ? 'Importing your history.'
      : connection.activeSources.length === 0
        ? ''
        : connection.connected
          ? 'Connected · syncing in the background'
          : 'No readings yet.';

  const isWearableActive = Boolean(connection?.connected);

  // Other local control states
  const [isReduceMotion, setIsReduceMotion] = useSessionState('settings.isReduceMotion', settings.isReduceMotion);
  // const [isAiInsights, setIsAiInsights] = useState(settings.isAiInsights);
  const [isHormonalOptionsOpen, setIsHormonalOptionsOpen] = useState(false);
  const [selectedHormonalContext, setSelectedHormonalContext] = useSessionState('settings.hormonalContext', 'cycling regularly');
  const [isCycleNotTypical, setIsCycleNotTypical] = useSessionState('settings.isCycleNotTypical', settings.isCycleNotTypical);
  // Persisted, and re-read on focus, so these must not also come from session state.
  const [isDailyReminder, setIsDailyReminder] = useState(DAILY_REMINDER_DEFAULT);
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isHarderDaysReminder, setIsHarderDaysReminder] = useState(HEADS_UP_DEFAULT);
  const [isWeeklyRecap, setIsWeeklyRecap] = useSessionState('settings.isWeeklyRecap', settings.isWeeklyRecap);
  const [isConnectingHealth, setIsConnectingHealth] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void readHeadsUpPreference().then((stored) => {
        if (stored !== null) setIsHarderDaysReminder(stored);
      });
      void readDailyReminderEnabled().then(setIsDailyReminder);
      void readDailyReminderTime().then(setReminderTime);
    }, []),
  );

  const handleHarderDaysReminderChange = (enabled: boolean) => {
    setIsHarderDaysReminder(enabled);
    void setHeadsUpPreference(enabled);
  };

  const handleDailyReminderChange = (enabled: boolean) => {
    setIsDailyReminder(enabled);
    void setDailyReminderEnabled(enabled);
  };

  const handleReminderTimeConfirm = (time: string) => {
    setIsTimePickerOpen(false);
    setReminderTime(time);
    void setDailyReminderTime(time);
  };

  // Recovery for an import that was interrupted. Importing years of history
  // takes a while, and closing the app part-way leaves it unfinished — the
  // automatic sync then correctly refuses to run, and without this there is
  // no way back.
  //
  // The same call onboarding makes. It resumes from wherever it stopped and
  // does no setup work again if there is none left, so pressing it on a
  // healthy install is a plain sync.
  const handleConnectHealth = async () => {
    if (isConnectingHealth) return;
    setIsConnectingHealth(true);
    try {
      const rowsWritten = await HeedlyNative.connectHealthKit();
      Alert.alert(
        rowsWritten > 0 ? 'Apple Health is up to date' : 'Nothing new to import',
        rowsWritten > 0
          ? 'Your history has been brought up to date.'
          : 'Heedly could not find anything new. If you have just connected, check Heedly is allowed in the Health app.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.warn('[Settings] Apple Health connection failed:', error);
      Alert.alert(
        'Could not reach Apple Health',
        'Something went wrong reading your health data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsConnectingHealth(false);
      await refreshConnection();
    }
  };


  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const c = useSxPalette();
  const isLightPalette = c.segOnBg === null;

  return (
    <View style={styles.root}>
      {/* Background — theme-aware atmosphere */}
      <DawnBackground />

      {/* ── Top Header (.sx-nav) — fixed; the list scrolls out of view below it,
           so nothing runs up into the status bar ───────────────────────────── */}
      <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <SymbolView name="chevron.left" size={22} tintColor={c.back} />
          </Pressable>
          <Text style={[styles.versionText, { color: c.version }]}>V1.0</Text>
        </View>
      </View>

      <ScrollView
        style={[styles.scrollView, { marginBottom: tabBarInset }]}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
        bounces={true}>

        {/* .sx-eyebrow */}
        <Text style={[styles.sectionLabel, { color: c.eyebrow }]}>SETTINGS</Text>

        {/* .sx-title */}
        <Text style={[styles.mainHeading, { color: c.title }]}>Your heedly</Text>

        {/* ── 1. APPEARANCE (.sx-sec) ───────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: c.section }]}>APPEARANCE</Text>

        <SettingsCard>
          {/* Theme Row */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: c.rowTitle }]}>Theme</Text>
              {/* Segmented Control (.sx-seg) */}
              <View style={[styles.segmentedTrack, { backgroundColor: c.segTrack }]}>
                {THEME_OPTIONS.map(({ mode, label }) => {
                  const isOn = themeMode === mode;
                  const text = (
                    <Text style={[styles.segmentText, { color: isOn ? c.segOnText : c.segText }]}>
                      {label}
                    </Text>
                  );
                  return (
                    <Pressable
                      key={mode}
                      onPress={() => setThemeMode(mode)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isOn }}>
                      {isOn && isLightPalette ? (
                        <LinearGradient
                          colors={c.toggleOn}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[styles.segmentBtn, styles.segmentBtnOnLight]}>
                          {text}
                        </LinearGradient>
                      ) : (
                        <View style={[styles.segmentBtn, isOn && { backgroundColor: c.segOnBg ?? undefined }]}>
                          {text}
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              {THEME_OPTIONS.find((option) => option.mode === themeMode)?.desc}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* True black (OLED) */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: c.rowTitle }]}>True black (OLED)</Text>
              <CustomToggle value={isTrueBlack} onValueChange={setTrueBlack} />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              For severe light sensitivity. Flattens dark mode to near-pure black. Applies whenever dark mode is on.
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* Reduce motion */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: c.rowTitle }]}>Reduce motion</Text>
              <CustomToggle value={isReduceMotion} onValueChange={setIsReduceMotion} />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              Softer transitions, no drifting backgrounds
            </Text>
          </View>
        </SettingsCard>

        {/* ── 2. WEARABLE (.sx-sec) ─────────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: c.section }]}>WEARABLE</Text>

        <SettingsCard>
          {/* Connected Wearable */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: c.rowTitle }]}>{wearableName}</Text>
              {/* .sx-change */}
              <Pressable
                style={({ pressed }) => [styles.changeLink, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Change wearable">
                <View
                  style={[
                    styles.changeDotRing,
                    { backgroundColor: isWearableActive ? c.changeDotRing : 'transparent' },
                  ]}>
                  <View
                    style={[
                      styles.changeDot,
                      { backgroundColor: isWearableActive ? c.changeDot : c.optDot },
                    ]}
                  />
                </View>
                <Text style={[styles.changeText, { color: c.change }]}>Change</Text>
                <Chevron color={c.changeChev} size={13} />
              </Pressable>
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              {wearableStatus}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* Add another (.sx-row-link.has-ic) */}
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Add another wearable">
            <View style={styles.rowBetween}>
              <View style={[styles.plusBadge, { backgroundColor: c.iconBg }]}>
                <SymbolView name="plus" size={18} tintColor={c.icon} />
              </View>
              <Text style={[styles.rowTitle, styles.rowTitleFill, { color: c.rowTitle }]}>Add another</Text>
              <Chevron color={c.chev} />
            </View>
            <Text style={[styles.rowDescription, styles.rowDescriptionIndented, { color: c.rowDesc }]}>
              Apple Watch, Garmin, Whoop, Apple Health …
            </Text>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* Connect or finish importing from Apple Health */}
          <Pressable
            onPress={handleConnectHealth}
            disabled={isConnectingHealth}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityState={{ disabled: isConnectingHealth, busy: isConnectingHealth }}
            accessibilityLabel="Connect Apple Health, or finish an interrupted import">
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, styles.rowTitleFill, { color: c.rowTitle }]}>
                {isConnectingHealth ? 'Importing…' : 'Connect Apple Health'}
              </Text>
              {!isConnectingHealth && <Chevron color={c.chev} />}
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              {isConnectingHealth
                ? 'This can take a while the first time. You can leave this screen.'
                : 'Also finishes an import that was interrupted'}
            </Text>
          </Pressable>
        </SettingsCard>

        {/* ── 3. AI INSIGHTS — deferred to a later phase ────────────────
        <Text style={[styles.groupHeaderLabel, { color: c.section }]}>AI INSIGHTS</Text>

        <SettingsCard>
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: c.rowTitle }]}>AI insights</Text>
              <CustomToggle value={isAiInsights} onValueChange={setIsAiInsights} />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              {"On: short anonymized patterns (never your raw data) are sent to generate warmer, plain-language insights. Off: the same patterns are shown using on-device wording. Either way, pattern detection always runs on your phone."}
            </Text>
          </View>
        </SettingsCard>
        */}

        {/* ── 4. HORMONAL CONTEXT (.sx-sec) ────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: c.section }]}>HORMONAL CONTEXT</Text>

        <SettingsCard>
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: c.rowTitle }]}>Cycle & hormones</Text>
            {/* Selection Dropdown Button (.sx-select) */}
            <Pressable
              style={({ pressed }) => [
                styles.cycleSelectButton,
                { backgroundColor: c.selectBg, borderColor: c.selectBorder },
                pressed && styles.pressed,
              ]}
              onPress={() => setIsHormonalOptionsOpen(!isHormonalOptionsOpen)}
              accessibilityRole="button"
              accessibilityLabel={`Hormonal context: ${selectedHormonalContext}`}>
              <Text style={[styles.cycleSelectButtonText, { color: c.selectText }]}>
                {capitalise(selectedHormonalContext)}
              </Text>
              <Chevron color={c.selectChev} />
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
                          backgroundColor: isSelected ? c.optOnBg : c.optBg,
                          borderColor: isSelected ? c.optOnBorder : c.optBorder,
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
                            borderColor: isSelected ? c.optDotOn : c.optDot,
                            backgroundColor: isSelected ? c.optDotOn : 'transparent',
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.hormonalOptionText,
                          { color: isSelected ? c.optOnText : c.optText },
                          isSelected && styles.hormonalOptionTextSelected,
                        ]}>
                        {opt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* Don't predict phase from periods toggle */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, styles.rowTitleFill, { color: c.rowTitle }]}>
                {"Don't predict phase from my periods"}
              </Text>
              <CustomToggle value={isCycleNotTypical} onValueChange={setIsCycleNotTypical} />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              For irregular or atypical cycles.
            </Text>
          </View>
        </SettingsCard>

        {/* ── 5. SUBSCRIPTION (.sx-sec) ────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: c.section }]}>SUBSCRIPTION</Text>

        <SettingsCard>
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => router.push('/paywall' as any)}
            accessibilityRole="button"
            accessibilityLabel="Manage subscription">
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, styles.rowTitleFill, { color: c.rowTitle }]}>Manage subscription</Text>
              <Chevron color={c.chev} />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              Update your plan or cancel anytime in the App Store. Your history stays on your phone either way.
            </Text>
          </Pressable>
        </SettingsCard>

        {/* ── 6. PRIVACY (.sx-sec) ─────────────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: c.section }]}>PRIVACY</Text>

        <SettingsCard>
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => router.push('/(tabs)/your-data' as any)}
            accessibilityRole="button"
            accessibilityLabel="Your data">
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, styles.rowTitleFill, { color: c.rowTitle }]}>Your data</Text>
              <Chevron color={c.chev} />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              See everything heedly keeps, where it lives, and who sees it.
            </Text>
          </Pressable>
        </SettingsCard>

        {/* ── 7. NOTIFICATIONS (.sx-sec) ───────────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: c.section }]}>NOTIFICATIONS</Text>

        <SettingsCard>
          {/* Daily check-in reminder */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: c.rowTitle }]}>Daily check-in reminder</Text>
              <CustomToggle value={isDailyReminder} onValueChange={handleDailyReminderChange} />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              A gentle nudge to check in — you pick the time.
            </Text>
          </View>

          {isDailyReminder && (
            <>
              <View style={[styles.divider, { backgroundColor: c.divider }]} />
              {/* Reminder time (.sx-value) */}
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                onPress={() => setIsTimePickerOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={`Reminder time ${formatReminderTime(reminderTime)}`}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.rowTitle, { color: c.rowTitle }]}>Reminder time</Text>
                  <View style={styles.rightValueRow}>
                    <Text style={[styles.timeValueText, { color: c.value }]}>
                      {formatReminderTime(reminderTime)}
                    </Text>
                    <Chevron color={c.valueChev} />
                  </View>
                </View>
              </Pressable>
            </>
          )}

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* Heads-up before harder days */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: c.rowTitle }]}>Heads-up before harder days</Text>
              <CustomToggle
                value={isHarderDaysReminder}
                onValueChange={handleHarderDaysReminderChange}
              />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              heedly lets you know when the next few days look heavier, so you can plan ahead.
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: c.divider }]} />

          {/* Weekly recap */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { color: c.rowTitle }]}>Weekly recap</Text>
              <CustomToggle value={isWeeklyRecap} onValueChange={setIsWeeklyRecap} />
            </View>
            <Text style={[styles.rowDescription, { color: c.rowDesc }]}>
              A short summary of what heedly noticed this week.
            </Text>
          </View>
        </SettingsCard>

      </ScrollView>

      {isTimePickerOpen && (
        <TimePickerSheet
          value={reminderTime}
          onCancel={() => setIsTimePickerOpen(false)}
          onConfirm={handleReminderTimeConfirm}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// Values from .sx-* in the Aubade handoff. CSS blur radius B maps to RN
// shadowRadius B / 2.

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  // .sx: padding 0 22px
  scrollContent: {
    paddingHorizontal: 22,
  },

  pressed: {
    opacity: 0.75,
  },

  // ── Header (.sx-nav) ────────────────────────────────────────────────────

  stickyHeader: {
    paddingHorizontal: 22,
  },

  // .sx-nav: height 30px, margin-bottom 13px
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 30,
    marginBottom: 13,
  },

  // .sx-back: 30x30, margin-left -5px
  backButton: {
    width: 30,
    height: 30,
    marginLeft: -5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // .sx-ver: 11.5px, 600, letter-spacing 0.04em
  versionText: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.46,
  },

  // .sx-eyebrow: 11px, 600, letter-spacing 0.2em, margin-bottom 7px
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  // .sx-title: Comfortaa 500, 30px, letter-spacing -0.01em
  mainHeading: {
    fontFamily: Fonts.display.medium,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.3,
  },

  // ── Group Headers & Cards (.sx-sec & .sx-card) ───────────────────────────

  // .sx-sec: 11px, 600, letter-spacing 0.16em, margin 23px 0 10px
  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    marginTop: 23,
    marginBottom: 10,
  },

  // .sx-tabbed .sx-card: radius 22px, padding 6px 0, shadow 0 10px 26px.
  // Rows' 18px side padding sits on the card so dividers inset to match.
  card: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 13,
  },

  // .sx-row: padding 17px 18px, min-height 58px
  row: {
    paddingVertical: 17,
    minHeight: 58,
    justifyContent: 'center',
  },

  // .sx-row-line: gap 12px
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  // .sx-row-title: 14.5px, 600, letter-spacing -0.01em, line-height 1.3
  rowTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    lineHeight: 19,
    flexShrink: 1,
  },

  // .sx-row-line > .sx-row-title: flex 1
  rowTitleFill: {
    flex: 1,
  },

  // .sx-row-desc: 12.5px, 450, line-height 1.45, margin-top 5px
  rowDescription: {
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 5,
  },

  // .has-ic > .sx-row-desc: padding-left 42px
  rowDescriptionIndented: {
    paddingLeft: 42,
  },

  // .sx-card > * + .sx-row::before: 1px, inset 18px (the card's padding)
  divider: {
    height: 1,
  },

  // ── Segmented Control (.sx-seg) ──────────────────────────────────────────

  // .sx-seg: padding 3px, gap 2px, radius 11px
  segmentedTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 11,
    padding: 3,
    gap: 2,
  },

  // .sx-seg-btn: padding 6px 13px, radius 8px
  segmentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // .sx-seg-btn.on (light): shadow 0 2px 6px rgba(224,115,95,0.28)
  segmentBtnOnLight: {
    shadowColor: '#E0735F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 3,
  },

  // .sx-seg-btn: 12.5px, 600
  segmentText: {
    fontSize: 12.5,
    fontWeight: '600',
  },

  // ── Wearable Row (.sx-change, .sx-row-ic) ────────────────────────────────

  // .sx-change: gap 5px
  changeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  // .sx-change-dot: 6px with a 2px ring
  changeDotRing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  changeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // .sx-change: 12px, 600
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // .sx-row-ic: 30x30, radius 9px
  plusBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hormonal Context (.sx-select & .sx-opts) ─────────────────────────────

  // .sx-select: margin-top 11px, padding 13px 15px, radius 13px
  cycleSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 13,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginTop: 11,
  },

  // .sx-select: 14px, 600
  cycleSelectButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // .sx-opts: gap 7px, margin-top 9px
  hormonalOptionsContainer: {
    marginTop: 9,
    gap: 7,
  },

  // .sx-opt: padding 11px 14px, radius 12px, gap 10px
  hormonalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },

  // .sx-optdot: 9x9, border 1.5px
  hormonalRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
  },

  // .sx-opt: 13.5px, 500
  hormonalOptionText: {
    fontSize: 13.5,
    fontWeight: '500',
  },

  hormonalOptionTextSelected: {
    fontWeight: '600',
  },

  // ── Notifications Row ────────────────────────────────────────────────────

  // .sx-value: gap 3px
  rightValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  // .sx-value: 14px, 600
  timeValueText: {
    fontSize: 14,
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

  // .sx-toggle: 46x28, fully rounded; knob 22px inset 3px
  toggleTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },

  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  // .knob: box-shadow 0 1px 3px rgba(0,0,0,0.18)
  toggleThumbShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.5,
    elevation: 2,
  },

  toggleThumbInactive: {
    alignSelf: 'flex-start',
  },

  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
