import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useCheckIn } from '@/contexts/CheckInContext';
import { useTheme } from '@/constants/themes';
import { useThemeMode } from '@/contexts/ThemeContext';
import type { YesterdayOption } from '@/types/checkin';

export default function YesterdayScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const { activeEntry, updateEntry, isEditing: contextIsEditing } = useCheckIn();
  const params = useLocalSearchParams<{
    isEditing?: string;
  }>();

  const isEditing = params.isEditing === 'true' || contextIsEditing;

  const initialId =
    activeEntry.yesterdayId ??
    (activeEntry.yesterdayIndex === 3
      ? 'lighter'
      : activeEntry.yesterdayIndex === 2
      ? 'same'
      : activeEntry.yesterdayIndex === 1
      ? 'heavier'
      : null);
  const [selectedId, setSelectedId] = useState<string | null>(initialId);

  const options: YesterdayOption[] = [
    {
      id: 'lighter',
      value: 'Lighter than usual',
      prefix: 'Lighter than ',
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
      id: 'same',
      value: 'About the same',
      prefix: 'About ',
      emphasis: 'the same',
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
      value: 'Heavier than usual',
      prefix: 'Heavier than ',
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
    const yesterdayIdx = option.id === 'lighter' ? 3 : option.id === 'same' ? 2 : 1;

    updateEntry({
      yesterdayId: option.id as 'lighter' | 'same' | 'heavier',
      yesterdayLabel: option.value,
      yesterdayIndex: yesterdayIdx,
    });

    if (isEditing) {
      router.push('/(check-in)/saved');
      return;
    }

    // Recurring daily flow: proceed to Question 1 of 3 (energy)
    router.push('/(check-in)/energy');
  };

  const handleBack = () => {
    if (isEditing) {
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
            <Text style={[styles.backChevron, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.81)') : 'rgba(74, 58, 57, 0.6)' }]}>
              ‹
            </Text>
          </Pressable>

          {/* 3 Inactive Progress Dots (.ci-dots) */}
          <View style={styles.progressRow}>
            <View style={[styles.progressDot, { backgroundColor: isDark ? (isTrueBlack ? "rgba(255, 255, 255, 0.18)" : 'rgba(199, 180, 191, 0.24)') : 'rgba(74, 58, 57, 0.18)' }]} />
            <View style={[styles.progressDot, { backgroundColor: isDark ? (isTrueBlack ? "rgba(255, 255, 255, 0.18)" : 'rgba(199, 180, 191, 0.24)') : 'rgba(74, 58, 57, 0.18)' }]} />
            <View style={[styles.progressDot, { backgroundColor: isDark ? (isTrueBlack ? "rgba(255, 255, 255, 0.18)" : 'rgba(199, 180, 191, 0.24)') : 'rgba(74, 58, 57, 0.18)' }]} />
          </View>

          {/* Skip Link (.ci-skip) */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Skip"
          >
            <Text style={[styles.skipText, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.68)') : 'rgba(74, 58, 57, 0.5)' }]}>
              Skip
            </Text>
          </Pressable>
        </View>

        {/* ── Viewport Content ─────────────────────────────────────────── */}
        <View style={styles.contentArea}>
          {/* ── Question Heading (.ob-h) ───────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={{ color: isDark ? (isTrueBlack ? "#E9DDD6" : '#F3E7E1') : theme.ink.display }}>{'How did\n'}</Text>
            <Text style={{ color: isDark ? (isTrueBlack ? "#C97B60" : '#E8907A') : theme.coral.terracottaDeep }}>yesterday land?</Text>
          </Text>

          {/* ── Supporting Subtitle (.ob-sub) ──────────────────────────── */}
          <Text style={[styles.supportingText, { color: isDark ? (isTrueBlack ? "#9A8A91" : 'rgba(199, 180, 191, 0.95)') : 'rgba(74, 58, 57, 0.72)' }]}>
            {'Just a quick look back — it helps the patterns make sense.'}
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
                      backgroundColor: option.cardBg,
                      borderColor: option.cardBorder,
                    },
                    isSelected && {
                      borderColor: isDark ? (isTrueBlack ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.25)') : 'rgba(74, 58, 57, 0.35)',
                      shadowOpacity: isDark ? (isTrueBlack ? 0 : 0.35) : 0.15,
                    },
                    isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
                    (pressed || isSelected) && styles.cardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={option.value}
                >
                  <View style={[styles.dot, { backgroundColor: option.dotColor }]} />
                  <Text style={[styles.cardText, { color: isDark ? (isTrueBlack ? "#E9DDD6" : '#F3E7E1') : '#4f3c3a' }]}>
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
                {
                  color: isDark ? '#E8907A' : '#b05334',
                  borderColor: isDark ? 'rgba(232, 144, 122, 0.46)' : 'rgba(176, 83, 52, 0.4)',
                },
              ]}
            >
              Skip — not sure yet.
            </Text>
          </Pressable>
        </View>

        {/* ── Bottom Section: Footnote (.ob-foot) ──────────────────────── */}
        <View style={styles.bottomSection}>
          <Text style={[styles.bottomHelperText, { color: isDark ? 'rgba(199, 180, 191, 0.65)' : 'rgba(74, 58, 57, 0.5)' }]}>
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
    paddingTop: 8,
    alignItems: 'flex-start',
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
    marginBottom: 26,
    maxWidth: '96%',
    textAlign: 'left',
  },

  optionsList: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 9,
    elevation: 2,
  },

  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
  },

  cardText: {
    fontSize: 16,
    lineHeight: 21,
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
    marginTop: 8,
  },

  secondarySkipText: {
    fontSize: 14.5,
    fontWeight: '500',
    borderBottomWidth: 1.2,
    paddingBottom: 2,
    textAlign: 'center',
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },

  bottomHelperText: {
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
});
