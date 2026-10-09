import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "@/components/ui/symbol";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTabBarInset } from '@/components/app-tabs';
import { DawnBackground, EmptyState } from "@/components/core";
import { Fonts } from "@/constants/theme";
import { useCheckIn } from "@/contexts/CheckInContext";
import { useAppTheme, useThemeMode } from "@/contexts/ThemeContext";
import { ENERGY_LEGEND, oledDotColor } from "@/copy/weekDots";
import { usePatterns } from "@/hooks/data";

// ─── Design Tokens ────────────────────────────────────────────────────────────

// .sx-badge.sage / .sx-badge.coral: [from, to, icon] for light, Dusk, OLED
const BADGE = {
  help: {
    light: ["#bcd6c2", "#9cc0aa", "#426150"],
    dusk: ["#4A6B55", "#33503F", "#C6DFCB"],
    oled: ["#2C4235", "#2C4235", "#9FB8A6"],
  },
  cost: {
    light: ["#f3a784", "#e7805f", "#fff8f4"],
    dusk: ["#8A4B3C", "#6B3A2E", "#F3D9CD"],
    oled: ["#5A3128", "#5A3128", "#D8BFB4"],
  },
} as const;

// ─── Pattern Card Component (.sx-card with subtle gradient / flat OLED) ───────

