import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Spacing } from '@/constants/theme';
import { useCheckInConfig } from '@/hooks/data';
import type { YesterdayOption } from '@/types/checkin';

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
    paddingHorizontal: 16,
    height: 52,
  },

  navButton: {
    height: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  backChevron: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.bodyText,
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
    borderRadius: 4,
    backgroundColor: COLORS.progressInactive,
  },

  skipText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.mutedText,
  },

  // ── Content Area ─────────────────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    alignItems: 'flex-start',
  },

  questionHeading: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 38,
    lineHeight: 46,
    marginBottom: Spacing.two,
    textAlign: 'left',
  },

  headingDark: {
    color: COLORS.headingDark,
  },

  headingAccent: {
    color: COLORS.accent,
  },

  supportingText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16.5,
    lineHeight: 23,
    color: '#463332',
    marginBottom: Spacing.five,
    maxWidth: '92%',
    textAlign: 'left',
  },

  // ── Option Cards ─────────────────────────────────────────────────────────

  optionsList: {
    width: '100%',
    gap: 12,
    marginBottom: 28,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    height: 62,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    shadowColor: '#8C6A6A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  cardText: {
    fontSize: 16.5,
    color: COLORS.headingDark,
  },

  cardTextRegular: {
    fontFamily: 'AvenirNext-Regular',
  },

  cardTextBold: {
    fontFamily: 'AvenirNext-DemiBold',
  },

  // ── Secondary Skip Link ──────────────────────────────────────────────────

  secondarySkipBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  secondarySkipText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14.5,
    color: COLORS.accent,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  // ── Bottom Footnote ──────────────────────────────────────────────────────

  bottomSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 24,
    alignItems: 'center',
  },

  bottomHelperText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13.5,
    color: '#6B4C3E',
    textAlign: 'center',
  },
});
