import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';
import { usePatterns } from '@/hooks/data';

// ─── Design tokens ────────────────────────────────────────────────────────────

const STATE_COLORS = {
  steady: '#94b094',
  caution: '#f0c59e',
  rest: '#da6d82',
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
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 112 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}>

        {/* ── Back Chevron / Top Spacing (.sx-nav) ─────────────────────── */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Today">
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>
        </View>

        {/* ── Section Label & Heading (.sx-eyebrow & .sx-title) ────────── */}
        <Text style={styles.sectionLabel}>PATTERNS</Text>

        <Text style={styles.mainHeading}>
          {"What we've noticed"}
        </Text>

        {/* ── Subtitle Block (.pt-sub) ─────────────────────────────────── */}
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitleLeft}>{subtitleLeftText}</Text>
          <Text style={styles.subtitleRight}>{learningSinceText}</Text>
        </View>

        {/* ── "This week" 7-Day Card (.pt-week) ────────────────────────── */}
        <View style={styles.thisWeekCard}>
          {/* Card Header */}
          <View style={styles.cardHeaderRow}>
            <Text style={styles.thisWeekTitle}>This week</Text>
            <View style={styles.thisWeekRightHeader}>
              <Text style={styles.sevenDaysText}>7 DAYS</Text>
              <Pressable
                onPress={() => setIsTankTooltipVisible(!isTankTooltipVisible)}
                style={({ pressed }) => [
                  styles.infoCircleButton,
                  isTankTooltipVisible && styles.infoCircleButtonActive,
                  pressed && styles.pressed,
                ]}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="How is the tank measured?">
                <Text
                  style={[
                    styles.infoCircleText,
                    isTankTooltipVisible && styles.infoCircleTextActive,
                  ]}>
                  i
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Popover Tooltip when Info Icon is Pressed (.pt-popover) */}
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
                  accessibilityLabel="Close tooltip">
                  <Text style={styles.tankTooltipCloseText}>✕</Text>
                </Pressable>
              </View>

              <Text style={styles.tankTooltipBody}>{tankTooltipBody}</Text>
            </View>
          )}

          {/* 7-Day Circles Row (.pt-chart) */}
          <View style={styles.daysRow}>
            {thisWeekDays.map((dayItem, index) => {
              const dotColor =
                dayItem.color.includes('Green') || dayItem.color === '#85B58E' || dayItem.color === '#7E9B6A'
                  ? STATE_COLORS.steady
                  : dayItem.color.includes('Yellow') || dayItem.color === '#E5B87E' || dayItem.color === '#D99843'
                  ? STATE_COLORS.caution
                  : STATE_COLORS.rest;

              return (
                <View key={index} style={styles.dayColumn}>
                  <View style={styles.dayDotContainer}>
                    <View
                      style={[
                        styles.dayDot,
                        {
                          width: dayItem.size,
                          height: dayItem.size,
                          borderRadius: dayItem.size / 2,
                          backgroundColor: dotColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.dayLabel}>{dayItem.day}</Text>
                </View>
              );
            })}
          </View>

          {/* Legend Row (.pt-legend) */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: STATE_COLORS.steady }]} />
              <Text style={styles.legendText}>Steady</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: STATE_COLORS.caution }]} />
              <Text style={styles.legendText}>Caution</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: STATE_COLORS.rest }]} />
              <Text style={styles.legendText}>Rest day</Text>
            </View>
          </View>

          {/* Card Footer Note */}
          <Text style={styles.cardFooterNote}>
            Bigger dot = more energy.
          </Text>
        </View>

        {/* ── "WHAT SEEMS TO HELP" Section (.pt-sec) ───────────────────── */}
        <Text style={styles.groupHeaderLabel}>WHAT SEEMS TO HELP</Text>

        {helpPatterns.map((pattern) => (
          <Pressable
            key={pattern.id}
            style={({ pressed }) => [styles.patternCard, pressed && styles.pressed]}>
            <View style={styles.helpBadge}>
              <SymbolView
                name={pattern.icon}
                size={16}
                tintColor="#5d7a52"
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardBodyText}>{pattern.bodyText}</Text>
              <Text style={styles.cardSubtitleText}>{pattern.subtitleText}</Text>
            </View>
          </Pressable>
        ))}

        {/* ── "WHAT SEEMS TO COST YOU" Section (.pt-sec) ───────────────── */}
        <Text style={styles.groupHeaderLabelSpacing}>WHAT SEEMS TO COST YOU</Text>

        {costPatterns.map((pattern) => (
          <Pressable
            key={pattern.id}
            style={({ pressed }) => [styles.patternCard, pressed && styles.pressed]}>
            <View style={styles.costBadge}>
              <SymbolView
                name={pattern.icon}
                size={16}
                tintColor={CORAL.terracottaDeep}
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardBodyText}>{pattern.bodyText}</Text>
              <Text style={styles.cardSubtitleText}>{pattern.subtitleText}</Text>
            </View>
          </Pressable>
        ))}

        {/* ── Bottom Explanatory Text (.pt-foot) ───────────────────────── */}
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
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
  },

  pressed: {
    opacity: 0.75,
  },

  // ── Header (.sx-nav) ────────────────────────────────────────────────────

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 36,
    marginBottom: 12,
  },

  backButton: {
    width: 36,
    height: 36,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
    color: 'rgba(74, 58, 57, 0.62)',
  },

  // .sx-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5)
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  // .sx-title: Comfortaa 400, 30px, lineHeight 36px, #463332
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: INK.display,
    marginBottom: 8,
  },

  // .pt-sub: flex, gap 18px, margin-top 12px
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },

  // .pt-sub-text: 14.5px, 1.45, rgba(74,58,57,0.8)
  subtitleLeft: {
    fontSize: 14.5,
    lineHeight: 21,
    color: 'rgba(74, 58, 57, 0.8)',
    flex: 1,
  },

  // .pt-since: 10.5px, 600, 0.13em, uppercase, rgba(74,58,57,0.5)
  subtitleRight: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1.37,
    color: 'rgba(74, 58, 57, 0.5)',
    textAlign: 'right',
    textTransform: 'uppercase',
    marginTop: 2,
  },

  // ── "This week" Card (.pt-week) ──────────────────────────────────────────

  thisWeekCard: {
    backgroundColor: 'rgba(255, 252, 248, 0.82)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 20,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  // .pt-week-title: Comfortaa 500, 20px, #463332
  thisWeekTitle: {
    fontFamily: Fonts.display.regular,
    fontSize: 20,
    color: INK.display,
  },

  thisWeekRightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // .pt-week-days: 10.5px, 600, uppercase, rgba(74,58,57,0.5)
  sevenDaysText: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1.37,
    color: 'rgba(74, 58, 57, 0.5)',
    textTransform: 'uppercase',
  },

  // .pt-info: 22x22, radius 11, border 1px rgba(74,58,57,0.28)
  infoCircleButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(74, 58, 57, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoCircleButtonActive: {
    borderColor: 'rgba(224, 115, 95, 0.6)',
    backgroundColor: 'rgba(224, 115, 95, 0.1)',
  },

  infoCircleText: {
    fontFamily: Fonts.display.regular,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.55)',
    lineHeight: 15,
  },

  infoCircleTextActive: {
    color: '#c9603f',
  },

  tankTooltipPopover: {
    position: 'absolute',
    top: 44,
    right: 14,
    width: 260,
    backgroundColor: '#fffefb',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#785A5A',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 40,
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
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1.26,
    color: 'rgba(74, 58, 57, 0.7)',
    textTransform: 'uppercase',
    flex: 1,
  },

  tankTooltipCloseBtn: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tankTooltipCloseText: {
    fontSize: 14,
    color: 'rgba(74, 58, 57, 0.5)',
  },

  tankTooltipBody: {
    fontSize: 13,
    lineHeight: 19.5,
    color: 'rgba(74, 58, 57, 0.8)',
  },

  // .pt-chart: grid 7 cols
  daysRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 16,
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
    shadowColor: '#785046',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  // .pt-day: 11.5px, 600, rgba(74,58,57,0.5)
  dayLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
  },

  // .pt-legend: 12px, 600, rgba(74,58,57,0.7)
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 6,
    marginBottom: 8,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },

  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.7)',
  },

  cardFooterNote: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(74, 58, 57, 0.55)',
    marginTop: 4,
  },

  // ── Insight Cards (.pt-card3) ────────────────────────────────────────────

  // .pt-sec: 11px, 600, letter-spacing 0.16em, uppercase, rgba(74,58,57,0.5)
  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    color: 'rgba(74, 58, 57, 0.5)',
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  groupHeaderLabelSpacing: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    color: 'rgba(74, 58, 57, 0.5)',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 24,
  },

  patternCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
    backgroundColor: 'rgba(255, 252, 248, 0.82)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  helpBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: 'rgba(126, 155, 106, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  costBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: 'rgba(244, 164, 126, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  cardTextBlock: {
    flex: 1,
    gap: 5,
  },

  // .pt-card3-text: 14px, 1.5, #463332
  cardBodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: INK.display,
    fontWeight: '400',
  },

  // .pt-card3-ev: 12.5px, 1.45, rgba(74,58,57,0.66)
  cardSubtitleText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: 'rgba(74, 58, 57, 0.66)',
  },

  // .pt-foot: 13px, 1.5, rgba(74,58,57,0.78)
  bottomExplanatoryText: {
    fontSize: 13,
    lineHeight: 19.5,
    color: 'rgba(74, 58, 57, 0.78)',
    marginTop: 14,
    paddingHorizontal: 2,
  },
});
