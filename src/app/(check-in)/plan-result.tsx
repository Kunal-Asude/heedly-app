import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { Spacing } from '@/constants/theme';
import { useCheckInConfig } from '@/hooks/data';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#463332',
  accent: '#b05334',
  bodyText: '#463332',
  mutedText: '#6B4C3E',
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
  cardBg: 'rgba(255, 251, 248, 0.85)',
  cardBorder: 'rgba(212, 184, 174, 0.35)',
  cautionBadgeBg: '#F4E2C7',
  cautionBadgeText: '#B57E32',
  cautionDot: '#D4A545',
  tipBoxBg: 'rgba(230, 222, 208, 0.65)',
  tipBoxBorder: 'rgba(212, 184, 174, 0.3)',
};

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

          {/* ── Top Header ────────────────────────────────────────────────── */}
          <View style={styles.headerBlock}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Go back to Planning">
              <Text style={styles.backChevron}>‹</Text>
            </Pressable>

            <Text style={styles.sectionLabel}>LOOKING AHEAD</Text>

            <Text style={styles.mainHeading}>
              {dayName} · {activityLabel}
            </Text>
          </View>

          {/* ── Main Forecast Card ────────────────────────────────────────── */}
          <View style={styles.forecastCard}>
            {/* Hero Orb */}
            <View style={styles.orbContainer}>
              <EnergyOrb state="caution" size={138} />
            </View>

            {/* Caution Badge */}
            <View style={styles.badgeContainer}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Caution</Text>
            </View>

            {/* Main Explanation Copy */}
            <Text style={styles.explanationText}>
              {explanationText}
            </Text>
          </View>

          {/* ── Recommendation Box ────────────────────────────────────────── */}
          <View style={styles.recommendationBox}>
            <SymbolView
              name="waveform.path.ecg"
              size={18}
              tintColor={COLORS.bodyText}
            />
            <Text style={styles.recommendationText}>
              {recommendationText}
            </Text>
          </View>

          {/* ── Footer Estimate Notice ────────────────────────────────────── */}
          <Text style={styles.estimateNotice}>
            Days further out are a rougher estimate.
          </Text>

          {/* Spacer pushing bottom CTA area */}
          <View style={styles.flexSpacer} />

          {/* ── Bottom Action Area ───────────────────────────────────────── */}
          <View style={styles.bottomArea}>
            {/* Done CTA Button with checkmark */}
            <Pressable
              style={({ pressed }) => [styles.doneButton, pressed && styles.buttonPressed]}
              onPress={handleDone}
              accessibilityRole="button"
              accessibilityLabel="Done">
              <View style={styles.doneTextContainer}>
                <Text style={styles.doneButtonText}>Done</Text>
              </View>
              <Text style={styles.checkmarkIcon}>✓</Text>
            </Pressable>

            {/* Remind me link */}
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

  glowInner: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#EEDCE0',
    opacity: 0.45,
    top: '8%',
    alignSelf: 'center',
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: 8,
    paddingBottom: Spacing.four,
  },

  pressed: {
    opacity: 0.82,
  },

  buttonPressed: {
    opacity: 0.88,
  },

  flexSpacer: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────

  headerBlock: {
    marginBottom: Spacing.three,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },

  backChevron: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.bodyText,
  },

  sectionLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 12,
    color: COLORS.mutedText,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  mainHeading: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 34,
    lineHeight: 42,
    color: COLORS.headingDark,
  },

  // ── Main Forecast Card ──────────────────────────────────────────────────

  forecastCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 24,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: Spacing.three,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  orbContainer: {
    width: 138,
    height: 138,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cautionBadgeBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(200, 150, 70, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 18,
  },

  badgeDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: COLORS.cautionDot,
  },

  badgeText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15,
    color: COLORS.cautionBadgeText,
  },

  explanationText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16.5,
    lineHeight: 24,
    color: '#463332',
    textAlign: 'center',
    width: '100%',
    maxWidth: 330,
    alignSelf: 'center',
    paddingHorizontal: 6,
  },

  // ── Recommendation Box ──────────────────────────────────────────────────

  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(235, 226, 210, 0.75)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(195, 170, 145, 0.5)',
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
    marginBottom: Spacing.three,
  },

  recommendationText: {
    flex: 1,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15.5,
    lineHeight: 22,
    color: '#463332',
  },

  // ── Footer Estimate Notice ──────────────────────────────────────────────

  estimateNotice: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: '#6B4C3E',
    textAlign: 'center',
    marginTop: 4,
  },

  // ── Bottom Action Area ──────────────────────────────────────────────────

  bottomArea: {
    gap: 14,
    alignItems: 'center',
  },

  doneButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: Spacing.four,
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  doneTextContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 24,
  },

  doneButtonText: {
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '600',
  },

  checkmarkIcon: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: '700',
  },

  reminderContainer: {
    paddingVertical: 4,
  },

  reminderText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
});
