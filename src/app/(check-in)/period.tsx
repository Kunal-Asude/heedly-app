import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { Fonts, Spacing } from '@/constants/theme';
import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';

import { useCheckIn } from '@/contexts/CheckInContext';

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
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const { activeEntry, updateEntry } = useCheckIn();

  const [selectedDay, setSelectedDay] = useState<string | null>(() => {
    if (activeEntry.periodInfo?.startsWith('Day ')) {
      return activeEntry.periodInfo.split(' · ')[0];
    }
    return null;
  });

  const [selectedFlow, setSelectedFlow] = useState<string | null>(() => {
    if (activeEntry.periodInfo?.includes(' · ')) {
      const parts = activeEntry.periodInfo.split(' · ');
      return parts[1]?.replace(' flow', '') ?? null;
    }
    return null;
  });

  const [selectedQuick, setSelectedQuick] = useState<string | null>(() => {
    if (activeEntry.periodInfo && QUICK_OPTIONS.includes(activeEntry.periodInfo)) {
      return activeEntry.periodInfo;
    }
    return null;
  });

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
    router.push('/(check-in)/saved');
  };

  const handleSave = () => {
    let periodInfo = '';
    if (selectedDay) {
      periodInfo = selectedFlow ? `${selectedDay} · ${selectedFlow} flow` : selectedDay;
    } else if (selectedQuick) {
      periodInfo = selectedQuick;
    }

    updateEntry({
      periodInfo: periodInfo.length > 0 ? periodInfo : null,
    });

    router.push('/(check-in)/saved');
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
            <Text style={[styles.backChevron, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.81)') : 'rgba(74, 58, 57, 0.6)' }]}>‹</Text>
          </Pressable>

          {/* Optional Tag Chip in Nav */}
          <View
            style={[
              styles.optionalBadge,
              {
                backgroundColor: isDark
                  ? isTrueBlack
                    ? "rgba(190, 106, 92, 0.14)"
                    : "rgba(226, 122, 108, 0.16)"
                  : "rgba(244, 164, 126, 0.2)",
                borderColor: isDark
                  ? isTrueBlack
                    ? "rgba(255, 255, 255, 0.07)"
                    : "rgba(255, 255, 255, 0.09)"
                  : "rgba(224, 115, 95, 0.28)",
              },
            ]}
          >
            <Text style={[styles.optionalBadgeText, { color: isDark ? (isTrueBlack ? "#C97B60" : "#E8907A") : "#b05334" }]}>OPTIONAL</Text>
          </View>

          {/* Skip link */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Skip">
            <Text style={[styles.skipText, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.68)') : 'rgba(74, 58, 57, 0.5)' }]}>Skip</Text>
          </Pressable>
        </View>

        {/* ── Viewport Content ─────────────────────────────────────────── */}
        <View style={styles.contentArea}>
          {/* ── Section Label ──────────────────────────────────────────── */}
          <Text style={[styles.questionLabel, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.68)') : 'rgba(74, 58, 57, 0.5)' }]}>CYCLE UPDATE</Text>

          {/* ── Question Heading ───────────────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={[styles.headingDark, { color: isDark ? (isTrueBlack ? "#E9DDD6" : "#F3E7E1") : theme.ink.display }]}>{'What day of your\n'}</Text>
            <Text style={[styles.headingAccent, { color: isDark ? (isTrueBlack ? "#C97B60" : "#E8907A") : theme.coral.terracottaDeep }]}>period?</Text>
          </Text>

          {/* ── Supporting Text ────────────────────────────────────────── */}
          <Text style={[styles.supportingText, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.95)') : 'rgba(74, 58, 57, 0.72)' }]}>
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
                    {
                      backgroundColor: isDark
                        ? isSelected
                          ? isTrueBlack
                            ? "rgba(190, 106, 92, 0.14)"
                            : "rgba(226, 122, 108, 0.22)"
                          : isTrueBlack
                          ? "#16111B"
                          : "rgba(51, 37, 56, 0.72)"
                        : isSelected
                        ? theme.coral.primary
                        : "rgba(255, 251, 248, 0.85)",
                      borderColor: isDark
                        ? isSelected
                          ? isTrueBlack
                            ? "rgba(255, 255, 255, 0.07)"
                            : "rgba(226, 122, 108, 0.5)"
                          : isTrueBlack
                          ? "rgba(255, 255, 255, 0.07)"
                          : "rgba(199, 180, 191, 0.14)"
                        : isSelected
                        ? "transparent"
                        : "rgba(212, 184, 174, 0.45)",
                    },
                    isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={day}>
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: isDark
                          ? isSelected
                            ? isTrueBlack
                              ? "#E9DDD6"
                              : "#F3E7E1"
                            : isTrueBlack
                            ? "#9A8A91"
                            : "rgba(199, 180, 191, 0.88)"
                          : isSelected
                          ? "#FFFFFF"
                          : "#463332",
                      },
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
              <Text style={[styles.subLabel, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.68)') : 'rgba(74, 58, 57, 0.5)' }]}>FLOW (OPTIONAL)</Text>
              <View style={styles.flowRow}>
                {FLOW_LEVELS.map((flow) => {
                  const isSelected = selectedFlow === flow;
                  return (
                    <Pressable
                      key={flow}
                      onPress={() => handleSelectFlow(flow)}
                      style={({ pressed }) => [
                        styles.flowChip,
                        {
                          backgroundColor: isDark
                            ? isSelected
                              ? isTrueBlack
                                ? "rgba(190, 106, 92, 0.14)"
                                : "rgba(226, 122, 108, 0.22)"
                              : isTrueBlack
                              ? "#16111B"
                              : "rgba(51, 37, 56, 0.72)"
                            : isSelected
                            ? theme.coral.primary
                            : "rgba(255, 251, 248, 0.85)",
                          borderColor: isDark
                            ? isSelected
                              ? isTrueBlack
                                ? "rgba(255, 255, 255, 0.07)"
                                : "rgba(226, 122, 108, 0.5)"
                              : isTrueBlack
                              ? "rgba(255, 255, 255, 0.07)"
                              : "rgba(199, 180, 191, 0.14)"
                            : isSelected
                            ? "transparent"
                            : "rgba(212, 184, 174, 0.45)",
                        },
                        isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={flow}>
                      <Text
                        style={[
                          styles.flowText,
                          {
                            color: isDark
                              ? isSelected
                                ? isTrueBlack
                                  ? "#E9DDD6"
                                  : "#F3E7E1"
                                : isTrueBlack
                                ? "#9A8A91"
                                : "rgba(199, 180, 191, 0.88)"
                              : isSelected
                              ? "#FFFFFF"
                              : "#463332",
                          },
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
            <Text style={[styles.subLabel, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.68)') : 'rgba(74, 58, 57, 0.5)' }]}>OR SELECT STATUS</Text>
            <View style={styles.quickList}>
              {QUICK_OPTIONS.map((option) => {
                const isSelected = selectedQuick === option;
                return (
                  <Pressable
                    key={option}
                    onPress={() => handleSelectQuick(option)}
                    style={({ pressed }) => [
                      styles.quickChip,
                      {
                        backgroundColor: isDark
                          ? isSelected
                            ? isTrueBlack
                              ? "rgba(190, 106, 92, 0.14)"
                              : "rgba(226, 122, 108, 0.22)"
                            : isTrueBlack
                            ? "#16111B"
                            : "rgba(51, 37, 56, 0.72)"
                          : isSelected
                          ? theme.coral.primary
                          : "rgba(255, 251, 248, 0.85)",
                        borderColor: isDark
                          ? isSelected
                            ? isTrueBlack
                              ? "rgba(255, 255, 255, 0.07)"
                              : "rgba(226, 122, 108, 0.5)"
                            : isTrueBlack
                            ? "rgba(255, 255, 255, 0.07)"
                            : "rgba(199, 180, 191, 0.14)"
                          : isSelected
                          ? "transparent"
                          : "rgba(212, 184, 174, 0.45)",
                      },
                      isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
                      pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={option}>
                    <Text
                      style={[
                        styles.quickText,
                        {
                          color: isDark
                            ? isSelected
                              ? isTrueBlack
                                ? "#E9DDD6"
                                : "#F3E7E1"
                              : isTrueBlack
                              ? "#9A8A91"
                              : "rgba(199, 180, 191, 0.88)"
                            : isSelected
                            ? "#FFFFFF"
                            : "#463332",
                        },
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
              styles.saveButtonWrapper,
              pressed && styles.buttonPressed,
              isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
            ]}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save check-in">
            <LinearGradient
              colors={
                isDark
                  ? isTrueBlack
                    ? ['#574049', '#241A20']
                    : ['#634256', '#8A5D7C', '#9E768E']
                  : [theme.coral.light, theme.coral.mid, theme.coral.primary]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.saveButtonGradient,
                isDark && isTrueBlack && {
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.saveButtonText, isDark && isTrueBlack && { color: '#EADCD4' }]}>Save</Text>
              <View style={styles.saveArrowContainer}>
                <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 5l7 7-7 7"
                    stroke={isDark && isTrueBlack ? '#EADCD4' : '#FFF6F1'}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </LinearGradient>
          </Pressable>

          <Text style={[styles.bottomHelperText, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.65)') : 'rgba(74, 58, 57, 0.5)' }]}>
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
    color: '#6B4C3E',
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
    color: '#6B4C3E',
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
    color: '#463332',
  },

  headingAccent: {
    fontFamily: Fonts.display.regular,
    color: '#b05334',
  },

  supportingText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#463332',
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
    backgroundColor: '#E07860',
    borderColor: '#E07860',
  },

  dayChipUnselected: {
    backgroundColor: 'rgba(255, 251, 248, 0.85)',
    borderColor: 'rgba(212, 184, 174, 0.45)',
  },

  dayText: {
    fontSize: 14.5,
    fontWeight: '600',
  },

  dayTextSelected: {
    color: '#FFFFFF',
  },

  dayTextUnselected: {
    color: '#463332',
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
    color: '#6B4C3E',
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
    backgroundColor: '#E07860',
    borderColor: '#E07860',
  },

  flowChipUnselected: {
    backgroundColor: 'rgba(255, 251, 248, 0.85)',
    borderColor: 'rgba(212, 184, 174, 0.45)',
  },

  flowText: {
    fontSize: 14,
  },

  flowTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  flowTextUnselected: {
    color: '#463332',
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
    backgroundColor: '#E07860',
    borderColor: '#E07860',
  },

  quickChipUnselected: {
    backgroundColor: 'rgba(255, 251, 248, 0.85)',
    borderColor: 'rgba(212, 184, 174, 0.45)',
  },

  quickText: {
    fontSize: 14.5,
  },

  quickTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  quickTextUnselected: {
    color: '#463332',
  },

  // ── Bottom Action Section ─────────────────────────────────────────────────

  bottomSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 24,
    gap: 12,
  },

  saveButtonWrapper: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 5,
  },

  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 24,
  },

  saveButtonText: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  saveArrowContainer: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomHelperText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#6B4C3E',
    textAlign: 'center',
  },
});

