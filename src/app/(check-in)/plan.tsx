import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';
import { useCheckInConfig } from '@/hooks/data';

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlanScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { isDark } = useThemeMode();
  const { planningDays, planningActivities } = useCheckInConfig();

  // Selection states (pre-selected values matching reference screenshot)
  const [selectedPreset, setSelectedPreset] = useState<'tomorrow' | 'weekend' | null>('weekend');
  const [selectedDayId, setSelectedDayId] = useState<string>('sat-24');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['Social']);

  const handleSelectPreset = (preset: 'tomorrow' | 'weekend') => {
    setSelectedPreset(preset);
    if (preset === 'tomorrow') {
      setSelectedDayId('thu-22');
    } else {
      setSelectedDayId('sat-24');
    }
  };

  const handleSelectDay = (dayId: string) => {
    setSelectedDayId(dayId);
    if (dayId === 'thu-22') {
      setSelectedPreset('tomorrow');
    } else if (dayId === 'sat-24' || dayId === 'sun-25') {
      setSelectedPreset('weekend');
    } else {
      setSelectedPreset(null);
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
    const selectedDayObj = planningDays.find((d) => d.id === selectedDayId);
    const dayNameMap: Record<string, string> = {
      WED: 'Wednesday',
      THU: 'Thursday',
      FRI: 'Friday',
      SAT: 'Saturday',
      SUN: 'Sunday',
      MON: 'Monday',
    };
    const dayName = selectedDayObj ? dayNameMap[selectedDayObj.day] || 'Saturday' : 'Saturday';
    const activityLabel = selectedActivities.length > 0 ? selectedActivities[0] : 'Social';

    router.push({
      pathname: '/(check-in)/plan-result',
      params: { dayName, activityLabel },
    });
  };

  // Theme-aware tokens
  const eyebrowColor = isDark ? 'rgba(199, 180, 191, 0.65)' : 'rgba(74, 58, 57, 0.55)';
  const mainHeadingColor = isDark ? '#F3E7E1' : theme.ink.display;
  const subtitleColor = isDark ? 'rgba(199, 180, 191, 0.72)' : 'rgba(74, 58, 57, 0.78)';
  const groupLabelColor = isDark ? 'rgba(199, 180, 191, 0.65)' : 'rgba(74, 58, 57, 0.55)';
  const optionalLabelColor = isDark ? 'rgba(199, 180, 191, 0.5)' : 'rgba(74, 58, 57, 0.4)';

  // Selection state colors matching noting.tsx (no border in dark mode when unselected)
  const activeBg = isDark ? 'rgba(226, 122, 108, 0.18)' : 'rgba(244, 164, 126, 0.2)';
  const activeBorder = isDark ? 'rgba(226, 122, 108, 0.45)' : 'rgba(224, 115, 95, 0.42)';
  const inactiveBg = isDark ? 'rgba(51, 37, 56, 0.72)' : 'rgba(255, 252, 248, 0.76)';
  const inactiveBorder = isDark ? 'transparent' : 'rgba(255, 255, 255, 0.8)';

  return (
    <View style={styles.root}>
      {/* Exact Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* ── Top Header (.sx-nav & .pl-*) ───────────────────────────────── */}
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

          {/* ── PICK A DAY Section (.pl-sec) ─────────────────────────────── */}
          <View style={styles.sectionBlock}>
            <Text style={[styles.groupLabel, { color: groupLabelColor }]}>PICK A DAY</Text>

            {/* Presets Row (.pl-quick) */}
            <View style={styles.presetsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.presetChip,
                  {
                    backgroundColor: selectedPreset === 'tomorrow' ? activeBg : inactiveBg,
                    borderColor: selectedPreset === 'tomorrow' ? activeBorder : inactiveBorder,
                    borderWidth: selectedPreset === 'tomorrow' ? 1.5 : (isDark ? 0 : 1),
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
                      fontWeight: selectedPreset === 'tomorrow' ? '600' : '500',
                    },
                  ]}>
                  Tomorrow
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.presetChip,
                  {
                    backgroundColor: selectedPreset === 'weekend' ? activeBg : inactiveBg,
                    borderColor: selectedPreset === 'weekend' ? activeBorder : inactiveBorder,
                    borderWidth: selectedPreset === 'weekend' ? 1.5 : (isDark ? 0 : 1),
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
                      fontWeight: selectedPreset === 'weekend' ? '600' : '500',
                    },
                  ]}>
                  This weekend
                </Text>
              </Pressable>
            </View>

            {/* Date Cards Row (.pl-dates) */}
            <View style={styles.dateCardsRow}>
              {planningDays.map((item) => {
                const isSelected = selectedDayId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.dateCardWrapper,
                      {
                        backgroundColor: isSelected ? activeBg : inactiveBg,
                        borderColor: isSelected ? activeBorder : inactiveBorder,
                        borderWidth: isSelected ? 1.5 : (isDark ? 0 : 1),
                      },
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleSelectDay(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.day} ${item.date}`}>
                    <Text
                      style={[
                        styles.dateCardDayLabel,
                        {
                          color: isSelected
                            ? '#FFFFFF'
                            : isDark ? 'rgba(199, 180, 191, 0.6)' : 'rgba(74, 58, 57, 0.55)',
                        },
                      ]}>
                      {item.day}
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
            <View style={styles.groupLabelRow}>
              <Text style={[styles.groupLabel, { color: groupLabelColor }]}>WHAT KIND OF THING?</Text>
              <Text style={[styles.optionalLabel, { color: optionalLabelColor }]}> (optional)</Text>
            </View>

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
                        borderColor: isSelected ? activeBorder : inactiveBorder,
                        borderWidth: isSelected ? 1.5 : (isDark ? 0 : 1),
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
                          fontWeight: isSelected ? '600' : '500',
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

          {/* ── Bottom Action Button (.pl-cta gradient) ─────────────────── */}
          <Pressable
            style={({ pressed }) => [styles.ctaButtonWrapper, pressed && styles.buttonPressed]}
            onPress={handleCheckCost}
            accessibilityRole="button"
            accessibilityLabel="Check the cost">
            <LinearGradient
              colors={isDark ? ['#634256', '#8A5D7C', '#9E768E'] : ['#f0a07e', '#e88970', '#e0735f']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.ctaButtonGradient}>
              <Text style={styles.ctaButtonText}>Check the cost</Text>
              <View style={styles.ctaArrowContainer}>
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M9 5l7 7-7 7"
                    stroke="#FFF6F1"
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 20,
  },

  pressed: {
    opacity: 0.75,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  flexSpacer: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────

  headerBlock: {
    marginBottom: 18,
  },

  backButton: {
    width: 36,
    height: 36,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
  },

  // .pl-eyebrow: 11px, 600, 0.2em, uppercase
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  // .pl-title: Comfortaa 400, 32px, lineHeight 38px
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  // .pl-sub: 14.5px, 1.5
  subtitleText: {
    fontSize: 14.5,
    lineHeight: 21,
  },

  // ── Sections ────────────────────────────────────────────────────────────

  sectionBlock: {
    marginTop: 22,
  },

  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingLeft: 2,
  },

  groupLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingLeft: 2,
  },

  optionalLabel: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Presets Row (.pl-quick)
  presetsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  presetChip: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  presetText: {
    fontSize: 15,
    letterSpacing: -0.15,
  },

  // Date Cards Row (.pl-dates)
  dateCardsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },

  dateCardWrapper: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  dateCardDayLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },

  dateCardNumber: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  // Activity Chips (.pl-kinds)
  activityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  activityChipWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activityChipText: {
    fontSize: 15,
    letterSpacing: -0.15,
  },

  // ── Bottom Action Button (.pl-cta gradient) ───────────────────

  ctaButtonWrapper: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },

  ctaButtonGradient: {
    flex: 1,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },

  ctaButtonText: {
    color: '#FFF6F1',
    fontSize: 16,
    fontWeight: '600',
  },

  ctaArrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
});
