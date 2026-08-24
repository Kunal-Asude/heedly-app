import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';
import { useCheckInConfig } from '@/hooks/data';


// ─── Component ────────────────────────────────────────────────────────────────

export default function BodyScreen() {
  const router = useRouter();
  const { bodyLevels } = useCheckInConfig();
  const params = useLocalSearchParams<{
    yesterdayIndex?: string;
    yesterdayLabel?: string;
    energyIndex?: string;
    energyLabel?: string;
    bodyIndex?: string;
    bodyLabel?: string;
    tags?: string;
    periodInfo?: string;
    isFirstTime?: string;
    isEditing?: string;
  }>();
  const initialIndex = params.bodyIndex !== undefined && !isNaN(Number(params.bodyIndex))
    ? Math.min(Math.max(0, Number(params.bodyIndex)), bodyLevels.length - 1)
    : 2;
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);
  const [isCrash, setIsCrash] = useState<boolean>(false);

  const selectedLevel = bodyLevels[selectedIndex];

  const isEditing = params.isEditing === 'true';

  const handleSelectLevel = (index: number) => {
    setSelectedIndex(index);
    setIsCrash(false);
  };

  const handleCrashPress = () => {
    setIsCrash(!isCrash);
    if (!isCrash) {
      setSelectedIndex(0); // Set to in pain when crash is selected
    }
  };

  const handleBack = () => {
    if (isEditing) {
      router.push({
        pathname: '/(check-in)/saved',
        params: {
          ...params,
        },
      });
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    if (isEditing) {
      router.push({
        pathname: '/(check-in)/saved',
        params: {
          ...params,
        },
      });
      return;
    }
    router.push({
      pathname: '/(check-in)/noting',
      params: {
        yesterdayIndex: params.yesterdayIndex,
        yesterdayLabel: params.yesterdayLabel,
        energyIndex: params.energyIndex,
        energyLabel: params.energyLabel,
        bodyIndex: params.bodyIndex,
        bodyLabel: params.bodyLabel,
        tags: params.tags,
        periodInfo: params.periodInfo,
        isFirstTime: params.isFirstTime,
      },
    });
  };

  const handleNext = () => {
    if (isEditing) {
      router.push({
        pathname: '/(check-in)/saved',
        params: {
          ...params,
          bodyIndex: selectedIndex,
          bodyLabel: selectedLevel.label,
        },
      });
      return;
    }
    router.push({
      pathname: '/(check-in)/noting',
      params: {
        yesterdayIndex: params.yesterdayIndex,
        yesterdayLabel: params.yesterdayLabel,
        energyIndex: params.energyIndex ?? '2',
        energyLabel: params.energyLabel ?? 'middling',
        bodyIndex: selectedIndex,
        bodyLabel: selectedLevel.label,
        tags: params.tags,
        periodInfo: params.periodInfo,
        isFirstTime: params.isFirstTime,
      },
    });
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
            accessibilityLabel="Go back to Question 1">
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>

          {/* Progress indicator (Question 2 of 3: dot, active pill, dot) */}
          <View style={styles.progressRow}>
            <View style={styles.progressDot} />
            <LinearGradient
              colors={['#f0a07e', '#e0735f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressActive}
            />
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
          {/* ── Question Label (.ci-eyebrow) ───────────────────────────── */}
          <Text style={styles.questionLabel}>QUESTION 2 OF 3</Text>

          {/* ── Question Heading (.ob-h: 31px, Comfortaa 400) ──────────── */}
          <Text style={styles.questionHeading}>
            <Text style={styles.headingDark}>How does your{'\n'}</Text>
            <Text style={styles.headingAccent}>body feel?</Text>
          </Text>

          {/* ── Supporting Text (.ob-sub: 14.5px) ──────────────────────── */}
          <Text style={styles.supportingText}>
            No need to think hard — go with your gut.
          </Text>

          {/* ── 5-Level Body Feel Selector (.ci-scalewrap) ─────────────── */}
          <View style={styles.selectorContainer}>
            <View style={styles.circlesRow}>
              {bodyLevels.map((level, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <Pressable
                    key={level.id}
                    onPress={() => handleSelectLevel(idx)}
                    style={styles.circleTouchArea}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`Body feel level ${level.label}`}>
                    <View style={styles.circleWrapper}>
                      {/* Translucent glow halo for selected state */}
                      {isSelected && (
                        <View
                          style={[
                            styles.selectedRing,
                            { backgroundColor: level.glowColor },
                          ]}
                        />
                      )}
                      {/* Main color circle (.ci-dot) */}
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

            {/* ── Labels Row (.ci-labels) ──────────────────────────────── */}
            <View style={styles.labelsRow}>
              <Text style={styles.endpointLabel}>{bodyLevels[0].label}</Text>

              {/* Center selected pill (.ci-pill) */}
              <View style={styles.selectedPill}>
                <View
                  style={[
                    styles.pillDot,
                    { backgroundColor: selectedLevel.color },
                  ]}
                />
                <Text style={styles.pillText}>{selectedLevel.label}</Text>
              </View>

              <Text style={styles.endpointLabel}>{bodyLevels[4].label}</Text>
            </View>
          </View>

          {/* ── Crash Link (.ci-crash: 14px, 600, terracotta) ───────────── */}
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
            style={({ pressed }) => [styles.nextButtonWrapper, pressed && styles.buttonPressed]}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next">
            <LinearGradient
              colors={[CORAL.light, CORAL.mid, CORAL.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nextButtonGradient}>
              <Text style={styles.nextButtonText}>{isEditing ? 'Save' : 'Next'}</Text>
              <View style={styles.nextArrowContainer}>
                <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 5l7 7-7 7"
                    stroke="#fff8f4"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </LinearGradient>
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
    paddingTop: 12,
  },

  pressed: {
    opacity: 0.7,
  },

  // ── Top Nav (.ci-head) ───────────────────────────────────────────────────

  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 52,
    marginBottom: 10,
  },

  navButton: {
    height: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
    color: 'rgba(74, 58, 57, 0.6)',
  },

  skipText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: 'rgba(74, 58, 57, 0.5)',
  },

  // ── Progress Bar (.ci-dots) ──────────────────────────────────────────────

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  progressActive: {
    width: 22,
    height: 7,
    borderRadius: 4,
  },

  progressDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(74, 58, 57, 0.18)',
  },

  // ── Fixed Viewport Content ───────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  // ── Question Label (.ci-eyebrow) ─────────────────────────────────────────

  questionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 9,
  },

  // ── Question Heading (.ob-h: Comfortaa 400, 31px, line-height 36px, letter-spacing -0.3) ──

  questionHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 12,
  },

  headingDark: {
    color: INK.display,
  },

  headingAccent: {
    color: CORAL.terracottaDeep,
  },

  // ── Supporting Text (.ob-sub: 14.5px, line-height 22px, color rgba(74,58,57,0.66)) ──

  supportingText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '400',
    color: 'rgba(74, 58, 57, 0.66)',
    marginBottom: 36,
    maxWidth: '90%',
  },

  // ── Body Feel Selector (.ci-scalewrap) ───────────────────────────────────

  selectorContainer: {
    marginBottom: 24,
  },

  circlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: 22,
  },

  circleTouchArea: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleWrapper: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.45,
    shadowRadius: 2,
  },

  // ── Labels Row (.ci-labels) ──────────────────────────────────────────────

  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },

  endpointLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(74, 58, 57, 0.55)',
    width: 65,
    textAlign: 'center',
  },

  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: 'rgba(244, 164, 126, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 15,
  },

  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f3c3a',
  },

  // ── Crash Link (.ci-crash: 14px, 600, color rgba(176,83,52,0.85)) ────────

  crashContainer: {
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 8,
  },

  crashText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(176, 83, 52, 0.85)',
    letterSpacing: 0.15,
    textDecorationLine: 'underline',
  },

  crashTextActive: {
    color: '#b05334',
  },

  // ── Bottom Section (.ob-cta gradient) ────────────────────────────────────

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 14,
  },

  nextButtonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  nextButtonGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  nextButtonText: {
    color: '#fff8f4',
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    textAlign: 'center',
  },

  nextArrowContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomHelperText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    color: 'rgba(74, 58, 57, 0.5)',
    textAlign: 'center',
  },
});
