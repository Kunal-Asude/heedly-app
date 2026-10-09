import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground, GlowDot } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useCheckIn } from '@/contexts/CheckInContext';
import { useCheckInConfig } from '@/hooks/data';
import { SymbolView } from '@/components/ui/symbol';
import { useCheckInPalette } from '@/constants/checkInPalette';

// ─── Component ────────────────────────────────────────────────────────────────

export default function BodyScreen() {
  const router = useRouter();
  const ci = useCheckInPalette();
  const { bodyLevels } = useCheckInConfig();
  const {
    currentEntry: activeEntry,
    updateEntry,
    isEditing: contextIsEditing,
    cancelEdit,
    commitEdit,
  } = useCheckIn();
  const params = useLocalSearchParams<{
    isFirstTime?: string;
    isEditing?: string;
  }>();

  const initialIndex =
    activeEntry.bodyIndex !== undefined && activeEntry.bodyIndex !== null
      ? Math.min(Math.max(0, activeEntry.bodyIndex), bodyLevels.length - 1)
      : 2;
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);

  const selectedLevel = bodyLevels[selectedIndex];
  const isEditing = params.isEditing === 'true' || contextIsEditing;

  const handleSelectLevel = (index: number) => {
    setSelectedIndex(index);
    updateEntry({
      bodyIndex: index,
      bodyLabel: bodyLevels[index].label,
    });
  };

  const handleCrashPress = () => {
    // Deliberately does not write bodyIndex/bodyLabel — see energy.tsx for the
    // full reasoning. selectedIndex is display state with a fallback of 2, and
    // storing it recorded an answer nobody gave.
    updateEntry({
      isCrash: true,
    });
    // Flagging a crash is a deliberate answer and always has been recorded
    // immediately, so it commits rather than sitting in the draft. Behaviour
    // preserved, not redesigned — the semantics are noted as ambiguous.
    if (isEditing) {
      commitEdit();
    }
    router.push('/(check-in)/saved');
  };

  const handleBack = () => {
    if (isEditing) {
      cancelEdit();
      router.push('/(check-in)/saved');
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
      cancelEdit();
      router.push('/(check-in)/saved');
      return;
    }
    router.push('/(check-in)/noting');
  };

  const handleNext = () => {
    // Records the highlighted option even when untouched — see energy.tsx.
    updateEntry({
      bodyIndex: selectedIndex,
      bodyLabel: selectedLevel.label,
    });

    if (isEditing) {
      commitEdit();
      router.push('/(check-in)/saved');
      return;
    }

    router.push('/(check-in)/noting');
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
            <SymbolView name="chevron.left" size={21} tintColor={ci.back} />
          </Pressable>

          {/* Progress Dots: Question 2 of 3 (.ci-dots) */}
          <View style={styles.progressRow}>
            <View
              style={[
                styles.progressDot,
                { backgroundColor: ci.dotOff },
              ]}
            />
            <LinearGradient
              colors={ci.dotOn}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.progressActive}
            />
            <View
              style={[
                styles.progressDot,
                { backgroundColor: ci.dotOff },
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
                { color: ci.skip },
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
              { color: ci.skip },
            ]}
          >
            QUESTION 2 OF 3
          </Text>

          {/* ── Question Heading (.ob-h) ───────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={{ color: ci.heading }}>{'How does your\n'}</Text>
            <Text style={{ color: ci.accent }}>body feel?</Text>
          </Text>

          {/* ── Supporting Subtitle (.ob-sub) ──────────────────────────── */}
          <Text
            style={[
              styles.supportingText,
              { color: ci.sub },
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
                            { backgroundColor: ci.scaleGlow[idx] },
                          ]}
                        />
                      )}
                      {/* Main dot circle (.ci-dot) */}
                      <View
                        style={[
                          styles.circle,
                          { backgroundColor: ci.scale[idx] },
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
                  { color: ci.lab },
                ]}
              >
                {bodyLevels[0].label}
              </Text>

              {/* Center selected pill (.ci-pill) */}
              <View
                style={[
                  styles.selectedPill,
                  { backgroundColor: ci.pillBg, borderColor: ci.pillBorder },
                ]}
              >
                <GlowDot color={ci.pillDot} />
                <Text
                  style={[
                    styles.pillText,
                    { color: ci.pillText },
                  ]}
                >
                  {selectedLevel.label}
                </Text>
              </View>

              <Text
                style={[
                  styles.endpointLabel,
                  { color: ci.lab },
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
                { color: ci.crash, borderColor: ci.crashLine },
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
              { shadowOpacity: ci.ctaShadowOpacity },
              ci.ctaShadowOpacity === 0 && { elevation: 0 },
            ]}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel="Next"
          >
            <LinearGradient
              colors={ci.cta}
              start={{ x: 0, y: ci.ctaHorizontal ? 0.5 : 0 }}
              end={{ x: 1, y: ci.ctaHorizontal ? 0.5 : 1 }}
              style={styles.nextButtonGradient}
            >
              <Text style={[styles.nextButtonText, { color: ci.ctaText }]}>{isEditing ? 'Save' : 'Next'}</Text>
              <View style={styles.nextArrowContainer}>
                <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 5l7 7-7 7"
                    stroke={ci.ctaText}
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
              { color: ci.foot },
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
    height: 30,
    marginBottom: 26,
  },

  navButton: {
    height: 30,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    width: 21,
    height: 21,
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
    alignItems: 'flex-start',
  },

  questionLabel: {
    fontSize: 11,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 9,
  },

  questionHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.31,
    textAlign: 'left',
  },

  supportingText: {
    fontSize: 14.5,
    lineHeight: 21.75,
    fontWeight: '500',
    marginTop: 12,
    maxWidth: 300,
    textAlign: 'left',
  },

  selectorContainer: {
    width: '100%',
    marginTop: 44,
  },

  circlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    height: 44,
  },

  circleTouchArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },

  selectedRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
    width: '100%',
  },

  endpointLabel: {
    fontSize: 13,
    fontWeight: '500',
    minWidth: 50,
  },

  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
  },

  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },

  crashContainer: {
    alignSelf: 'center',
    marginTop: 30,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },

  crashText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.14,
    borderBottomWidth: 1,
    paddingBottom: 1,
    textAlign: 'center',
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 6,
    alignItems: 'center',
    gap: 14,
  },

  nextButtonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 5,
  },

  nextButtonGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  nextButtonText: {
    fontSize: 16.5,
    fontWeight: '600',
  },

  nextArrowContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },

  bottomHelperText: {
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: '400',
    textAlign: 'center',
  },
});
