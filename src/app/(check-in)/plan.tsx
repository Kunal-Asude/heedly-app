import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from '@/components/ui/symbol';
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
      ? "#A8979E"
      : "rgba(199, 180, 191, 1)"
    : "rgba(74, 58, 57, 0.78)";
  const groupLabelColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.68)"
    : "rgba(74, 58, 57, 0.5)";
  const optionalLabelColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.54)"
    : "rgba(74, 58, 57, 0.4)";

  // .pl-chip / .pl-date / .pl-kind. In the light theme a selected date or kind
  // is the solid coral gradient; a selected quick chip stays a soft tint.
  const tintBg = isDark
    ? isTrueBlack
      ? 'rgba(190, 106, 92, 0.14)'
      : 'rgba(226, 122, 108, 0.17)'
    : 'rgba(244, 164, 126, 0.18)';
  const tintBorder = isDark
    ? isTrueBlack
      ? 'rgba(255, 255, 255, 0.07)'
      : 'rgba(255, 255, 255, 0.09)'
    : 'rgba(224, 115, 95, 0.42)';
  const inactiveBg = isDark
    ? isTrueBlack
      ? '#16111B'
      : 'rgba(51, 37, 56, 0.72)'
    : '#fffdfa';
  const inactiveBorder = isDark
    ? isTrueBlack
      ? 'rgba(255, 255, 255, 0.07)'
      : 'rgba(199, 180, 191, 0.14)'
    : 'rgba(120, 90, 80, 0.16)';
  const chipText = isDark ? (isTrueBlack ? '#E9DDD6' : '#F3E7E1') : '#4f3c3a';
  const solidSelected = !isDark;
  const solidText = '#fff8f4';

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
              <SymbolView name="chevron.left" size={22} tintColor={isDark ? (isTrueBlack ? '#A8979E' : 'rgba(199, 180, 191, 0.84)') : 'rgba(74, 58, 57, 0.62)'} />
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
                    backgroundColor: selectedPreset === 'tomorrow' ? tintBg : inactiveBg,
                    borderColor: selectedPreset === 'tomorrow' ? tintBorder : inactiveBorder,
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
                      color: chipText,
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
                      backgroundColor: selectedPreset === 'weekend' ? tintBg : inactiveBg,
                      borderColor: selectedPreset === 'weekend' ? tintBorder : inactiveBorder,
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
                        color: chipText,
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
                        backgroundColor: isSelected ? (solidSelected ? 'transparent' : tintBg) : inactiveBg,
                        borderColor: isSelected ? (solidSelected ? 'transparent' : tintBorder) : inactiveBorder,
                      },
                      isSelected && solidSelected && styles.solidLift,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleSelectDay(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.abbr} ${item.date}`}>
                    {isSelected && solidSelected && (
                      <LinearGradient
                        colors={['#f4a47e', '#e0735f']}
                        start={{ x: 0.2, y: 0 }}
                        end={{ x: 0.8, y: 1 }}
                        style={[styles.solidFill, { borderRadius: 15 }]}
                      />
                    )}
                    <Text
                      style={[
                        styles.dateCardDayLabel,
                        {
                          color: isSelected && solidSelected
                            ? solidText
                            : isDark ? (isTrueBlack ? '#9A8A91' : 'rgba(199, 180, 191, 0.62)') : 'rgba(74, 58, 57, 0.46)',
                        },
                      ]}>
                      {item.abbr}
                    </Text>
                    <Text
                      style={[
                        styles.dateCardNumber,
                        {
                          color: isSelected && solidSelected ? solidText : isDark ? chipText : '#463332',
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
                        backgroundColor: isSelected ? (solidSelected ? 'transparent' : tintBg) : inactiveBg,
                        borderColor: isSelected ? (solidSelected ? 'transparent' : tintBorder) : inactiveBorder,
                      },
                      isSelected && solidSelected && styles.solidLift,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleToggleActivity(activity)}
                    accessibilityRole="button"
                    accessibilityLabel={activity}>
                    {isSelected && solidSelected && (
                      <LinearGradient
                        colors={['#f4a47e', '#e0735f']}
                        start={{ x: 0.2, y: 0 }}
                        end={{ x: 0.8, y: 1 }}
                        style={[styles.solidFill, { borderRadius: 999 }]}
                      />
                    )}
                    <Text
                      style={[
                        styles.activityChipText,
                        {
                          color: isSelected && solidSelected ? solidText : chipText,
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
                  : ['#f4a47e', '#ea846a', '#e0735f']
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
  container: { flex: 1, paddingHorizontal: 22, paddingBottom: 20 },
  pressed: { opacity: 0.75 },
  buttonPressed: { transform: [{ scale: 0.985 }], opacity: 0.92 },
  flexSpacer: { flex: 1 },
  headerBlock: {},
  backButton: { width: 30, height: 30, marginLeft: -5, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  // .pl-date.sel / .pl-kind.sel: shadow 0 8px 18px rgba(224,115,95,0.28)
  solidLift: { shadowColor: '#E0735F', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 9, elevation: 4 },
  solidFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 2.2, textTransform: 'uppercase', marginBottom: 7 },
  mainHeading: { fontFamily: Fonts.display.medium, fontSize: 30, lineHeight: 34, letterSpacing: -0.3 },
  subtitleText: { fontSize: 14.5, lineHeight: 22, marginTop: 12, maxWidth: 270 },
  sectionBlock: { marginTop: 26 },
  groupLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1.76, textTransform: 'uppercase', marginBottom: 12 },
  optionalLabel: { fontSize: 11, fontWeight: '500', textTransform: 'none', letterSpacing: 0 },
  presetsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  presetChip: { paddingVertical: 10, paddingHorizontal: 17, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  presetText: { fontSize: 14, fontWeight: '600' },
  dateCardsRow: { flexDirection: 'row', gap: 8 },
  dateCardWrapper: { flex: 1, paddingTop: 11, paddingBottom: 12, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 3, borderWidth: 1.5 },
  dateCardDayLabel: { fontSize: 9.5, fontWeight: '700', letterSpacing: 0.95, textTransform: 'uppercase' },
  dateCardNumber: { fontSize: 17, fontWeight: '600' },
  activityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  activityChipWrapper: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  activityChipText: { fontSize: 13.5, fontWeight: '600' },
  ctaButtonWrapper: { width: '100%', height: 56, borderRadius: 28, shadowColor: '#6E5656', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.16, shadowRadius: 10, elevation: 8 },
  ctaButtonGradient: { flex: 1, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  ctaButtonText: { color: '#FFF8F4', fontSize: 16, fontWeight: '600', letterSpacing: -0.16 },
  ctaArrowContainer: { position: 'absolute', right: 22, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
});