function PatternCard({
  children,
  isDark,
  isTrueBlack = false,
  style,
}: {
  children: React.ReactNode;
  isDark: boolean;
  isTrueBlack?: boolean;
  style?: any;
}) {
  if (isDark && isTrueBlack) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: '#16111B',
            borderColor: 'rgba(255, 255, 255, 0.07)',
            shadowOpacity: 0,
            elevation: 0,
          },
          style,
        ]}>
        {children}
      </View>
    );
  }

  // .pt-week / .pt-card3: flat #fffcf8b8 (light), 90deg mauve gradient at 0.7 (Dusk)
  const cardGradientColors: [string, string, string] = isDark
    ? ['rgba(46, 39, 56, 0.7)', 'rgba(67, 49, 67, 0.7)', 'rgba(102, 73, 73, 0.7)']
    : ['rgba(255, 252, 248, 0.72)', 'rgba(255, 252, 248, 0.72)', 'rgba(255, 252, 248, 0.72)'];

  return (
    <LinearGradient
      colors={cardGradientColors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        styles.card,
        {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.85)',
          shadowColor: isDark ? '#000000' : '#BE968C',
          shadowOpacity: isDark ? 0.29 : 0.16,
        },
        style,
      ]}>
      {children}
    </LinearGradient>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PatternsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const [isTankTooltipVisible, setIsTankTooltipVisible] = useState(false);
  const { isHydrating, hasEverCheckedIn } = useCheckIn();
  const showEmptyState = !isHydrating && !hasEverCheckedIn;

  const {
    thisWeekDays,
    helpPatterns,
    costPatterns,
    tankTooltipTitle,
    tankTooltipBody,
    learningSinceText,
    refresh: refreshPatterns,
  } = usePatterns();

  useFocusEffect(
    useCallback(() => {
      void refreshPatterns();
    }, [refreshPatterns]),
  );

  // Dynamic Theme Colors (Dawn vs Dusk vs True Black / OLED)
  const badgeTheme = isDark ? (isTrueBlack ? "oled" : "dusk") : "light";

  // .sx-eyebrow / .pt-since / .pt-week-days / .pt-day / .pt-sec
  const mutedLabelColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.68)"
    : "rgba(74, 58, 57, 0.5)";
  // .sx-title / .pt-week-title / .pt-card3-text
  const inkColor = isDark
    ? isTrueBlack
      ? "#E9DDD6"
      : "#F3E7E1"
    : theme.ink.display;
  // .pt-sub-text
  const subtitleColor = isDark
    ? isTrueBlack
      ? "#A8979E"
      : "rgba(199, 180, 191, 1)"
    : "rgba(74, 58, 57, 0.8)";
  // .pt-card3-ev
  const subtextColor = isDark
    ? isTrueBlack
      ? "#A8979E"
      : "rgba(199, 180, 191, 0.89)"
    : "rgba(74, 58, 57, 0.66)";
  // .pt-legend span
  const legendTextColor = isDark
    ? isTrueBlack
      ? "#A8979E"
      : "rgba(199, 180, 191, 0.95)"
    : "rgba(74, 58, 57, 0.7)";
  // .pt-foot
  const footnoteColor = isDark
    ? isTrueBlack
      ? "#A8979E"
      : "rgba(199, 180, 191, 1)"
    : "rgba(74, 58, 57, 0.78)";


  return (
    <View style={styles.root}>
      {/* Atmosphere Background */}
      <DawnBackground />

      {/* ── Back header — fixed; content scrolls out of view below it ── */}
      <View style={[styles.stickyHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <SymbolView name="chevron.left" size={22} tintColor={isDark ? (isTrueBlack ? "#A8979E" : "rgba(199, 180, 191, 0.84)") : "rgba(74, 58, 57, 0.62)"} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={[styles.scrollView, { marginBottom: tabBarInset }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Section Label & Heading (.sx-eyebrow & .sx-title) ────────── */}
        <Text style={[styles.sectionLabel, { color: mutedLabelColor }]}>PATTERNS</Text>

        <Text style={[styles.mainHeading, { color: inkColor }]}>
          {"What we've noticed"}
        </Text>

        {showEmptyState ? (
          <EmptyState
            title="Nothing to show yet."
            body={"Patterns need a few days of check-ins before they mean anything. Yours will appear here."}
          />
        ) : (
        <>
        {/* ── Subtitle Block (.pt-sub) ─────────────────────────────────── */}
        <View style={styles.subtitleRow}>
          <Text style={[styles.subtitleLeft, { color: subtitleColor }]}>
            {"A few small things we're\nlearning about you."}
          </Text>
          {learningSinceText ? (
            <Text style={[styles.learningSince, { color: mutedLabelColor }]}>
              {`LEARNING SINCE ${learningSinceText}`}
            </Text>
          ) : null}
        </View>

        {/* ── "This week" 7-Day Card (.pt-week) ────────────────────────── */}
        <PatternCard isDark={isDark} isTrueBlack={isTrueBlack} style={styles.thisWeekCard}>
          {/* Card Header */}
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.thisWeekTitle, { color: inkColor }]}>This week</Text>
            <View style={styles.thisWeekRightHeader}>
              <Text style={[styles.sevenDaysText, { color: mutedLabelColor }]}>7 DAYS</Text>
              <Pressable
                onPress={() => setIsTankTooltipVisible(!isTankTooltipVisible)}
                style={({ pressed }) => [
                  styles.infoCircleButton,
                  {
                    borderColor: isDark
                      ? isTankTooltipVisible
                        ? isTrueBlack
                          ? "rgba(190, 106, 92, 0.6)" // OLED .pt-info.active
                          : "rgba(226, 122, 108, 0.6)"
                        : isTrueBlack
                        ? "rgba(255, 255, 255, 0.07)" // OLED .pt-info
                        : "rgba(199, 180, 191, 0.35)"
                      : isTankTooltipVisible
                      ? "rgba(224, 115, 95, 0.6)"
                      : "rgba(74, 58, 57, 0.28)",
                    backgroundColor: isTankTooltipVisible && !isTrueBlack
                      ? isDark
                        ? "rgba(226, 122, 108, 0.15)"
                        : "rgba(224, 115, 95, 0.1)"
                      : "transparent",
                  },
                  pressed && styles.pressed,
                ]}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="How is the tank measured?"
              >
                <Text
                  style={[
                    styles.infoCircleText,
                    {
                      color: isTankTooltipVisible
                        ? isDark
                          ? isTrueBlack
                            ? "#C97B60"
                            : "#E8907A"
                          : "#c9603f"
                        : isDark
                        ? isTrueBlack
                          ? "#9A8A91"
                          : "rgba(199, 180, 191, 0.75)"
                        : "rgba(74, 58, 57, 0.55)",
                    },
                  ]}
                >
                  i
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Popover Tooltip when Info Icon is Pressed (.pt-popover) */}
          {isTankTooltipVisible && (
            <View
              style={[
                styles.tankTooltipPopover,
                {
                  backgroundColor: isDark ? (isTrueBlack ? "#16111B" : "#3D293E") : "#fffefb",
                  borderColor: isDark
                    ? isTrueBlack
                      ? "rgba(255, 255, 255, 0.07)"
                      : "rgba(255, 255, 255, 0.12)"
                    : "rgba(220, 190, 180, 0.5)",
                },
              ]}
            >
              <View style={styles.tankTooltipHeader}>
                <Text
                  style={[
                    styles.tankTooltipTitle,
                    { color: isDark ? (isTrueBlack ? "#A8979E" : "rgba(199, 180, 191, 0.75)") : "rgba(74, 58, 57, 0.7)" }, // OLED .pt-popover-title
                  ]}
                >
                  {tankTooltipTitle}
                </Text>
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
                  <Text style={[styles.tankTooltipCloseText, { color: isDark ? (isTrueBlack ? "#9A8A91" : "rgba(199, 180, 191, 0.6)") : "rgba(74, 58, 57, 0.5)" }]}>
                    ✕
                  </Text>
                </Pressable>
              </View>

              <Text
                style={[
                  styles.tankTooltipBody,
                  { color: isDark ? (isTrueBlack ? "#A8979E" : "rgba(199, 180, 191, 0.92)") : "rgba(74, 58, 57, 0.8)" }, // OLED .pt-popover-body
                ]}
              >
                {tankTooltipBody}
              </Text>
            </View>
          )}

          {/* 7-Day Circles Row (.pt-chart) */}
          <View style={styles.daysRow}>
            {thisWeekDays.map((dayItem, index) => {
              const dotColor = isTrueBlack ? oledDotColor(dayItem.color) : dayItem.color;

              return (
                <View key={dayItem.date ?? index} style={styles.dayColumn}>
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
                  <Text style={[styles.dayLabel, { color: mutedLabelColor }]}>
                    {dayItem.day}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Legend Row (.pt-legend) */}
          <View style={styles.legendRow}>
            {ENERGY_LEGEND.map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: isTrueBlack ? oledDotColor(item.color) : item.color }]} />
                <Text style={[styles.legendText, { color: legendTextColor }]}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Second .pt-legend row */}
          <View style={styles.legendRow}>
            <Text style={[styles.legendText, { color: legendTextColor }]}>
              Bigger dot = more energy.
            </Text>
          </View>

          {/* .pt-foot */}
          <Text style={[styles.cardFooterNote, { color: footnoteColor }]}>
            Your tank reflects your recent weeks, not a fixed ceiling.
          </Text>
        </PatternCard>

        {/* ── "WHAT SEEMS TO HELP" Section (.pt-sec) ───────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: mutedLabelColor }]}>
          WHAT SEEMS TO HELP
        </Text>

        {helpPatterns.map((pattern) => (
          <PatternCard
            key={pattern.id}
            isDark={isDark}
            isTrueBlack={isTrueBlack}
            style={styles.patternCard}
          >
            <LinearGradient
              colors={[BADGE.help[badgeTheme][0], BADGE.help[badgeTheme][1]]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.helpBadge}
            >
              <SymbolView
                name={pattern.icon}
                size={18}
                tintColor={BADGE.help[badgeTheme][2]}
              />
            </LinearGradient>
            <View style={styles.cardTextBlock}>
              <Text style={[styles.cardBodyText, { color: inkColor }]}>
                {pattern.bodyText}
              </Text>
              <Text style={[styles.cardSubtitleText, { color: subtextColor }]}>
                {pattern.subtitleText}
              </Text>
            </View>
          </PatternCard>
        ))}

        {/* ── "WHAT SEEMS TO COST YOU" Section (.pt-sec) ───────────────── */}
        <Text style={[styles.groupHeaderLabelSpacing, { color: mutedLabelColor }]}>
          WHAT SEEMS TO COST YOU
        </Text>

        {costPatterns.map((pattern) => (
          <PatternCard
            key={pattern.id}
            isDark={isDark}
            isTrueBlack={isTrueBlack}
            style={styles.patternCard}
          >
            <LinearGradient
              colors={[BADGE.cost[badgeTheme][0], BADGE.cost[badgeTheme][1]]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.costBadge}
            >
              <SymbolView
                name={pattern.icon}
                size={18}
                tintColor={BADGE.cost[badgeTheme][2]}
              />
            </LinearGradient>
            <View style={styles.cardTextBlock}>
              <Text style={[styles.cardBodyText, { color: inkColor }]}>
                {pattern.bodyText}
              </Text>
              <Text style={[styles.cardSubtitleText, { color: subtextColor }]}>
                {pattern.subtitleText}
              </Text>
            </View>
          </PatternCard>
        ))}

        {/* ── Bottom Explanatory Text (.pt-foot) ───────────────────────── */}
        <Text style={[styles.bottomExplanatoryText, { color: footnoteColor }]}>
          {"We only share patterns we're reasonably sure about. Tap a card to see the days behind it."}
        </Text>
        </>
        )}

      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 22,
  },

  pressed: {
    opacity: 0.75,
  },

  // ── Header (.sx-nav) ────────────────────────────────────────────────────

  stickyHeader: {
    paddingHorizontal: 22,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 30,
    marginBottom: 13,
  },

  backButton: {
    width: 30,
    height: 30,
    marginLeft: -5,
    alignItems: "center",
    justifyContent: "center",
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
  },

  // .sx-eyebrow: 11px, 600, 0.2em, uppercase
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  // .sx-title: Comfortaa 400, 32px, lineHeight 38px
  mainHeading: {
    fontFamily: Fonts.display.medium,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.3,
  },

  // .pt-sub: flex, gap 18px, margin-top 12px
  subtitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 18,
    marginTop: 12,
  },

  subtitleLeft: {
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: "500",
    flex: 1,
    maxWidth: 190,
  },

  learningSince: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 1.37,
    lineHeight: 14.7,
    textTransform: "uppercase",
    textAlign: "right",
    maxWidth: 118,
    marginTop: 2,
  },

  // ── Cards (.sx-card) ─────────────────────────────────────────────────────

  card: {
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 13,
    // no Android elevation: it shows through the translucent card
    elevation: 0,
  },

  // ── "This week" Card (.pt-week) ──────────────────────────────────────────

  thisWeekCard: {
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 17,
    marginTop: 18,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  thisWeekTitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  thisWeekRightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  sevenDaysText: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 1.37,
    textTransform: "uppercase",
  },

  infoCircleButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  infoCircleText: {
    fontFamily: Fonts.display.regular,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 15,
  },

  tankTooltipPopover: {
    position: "absolute",
    top: 40,
    right: 10,
    width: 248,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingTop: 14,
    paddingBottom: 15,
    borderWidth: 1,
    shadowColor: "#785A5A",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 14,
    zIndex: 100,
  },

  tankTooltipHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 9,
  },

  tankTooltipTitle: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1.26,
    textTransform: "uppercase",
    flex: 1,
  },

  tankTooltipCloseBtn: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  tankTooltipCloseText: {
    fontSize: 18,
    lineHeight: 20,
  },

  tankTooltipBody: {
    fontSize: 13,
    lineHeight: 19.5,
    fontWeight: "400",
  },

  // .pt-chart: grid 7 cols
  daysRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  dayColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },

  dayDotContainer: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  dayDot: {
    shadowColor: "#785046",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 2.5,
  },

  dayLabel: {
    fontSize: 11.5,
    fontWeight: "600",
  },

  // .pt-legend
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 18,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },

  legendText: {
    fontSize: 12,
    fontWeight: "600",
  },

  cardFooterNote: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19.5,
    marginTop: 11,
    marginHorizontal: 2,
  },

  // ── Pattern Cards (.pt-sec) ──────────────────────────────────────────────

  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.76,
    textTransform: "uppercase",
    marginTop: 23,
    marginBottom: 0,
  },

  groupHeaderLabelSpacing: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.76,
    textTransform: "uppercase",
    marginTop: 23,
    marginBottom: 0,
  },

  patternCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    gap: 13,
    marginTop: 9,
  },

  helpBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  costBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTextBlock: {
    flex: 1,
    gap: 7,
  },

  cardBodyText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400",
  },

  cardSubtitleText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "400",
  },

  bottomExplanatoryText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19.5,
    marginTop: 11,
    marginHorizontal: 2,
  },
});
