import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Spacing } from '@/constants/theme';

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
  pillBg: 'rgba(255, 251, 248, 0.75)',
  pillBorder: 'rgba(212, 184, 174, 0.4)',
};

// ─── Energy level data ────────────────────────────────────────────────────────

type EnergyLevel = {
  id: number;
  label: string;
  color: string;
  glowColor: string;
};

const RECURRING_LEVELS: EnergyLevel[] = [
  { id: 0, label: 'drained', color: '#DC6B76', glowColor: 'rgba(220, 107, 118, 0.3)' },
  { id: 1, label: 'low', color: '#E08568', glowColor: 'rgba(224, 133, 104, 0.3)' },
  { id: 2, label: 'middling', color: '#E7B874', glowColor: 'rgba(231, 184, 116, 0.35)' },
  { id: 3, label: 'good', color: '#A5C49F', glowColor: 'rgba(165, 196, 159, 0.35)' },
  { id: 4, label: 'high', color: '#7BA98B', glowColor: 'rgba(123, 169, 139, 0.35)' },
];

const FIRST_TIME_LEVELS: EnergyLevel[] = [
  { id: 0, label: 'awful', color: '#DC6B76', glowColor: 'rgba(220, 107, 118, 0.3)' },
  { id: 1, label: 'poor', color: '#E08568', glowColor: 'rgba(224, 133, 104, 0.3)' },
  { id: 2, label: 'okay', color: '#E7B874', glowColor: 'rgba(231, 184, 116, 0.35)' },
  { id: 3, label: 'good', color: '#A5C49F', glowColor: 'rgba(165, 196, 159, 0.35)' },
  { id: 4, label: 'great', color: '#7BA98B', glowColor: 'rgba(123, 169, 139, 0.35)' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function EnergyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    yesterdayIndex?: string;
    yesterdayLabel?: string;
    isFirstTime?: string;
  }>();

  const isFirstTime = params.isFirstTime === 'true';
  const levels = isFirstTime ? FIRST_TIME_LEVELS : RECURRING_LEVELS;
  const [selectedIndex, setSelectedIndex] = useState<number>(2); // Default: okay / middling
  const [isCrash, setIsCrash] = useState<boolean>(false);

  const selectedLevel = levels[selectedIndex];

  const handleSelectLevel = (index: number) => {
    setSelectedIndex(index);
    setIsCrash(false);
  };

  const handleCrashPress = () => {
    setIsCrash(!isCrash);
    if (!isCrash) {
      setSelectedIndex(0); // Set to awful / drained when crash is selected
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
    if (isFirstTime) {
      router.push({
        pathname: '/(check-in)/yesterday',
        params: {
          isFirstTime: 'true',
        },
      });
    } else {
      router.push({
        pathname: '/(check-in)/body',
        params: {
          yesterdayIndex: params.yesterdayIndex,
          yesterdayLabel: params.yesterdayLabel,
        },
      });
    }
  };

  const handleNext = () => {
    if (isFirstTime) {
      router.push({
        pathname: '/(check-in)/yesterday',
        params: {
          energyIndex: selectedIndex,
          energyLabel: selectedLevel.label,
          isFirstTime: 'true',
        },
      });
    } else {
      router.push({
        pathname: '/(check-in)/body',
        params: {
          yesterdayIndex: params.yesterdayIndex,
          yesterdayLabel: params.yesterdayLabel,
          energyIndex: selectedIndex,
          energyLabel: selectedLevel.label,
        },
      });
    }
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Top navigation bar ───────────────────────────────────────── */}
        <View style={styles.topNav}>
          {/* Back button */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>

          {/* Progress indicator (Question 1 of 3) */}
          <View style={styles.progressRow}>
            <View style={styles.progressActive} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
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

        {/* ── Fixed Viewport Content (Non-scrollable) ──────────────────── */}
        <View style={styles.contentArea}>
          {/* ── Question Label ─────────────────────────────────────────── */}
          <Text style={styles.questionLabel}>QUESTION 1 OF 3</Text>

          {/* ── Question Heading ───────────────────────────────────────── */}
          <Text style={styles.questionHeading}>
            {isFirstTime ? (
              <>
                <Text style={styles.headingDark}>{'How are you\n'}</Text>
                <Text style={styles.headingAccent}>feeling?</Text>
              </>
            ) : (
              <>
                <Text style={styles.headingDark}>{"How's your\n"}</Text>
                <Text style={styles.headingAccent}>energy right now?</Text>
              </>
            )}
          </Text>

          {/* ── Supporting Text ────────────────────────────────────────── */}
          <Text style={styles.supportingText}>
            {isFirstTime
              ? 'No need to think hard — go with your gut.'
              : 'No need to think hard — go with your gut.'}
          </Text>

          {/* ── 5-Level Energy Selector ────────────────────────────────── */}
          <View style={styles.selectorContainer}>
            <View style={styles.circlesRow}>
              {levels.map((level, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <Pressable
                    key={level.id}
                    onPress={() => handleSelectLevel(idx)}
                    style={styles.circleTouchArea}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`Energy level ${level.label}`}>
                    <View style={styles.circleWrapper}>
                      {/* Translucent glow ring for selected state */}
                      {isSelected && (
                        <View
                          style={[
                            styles.selectedRing,
                            { backgroundColor: level.glowColor },
                          ]}
                        />
                      )}
                      {/* Main color circle */}
                      <View
                        style={[
                          styles.circle,
                          { backgroundColor: level.color },
                        ]}
                      />
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* ── Labels Row (awful/drained, selected pill, great/high) ──── */}
            <View style={styles.labelsRow}>
              <Text style={styles.endpointLabel}>{levels[0].label}</Text>

              {/* Center selected pill */}
              <View style={styles.selectedPill}>
                <View
                  style={[
                    styles.pillDot,
                    { backgroundColor: selectedLevel.color },
                  ]}
                />
                <Text style={styles.pillText}>{selectedLevel.label}</Text>
              </View>

              <Text style={styles.endpointLabel}>{levels[4].label}</Text>
            </View>
          </View>

          {/* ── Crash Link ─────────────────────────────────────────────── */}
          <Pressable
            onPress={handleCrashPress}
            style={({ pressed }) => [styles.crashContainer, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="I'm in a crash">
            <Text
              style={[
                styles.crashText,
                isCrash && styles.crashTextActive,
              ]}>
              {"I'm in a crash"}
            </Text>
          </Pressable>

        </View>

        {/* ── Bottom Section: Next Button & Helper Text ───────────────── */}
        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next">
            <Text style={styles.nextButtonText}>Next</Text>
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
    overflow: 'hidden',
  },

  glowInner: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#EEDCE0',
    opacity: 0.45,
    top: '8%',
    alignSelf: 'center',
  },

  safeArea: {
    flex: 1,
  },

  pressed: {
    opacity: 0.7,
  },

  // ── Top Nav ──────────────────────────────────────────────────────────────

  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    height: 44,
  },

  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.bodyText,
  },

  skipText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.mutedText,
    paddingBottom: 4,
    paddingRight: 6,
    paddingLeft: 2,
  },

  // ── Progress Bar ─────────────────────────────────────────────────────────

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  progressActive: {
    width: 32,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  progressDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.progressInactive,
  },

  // ── Fixed Viewport Content ───────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },

  // ── Question Label ───────────────────────────────────────────────────────

  questionLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 12,
    color: COLORS.mutedText,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.two,
  },

  // ── Question Heading ─────────────────────────────────────────────────────

  questionHeading: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 38,
    lineHeight: 46,
    marginBottom: Spacing.two,
  },

  headingDark: {
    color: COLORS.headingDark,
  },

  headingAccent: {
    color: COLORS.accent,
  },

  // ── Supporting Text ──────────────────────────────────────────────────────

  supportingText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16.5,
    lineHeight: 23,
    color: '#463332',
    marginBottom: Spacing.five,
    maxWidth: '90%',
  },

  // ── Energy Selector ──────────────────────────────────────────────────────

  selectorContainer: {
    marginBottom: Spacing.four,
  },

  circlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    marginBottom: Spacing.three,
  },

  circleTouchArea: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  // ── Labels Row ───────────────────────────────────────────────────────────

  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.one,
  },

  endpointLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: COLORS.mutedText,
    width: 60,
    textAlign: 'center',
  },

  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.pillBg,
    borderWidth: 1,
    borderColor: COLORS.pillBorder,
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 18,
    minWidth: 120,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  pillText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 14,
    color: COLORS.headingDark,
  },

  // ── Crash Link ───────────────────────────────────────────────────────────

  crashContainer: {
    alignSelf: 'center',
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
    fontWeight: '400'

  },

  crashText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15,
    color: COLORS.accent,
    textDecorationLine: 'underline',
    fontWeight: '400'

  },

  crashTextActive: {
    fontFamily: 'AvenirNext-DemiBold',
    fontWeight: '400'

  },

  // ── Bottom Section ───────────────────────────────────────────────────────

  bottomSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    alignItems: 'center',
    gap: 12,
  },

  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 50,
    paddingVertical: 18,
    paddingLeft: Spacing.four,
    paddingRight: Spacing.three,
    alignSelf: 'stretch',
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.86,
  },

  nextButtonText: {
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
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13.5,
    color: '#6B4C3E',
    textAlign: 'center',
  },
});
