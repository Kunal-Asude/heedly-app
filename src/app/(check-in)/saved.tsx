import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#463332',
  accent: '#b05334',
  bodyText: '#463332',
  mutedText: '#6B4C3E',
  helperText: '#8A6A5E',
  buttonBg: 'rgba(255, 251, 248, 0.95)',
  buttonBorder: 'rgba(212, 184, 174, 0.35)',
  cardBg: 'rgba(255, 251, 248, 0.85)',
  cardBorder: 'rgba(212, 184, 174, 0.4)',
  divider: 'rgba(212, 184, 174, 0.35)',
  checkBg: '#C8E3D0',
  checkIcon: '#2E5A3E',
  activeDot: '#E08568',
  inactiveDot: '#E5C4B7',
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
        {/* ── Fixed Viewport Content (Non-scrollable) ──────────────────── */}
        <View style={styles.contentArea}>

          {/* Green Check Icon Badge */}
          <View style={styles.iconContainer}>
            <View style={styles.checkBadge}>
              <SymbolView
                name="checkmark"
                size={22}
                tintColor={COLORS.checkIcon}
              />
            </View>
          </View>

          {/* Conditional Heading */}
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

          {/* Conditional Description */}
          {isFirstTime ? (
            <Text style={styles.description}>
              {"That's your first piece of the picture.\nEach check-in teaches heedly a little\nmore about you."}
            </Text>
          ) : (
            <Text style={styles.description}>
              {"We'll quietly watch for patterns and only\nping you if something matters."}
            </Text>
          )}

          {/* Summary Card with Tappable Rows */}
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

          {/* Helper Text below card */}
          <Text style={styles.helperText}>
            Tap any line to edit before you go.
          </Text>

        </View>

        {/* ── Bottom Section: Back to Today Button ───────────────────── */}
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
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    paddingBottom: Spacing.two,
  },

  // ── Icon Badge ───────────────────────────────────────────────────────────

  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },

  checkBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.checkBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7AAB89',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── Headings ─────────────────────────────────────────────────────────────

  headingFirstTime: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 36,
    lineHeight: 44,
    textAlign: 'center',
    marginBottom: 12,
  },

  headingRegular: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 34,
    lineHeight: 42,
    textAlign: 'center',
    marginBottom: 12,
  },

  headingDark: {
    color: COLORS.headingDark,
  },

  headingAccent: {
    color: COLORS.accent,
  },

  // ── Description ──────────────────────────────────────────────────────────

  description: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    lineHeight: 23,
    color: '#463332',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: Spacing.three,
  },

  // ── Summary Card ─────────────────────────────────────────────────────────

  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },

  summaryRowTopAligned: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },

  rowLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 11,
    color: COLORS.mutedText,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  rowLabelTop: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 11,
    color: COLORS.mutedText,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingTop: 2,
  },

  rowValueBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  rowValueText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15,
    color: COLORS.headingDark,
  },

  rowValueTextNotable: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.headingDark,
    marginLeft: 16,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 14,
  },

  // ── Helper Text ──────────────────────────────────────────────────────────

  helperText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13.5,
    lineHeight: 18,
    color: COLORS.helperText,
    textAlign: 'center',
    marginTop: 16,
  },

  // ── Dot Rating ───────────────────────────────────────────────────────────

  dotRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // ── Bottom Section ───────────────────────────────────────────────────────

  bottomSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },

  button: {
    backgroundColor: COLORS.buttonBg,
    borderRadius: 50,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  buttonText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 17,
    color: COLORS.headingDark,
  },
});
