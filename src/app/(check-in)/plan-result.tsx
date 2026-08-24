import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';
import { useCheckInConfig } from '@/hooks/data';

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlanResultScreen() {
  const router = useRouter();
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

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
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
              <Text style={styles.backChevron}>‹</Text>
            </Pressable>

            {/* .pl-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5) */}
            <Text style={styles.sectionLabel}>LOOKING AHEAD</Text>

            {/* .pl-rtitle: Comfortaa 400, 27px, lineHeight 34px, #463332 */}
            <Text style={styles.mainHeading}>
              {dayName} · {activityLabel}
            </Text>
          </View>

          {/* ── Main Forecast Card (.pl-card) ─────────────────────────────── */}
          <View style={styles.forecastCard}>
            {/* Hero Orb (.pl-gauge: 138x138) */}
            <View style={styles.orbContainer}>
              <EnergyOrb state="caution" size={138} />
            </View>

            {/* Caution Badge (.pl-pill) */}
            <View style={styles.badgeContainer}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Caution</Text>
            </View>

            {/* Main Explanation Copy (.pl-read) */}
            <Text style={styles.explanationText}>
              {explanationText}
            </Text>
          </View>

          {/* ── Recommendation Box (.pl-tip) ─────────────────────────────── */}
          <View style={styles.recommendationBox}>
            <View style={styles.tipIconContainer}>
              <SymbolView
                name="waveform.path.ecg"
                size={18}
                tintColor="#5d7a52"
              />
            </View>
            <Text style={styles.recommendationText}>
              {recommendationText}
            </Text>
          </View>

          {/* ── Footer Estimate Notice (.pl-caveat) ───────────────────────── */}
          <Text style={styles.estimateNotice}>
            Days further out are a rougher estimate.
          </Text>

          {/* Spacer pushing bottom CTA area */}
          <View style={styles.flexSpacer} />

          {/* ── Bottom Action Area (.pl-done & .pl-relink) ───────────────── */}
          <View style={styles.bottomArea}>
            <Pressable
              style={({ pressed }) => [styles.doneButtonWrapper, pressed && styles.buttonPressed]}
              onPress={handleDone}
              accessibilityRole="button"
              accessibilityLabel="Done">
              <LinearGradient
                colors={[CORAL.light, CORAL.mid, CORAL.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.doneButtonGradient}>
                <Text style={styles.doneButtonText}>Done</Text>
                <View style={styles.checkmarkIconContainer}>
                  <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17l-5-5"
                      stroke="#fff8f4"
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
              <Text style={styles.reminderText}>Remind me to ease up before</Text>
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
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },

  pressed: {
    opacity: 0.8,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
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
    marginBottom: 8,
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
    color: 'rgba(74, 58, 57, 0.62)',
  },

  // .pl-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5)
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  // .pl-rtitle: Comfortaa 400, 27px, lineHeight 34px, #463332
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -0.3,
    color: INK.display,
  },

  // ── Main Forecast Card (.pl-card) ────────────────────────────────────────

  forecastCard: {
    backgroundColor: 'rgba(250, 244, 236, 0.88)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 3,
  },

  orbContainer: {
    width: 138,
    height: 138,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // .pl-pill: padding 7px 16px, radius 999px, bg rgba(217,152,67,0.16), border 1px rgba(217,152,67,0.3)
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(217, 152, 67, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(217, 152, 67, 0.3)',
  },

  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d99843',
  },

  // .pl-pill text: 14px, 600, #9a6a2a
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9a6a2a',
  },

  // .pl-read: 14.5px, 1.55, rgba(74,58,57,0.82)
  explanationText: {
    fontSize: 14.5,
    lineHeight: 22.5,
    color: 'rgba(74, 58, 57, 0.82)',
    fontWeight: '500',
    textAlign: 'center',
  },

  // ── Recommendation Box (.pl-tip) ────────────────────────────────────────

  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
    backgroundColor: 'rgba(126, 155, 106, 0.1)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(126, 155, 106, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  tipIconContainer: {
    marginTop: 1,
  },

  // .pl-tip p: 13.5px, 1.5, #4f5a45, 500
  recommendationText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#4f5a45',
    fontWeight: '500',
  },

  // .pl-caveat: 13px, 1.5, rgba(74,58,57,0.62)
  estimateNotice: {
    fontSize: 13,
    lineHeight: 19.5,
    color: 'rgba(74, 58, 57, 0.62)',
    fontWeight: '500',
    textAlign: 'center',
  },

  // ── Bottom Action Area ───────────────────────────────────────────────────

  bottomArea: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },

  // .pl-done: 58px, 29px radius, gradient, shadow
  doneButtonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  doneButtonGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  doneButtonText: {
    color: '#fff8f4',
    fontSize: 16.5,
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

  // .pl-relink: 13.5px, 500, rgba(176,83,52,0.85), underline
  reminderContainer: {
    paddingVertical: 4,
  },

  reminderText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: 'rgba(176, 83, 52, 0.85)',
    textDecorationLine: 'underline',
  },
});
