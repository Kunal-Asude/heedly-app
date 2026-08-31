import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DawnBackground } from "@/components/core";
import { Fonts } from "@/constants/theme";
import { useAppTheme, useThemeMode } from "@/contexts/ThemeContext";
import { usePatterns } from "@/hooks/data";

// ─── Design Tokens ────────────────────────────────────────────────────────────

const STATE_COLORS = {
  steady: "#8FB996",
  caution: "#ECC880",
  rest: "#E27A6C",
};

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

  const cardGradientColors: [string, string, string] = isDark
    ? ['rgba(50, 35, 54, 0.88)', 'rgba(62, 43, 65, 0.85)', 'rgba(82, 54, 72, 0.82)']
    : ['rgba(252, 246, 240, 0.92)', 'rgba(255, 250, 245, 0.95)', 'rgba(255, 238, 230, 0.95)'];

  return (
    <LinearGradient
      colors={cardGradientColors}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 1, y: 0.7 }}
      style={[
        styles.card,
        {
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.85)',
          shadowColor: isDark ? '#000000' : '#BE968C',
          shadowOpacity: isDark ? 0.24 : 0.08,
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
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const [isTankTooltipVisible, setIsTankTooltipVisible] = useState(false);

  const {
    thisWeekDays,
    helpPatterns,
    costPatterns,
    tankTooltipTitle,
    tankTooltipBody,
  } = usePatterns();

  // Dynamic Theme Colors (Dawn vs Dusk vs True Black / OLED)
  const eyebrowColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.65)"
    : "rgba(74, 58, 57, 0.55)";
  const mainHeadingColor = isDark
    ? isTrueBlack
      ? "#E9DDD6"
      : "#F3E7E1"
    : theme.ink.display;
  const subtitleColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.72)"
    : "rgba(74, 58, 57, 0.75)";
  const learningSinceLabelColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.55)"
    : "rgba(74, 58, 57, 0.5)";
  const learningSinceDateColor = isDark
    ? isTrueBlack
      ? "#E9DDD6"
      : "#F3E7E1"
    : "#4F3C3A";
  const groupHeaderColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.65)"
    : "rgba(74, 58, 57, 0.55)";
  const cardTitleColor = isDark
    ? isTrueBlack
      ? "#E9DDD6"
      : "#F3E7E1"
    : "#4F3C3A";
  const bodyTextColor = isDark
    ? isTrueBlack
      ? "#E9DDD6"
      : "#F3E7E1"
    : "#4F3C3A";
  const subtextColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.68)"
    : "rgba(74, 58, 57, 0.62)";
  const legendTextColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.8)"
    : "rgba(74, 58, 57, 0.75)";
  const footnoteColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.65)"
    : "rgba(74, 58, 57, 0.6)";


  return (
    <View style={styles.root}>
      {/* Atmosphere Background */}
      <DawnBackground />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Back Chevron (.sx-nav) ──────────────────────────────────── */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => router.replace("/(tabs)")}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Today"
          >
            <Text style={[styles.backChevron, { color: isDark ? theme.ink.muted : "rgba(74, 58, 57, 0.62)" }]}>‹</Text>
          </Pressable>
        </View>

        {/* ── Section Label & Heading (.sx-eyebrow & .sx-title) ────────── */}
        <Text style={[styles.sectionLabel, { color: eyebrowColor }]}>PATTERNS</Text>

        <Text style={[styles.mainHeading, { color: mainHeadingColor }]}>
          {"What we've noticed"}
        </Text>

        {/* ── Subtitle Block (.pt-sub) ─────────────────────────────────── */}
        <View style={styles.subtitleRow}>
          <Text style={[styles.subtitleLeft, { color: subtitleColor }]}>
            {"A few small things we're\nlearning about you."}
          </Text>
          <View style={styles.subtitleRightContainer}>
            <Text style={[styles.subtitleRightLabel, { color: learningSinceLabelColor }]}>
              LEARNING SINCE
            </Text>
            <Text style={[styles.subtitleRightDate, { color: learningSinceDateColor }]}>
              MARCH 14
            </Text>
          </View>
        </View>

        {/* ── "This week" 7-Day Card (.pt-week) ────────────────────────── */}
        <PatternCard isDark={isDark} isTrueBlack={isTrueBlack} style={styles.thisWeekCard}>
          {/* Card Header */}
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.thisWeekTitle, { color: cardTitleColor }]}>This week</Text>
            <View style={styles.thisWeekRightHeader}>
              <Text style={[styles.sevenDaysText, { color: eyebrowColor }]}>7 DAYS</Text>
              <Pressable
                onPress={() => setIsTankTooltipVisible(!isTankTooltipVisible)}
                style={({ pressed }) => [
                  styles.infoCircleButton,
                  {
                    borderColor: isDark
                      ? isTankTooltipVisible
                        ? "rgba(226, 122, 108, 0.6)"
                        : isTrueBlack
                        ? "rgba(255, 255, 255, 0.18)"
                        : "rgba(199, 180, 191, 0.35)"
                      : isTankTooltipVisible
                      ? "rgba(224, 115, 95, 0.6)"
                      : "rgba(74, 58, 57, 0.28)",
                    backgroundColor: isTankTooltipVisible
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
                          ? "#E8907A"
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
                    { color: isDark ? (isTrueBlack ? "#9A8A91" : "rgba(199, 180, 191, 0.75)") : "rgba(74, 58, 57, 0.7)" },
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
                  { color: isDark ? (isTrueBlack ? "#E9DDD6" : "rgba(199, 180, 191, 0.92)") : "rgba(74, 58, 57, 0.8)" },
                ]}
              >
                {tankTooltipBody}
              </Text>
            </View>
          )}

          {/* 7-Day Circles Row (.pt-chart) */}
          <View style={styles.daysRow}>
            {thisWeekDays.map((dayItem, index) => {
              const dotColor =
                dayItem.type === "steady"
                  ? isDark && isTrueBlack
                    ? "#6E9678"
                    : STATE_COLORS.steady
                  : dayItem.type === "caution"
                  ? isDark && isTrueBlack
                    ? "#C29A5F"
                    : STATE_COLORS.caution
                  : isDark && isTrueBlack
                  ? "#BE6A5C"
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
                  <Text style={[styles.dayLabel, { color: isDark ? (isTrueBlack ? "#9A8A91" : "rgba(199, 180, 191, 0.65)") : "rgba(74, 58, 57, 0.55)" }]}>
                    {dayItem.day}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Legend Row (.pt-legend) */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: isDark && isTrueBlack ? "#6E9678" : STATE_COLORS.steady }]} />
              <Text style={[styles.legendText, { color: legendTextColor }]}>Steady</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: isDark && isTrueBlack ? "#C29A5F" : STATE_COLORS.caution }]} />
              <Text style={[styles.legendText, { color: legendTextColor }]}>Caution</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: isDark && isTrueBlack ? "#BE6A5C" : STATE_COLORS.rest }]} />
              <Text style={[styles.legendText, { color: legendTextColor }]}>Rest day</Text>
            </View>
          </View>

          {/* Card Footer Note */}
          <Text style={[styles.cardFooterNote, { color: subtextColor }]}>
            Bigger dot = more energy.
          </Text>
          <Text style={[styles.cardFooterSecondary, { color: subtextColor }]}>
            Your tank reflects your recent weeks, not a fixed ceiling.
          </Text>
        </PatternCard>

        {/* ── "WHAT SEEMS TO HELP" Section (.pt-sec) ───────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>
          WHAT SEEMS TO HELP
        </Text>

        {helpPatterns.map((pattern) => (
          <PatternCard
            key={pattern.id}
            isDark={isDark}
            isTrueBlack={isTrueBlack}
            style={styles.patternCard}
          >
            <View
              style={[
                styles.helpBadge,
                {
                  backgroundColor: isDark
                    ? isTrueBlack
                      ? "#2C4235"
                      : "#3E5D47"
                    : "rgba(126, 155, 106, 0.18)",
                  borderColor: isDark && isTrueBlack ? "rgba(255, 255, 255, 0.07)" : "transparent",
                  borderWidth: isDark && isTrueBlack ? 1 : 0,
                },
              ]}
            >
              <SymbolView
                name={pattern.icon === "moon.fill" ? "moon" : "clock"}
                size={17}
                tintColor={isDark ? (isTrueBlack ? "#9FB8A6" : "#E0F2E6") : "#5d7a52"}
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={[styles.cardBodyText, { color: bodyTextColor }]}>
                {pattern.bodyText}
              </Text>
              <Text style={[styles.cardSubtitleText, { color: subtextColor }]}>
                {pattern.subtitleText}
              </Text>
            </View>
          </PatternCard>
        ))}

        {/* ── "WHAT SEEMS TO COST YOU" Section (.pt-sec) ───────────────── */}
        <Text style={[styles.groupHeaderLabelSpacing, { color: groupHeaderColor }]}>
          WHAT SEEMS TO COST YOU
        </Text>

        {costPatterns.map((pattern) => (
          <PatternCard
            key={pattern.id}
            isDark={isDark}
            isTrueBlack={isTrueBlack}
            style={styles.patternCard}
          >
            <View
              style={[
                styles.costBadge,
                {
                  backgroundColor: isDark
                    ? isTrueBlack
                      ? "#3D2526"
                      : "#784436"
                    : "rgba(224, 115, 95, 0.18)",
                  borderColor: isDark && isTrueBlack ? "rgba(255, 255, 255, 0.07)" : "transparent",
                  borderWidth: isDark && isTrueBlack ? 1 : 0,
                },
              ]}
            >
              <SymbolView
                name={
                  pattern.icon === "person.2.fill"
                    ? "person.2"
                    : pattern.icon === "bolt.fill"
                    ? "bolt"
                    : "sun.max"
                }
                size={17}
                tintColor={isDark ? (isTrueBlack ? "#C97B60" : "#FFF0EB") : "#b0532f"}
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={[styles.cardBodyText, { color: bodyTextColor }]}>
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

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 36,
    marginBottom: 12,
  },

  backButton: {
    width: 36,
    height: 36,
    marginLeft: -6,
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
    marginBottom: 6,
  },

  // .sx-title: Comfortaa 400, 32px, lineHeight 38px
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    marginBottom: 8,
  },

  // .pt-sub: flex, gap 18px, margin-top 12px
  subtitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },

  subtitleLeft: {
    fontSize: 14.5,
    lineHeight: 21,
    flex: 1,
  },

  subtitleRightContainer: {
    alignItems: "flex-end",
    gap: 2,
    marginTop: 2,
  },

  subtitleRightLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },

  subtitleRightDate: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // ── Cards (.sx-card) ─────────────────────────────────────────────────────

  card: {
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 3,
  },

  // ── "This week" Card (.pt-week) ──────────────────────────────────────────

  thisWeekCard: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 20,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  thisWeekTitle: {
    fontSize: 18.5,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  thisWeekRightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sevenDaysText: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 1.4,
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
    top: 48,
    right: 14,
    width: 275,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.42,
    shadowRadius: 30,
    elevation: 14,
    zIndex: 100,
  },

  tankTooltipHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  tankTooltipTitle: {
    fontSize: 10.5,
    fontWeight: "700",
    letterSpacing: 1.2,
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
    fontSize: 14,
  },

  tankTooltipBody: {
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: "400",
  },

  // .pt-chart: grid 7 cols
  daysRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    height: 52,
    marginBottom: 14,
  },

  dayColumn: {
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    width: 36,
  },

  dayDotContainer: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  dayDot: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },

  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
  },

  // .pt-legend
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
    marginVertical: 10,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  legendText: {
    fontSize: 12.5,
    fontWeight: "500",
  },

  cardFooterNote: {
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 19.5,
    marginTop: 4,
  },

  cardFooterSecondary: {
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 19.5,
    marginTop: 4,
  },

  // ── Pattern Cards (.pt-sec) ──────────────────────────────────────────────

  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginTop: 18,
    marginBottom: 10,
    paddingLeft: 4,
  },

  groupHeaderLabelSpacing: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginTop: 22,
    marginBottom: 10,
    paddingLeft: 4,
  },

  patternCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
    marginBottom: 12,
  },

  helpBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  costBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  cardTextBlock: {
    flex: 1,
    gap: 6,
  },

  cardBodyText: {
    fontSize: 14.5,
    lineHeight: 21,
    fontWeight: "500",
  },

  cardSubtitleText: {
    fontSize: 12.5,
    fontWeight: "400",
  },

  bottomExplanatoryText: {
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 16,
    paddingHorizontal: 4,
  },
});
