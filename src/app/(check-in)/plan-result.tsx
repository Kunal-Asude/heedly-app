import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';
import { useCheckInConfig } from '@/hooks/data';

// ─── Forecast Card Component (.pl-card with subtle gradient / flat OLED) ─────

function ForecastCard({
  children,
  isDark,
  isTrueBlack = false,
}: {
  children: React.ReactNode;
  isDark: boolean;
  isTrueBlack?: boolean;
}) {
  if (isDark && isTrueBlack) {
    return (
      <View
        style={[
          styles.forecastCard,
          {
            backgroundColor: '#16111B',
            borderColor: 'rgba(255, 255, 255, 0.07)',
            shadowOpacity: 0,
            elevation: 0,
          },
        ]}>
        {children}
      </View>
    );
  }

  const cardGradientColors: [string, string, string] = isDark
    ? ['rgba(50, 35, 54, 0.88)', 'rgba(62, 43, 65, 0.85)', 'rgba(82, 54, 72, 0.82)']
    : ['rgba(252, 246, 240, 0.92)', 'rgba(255, 250, 245, 0.95)', 'rgba(255, 238, 230, 0.95)'];

  return (
    <LinearGradient
      colors={cardGradientColors}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 1, y: 0.7 }}
      style={[
        styles.forecastCard,
        {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.85)',
          shadowColor: isDark ? '#000000' : '#BE968C',
          shadowOpacity: isDark ? 0.24 : 0.08,
        },
      ]}>
      {children}
    </LinearGradient>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlanResultScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const { defaultPlanningPrediction } = useCheckInConfig();
  const params = useLocalSearchParams<{ dayName?: string; activityLabel?: string }>();


  const dayName = params.dayName || 'Saturday';
  const activityLabel = params.activityLabel || 'Social';

  const explanationText = defaultPlanningPrediction.explanationTemplate.replace(
    '{dayName}',
    dayName
  );
  const recommendationText = defaultPlanningPrediction.recommendation;

  const handleDone = () => {
    router.replace('/(tabs)');
  };

  // Theme-aware tokens
  const eyebrowColor = isDark ? 'rgba(199, 180, 191, 0.65)' : 'rgba(74, 58, 57, 0.55)';
  const mainHeadingColor = isDark ? '#F3E7E1' : theme.ink.display;
  const explanationColor = isDark ? '#F3E7E1' : 'rgba(74, 58, 57, 0.82)';
  const reminderLinkColor = isDark ? (isTrueBlack ? '#C97B60' : '#E8907A') : 'rgba(176, 83, 52, 0.85)';

  return (
    <View style={styles.root}>
      {/* Exact Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* ── Top Header (.sx-nav & .pl-*) ───────────────────────────────── */}
          <View style={styles.headerBlock}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Go back to Planning">
              <Text style={[styles.backChevron, { color: isDark ? theme.ink.muted : 'rgba(74, 58, 57, 0.62)' }]}>‹</Text>
            </Pressable>

            <Text style={[styles.sectionLabel, { color: eyebrowColor }]}>LOOKING AHEAD</Text>
            <Text style={[styles.mainHeading, { color: mainHeadingColor }]}>
              {dayName} · {activityLabel}
            </Text>
          </View>

          {/* ── Main Forecast Card (.pl-card) ─────────────────────────────── */}
          <ForecastCard isDark={isDark} isTrueBlack={isTrueBlack}>
            {/* Hero Orb (.pl-gauge: 140x140) */}
            <View style={styles.orbContainer}>
              <EnergyOrb state="caution" size={140} />
            </View>

            {/* Caution Badge (.pl-pill) */}
            <View
              style={[
                styles.badgeContainer,
                {
                  backgroundColor: isDark
                    ? isTrueBlack
                      ? 'rgba(194, 154, 95, 0.14)'
                      : 'rgba(92, 60, 52, 0.65)'
                    : 'rgba(217, 152, 67, 0.16)',
                  borderColor: isDark
                    ? isTrueBlack
                      ? 'rgba(255, 255, 255, 0.07)'
                      : 'rgba(236, 200, 128, 0.35)'
                    : 'rgba(217, 152, 67, 0.3)',
                },
              ]}>
              <View style={[styles.badgeDot, isDark && isTrueBlack && { backgroundColor: '#C29A5F' }]} />
              <Text
                style={[
                  styles.badgeText,
                  { color: isDark ? (isTrueBlack ? '#C29A5F' : '#F5DDC4') : '#9a6a2a' },
                ]}>
                Caution
              </Text>
            </View>

            {/* Main Explanation Copy (.pl-read) */}
            <Text style={[styles.explanationText, { color: explanationColor }]}>
              {explanationText}
            </Text>
          </ForecastCard>

          {/* ── Recommendation Box (.pl-tip) ─────────────────────────────── */}
          <View
            style={[
              styles.recommendationBox,
              {
                backgroundColor: isDark
                  ? isTrueBlack
                    ? '#16111B'
                    : 'rgba(32, 54, 46, 0.78)'
                  : 'rgba(126, 155, 106, 0.14)',
                borderColor: isDark
                  ? isTrueBlack
                    ? 'rgba(255, 255, 255, 0.07)'
                    : 'rgba(134, 196, 180, 0.35)'
                  : 'rgba(126, 155, 106, 0.3)',
              },
            ]}>
            <View style={styles.tipIconContainer}>
              <SymbolView
                name="waveform.path"
                size={18}
                tintColor={isDark ? (isTrueBlack ? '#9FB8A6' : '#86C4B4') : '#5d7a52'}
              />
            </View>
            <Text
              style={[
                styles.recommendationText,
                { color: isDark ? (isTrueBlack ? '#9FB8A6' : '#C8EADB') : '#4f5a45' },
              ]}>
              {recommendationText}
            </Text>
          </View>

          {/* ── Footer Estimate Notice (.pl-caveat) ───────────────────────── */}
          <Text
            style={[
              styles.estimateNotice,
              { color: isDark ? (isTrueBlack ? '#9A8A91' : 'rgba(199, 180, 191, 0.75)') : 'rgba(74, 58, 57, 0.7)' },
            ]}>
            Days further out are a rougher estimate.
          </Text>

          {/* Spacer pushing bottom CTA area */}
          <View style={styles.flexSpacer} />

          {/* ── Bottom Action Area (.pl-done & .pl-relink) ───────────────── */}
          <View style={styles.bottomArea}>
            <Pressable
              style={({ pressed }) => [
                styles.doneButtonWrapper,
                pressed && styles.buttonPressed,
                isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
              ]}
              onPress={handleDone}
              accessibilityRole="button"
              accessibilityLabel="Done">
              <LinearGradient
                colors={
                  isDark
                    ? isTrueBlack
                      ? ['#574049', '#241A20']
                      : ['#634256', '#8A5D7C', '#9E768E']
                    : ['#f0a07e', '#e88970', '#e0735f']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.doneButtonGradient,
                  isDark && isTrueBlack && {
                    borderColor: 'rgba(255, 255, 255, 0.06)',
                    borderWidth: 1,
                  },
                ]}>
                <Text style={[styles.doneButtonText, isDark && isTrueBlack && { color: '#EADCD4' }]}>Done</Text>
                <View style={styles.checkmarkIconContainer}>
                  <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17l-5-5"
                      stroke={isDark && isTrueBlack ? '#EADCD4' : '#FFF6F1'}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </LinearGradient>
            </Pressable>


            {/* Remind me link (.pl-relink) */}
            <Pressable
              style={({ pressed }) => [styles.reminderContainer, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Remind me to ease up before">
              <View
                style={[
                  styles.linkUnderlineWrapper,
                  { borderBottomColor: `${reminderLinkColor}90` },
                ]}>
                <Text style={[styles.reminderText, { color: reminderLinkColor }]}>
                  Remind me to ease up before
                </Text>
              </View>
            </Pressable>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 20,
  },

  pressed: {
    opacity: 0.75,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  flexSpacer: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────

  headerBlock: {
    marginBottom: 16,
  },

  backButton: {
    width: 36,
    height: 36,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
  },

  // .pl-eyebrow: 11px, 600, 0.2em, uppercase
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  // .pl-rtitle: Comfortaa 400, 32px, lineHeight 38px
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
  },

  // ── Main Forecast Card (.pl-card) ────────────────────────────────────────

  forecastCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 3,
  },

  orbContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // .pl-pill: padding 6px 14px, radius 14px
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ECC880',
  },

  badgeText: {
    fontSize: 13.5,
    fontWeight: '600',
  },

  // .pl-read: 15px, 1.55
  explanationText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'center',
  },

  // ── Recommendation Box (.pl-tip) ────────────────────────────────────────

  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
  },

  tipIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  recommendationText: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 21.5,
    fontWeight: '400',
  },

  // .pl-caveat: 14px
  estimateNotice: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },

  // ── Bottom Action Area ───────────────────────────────────────────────────

  bottomArea: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },

  doneButtonWrapper: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 8,
  },

  doneButtonGradient: {
    flex: 1,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },

  doneButtonText: {
    color: '#FFF6F1',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.15,
  },

  checkmarkIconContainer: {
    position: 'absolute',
    right: 22,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  reminderContainer: {
    alignSelf: 'center',
    paddingVertical: 4,
  },

  linkUnderlineWrapper: {
    borderBottomWidth: 1.2,
    paddingBottom: 0,
    alignSelf: 'center',
  },

  reminderText: {
    fontSize: 15.5,
    fontWeight: '500',
    lineHeight: 22,
    textAlign: 'center',
    textDecorationLine: 'none',
    letterSpacing: 0,
  },
});
