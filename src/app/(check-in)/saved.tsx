import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#2C1810',
  accent: '#C0634A',
  bodyText: '#785344',
  mutedText: '#a38778',
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
    energyIndex?: string;
    energyLabel?: string;
    bodyIndex?: string;
    bodyLabel?: string;
    tags?: string;
  }>();

  const energyLabel = params.energyLabel ?? 'middling';
  const energyRating = params.energyIndex ? Number(params.energyIndex) + 1 : 3;
  const bodyLabel = params.bodyLabel ?? 'tender';
  const bodyRating = params.bodyIndex ? Number(params.bodyIndex) + 1 : 3;
  const tagsText = params.tags && params.tags.length > 0 ? params.tags : 'social · screens · warm room';

  const handleBackToToday = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      {/* Atmospheric background glow */}
      <View style={styles.glowInner} pointerEvents="none" />

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

          {/* Heading */}
          <Text style={styles.heading}>
            <Text style={styles.headingDark}>Saved.{'\n'}</Text>
            <Text style={styles.headingAccent}>Rest well, Sam.</Text>
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            {"We'll quietly watch for patterns and only"}{'\n'}ping you if something matters.
          </Text>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            {/* ENERGY Row */}
            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>ENERGY</Text>
              <View style={styles.rowValueBlock}>
                <Text style={styles.rowValueText}>{energyLabel}</Text>
                <FiveDotRating value={energyRating} />
              </View>
            </View>

            <View style={styles.divider} />

            {/* BODY Row */}
            <View style={styles.summaryRow}>
              <Text style={styles.rowLabel}>BODY</Text>
              <View style={styles.rowValueBlock}>
                <Text style={styles.rowValueText}>{bodyLabel}</Text>
                <FiveDotRating value={bodyRating} />
              </View>
            </View>

            <View style={styles.divider} />

            {/* NOTABLE Row */}
            <View style={styles.summaryRowTopAligned}>
              <Text style={styles.rowLabelTop}>NOTABLE</Text>
              <Text style={styles.rowValueTextNotable}>
                {tagsText}
              </Text>
            </View>
          </View>

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
    backgroundColor: COLORS.background,
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

  pressed: {
    opacity: 0.85,
  },

  // ── Content Area ─────────────────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    paddingBottom: Spacing.four,
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

  // ── Heading ──────────────────────────────────────────────────────────────

  heading: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 34,
    lineHeight: 42,
    textAlign: 'center',
    marginBottom: 14,
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
    lineHeight: 22,
    color: COLORS.bodyText,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: Spacing.two,
  },

  // ── Summary Card ─────────────────────────────────────────────────────────

  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 18,
    paddingHorizontal: 20,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 3 },
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
    paddingVertical: 18,
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
