import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { SymbolView } from '@/components/ui/symbol';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useAppTheme, useThemeMode } from '@/contexts/ThemeContext';

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
    ? ['rgba(46, 39, 56, 0.7)', 'rgba(67, 49, 67, 0.7)', 'rgba(102, 73, 73, 0.7)']
    : ['#faf4ec', '#faf4ec', '#faf4ec'];

  return (
    <LinearGradient
      colors={cardGradientColors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        styles.forecastCard,
        {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.7)',
          shadowColor: isDark ? '#000000' : '#BE968C',
          shadowOpacity: isDark ? 0.25 : 0.14,
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
  const params = useLocalSearchParams<{ dayName?: string; activityLabel?: string }>();

  const dayName = params.dayName ?? null;
  const activityLabel = params.activityLabel ?? null;

  const explanationText = "Heedly doesn't project planned days yet.";

  const handleDone = () => {
    router.replace('/(tabs)');
  };

  // Theme-aware tokens
  const eyebrowColor = isDark ? (isTrueBlack ? '#9A8A91' : 'rgba(199, 180, 191, 0.68)') : 'rgba(74, 58, 57, 0.5)';
  const mainHeadingColor = isDark ? (isTrueBlack ? '#E9DDD6' : '#F3E7E1') : theme.ink.display;
  const explanationColor = isDark ? (isTrueBlack ? '#A8979E' : 'rgba(199, 180, 191, 1)') : 'rgba(74, 58, 57, 0.82)';
  const reminderLinkColor = isDark ? (isTrueBlack ? '#C97B60' : '#E8907A') : 'rgba(176, 83, 52, 0.85)';
  // .pl-relink: underline rgba(…, 0.34) / 0.39
  const reminderLineColor = isDark ? (isTrueBlack ? 'rgba(201, 123, 96, 0.39)' : 'rgba(232, 144, 122, 0.39)') : 'rgba(176, 83, 52, 0.34)';

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
              <SymbolView name="chevron.left" size={22} tintColor={isDark ? (isTrueBlack ? '#A8979E' : 'rgba(199, 180, 191, 0.84)') : 'rgba(74, 58, 57, 0.62)'} />
            </Pressable>

            <Text style={[styles.sectionLabel, { color: eyebrowColor }]}>LOOKING AHEAD</Text>
            <Text style={[styles.mainHeading, { color: mainHeadingColor }]}>
              {[dayName, activityLabel].filter(Boolean).join(' · ')}
            </Text>
          </View>

          {/* ── Main Forecast Card (.pl-card) ─────────────────────────────── */}
          <ForecastCard isDark={isDark} isTrueBlack={isTrueBlack}>
            {/* Hero Orb (.pl-gauge: 140x140) */}
            <View style={styles.orbContainer}>
              <EnergyOrb state="empty" size={138} />
            </View>

            {/* Main Explanation Copy (.pl-read) */}
            <Text style={[styles.explanationText, { color: explanationColor }]}>
              {explanationText}
            </Text>
          </ForecastCard>

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
                    : ['#f4a47e', '#ea846a', '#e0735f']
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
                  { borderBottomColor: reminderLineColor },
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
    marginBottom: 0,
  },

  backButton: {
    width: 30,
    height: 30,
    marginLeft: -5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  backChevron: {
    width: 22,
    height: 22,
  },

  // .pl-eyebrow: 11px, 600, 0.2em, uppercase
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  // .pl-rtitle: Comfortaa 400, 32px, lineHeight 38px
  mainHeading: {
    fontFamily: Fonts.display.medium,
    fontSize: 27,
    lineHeight: 31,
    letterSpacing: -0.27,
  },

  // ── Main Forecast Card (.pl-card) ────────────────────────────────────────

  forecastCard: {
    borderRadius: 24,
    borderWidth: 1,
    paddingTop: 26,
    paddingHorizontal: 22,
    paddingBottom: 22,
    alignItems: 'center',
    marginTop: 18,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 15,
    elevation: 3,
  },

  orbContainer: {
    width: 138,
    height: 138,
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
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 260,
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
    gap: 16,
  },

  doneButtonWrapper: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 8,
  },

  doneButtonGradient: {
    flex: 1,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  doneButtonText: {
    color: '#FFF8F4',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.16,
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
    borderBottomWidth: 1,
    paddingBottom: 1,
    alignSelf: 'center',
  },

  reminderText: {
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
    textAlign: 'center',
  },
});
