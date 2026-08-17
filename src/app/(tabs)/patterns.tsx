import { useRouter } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#2C1810',
  accent: '#C0634A',
  bodyText: '#785344',
  mutedText: '#a38778',
  cardBg: 'rgba(255, 251, 248, 0.85)',
  cardBorder: 'rgba(212, 184, 174, 0.35)',
  steadyGreen: '#85B58E',
  cautionYellow: '#E5B87E',
  restPink: '#DC6B76',
  helpBadge: '#A8C7A5',
  costBadge: '#E08568',
};

// ─── Data structures for easy API integration ───────────────────────────────

type DayPattern = {
  day: string;
  type: 'steady' | 'caution' | 'rest';
  size: number;
  color: string;
};

type PatternCardData = {
  id: string;
  icon: SymbolViewProps['name'];
  badgeColor: string;
  bodyText: string;
  subtitleText: string;
};

const THIS_WEEK_DAYS: DayPattern[] = [
  { day: 'M', type: 'steady', size: 36, color: COLORS.steadyGreen },
  { day: 'T', type: 'steady', size: 36, color: COLORS.steadyGreen },
  { day: 'W', type: 'caution', size: 32, color: COLORS.cautionYellow },
  { day: 'T', type: 'caution', size: 32, color: COLORS.cautionYellow },
  { day: 'F', type: 'caution', size: 28, color: COLORS.cautionYellow },
  { day: 'S', type: 'rest', size: 26, color: COLORS.restPink },
  { day: 'S', type: 'rest', size: 26, color: COLORS.restPink },
];

const HELP_PATTERNS: PatternCardData[] = [
  {
    id: 'help-1',
    icon: 'moon.fill',
    badgeColor: COLORS.helpBadge,
    bodyText: 'Your energy tends to be steadiest on mornings after eight or more hours of sleep.',
    subtitleText: 'Based on 38 mornings.',
  },
  {
    id: 'help-2',
    icon: 'clock.fill',
    badgeColor: COLORS.helpBadge,
    bodyText: 'On nights you fall asleep before 11pm, your tank tends to start the next day about a quarter fuller.',
    subtitleText: 'Across 6 of the last 8 weeks.',
  },
];

