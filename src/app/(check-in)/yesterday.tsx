import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useCheckInPalette } from '@/constants/checkInPalette';
import { SymbolView } from '@/components/ui/symbol';
import { useCheckIn } from '@/contexts/CheckInContext';
import { useThemeMode } from '@/contexts/ThemeContext';
import type { YesterdayOption } from '@/types/checkin';

// .ci-ypill tone per option
const YP_TONE: Record<string, "sage" | "oat" | "coral"> = {
  lighter: "sage",
  usual: "oat",
  heavier: "coral",
};

export default function YesterdayScreen() {
  const router = useRouter();
  const { isDark, isTrueBlack } = useThemeMode();
  const ci = useCheckInPalette();
  const {
    currentEntry: activeEntry,
    updateEntry,
    isEditing: contextIsEditing,
    cancelEdit,
    commitEdit,
  } = useCheckIn();
  const params = useLocalSearchParams<{
    isEditing?: string;
  }>();

  const isEditing = params.isEditing === 'true' || contextIsEditing;

  const initialId =
    activeEntry.yesterdayId ??
    (activeEntry.yesterdayIndex === 3
      ? 'lighter'
      : activeEntry.yesterdayIndex === 2
      ? 'usual'
      : activeEntry.yesterdayIndex === 1
      ? 'heavier'
      : null);
  const [selectedId, setSelectedId] = useState<string | null>(initialId);

  const options: YesterdayOption[] = [
    {
      id: 'lighter',
      value: 'Better than usual',
      prefix: 'Better than ',
      emphasis: 'usual',
      dotColor: isDark && isTrueBlack ? '#6E9678' : '#86C4B4',
      cardBg: isDark
        ? isTrueBlack
          ? 'rgba(110, 150, 120, 0.14)'
          : 'rgba(134, 196, 180, 0.14)'
        : 'rgba(224, 240, 235, 0.85)',
      cardBorder: isDark
        ? isTrueBlack
          ? 'rgba(255, 255, 255, 0.07)'
          : 'rgba(134, 196, 180, 0.42)'
        : 'rgba(134, 196, 180, 0.4)',
    },
    {
      id: 'usual',
      value: 'A normal day',
      prefix: 'A ',
      emphasis: 'normal day',
      dotColor: isDark ? (isTrueBlack ? '#C29A5F' : '#cdb488') : '#B88A58',
      cardBg: isDark
        ? isTrueBlack
          ? 'rgba(194, 154, 95, 0.14)'
          : 'rgba(232, 168, 124, 0.18)'
        : 'rgba(252, 246, 236, 0.88)',
      cardBorder: isDark
        ? isTrueBlack
          ? 'rgba(255, 255, 255, 0.07)'
          : 'rgba(232, 168, 124, 0.4)'
        : 'rgba(215, 186, 150, 0.4)',
    },
    {
      id: 'heavier',
      value: 'Worse than usual',
      prefix: 'Worse than ',
      emphasis: 'usual',
      dotColor: isDark && isTrueBlack ? '#BE6A5C' : '#E27A6C',
      cardBg: isDark
        ? isTrueBlack
          ? 'rgba(190, 106, 92, 0.14)'
          : 'rgba(226, 122, 108, 0.13)'
        : 'rgba(255, 238, 232, 0.88)',
      cardBorder: isDark
        ? isTrueBlack
          ? 'rgba(255, 255, 255, 0.07)'
          : 'rgba(226, 122, 108, 0.42)'
        : 'rgba(226, 122, 108, 0.4)',
    },
  ];

  const handleSelectOption = (option: YesterdayOption) => {
    setSelectedId(option.id);
    const yesterdayIdx = option.id === 'lighter' ? 3 : option.id === 'usual' ? 2 : 1;

    updateEntry({
      yesterdayId: option.id as 'lighter' | 'usual' | 'heavier',
      yesterdayLabel: option.value,
      yesterdayIndex: yesterdayIdx,
    });

    if (isEditing) {
      // This screen has no Save button — choosing an answer is the commit.
      commitEdit();
      router.push('/(check-in)/saved');
      return;
    }

    // Recurring daily flow: proceed to Question 1 of 3 (energy)
    router.push('/(check-in)/energy');
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
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    if (isEditing) {
      cancelEdit();
      router.push('/(check-in)/saved');
      return;
    }
    // Recurring daily flow: skip directly to energy screen
    router.push('/(check-in)/energy');
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Atmosphere Background */}
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

          {/* 3 Inactive Progress Dots (.ci-dots) */}
          <View style={styles.progressRow}>
            <View style={[styles.progressDot, { backgroundColor: ci.dotOff }]} />
            <View style={[styles.progressDot, { backgroundColor: ci.dotOff }]} />
            <View style={[styles.progressDot, { backgroundColor: ci.dotOff }]} />
          </View>

          {/* Skip Link (.ci-skip) */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Skip"
          >
            <Text style={[styles.skipText, { color: ci.skip }]}>
              Skip
            </Text>
          </Pressable>
        </View>

        {/* ── Viewport Content ─────────────────────────────────────────── */}
        <View style={styles.contentArea}>
          {/* ── Question Heading (.ob-h) ───────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={{ color: ci.heading }}>{'How was\n'}</Text>
            <Text style={{ color: ci.accent }}>yesterday?</Text>
          </Text>

          {/* ── Supporting Subtitle (.ob-sub) ──────────────────────────── */}
          <Text style={[styles.supportingText, { color: ci.sub }]}>
            {'This helps heedly learn how accurate its predictions are for you.'}
          </Text>

          {/* ── 3 Option Cards (.ci-yp) ────────────────────────────────── */}
          <View style={styles.optionsList}>
            {options.map((option) => {
              const isSelected = selectedId === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleSelectOption(option)}
                  style={({ pressed }) => [
                    styles.optionCard,
                    {
                      backgroundColor: ci.ypTones[YP_TONE[option.id] ?? "oat"][0],
                      borderColor: ci.ypTones[YP_TONE[option.id] ?? "oat"][1],
                    },
                    isSelected && [styles.optionCardSelected, { borderColor: ci.ypRing }],
                    isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
                    pressed && styles.cardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={option.value}
                >
                  <View style={[styles.dot, { backgroundColor: ci.ypTones[YP_TONE[option.id] ?? "oat"][2] }]} />
                  <Text style={[styles.cardText, { color: ci.ypText }]}>
                    <Text style={styles.cardTextRegular}>{option.prefix}</Text>
                    <Text style={styles.cardTextBold}>{option.emphasis}</Text>
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Secondary Skip Link (.ci-yp-skip) ──────────────────────── */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [styles.secondarySkipBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Skip, not sure yet"
          >
            <Text
              style={[
                styles.secondarySkipText,
                { color: ci.ypSkip, borderColor: ci.ypSkipLine },
              ]}
            >
              Skip — not sure yet.
            </Text>
          </Pressable>

          {/* ── Footnote (.ob-foot): directly under the skip link ─────── */}
          <Text style={[styles.bottomHelperText, { color: ci.foot }]}>
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

  cardPressed: {
    transform: [{ scale: 0.985 }],
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

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  progressDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  skipText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },

  contentArea: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
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

  optionsList: {
    width: '100%',
    gap: 12,
    marginTop: 30,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4.5,
    elevation: 2,
  },

  // .ci-ypill.sel: 2px ring
  optionCardSelected: {
    borderWidth: 2,
    paddingVertical: 17,
    paddingHorizontal: 19,
  },

  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },

  cardText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '600',
  },

  cardTextRegular: {
    fontWeight: '600',
  },

  cardTextBold: {
    fontWeight: '600',
  },

  secondarySkipBtn: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginTop: 22,
  },

  secondarySkipText: {
    fontSize: 14,
    fontWeight: '500',
    borderBottomWidth: 1,
    paddingBottom: 1,
    textAlign: 'center',
  },


  bottomHelperText: {
    alignSelf: 'center',
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: '400',
    marginTop: 14,
    textAlign: 'center',
  },
});
