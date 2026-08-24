import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Spacing } from '@/constants/theme';
import { usePatterns } from '@/hooks/data';

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

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatternsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isTankTooltipVisible, setIsTankTooltipVisible] = useState(false);
  const {
    thisWeekDays,
    helpPatterns,
    costPatterns,
    learningSinceText,
    subtitleLeftText,
    tankTooltipTitle,
    tankTooltipBody,
  } = usePatterns();

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
          <Text style={styles.subtitleLeft}>{subtitleLeftText}</Text>
          <Text style={styles.subtitleRight}>{learningSinceText}</Text>
        </View>

        {/* ── "This week" 7-Day Card ─────────────────────────────────────── */}
        <View style={styles.thisWeekCard}>
          {/* Card Header */}
          <View style={styles.cardHeaderRow}>
            <Text style={styles.thisWeekTitle}>This week</Text>
            <Pressable
              onPress={() => setIsTankTooltipVisible(!isTankTooltipVisible)}
              style={({ pressed }) => [
                styles.thisWeekRightHeader,
                pressed && styles.pressed,
              ]}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="How is the tank measured?"
            >
              <Text style={styles.sevenDaysText}>7 DAYS</Text>
              <SymbolView
                name="info.circle"
                size={18}
                tintColor={isTankTooltipVisible ? COLORS.accent : COLORS.mutedText}
              />
            </Pressable>
          </View>

          {/* Popover Tooltip when Info Icon is Pressed */}
          {isTankTooltipVisible && (
            <View style={styles.tankTooltipPopover}>
              <View style={styles.tankTooltipHeader}>
                <Text style={styles.tankTooltipTitle}>{tankTooltipTitle}</Text>
                <Pressable
                  onPress={() => setIsTankTooltipVisible(false)}
                  style={({ pressed }) => [
                    styles.tankTooltipCloseBtn,
                    pressed && styles.pressed,
                  ]}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Close tooltip"
                >
                  <Text style={styles.tankTooltipCloseText}>✕</Text>
                </Pressable>
              </View>

              <Text style={styles.tankTooltipBody}>{tankTooltipBody}</Text>
            </View>
          )}

          {/* 7-Day Circles Row */}
          <View style={styles.daysRow}>
            {thisWeekDays.map((dayItem, index) => (
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

        {helpPatterns.map((pattern) => (
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

        {costPatterns.map((pattern) => (
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

  tankTooltipPopover: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 275,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 184, 174, 0.4)',
    shadowColor: '#4A2820',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 100,
  },

  tankTooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  tankTooltipTitle: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 12,
    letterSpacing: 1.1,
    color: '#785344',
    textTransform: 'uppercase',
    flex: 1,
    marginRight: 8,
  },

  tankTooltipCloseBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tankTooltipCloseText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    lineHeight: 16,
    color: '#A38778',
  },

  tankTooltipBody: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13.5,
    lineHeight: 19.5,
    color: '#6B4C3E',
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
