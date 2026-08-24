import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useCheckInConfig } from '@/hooks/data';
import type { YesterdayOption } from '@/types/checkin';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#463332',
  accent: '#b0532f',
  bodyText: '#463332',
  mutedText: 'rgba(74, 58, 57, 0.5)',
  skipLink: '#b05334',
  progressInactive: 'rgba(74, 58, 57, 0.18)',
};

export default function YesterdayScreen() {
  const router = useRouter();
  const { yesterdayOptions } = useCheckInConfig();
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
  const hasEnergy = !!params.energyIndex;
  const initialId = params.yesterdayIndex === '3' || params.yesterdayLabel === 'Lighter than usual'
    ? 'lighter'
    : params.yesterdayIndex === '2' || params.yesterdayLabel === 'About the same'
    ? 'same'
    : params.yesterdayIndex === '1' || params.yesterdayLabel === 'Heavier than usual'
    ? 'heavier'
    : null;
  const [selectedId, setSelectedId] = useState<string | null>(initialId);

  const isEditing = params.isEditing === 'true';

  const handleSelectOption = (option: YesterdayOption) => {
    setSelectedId(option.id);
    const yesterdayIdx = option.id === 'lighter' ? '3' : option.id === 'same' ? '2' : '1';

    if (isEditing) {
      router.push({
        pathname: '/(check-in)/saved',
        params: {
          ...params,
          yesterdayIndex: yesterdayIdx,
          yesterdayLabel: option.value,
        },
      });
      return;
    }

    if (hasEnergy) {
      // First-time flow: already answered Q1 (feeling), now proceed to Q2 (body)
      router.push({
        pathname: '/(check-in)/body',
        params: {
          energyIndex: params.energyIndex,
          energyLabel: params.energyLabel,
          yesterdayIndex: yesterdayIdx,
          yesterdayLabel: option.value,
          bodyIndex: params.bodyIndex,
          bodyLabel: params.bodyLabel,
          tags: params.tags,
          periodInfo: params.periodInfo,
          isFirstTime: params.isFirstTime,
        },
      });
    } else {
      // Recurring daily flow: yesterday was question 1, now proceed to energy question
      router.push({
        pathname: '/(check-in)/energy',
        params: {
          yesterdayIndex: yesterdayIdx,
          yesterdayLabel: option.value,
          energyIndex: params.energyIndex,
          energyLabel: params.energyLabel,
          bodyIndex: params.bodyIndex,
          bodyLabel: params.bodyLabel,
          tags: params.tags,
          periodInfo: params.periodInfo,
          isFirstTime: params.isFirstTime,
        },
      });
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
    if (hasEnergy) {
      // First-time flow: proceed to body
      router.push({
        pathname: '/(check-in)/body',
        params: {
          energyIndex: params.energyIndex,
          energyLabel: params.energyLabel,
          yesterdayIndex: params.yesterdayIndex,
          yesterdayLabel: params.yesterdayLabel,
          bodyIndex: params.bodyIndex,
          bodyLabel: params.bodyLabel,
          tags: params.tags,
          periodInfo: params.periodInfo,
          isFirstTime: params.isFirstTime,
        },
      });
    } else {
      // Recurring daily flow: proceed to energy
      router.push({
        pathname: '/(check-in)/energy',
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
    }
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Top Navigation Bar ───────────────────────────────────────── */}
        <View style={styles.topNav}>
          {/* Back Chevron */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back">
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>

          {/* 3 Progress Dots */}
          <View style={styles.progressRow}>
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>

          {/* Skip Link */}
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
          {/* ── Question Heading ───────────────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={styles.headingDark}>{'How did\n'}</Text>
            <Text style={styles.headingAccent}>yesterday land?</Text>
          </Text>

          {/* ── Supporting Subtitle ────────────────────────────────────── */}
          <Text style={styles.supportingText}>
            {'Just a quick look back — it helps the patterns make sense.'}
          </Text>

          {/* ── 3 Option Cards ─────────────────────────────────────────── */}
          <View style={styles.optionsList}>
            {yesterdayOptions.map((option) => {
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
                    (pressed || isSelected) && styles.cardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={option.value}>
                  <View style={[styles.dot, { backgroundColor: option.dotColor }]} />
                  <Text style={styles.cardText}>
                    <Text style={styles.cardTextRegular}>{option.prefix}</Text>
                    <Text style={styles.cardTextBold}>{option.emphasis}</Text>
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Secondary Skip Link ────────────────────────────────────── */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [styles.secondarySkipBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Skip, not sure yet">
            <Text style={styles.secondarySkipText}>Skip — not sure yet.</Text>
          </Pressable>
        </View>

        {/* ── Bottom Section: Footnote ─────────────────────────────────── */}
        <View style={styles.bottomSection}>
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

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  // ── Top Navigation Bar ───────────────────────────────────────────────────

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
    backgroundColor: COLORS.progressInactive,
  },

  skipText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.mutedText,
  },

  // ── Content Area ─────────────────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'flex-start',
  },

  questionHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 12,
    textAlign: 'left',
  },

  headingDark: {
    color: COLORS.headingDark,
  },

  headingAccent: {
    color: COLORS.accent,
  },

  supportingText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '400',
    color: 'rgba(74, 58, 57, 0.66)',
    marginBottom: 24,
    maxWidth: '92%',
    textAlign: 'left',
  },

  // ── Option Cards ─────────────────────────────────────────────────────────

  optionsList: {
    width: '100%',
    gap: 12,
    marginBottom: 22,
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
    color: '#4f3c3a',
    lineHeight: 20,
  },

  cardTextRegular: {
    fontWeight: '600',
  },

  cardTextBold: {
    fontWeight: '600',
  },

  // ── Secondary Skip Link ──────────────────────────────────────────────────

  secondarySkipBtn: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    marginTop: 10,
  },

  secondarySkipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.skipLink,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  // ── Bottom Footnote ──────────────────────────────────────────────────────

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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