const COST_PATTERNS: PatternCardData[] = [
  {
    id: 'cost-1',
    icon: 'person.2.fill',
    badgeColor: COLORS.costBadge,
    bodyText: 'Social time tends to show up in your body two days later, not the same evening.',
    subtitleText: 'Noticed across 6 of your last 7 social days.',
  },
  {
    id: 'cost-2',
    icon: 'bolt.fill',
    badgeColor: COLORS.costBadge,
    bodyText: 'Long screen stretches — work, admin, anything mentally heavy — seem to drain you almost as fast as standing does.',
    subtitleText: 'Strongest on days over 4 hours of screen time.',
  },
  {
    id: 'cost-3',
    icon: 'sun.max.fill',
    badgeColor: COLORS.costBadge,
    bodyText: 'Even mildly warm rooms above 25°C pull your tank down quickly, especially in the afternoon.',
    subtitleText: '9 hot days noticed so far — a stronger pattern than most.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatternsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}>

        {/* ── Back Chevron / Top Spacing ─────────────────────────────────── */}
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={({ pressed }) => [styles.topRow, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Go back to Today">
          <Text style={styles.backChevron}>‹</Text>
        </Pressable>

        {/* ── Section Label & Heading ────────────────────────────────────── */}
        <Text style={styles.sectionLabel}>PATTERNS</Text>

        <Text style={styles.mainHeading}>
          {"What we've noticed"}
        </Text>

        {/* ── Subtitle Block ─────────────────────────────────────────────── */}
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitleLeft}>
            {"A few small things we're\nlearning about you."}
          </Text>
          <Text style={styles.subtitleRight}>
            {"LEARNING SINCE\nMARCH 14"}
          </Text>
        </View>

        {/* ── "This week" 7-Day Card ─────────────────────────────────────── */}
        <View style={styles.thisWeekCard}>
          {/* Card Header */}
          <View style={styles.cardHeaderRow}>
            <Text style={styles.thisWeekTitle}>This week</Text>
            <View style={styles.thisWeekRightHeader}>
              <Text style={styles.sevenDaysText}>7 DAYS</Text>
              <SymbolView
                name="info.circle"
                size={18}
                tintColor={COLORS.mutedText}
              />
            </View>
          </View>

          {/* 7-Day Circles Row */}
          <View style={styles.daysRow}>
            {THIS_WEEK_DAYS.map((dayItem, index) => (
              <View key={index} style={styles.dayColumn}>
                <View style={styles.dayDotContainer}>
                  <View
                    style={[
                      styles.dayDot,
                      {
                        width: dayItem.size,
                        height: dayItem.size,
                        borderRadius: dayItem.size / 2,
                        backgroundColor: dayItem.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dayLabel}>{dayItem.day}</Text>
              </View>
            ))}
          </View>

          {/* Legend Row */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.steadyGreen }]} />
              <Text style={styles.legendText}>Steady</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.cautionYellow }]} />
              <Text style={styles.legendText}>Caution</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.restPink }]} />
              <Text style={styles.legendText}>Rest day</Text>
            </View>
          </View>

          {/* Card Footer Note */}
          <Text style={styles.cardFooterNote}>
            Bigger dot = more energy.
          </Text>
        </View>

        {/* ── "WHAT SEEMS TO HELP" Section ──────────────────────────────── */}
        <View style={styles.sectionHeaderBlock}>
          <Text style={styles.groupHeaderLabel}>WHAT SEEMS TO HELP</Text>
        </View>

        {HELP_PATTERNS.map((pattern) => (
          <Pressable
            key={pattern.id}
            style={({ pressed }) => [styles.patternCard, pressed && styles.pressed]}>
            <View style={[styles.cardIconBadge, { backgroundColor: pattern.badgeColor }]}>
              <SymbolView
                name={pattern.icon}
                size={20}
                tintColor="#FFFFFF"
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardBodyText}>{pattern.bodyText}</Text>
              <Text style={styles.cardSubtitleText}>{pattern.subtitleText}</Text>
            </View>
          </Pressable>
        ))}

        {/* ── "WHAT SEEMS TO COST YOU" Section ─────────────────────────── */}
        <View style={styles.sectionHeaderBlock}>
          <Text style={styles.groupHeaderLabel}>WHAT SEEMS TO COST YOU</Text>
        </View>

        {COST_PATTERNS.map((pattern) => (
          <Pressable
            key={pattern.id}
            style={({ pressed }) => [styles.patternCard, pressed && styles.pressed]}>
            <View style={[styles.cardIconBadge, { backgroundColor: pattern.badgeColor }]}>
              <SymbolView
                name={pattern.icon}
                size={20}
                tintColor="#FFFFFF"
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardBodyText}>{pattern.bodyText}</Text>
              <Text style={styles.cardSubtitleText}>{pattern.subtitleText}</Text>
            </View>
          </Pressable>
        ))}

        {/* ── Bottom Explanatory Text ────────────────────────────────────── */}
        <Text style={styles.bottomExplanatoryText}>
          {"We only share patterns we're reasonably sure about. Tap a card to see the days behind it."}
        </Text>

      </ScrollView>
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.four,
  },

  pressed: {
    opacity: 0.85,
  },

  // ── Header ──────────────────────────────────────────────────────────────

  topRow: {
    marginBottom: 4,
  },

  backChevron: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 26,
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
    fontSize: 36,
    lineHeight: 44,
    color: '#463332',
    marginBottom: 10,
  },

  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
  },

  subtitleLeft: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16.5,
    lineHeight: 23,
    color: '#463332',
    flex: 1,
  },

  subtitleRight: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.2,
    color: COLORS.mutedText,
    textAlign: 'right',
    textTransform: 'uppercase',
  },

  // ── "This week" Card ─────────────────────────────────────────────────────

  thisWeekCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: Spacing.four,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  thisWeekTitle: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 24,
    color: COLORS.headingDark,
  },

  thisWeekRightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  sevenDaysText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 11,
    letterSpacing: 1.2,
    color: COLORS.mutedText,
  },

  daysRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 18,
    height: 48,
  },

  dayColumn: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  dayDotContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayDot: {
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  dayLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13,
    color: COLORS.bodyText,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 14,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13,
    color: COLORS.bodyText,
  },

  cardFooterNote: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13,
    color: COLORS.bodyText,
  },

  // ── Group Headers ────────────────────────────────────────────────────────

  sectionHeaderBlock: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },

  groupHeaderLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 12,
    letterSpacing: 1.5,
    color: COLORS.mutedText,
    textTransform: 'uppercase',
  },

  // ── Pattern Cards ────────────────────────────────────────────────────────

  patternCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: Spacing.three,
    gap: 14,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  cardIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTextBlock: {
    flex: 1,
    gap: 6,
  },

  cardBodyText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.headingDark,
  },

  cardSubtitleText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13,
    color: COLORS.mutedText,
  },

  // ── Bottom Explanatory Text ──────────────────────────────────────────────

  bottomExplanatoryText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.bodyText,
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
  },
});
