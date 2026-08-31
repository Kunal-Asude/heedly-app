import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/constants/themes';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useCheckInConfig } from '@/hooks/data';

// ─── Component ────────────────────────────────────────────────────────────────

export default function BodyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isDark, isTrueBlack } = useThemeMode();
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

  const isFirstTime = params.isFirstTime === 'true';
  const initialIndex =
    params.bodyIndex !== undefined && !isNaN(Number(params.bodyIndex))
      ? Math.min(Math.max(0, Number(params.bodyIndex)), bodyLevels.length - 1)
      : 2;
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);

  const selectedLevel = bodyLevels[selectedIndex];
  const isEditing = params.isEditing === 'true';

  const handleSelectLevel = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCrashPress = () => {
    router.push({
      pathname: '/(check-in)/saved',
      params: {
        ...params,
        bodyIndex: selectedIndex.toString(),
        bodyLabel: selectedLevel.label,
        isCrash: 'true',
        isFirstTime: isFirstTime ? 'true' : 'false',
      },
    });
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
      router.push('/(check-in)/energy');
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
        ...params,
        isFirstTime: isFirstTime ? 'true' : 'false',
      },
    });
  };

  const handleNext = () => {
    if (isEditing) {
      router.push({
        pathname: '/(check-in)/saved',
        params: {
          ...params,
          bodyIndex: selectedIndex.toString(),
          bodyLabel: selectedLevel.label,
        },
      });
      return;
    }
    router.push({
      pathname: '/(check-in)/noting',
      params: {
        ...params,
        bodyIndex: selectedIndex.toString(),
        bodyLabel: selectedLevel.label,
        isFirstTime: isFirstTime ? 'true' : 'false',
      },
    });
  };


  return (
    <View style={styles.root}>
      {/* Exact Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Top Navigation Bar (.ci-head) ────────────────────────────── */}
        <View style={styles.topNav}>
          {/* Back Chevron (.ci-back) */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text
              style={[
                styles.backChevron,
                { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.81)') : 'rgba(74, 58, 57, 0.6)' },
              ]}
            >
              ‹
            </Text>
          </Pressable>

          {/* Progress Dots: Question 2 of 3 (.ci-dots) */}
          <View style={styles.progressRow}>
            <View
              style={[
                styles.progressDot,
                { backgroundColor: isDark ? (isTrueBlack ? "rgba(255, 255, 255, 0.18)" : 'rgba(199, 180, 191, 0.24)') : 'rgba(74, 58, 57, 0.18)' },
              ]}
            />
            <LinearGradient
              colors={
                isDark
                  ? isTrueBlack
                    ? ['#C97B60', '#BE6A5C']
                    : ['#E8907A', '#C86858']
                  : [theme.coral.mid, theme.coral.terracotta]
              }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.progressActive}
            />
            <View
              style={[
                styles.progressDot,
                { backgroundColor: isDark ? (isTrueBlack ? "rgba(255, 255, 255, 0.18)" : 'rgba(199, 180, 191, 0.24)') : 'rgba(74, 58, 57, 0.18)' },
              ]}
            />
          </View>

          {/* Skip Link (.ci-skip) */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Skip"
          >
            <Text
              style={[
                styles.skipText,
                { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.68)') : 'rgba(74, 58, 57, 0.5)' },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>

        {/* ── Fixed Viewport Content ───────────────────────────────────── */}
        <View style={styles.contentArea}>
          {/* ── Question Eyebrow (.ci-eyebrow) ─────────────────────────── */}
          <Text
            style={[
              styles.questionLabel,
              { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.68)') : 'rgba(74, 58, 57, 0.5)' },
            ]}
          >
            QUESTION 2 OF 3
          </Text>

          {/* ── Question Heading (.ob-h) ───────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={{ color: isDark ? (isTrueBlack ? "#E9DDD6" : '#F3E7E1') : theme.ink.display }}>{'How does your\n'}</Text>
            <Text style={{ color: isDark ? (isTrueBlack ? "#C97B60" : '#E8907A') : theme.coral.terracottaDeep }}>body feel?</Text>
          </Text>

          {/* ── Supporting Subtitle (.ob-sub) ──────────────────────────── */}
          <Text
            style={[
              styles.supportingText,
              { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.95)') : 'rgba(74, 58, 57, 0.72)' },
            ]}
          >
            No need to think hard — go with your gut.
          </Text>

          {/* ── 5-Level Scale Selector (.ci-scalewrap) ──────────────────── */}
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
                    accessibilityLabel={`Body feel ${level.label}`}
                  >
                    <View style={styles.circleWrapper}>
                      {/* Outer glow ring when selected (.ci-dot.sel) */}
                      {isSelected && (
                        <View
                          style={[
                            styles.selectedRing,
                            { backgroundColor: isDark && isTrueBlack ? 'rgba(255, 255, 255, 0.12)' : level.glowColor },
                          ]}
                        />
                      )}
                      {/* Main dot circle (.ci-dot) */}
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
              <Text
                style={[
                  styles.endpointLabel,
                  { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.74)') : 'rgba(74, 58, 57, 0.55)' },
                ]}
              >
                {bodyLevels[0].label}
              </Text>

              {/* Center selected pill (.ci-pill) */}
              <View
                style={[
                  styles.selectedPill,
                  {
                    backgroundColor: isDark
                      ? isTrueBlack
                        ? 'rgba(190, 106, 92, 0.14)'
                        : 'rgba(226, 122, 108, 0.16)'
                      : 'rgba(244, 164, 126, 0.18)',
                    borderColor: isDark
                      ? isTrueBlack
                        ? 'rgba(255, 255, 255, 0.07)'
                        : 'rgba(255, 255, 255, 0.09)'
                      : 'rgba(224, 115, 95, 0.28)',
                  },
                ]}
              >
                <View
                  style={[
                    styles.pillDot,
                    { backgroundColor: isDark && isTrueBlack ? '#C29A5F' : (isDark ? '#D9735A' : selectedLevel.color) },
                  ]}
                />
                <Text
                  style={[
                    styles.pillText,
                    { color: isDark ? (isTrueBlack ? '#E9DDD6' : '#F3E7E1') : '#4f3c3a' },
                  ]}
                >
                  {selectedLevel.label}
                </Text>
              </View>

              <Text
                style={[
                  styles.endpointLabel,
                  { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.74)') : 'rgba(74, 58, 57, 0.55)' },
                ]}
              >
                {bodyLevels[4].label}
              </Text>
            </View>
          </View>

          {/* ── Crash Link (.ci-crash) ─────────────────────────────────── */}
          <Pressable
            onPress={handleCrashPress}
            style={({ pressed }) => [styles.crashContainer, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="I'm in a crash"
          >
            <Text
              style={[
                styles.crashText,
                {
                  color: isDark ? (isTrueBlack ? '#C97B60' : 'rgba(232, 144, 122, 0.98)') : 'rgba(176, 83, 52, 0.98)',
                  borderColor: isDark ? (isTrueBlack ? 'rgba(255, 255, 255, 0.07)' : 'rgba(232, 144, 122, 0.46)') : 'rgba(176, 83, 52, 0.4)',
                },
              ]}
            >
              {"I'm in a crash"}
            </Text>
          </Pressable>
        </View>

        {/* ── Bottom Section: Next CTA & Helper Footnote ──────────────── */}
        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [
              styles.nextButtonWrapper,
              pressed && styles.buttonPressed,
              isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
            ]}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next"
          >
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
                styles.nextButtonGradient,
                isDark && isTrueBlack && {
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.nextButtonText, isDark && isTrueBlack && { color: '#EADCD4' }]}>{isEditing ? 'Save' : 'Next'}</Text>
              <View style={styles.nextArrowContainer}>
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

          <Text
            style={[
              styles.bottomHelperText,
              { color: isDark ? 'rgba(199, 180, 191, 0.65)' : 'rgba(74, 58, 57, 0.5)' },
            ]}
          >
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
    paddingTop: 8,
  },

  pressed: {
    opacity: 0.75,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 48,
    marginBottom: 12,
  },

  navButton: {
    height: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '300',
  },

  skipText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },

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
  },

  contentArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: 'flex-start',
  },

  questionLabel: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 10,
  },

  questionHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 10,
    textAlign: 'left',
  },

  supportingText: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '400',
    marginBottom: 36,
    maxWidth: '96%',
    textAlign: 'left',
  },

  selectorContainer: {
    width: '100%',
    marginBottom: 28,
  },

  circlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height: 48,
  },

  circleTouchArea: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleWrapper: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  selectedRing: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
  },

  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    width: '100%',
  },

  endpointLabel: {
    fontSize: 13.5,
    fontWeight: '500',
    minWidth: 50,
  },

  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 6.5,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
  },

  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  pillText: {
    fontSize: 14.5,
    fontWeight: '600',
  },

  crashContainer: {
    alignSelf: 'center',
    marginTop: 18,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },

  crashText: {
    fontSize: 14.5,
    fontWeight: '600',
    borderBottomWidth: 1.2,
    paddingBottom: 2,
    textAlign: 'center',
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
    gap: 14,
  },

  nextButtonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
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
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  nextButtonText: {
    color: '#FFF6F1',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.15,
  },

  nextArrowContainer: {
    position: 'absolute',
    right: 22,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  bottomHelperText: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
});
