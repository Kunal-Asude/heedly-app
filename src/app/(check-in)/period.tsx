import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Fonts, Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#463332',
  accent: '#b05334',
  bodyText: '#463332',
  mutedText: '#6B4C3E',
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
  progressInactive: '#E5C4B7',
  cardBg: 'rgba(255, 251, 248, 0.85)',
  cardBorder: 'rgba(212, 184, 174, 0.4)',
  selectedBg: '#E07860',
  selectedText: '#FFFFFF',
  unselectedBg: 'rgba(255, 251, 248, 0.85)',
  unselectedText: '#463332',
  unselectedBorder: 'rgba(212, 184, 174, 0.45)',
  spottingDot: '#DC6B76',
};

const PERIOD_DAYS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7+'];

const FLOW_LEVELS = ['Light', 'Medium', 'Heavy'];

const QUICK_OPTIONS = [
  'Period just started',
  'Spotting',
  'Not bleeding today',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PeriodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    yesterdayIndex?: string;
    yesterdayLabel?: string;
    energyIndex?: string;
    energyLabel?: string;
    bodyIndex?: string;
    bodyLabel?: string;
    tags?: string;
  }>();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);

  const handleSelectDay = (day: string) => {
    if (selectedDay === day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
      setSelectedQuick(null);
    }
  };

  const handleSelectFlow = (flow: string) => {
    setSelectedFlow(selectedFlow === flow ? null : flow);
  };

  const handleSelectQuick = (option: string) => {
    if (selectedQuick === option) {
      setSelectedQuick(null);
    } else {
      setSelectedQuick(option);
      setSelectedDay(null);
      setSelectedFlow(null);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.push({
      pathname: '/(check-in)/saved',
      params: {
        yesterdayIndex: params.yesterdayIndex,
        yesterdayLabel: params.yesterdayLabel,
        energyIndex: params.energyIndex ?? '2',
        energyLabel: params.energyLabel ?? 'middling',
        bodyIndex: params.bodyIndex ?? '2',
        bodyLabel: params.bodyLabel ?? 'tender',
        tags: params.tags,
      },
    });
  };

  const handleSave = () => {
    let periodInfo = '';
    if (selectedDay) {
      periodInfo = selectedFlow ? `${selectedDay} · ${selectedFlow} flow` : selectedDay;
    } else if (selectedQuick) {
      periodInfo = selectedQuick;
    }

    router.push({
      pathname: '/(check-in)/saved',
      params: {
        yesterdayIndex: params.yesterdayIndex,
        yesterdayLabel: params.yesterdayLabel,
        energyIndex: params.energyIndex ?? '2',
        energyLabel: params.energyLabel ?? 'middling',
        bodyIndex: params.bodyIndex ?? '2',
        bodyLabel: params.bodyLabel ?? 'tender',
        tags: params.tags,
        periodInfo: periodInfo.length > 0 ? periodInfo : undefined,
      },
    });
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Top Navigation Bar ───────────────────────────────────────── */}
        <View style={styles.topNav}>
          {/* Back button */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Question 3">
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>

          {/* Optional Tag Chip in Nav */}
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalBadgeText}>OPTIONAL</Text>
          </View>

          {/* Skip link */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Skip">
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* ── Viewport Content ─────────────────────────────────────────── */}
        <View style={styles.contentArea}>
          {/* ── Section Label ──────────────────────────────────────────── */}
          <Text style={styles.questionLabel}>CYCLE UPDATE</Text>

          {/* ── Question Heading ───────────────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={styles.headingDark}>{'What day of your\n'}</Text>
            <Text style={styles.headingAccent}>period?</Text>
          </Text>

          {/* ── Supporting Text ────────────────────────────────────────── */}
          <Text style={styles.supportingText}>
            Skip anytime if this does not apply to you.
          </Text>

          {/* ── Day Number Chips ───────────────────────────────────────── */}
          <View style={styles.daysRow}>
            {PERIOD_DAYS.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <Pressable
                  key={day}
                  onPress={() => handleSelectDay(day)}
                  style={({ pressed }) => [
                    styles.dayChip,
                    isSelected ? styles.dayChipSelected : styles.dayChipUnselected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={day}>
                  <Text
                    style={[
                      styles.dayText,
                      isSelected ? styles.dayTextSelected : styles.dayTextUnselected,
                    ]}>
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Flow Selection (Shown when a day is selected) ──────────── */}
          {selectedDay && (
            <View style={styles.flowSection}>
              <Text style={styles.subLabel}>FLOW (OPTIONAL)</Text>
              <View style={styles.flowRow}>
                {FLOW_LEVELS.map((flow) => {
                  const isSelected = selectedFlow === flow;
                  return (
                    <Pressable
                      key={flow}
                      onPress={() => handleSelectFlow(flow)}
                      style={({ pressed }) => [
                        styles.flowChip,
                        isSelected ? styles.flowChipSelected : styles.flowChipUnselected,
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={flow}>
                      <Text
                        style={[
                          styles.flowText,
                          isSelected ? styles.flowTextSelected : styles.flowTextUnselected,
                        ]}>
                        {flow}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Quick Status Options ───────────────────────────────────── */}
          <View style={styles.quickOptionsSection}>
            <Text style={styles.subLabel}>OR SELECT STATUS</Text>
            <View style={styles.quickList}>
              {QUICK_OPTIONS.map((option) => {
                const isSelected = selectedQuick === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => handleSelectQuick(option)}
                    style={({ pressed }) => [
                      styles.quickChip,
                      isSelected ? styles.quickChipSelected : styles.quickChipUnselected,
                      pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={option}>
                    <Text
                      style={[
                        styles.quickText,
                        isSelected ? styles.quickTextSelected : styles.quickTextUnselected,
                      ]}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Bottom Section: Save Button & Helper Text ────────────────── */}
        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save check-in">
            <Text style={styles.saveButtonText}>Save</Text>
            <Text style={styles.nextArrow}>›</Text>
          </Pressable>

          <Text style={styles.bottomHelperText}>
            You can do this lying down.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  safeArea: {
    flex: 1,
  },

  pressed: {
    opacity: 0.8,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  // ── Top Navigation Bar ───────────────────────────────────────────────────

  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: 8,
    paddingBottom: 12,
  },

  navButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    fontSize: 28,
    lineHeight: 28,
    color: '#785344',
  },

  optionalBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 184, 174, 0.3)',
  },

  optionalBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.mutedText,
    letterSpacing: 1.4,
  },

  skipText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#785344',
  },

  // ── Content Area ─────────────────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },

  questionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedText,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },

  questionHeading: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: 'center',
    marginBottom: 8,
  },

  headingDark: {
    fontFamily: Fonts.display.regular,
    color: COLORS.headingDark,
  },

  headingAccent: {
    fontFamily: Fonts.display.regular,
    color: COLORS.accent,
  },

  supportingText: {
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.bodyText,
    textAlign: 'center',
    marginBottom: 24,
  },

  // ── Day Chips ────────────────────────────────────────────────────────────

  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },

  dayChip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
  },

  dayChipSelected: {
    backgroundColor: COLORS.selectedBg,
    borderColor: COLORS.selectedBg,
  },

  dayChipUnselected: {
    backgroundColor: COLORS.unselectedBg,
    borderColor: COLORS.unselectedBorder,
  },

  dayText: {
    fontSize: 14.5,
    fontWeight: '600',
  },

  dayTextSelected: {
    color: COLORS.selectedText,
  },

  dayTextUnselected: {
    color: COLORS.unselectedText,
  },

  // ── Flow Section ─────────────────────────────────────────────────────────

  flowSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },

  subLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.mutedText,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 10,
    textAlign: 'center',
  },

  flowRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },

  flowChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
  },

  flowChipSelected: {
    backgroundColor: COLORS.selectedBg,
    borderColor: COLORS.selectedBg,
  },

  flowChipUnselected: {
    backgroundColor: COLORS.unselectedBg,
    borderColor: COLORS.unselectedBorder,
  },

  flowText: {
    fontSize: 14,
  },

  flowTextSelected: {
    color: COLORS.selectedText,
    fontWeight: '600',
  },

  flowTextUnselected: {
    color: COLORS.unselectedText,
  },

  // ── Quick Options ────────────────────────────────────────────────────────

  quickOptionsSection: {
    width: '100%',
    alignItems: 'center',
  },

  quickList: {
    width: '100%',
    gap: 8,
  },

  quickChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },

  quickChipSelected: {
    backgroundColor: COLORS.selectedBg,
    borderColor: COLORS.selectedBg,
  },

  quickChipUnselected: {
    backgroundColor: COLORS.unselectedBg,
    borderColor: COLORS.unselectedBorder,
  },

  quickText: {
    fontSize: 14.5,
  },

  quickTextSelected: {
    color: COLORS.selectedText,
    fontWeight: '600',
  },

  quickTextUnselected: {
    color: COLORS.unselectedText,
  },

  // ── Bottom Action Section ─────────────────────────────────────────────────

  bottomSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 24,
    gap: 12,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 24,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 5,
  },

  saveButtonText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  nextArrow: {
    color: COLORS.buttonText,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 28,
    opacity: 0.85,
  },

  bottomHelperText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#6B4C3E',
    textAlign: 'center',
  },
});
