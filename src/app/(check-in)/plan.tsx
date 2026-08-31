import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';
import { useCheckInConfig } from '@/hooks/data';

// ─── Calendar helpers ─────────────────────────────────────────────────────────

const DAY_ABBRS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
const DAY_FULL_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const;

interface PlanDay {
  id: string;       // "YYYY-MM-DD" — stable unique key, replaces hardcoded "sat-24" etc.
  abbr: string;     // "MON", "SAT" …
  date: number;     // day-of-month
  fullName: string; // "Monday" …
}

/** Generates the next 6 days starting from tomorrow (device local time, no past). */
function buildFutureDays(): PlanDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: PlanDay[] = [];
  for (let i = 1; i <= 6; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    days.push({
      id: d.toISOString().slice(0, 10),
      abbr: DAY_ABBRS[dow],
      date: d.getDate(),
      fullName: DAY_FULL_NAMES[dow],
    });
  }
  return days;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlanScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const { planningActivities } = useCheckInConfig();

  // Build the real 6-day window once per mount — no hardcoded dates
  const days = useMemo(() => buildFutureDays(), []);

  // "Tomorrow" — always the first future day
  const tomorrowId = days[0]?.id ?? null;

  // "This weekend" — first Saturday in window, else first Sunday
  const weekendId = useMemo(() => {
    const sat = days.find((d) => d.abbr === 'SAT');
    if (sat) return sat.id;
    const sun = days.find((d) => d.abbr === 'SUN');
    return sun?.id ?? null;
  }, [days]);

  // Selected date: defaults to Tomorrow (or first day)
  const [selectedDayId, setSelectedDayId] = useState<string>(tomorrowId ?? days[0].id);

  // Selected activities (multi-select)
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  // Preset pill active tracker: 'tomorrow' | 'weekend' | 'custom'
  const selectedPreset = useMemo<'tomorrow' | 'weekend' | 'custom'>(() => {
    if (selectedDayId === tomorrowId) return 'tomorrow';
    if (selectedDayId === weekendId) return 'weekend';
    return 'custom';
  }, [selectedDayId, tomorrowId, weekendId]);

  const handleSelectDay = (id: string) => {
    setSelectedDayId(id);
  };

  const handleSelectPreset = (preset: 'tomorrow' | 'weekend') => {
    if (preset === 'tomorrow' && tomorrowId) {
      setSelectedDayId(tomorrowId);
    } else if (preset === 'weekend' && weekendId) {
      setSelectedDayId(weekendId);
    }
  };

  const handleToggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleCheckCost = () => {
    const chosenDay = days.find((d) => d.id === selectedDayId) ?? days[0];
    const activityName = selectedActivities[0] || 'Social';

    router.push({
      pathname: '/(check-in)/plan-result',
      params: {
        dayName: chosenDay.fullName,
        activityLabel: activityName,
      },
    });
  };

  // Theme-aware tokens (Dawn vs Dusk vs True Black / OLED)
  const eyebrowColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.65)"
    : "rgba(74, 58, 57, 0.55)";
  const mainHeadingColor = isDark
    ? isTrueBlack
      ? "#E9DDD6"
      : "#F3E7E1"
    : theme.ink.display;
  const subtitleColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.72)"
    : "rgba(74, 58, 57, 0.78)";
  const groupLabelColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.65)"
    : "rgba(74, 58, 57, 0.55)";
  const optionalLabelColor = isDark
    ? isTrueBlack
      ? "rgba(154, 138, 145, 0.65)"
      : "rgba(199, 180, 191, 0.5)"
    : "rgba(74, 58, 57, 0.4)";

  // Selection state colors
  const activeBg = isDark
    ? isTrueBlack
      ? 'rgba(190, 106, 92, 0.14)'
      : 'rgba(226, 122, 108, 0.18)'
    : 'rgba(244, 164, 126, 0.2)';
  const activeBorder = isDark
    ? isTrueBlack
      ? 'rgba(255, 255, 255, 0.07)'
      : 'rgba(226, 122, 108, 0.45)'
    : 'rgba(224, 115, 95, 0.42)';
  const inactiveBg = isDark
    ? isTrueBlack
      ? '#16111B'
      : 'rgba(51, 37, 56, 0.72)'
    : 'rgba(255, 252, 248, 0.76)';
  const inactiveBorder = isDark
    ? isTrueBlack
      ? 'rgba(255, 255, 255, 0.07)'
      : 'transparent'
    : 'rgba(255, 255, 255, 0.8)';

  // Hide "This weekend" if no SAT or SUN falls within the 6-day window
  const hasWeekendInWindow = weekendId !== null;

  return (
    <View style={styles.root}>
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          <View style={styles.headerBlock}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Text style={[styles.backChevron, { color: isDark ? theme.ink.muted : 'rgba(74, 58, 57, 0.62)' }]}>‹</Text>
            </Pressable>

            <Text style={[styles.sectionLabel, { color: eyebrowColor }]}>PLAN AHEAD</Text>
            <Text style={[styles.mainHeading, { color: mainHeadingColor }]}>Planning something?</Text>
            <Text style={[styles.subtitleText, { color: subtitleColor }]}>
              {'See what it might cost you — before you say yes.'}
            </Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={[styles.groupLabel, { color: groupLabelColor }]}>PICK A DAY</Text>

            <View style={styles.presetsRow}>
              {/* Tomorrow — always shown */}
              <Pressable
                style={({ pressed }) => [
                  styles.presetChip,
                  {
                    backgroundColor: selectedPreset === 'tomorrow' ? activeBg : inactiveBg,
                    borderColor: selectedPreset === 'tomorrow' ? activeBorder : (isDark ? 'transparent' : inactiveBorder),
                  },
                  pressed && styles.pressed,
                ]}
                onPress={() => handleSelectPreset('tomorrow')}
                accessibilityRole="button"
                accessibilityLabel="Tomorrow">
                <Text
                  style={[
                    styles.presetText,
                    {
                      color: selectedPreset === 'tomorrow'
                        ? '#FFFFFF'
                        : isDark ? 'rgba(199, 180, 191, 0.85)' : '#4f3c3a',
                    },
                  ]}>
                  Tomorrow
                </Text>
              </Pressable>

              {/* This weekend — only shown if a SAT or SUN falls in the 6-day window */}
              {hasWeekendInWindow && (
                <Pressable
                  style={({ pressed }) => [
                    styles.presetChip,
                    {
                      backgroundColor: selectedPreset === 'weekend' ? activeBg : inactiveBg,
                      borderColor: selectedPreset === 'weekend' ? activeBorder : (isDark ? 'transparent' : inactiveBorder),
                    },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleSelectPreset('weekend')}
                  accessibilityRole="button"
                  accessibilityLabel="This weekend">
                  <Text
                    style={[
                      styles.presetText,
                      {
                        color: selectedPreset === 'weekend'
                          ? '#FFFFFF'
                          : isDark ? 'rgba(199, 180, 191, 0.85)' : '#4f3c3a',
                      },
                    ]}>
                    This weekend
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Date Cards Row (.pl-dates) — real dates, no past days */}
            <View style={styles.dateCardsRow}>
              {days.map((item) => {
                const isSelected = selectedDayId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.dateCardWrapper,
                      {
                        backgroundColor: isSelected ? activeBg : inactiveBg,
                        borderColor: isSelected ? activeBorder : (isDark ? 'transparent' : inactiveBorder),
                      },
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleSelectDay(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.abbr} ${item.date}`}>
                    <Text
                      style={[
                        styles.dateCardDayLabel,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDark ? 'rgba(199, 180, 191, 0.6)' : 'rgba(74, 58, 57, 0.55)',
                        },
                      ]}>
                      {item.abbr}
                    </Text>
                    <Text
                      style={[
                        styles.dateCardNumber,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDark ? '#F3E7E1' : '#4f3c3a',
                        },
                      ]}>
                      {item.date}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ── WHAT KIND OF THING? Section (.pl-sec) ────────────────────── */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.groupLabel, { color: groupLabelColor }]}>
              WHAT KIND OF THING?
              <Text style={[styles.optionalLabel, { color: optionalLabelColor }]}> (optional)</Text>
            </Text>

            {/* Activity Type Chips Wrap (.pl-kinds) */}
            <View style={styles.activityWrap}>
              {planningActivities.map((activity) => {
                const isSelected = selectedActivities.includes(activity);
                return (
                  <Pressable
                    key={activity}
                    style={({ pressed }) => [
                      styles.activityChipWrapper,
                      {
                        backgroundColor: isSelected ? activeBg : inactiveBg,
                        borderColor: isSelected ? activeBorder : (isDark ? 'transparent' : inactiveBorder),
                      },
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleToggleActivity(activity)}
                    accessibilityRole="button"
                    accessibilityLabel={activity}>
                    <Text
                      style={[
                        styles.activityChipText,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDark ? 'rgba(199, 180, 191, 0.85)' : '#4f3c3a',
                        },
                      ]}>
                      {activity}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.flexSpacer} />

          <Pressable
            style={({ pressed }) => [
              styles.ctaButtonWrapper,
              pressed && styles.buttonPressed,
              isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
            ]}
            onPress={handleCheckCost}
            accessibilityRole="button"
            accessibilityLabel="Check the cost">
            <LinearGradient
              colors={
                isDark
                  ? isTrueBlack
                    ? ['#574049', '#241A20']
                    : ['#634256', '#8A5D7C', '#9E768E']
                  : ['#f0a07e', '#e88970', '#e0735f']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.ctaButtonGradient,
                isDark && isTrueBlack && {
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                  borderWidth: 1,
                },
              ]}>
              <Text style={[styles.ctaButtonText, isDark && isTrueBlack && { color: '#EADCD4' }]}>Check the cost</Text>
              <View style={styles.ctaArrowContainer}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M9 5l7 7-7 7"
                    stroke={isDark && isTrueBlack ? '#EADCD4' : '#FFF6F1'}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </LinearGradient>
          </Pressable>


        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 20 },
  pressed: { opacity: 0.75 },
  buttonPressed: { transform: [{ scale: 0.985 }], opacity: 0.92 },
  flexSpacer: { flex: 1 },
  headerBlock: { marginBottom: 18 },
  backButton: { width: 36, height: 36, marginLeft: -6, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  backChevron: { fontSize: 30, lineHeight: 30 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 6 },
  mainHeading: { fontFamily: Fonts.display.regular, fontSize: 32, lineHeight: 38, letterSpacing: -0.3, marginBottom: 6 },
  subtitleText: { fontSize: 14.5, lineHeight: 21 },
  sectionBlock: { marginTop: 22 },
  groupLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 2 },
  optionalLabel: { fontSize: 11, fontWeight: '500', textTransform: 'none', letterSpacing: 0 },
  presetsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  presetChip: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 22, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  presetText: { fontSize: 15, letterSpacing: -0.15, fontWeight: '500' },
  dateCardsRow: { flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
  dateCardWrapper: { flex: 1, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 3, borderWidth: 1.5 },
  dateCardDayLabel: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  dateCardNumber: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  activityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  activityChipWrapper: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 22, height: 44, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  activityChipText: { fontSize: 15, letterSpacing: -0.15, fontWeight: '500' },
  ctaButtonWrapper: { width: '100%', height: 54, borderRadius: 27, shadowColor: '#000000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 18, elevation: 8 },
  ctaButtonGradient: { flex: 1, borderRadius: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)' },
  ctaButtonText: { color: '#FFF6F1', fontSize: 16, fontWeight: '600' },
  ctaArrowContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 1 },
});
