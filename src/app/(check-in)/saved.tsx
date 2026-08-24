import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';

// ─── Design tokens (from Aubade Dawn HTML) ─────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#463332',
  accent: '#b0532f',
  bodyText: '#463332',
  mutedText: 'rgba(74, 58, 57, 0.5)',
  helperText: 'rgba(74, 58, 57, 0.5)',
  buttonBg: 'rgba(255, 255, 255, 0.7)',
  buttonBorder: 'rgba(255, 255, 255, 0.85)',
  cardBg: 'rgba(255, 252, 248, 0.72)',
  cardBorder: 'rgba(255, 255, 255, 0.8)',
  divider: 'rgba(120, 90, 90, 0.1)',
  checkBg: '#c1dac8',
  checkIcon: '#4f7359',
  activeDot: '#ec7d5e',
  inactiveDot: 'rgba(120, 90, 90, 0.18)',
};

// ─── Dot Rating Indicator Component ────────────────────────────────────────────

function FiveDotRating({ value }: { value: number }) {
  return (
    <View style={styles.dotRatingRow}>
      {[1, 2, 3, 4, 5].map((idx) => (
        <View
          key={idx}
          style={[
            styles.ratingDot,
            { backgroundColor: idx <= value ? COLORS.activeDot : COLORS.inactiveDot },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckInSavedScreen() {
  const router = useRouter();
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
  }>();

  const isFirstTime = params.isFirstTime === 'true';

  const yesterdayLabel = params.yesterdayLabel;
  const energyLabel = params.energyLabel ?? (isFirstTime ? 'okay' : 'middling');
  const energyRating = params.energyIndex ? Number(params.energyIndex) + 1 : 3;
  const bodyLabel = params.bodyLabel ?? 'tender';
  const bodyRating = params.bodyIndex ? Number(params.bodyIndex) + 1 : 3;
  const tagsText = params.tags && params.tags.length > 0 ? params.tags : 'social · screens · warm room';
  const periodInfo = params.periodInfo;

  const currentParams = {
    energyIndex: params.energyIndex,
    energyLabel: params.energyLabel,
    yesterdayIndex: params.yesterdayIndex,
    yesterdayLabel: params.yesterdayLabel,
    bodyIndex: params.bodyIndex,
    bodyLabel: params.bodyLabel,
    tags: params.tags,
    periodInfo: params.periodInfo,
    isFirstTime: params.isFirstTime,
    isEditing: 'true',
  };

  const handleEditEnergy = () => {
    router.push({
      pathname: '/(check-in)/energy',
      params: currentParams,
    });
  };

  const handleEditBody = () => {
    router.push({
      pathname: '/(check-in)/body',
      params: currentParams,
    });
  };

  const handleEditNotable = () => {
    router.push({
      pathname: '/(check-in)/noting',
      params: currentParams,
    });
  };

  const handleEditYesterday = () => {
    router.push({
      pathname: '/(check-in)/yesterday',
      params: currentParams,
    });
  };

  const handleEditCycle = () => {
    router.push({
      pathname: '/(check-in)/noting',
      params: {
        ...currentParams,
        openPeriod: 'true',
      },
    });
  };

  const handleBackToToday = () => {
    router.replace('/(tabs)?mode=steady' as any);
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Fixed Viewport Content (.ci-done) ───────────────────────── */}
        <View style={styles.contentArea}>

          {/* Green Check Icon Badge (.ci-done-icon.check) */}
          <View style={styles.iconContainer}>
            <View style={styles.checkBadge}>
              <SymbolView
                name="checkmark"
                size={22}
                tintColor={COLORS.checkIcon}
              />
            </View>
          </View>

          {/* Conditional Heading (.ci-done .ob-h: 32px, Comfortaa 400) */}
          {isFirstTime ? (
            <Text style={styles.headingFirstTime}>
              <Text style={styles.headingDark}>Thank you, </Text>
              <Text style={styles.headingAccent}>Sam.</Text>
            </Text>
          ) : (
            <Text style={styles.headingRegular}>
              <Text style={styles.headingDark}>Saved.{'\n'}</Text>
              <Text style={styles.headingAccent}>Rest well, Sam.</Text>
            </Text>
          )}

          {/* Conditional Description (.lead: 15px, line-height 23px) */}
          {isFirstTime ? (
            <Text style={styles.description}>
              {"That's your first piece of the picture.\nEach check-in teaches heedly a little\nmore about you."}
            </Text>
          ) : (
            <Text style={styles.description}>
              {"We'll quietly watch for patterns and only\nping you if something matters."}
            </Text>
          )}

          {/* Summary Card with Tappable Rows (.ci-summary) */}
          <View style={styles.summaryCard}>
            {/* FIRST ROW: FEELING (First Time) vs ENERGY (Recurring) */}
            <Pressable
              style={({ pressed }) => [styles.summaryRow, pressed && styles.rowPressed]}
              onPress={handleEditEnergy}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${isFirstTime ? 'feeling' : 'energy'}: ${energyLabel}`}
            >
              <Text style={styles.rowLabel}>{isFirstTime ? 'FEELING' : 'ENERGY'}</Text>
              <View style={styles.rowValueBlock}>
                <Text style={styles.rowValueText}>{energyLabel}</Text>
                <FiveDotRating value={energyRating} />
              </View>
            </Pressable>

            <View style={styles.divider} />

            {/* SECOND ROW: BODY */}
            <Pressable
              style={({ pressed }) => [styles.summaryRow, pressed && styles.rowPressed]}
              onPress={handleEditBody}
              accessibilityRole="button"
              accessibilityLabel={`Edit body: ${bodyLabel}`}
            >
              <Text style={styles.rowLabel}>BODY</Text>
              <View style={styles.rowValueBlock}>
                <Text style={styles.rowValueText}>{bodyLabel}</Text>
                <FiveDotRating value={bodyRating} />
              </View>
            </Pressable>

            <View style={styles.divider} />

            {/* THIRD ROW: NOTABLE */}
            <Pressable
              style={({ pressed }) => [styles.summaryRowTopAligned, pressed && styles.rowPressed]}
              onPress={handleEditNotable}
              accessibilityRole="button"
              accessibilityLabel={`Edit notable tags: ${tagsText}`}
            >
              <Text style={styles.rowLabelTop}>NOTABLE</Text>
              <Text style={styles.rowValueTextNotable}>
                {tagsText}
              </Text>
            </Pressable>

            {/* FOURTH ROW: YESTERDAY (Shown on Regular / Recurring check-in) */}
            {!isFirstTime && yesterdayLabel && (
              <>
                <View style={styles.divider} />
                <Pressable
                  style={({ pressed }) => [styles.summaryRow, pressed && styles.rowPressed]}
                  onPress={handleEditYesterday}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit yesterday: ${yesterdayLabel}`}
                >
                  <Text style={styles.rowLabel}>YESTERDAY</Text>
                  <Text style={styles.rowValueText}>{yesterdayLabel}</Text>
                </Pressable>
              </>
            )}

            {/* CYCLE / PERIOD Row (if recorded) */}
            {periodInfo && (
              <>
                <View style={styles.divider} />
                <Pressable
                  style={({ pressed }) => [styles.summaryRowTopAligned, pressed && styles.rowPressed]}
                  onPress={handleEditCycle}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit cycle: ${periodInfo}`}
                >
                  <Text style={styles.rowLabelTop}>CYCLE</Text>
                  <Text style={styles.rowValueTextNotable}>
                    {periodInfo}
                  </Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Helper Text below card (.ci-edit-hint: 12px, rgba(74,58,57,0.5)) */}
          <Text style={styles.helperText}>
            Tap any line to edit before you go.
          </Text>

        </View>

        {/* ── Bottom Section: Back to Today Button (.ci-secondary) ─────── */}
        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
            onPress={handleBackToToday}
            accessibilityRole="button"
            accessibilityLabel="Back to today">
            <Text style={styles.buttonText}>Back to today</Text>
          </Pressable>
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
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  rowPressed: {
    opacity: 0.6,
  },

  // ── Content Area ─────────────────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: 26,
    justifyContent: 'center',
    paddingBottom: 8,
  },

  // ── Icon Badge (.ci-done-icon.check: 56x56) ──────────────────────────────

  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  checkBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.checkBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },

  // ── Headings (.ci-done .ob-h: 32px, Comfortaa 400) ───────────────────────

  headingFirstTime: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 12,
  },

  headingRegular: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 12,
  },

  headingDark: {
    color: INK.display,
  },

  headingAccent: {
    color: CORAL.terracottaDeep,
  },

  // ── Description (.lead: 15px, line-height 23px) ──────────────────────────

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: INK.soft,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },

  // ── Summary Card (.ci-summary: radius 20, shadow, padding 4px 18px) ──────

  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 6,
    paddingHorizontal: 18,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 3,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  summaryRowTopAligned: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  // .ci-skey: 11px, 600, letter-spacing 0.16em, uppercase, rgba(74,58,57,0.5)
  rowLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
    letterSpacing: 1.76,
    textTransform: 'uppercase',
  },

  rowLabelTop: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    paddingTop: 2,
  },

  rowValueBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // .ci-sval: 14px, 600, #4f3c3a
  rowValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f3c3a',
  },

  // .ci-snote: 13px, 600, #5a4644
  rowValueTextNotable: {
    flex: 1,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: '#5a4644',
    marginLeft: 16,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
  },

  // ── Helper Text (.ci-edit-hint: 12px, rgba(74,58,57,0.5)) ────────────────

  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(74, 58, 57, 0.5)',
    textAlign: 'center',
    marginTop: 16,
  },

  // ── Dot Rating (.ci-sdots) ───────────────────────────────────────────────

  dotRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  ratingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // ── Bottom Section (.ci-secondary: height 54, radius 27, 16px 600 #5a4644) ─

  bottomSection: {
    paddingHorizontal: 26,
    paddingBottom: 26,
  },

  button: {
    backgroundColor: COLORS.buttonBg,
    borderRadius: 27,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 2,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5a4644',
  },
});
