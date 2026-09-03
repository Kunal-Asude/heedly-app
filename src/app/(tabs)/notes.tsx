import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
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
import { useNotes } from "@/hooks/data";

// ─── Notes Card Component (.sx-card / .nt-card) ───────────────────────────────

function NotesCard({
  children,
  isDark,
  isTrueBlack,
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
            backgroundColor: "#16111B",
            borderColor: "rgba(255, 255, 255, 0.07)",
            shadowOpacity: 0,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  const cardGradientColors: [string, string, string] = isDark
    ? ["rgba(50, 35, 54, 0.88)", "rgba(62, 43, 65, 0.85)", "rgba(82, 54, 72, 0.82)"]
    : ["rgba(252, 246, 240, 0.92)", "rgba(255, 250, 245, 0.95)", "rgba(255, 238, 230, 0.95)"];

  return (
    <LinearGradient
      colors={cardGradientColors}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 1, y: 0.7 }}
      style={[
        styles.card,
        {
          borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.85)",
          shadowColor: isDark ? "#000000" : "#BE968C",
          shadowOpacity: isDark ? 0.24 : 0.08,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();

  const {
    userName,
    dateRange,
    totalCheckInsCount,
    metrics,
    triggers,
    summaryParagraph,
    generatedDateText,
  } = useNotes();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/patterns" as any);
    }
  };

  // ── Theme-aware tokens matching Aubade - True Black (OLED).html ──────────────
  const isOled = isDark && isTrueBlack;

  const eyebrowColor = isDark ? (isOled ? "#9A8A91" : "rgba(199, 180, 191, 0.65)") : "rgba(74, 58, 57, 0.55)";
  const mainHeadingColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : theme.ink.display;
  const subtitleColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.72)") : "rgba(74, 58, 57, 0.75)";
  const cardHeaderLabelColor = isDark ? (isOled ? "#9A8A91" : "rgba(199, 180, 191, 0.6)") : "rgba(74, 58, 57, 0.5)";
  const userNameColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : theme.ink.display;
  const cardHeaderDateColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.85)") : "rgba(74, 58, 57, 0.74)";
  const checkInsCountColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.6)") : "rgba(74, 58, 57, 0.58)";

  // Metric tiles (.nt-tile)
  const metricBoxBg = isDark ? (isOled ? "#16111B" : "rgba(112, 72, 94, 0.65)") : "#f8d9bf";
  const metricBoxBorder = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(255, 255, 255, 0.6)";
  const metricLabelColor = isDark ? (isOled ? "#9A8A91" : "#FFFFFF") : "rgba(120, 72, 48, 0.72)";
  const metricValueColor = isDark ? (isOled ? "#E9DDD6" : "#FFFFFF") : "#463130";
  const metricSubtextColor = isDark ? (isOled ? "#9A8A91" : "#FFFFFF") : "rgba(74, 58, 57, 0.6)";

  // Top triggers (.nt-trig)
  const groupHeaderColor = isDark ? (isOled ? "#9A8A91" : "rgba(199, 180, 191, 0.65)") : "rgba(74, 58, 57, 0.55)";
  const triggerTitleColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : theme.ink.display;
  const triggerSubtitleColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.65)") : "rgba(74, 58, 57, 0.6)";
  const impactTextColor = isDark ? (isOled ? "#C97B60" : "#E8907A") : "#b6634a";
  const dividerColor = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(120, 90, 80, 0.13)";

  // Summary (.nt-card--summary)
  const summaryTextColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.9)") : "rgba(74, 58, 57, 0.82)";
  const disclaimerTextColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.55)") : "rgba(74, 58, 57, 0.6)";
  const personalNoteColor = isDark ? (isOled ? "#C97B60" : "#E8907A") : theme.coral.terracotta;

  // Floating actions bar (.nt-actions)
  const bottomPanelBg = isDark ? (isOled ? "#16111B" : "rgba(38, 26, 42, 0.92)") : "rgba(255, 255, 255, 0.75)";
  const bottomPanelBorder = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(255, 255, 255, 0.85)";
  const ctaGradient: [string, string, ...string[]] = isDark
    ? (isOled ? ["#574049", "#241A20"] : ["#634256", "#8A5D7C", "#9E768E"])
    : ["#f0a07e", "#e88970", "#e0735f"];
  const ctaTextColor = isDark ? (isOled ? "#EADCD4" : "#FFF6F1") : "#FFF6F1";
  const ghostBtnBg = isDark ? (isOled ? "#16111B" : "rgba(72, 48, 62, 0.7)") : "rgba(255, 255, 255, 0.75)";
  const ghostBtnBorder = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(255, 255, 255, 0.85)";
  const ghostBtnTextColor = isDark ? (isOled ? "#A8979E" : "#FFF6F1") : "#4f3c3a";
  const ghostBtnIconColor = isDark ? (isOled ? "#C97B60" : "#FFF6F1") : "#4f3c3a";

  return (
    <View style={styles.root}>
      {/* Atmosphere Background */}
      <DawnBackground />

      {/* Top Fade mask in OLED mode (.nt-topfade) */}
      {isOled && (
        <LinearGradient
          colors={["#000000", "rgba(0,0,0,0.82)", "rgba(0,0,0,0)"]}
          style={[styles.topFade, { height: insets.top + 28 }]}
          pointerEvents="none"
        />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 160 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Back Chevron (.sx-nav) ─────────────────────────────────── */}
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={[styles.backChevron, { color: isDark ? (isOled ? "#9A8A91" : theme.ink.muted) : "rgba(74, 58, 57, 0.62)" }]}>‹</Text>
          </Pressable>
        </View>

        {/* ── Category Label & Heading (.nt-eyebrow & .nt-title) ─────── */}
        <Text style={[styles.categoryLabel, { color: eyebrowColor }]}>FOR YOUR APPOINTMENT</Text>

        <Text style={[styles.mainHeading, { color: mainHeadingColor }]}>Your notes</Text>

        <Text style={[styles.subtitleText, { color: subtitleColor }]}>
          {"Everything you've been living, now on one page."}
        </Text>

        {/* ── 90-DAY SUMMARY Card (.nt-card) ─────────────────────────── */}
        <NotesCard isDark={isDark} isTrueBlack={isTrueBlack} style={styles.summary90Card}>
          {/* Header Row (.nt-card-head) */}
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={[styles.cardHeaderLabel, { color: cardHeaderLabelColor }]}>
                90-DAY SUMMARY
              </Text>
              <Text style={[styles.userNameText, { color: userNameColor }]}>
                {userName}
              </Text>
            </View>
            <View style={styles.metaRight}>
              <Text style={[styles.cardHeaderDate, { color: cardHeaderDateColor }]}>
                {dateRange}
              </Text>
              <Text style={[styles.checkInsText, { color: checkInsCountColor }]}>
                {totalCheckInsCount} daily check-ins
              </Text>
            </View>
          </View>

          {/* 3 Metric Tiles Row (.nt-tiles) */}
          <View style={styles.metricsRow}>
            {metrics.map((metric, idx) => (
              <View
                key={idx}
                style={[
                  styles.metricBox,
                  {
                    backgroundColor: metricBoxBg,
                    borderColor: metricBoxBorder,
                  },
                ]}
              >
                <Text style={[styles.metricLabel, { color: metricLabelColor }]}>
                  {metric.label}
                </Text>
                <Text
                  style={[
                    styles.metricValue,
                    { color: metricValueColor },
                    metric.value.length > 4 && { fontSize: 18 },
                  ]}
                >
                  {metric.value}
                </Text>
                <Text style={[styles.metricSubtext, { color: metricSubtextColor }]}>
                  {metric.subtext}
                </Text>
              </View>
            ))}
          </View>
        </NotesCard>

        {/* ── TOP TRIGGERS Section (.nt-sec--sp) ─────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>TOP TRIGGERS</Text>

        <View style={styles.triggersBlock}>
          {triggers.map((trigger, index) => (
            <View key={trigger.id}>
              <View style={styles.triggerRow}>
                <View style={styles.triggerLeftBlock}>
                  <Text style={[styles.triggerTitle, { color: triggerTitleColor }]}>
                    {trigger.title}
                  </Text>
                  <Text style={[styles.triggerSubtitle, { color: triggerSubtitleColor }]}>
                    {trigger.subtitle}
                  </Text>
                </View>
                <Text style={[styles.impactText, { color: impactTextColor }]}>
                  {trigger.impactText}
                </Text>
              </View>
              {index < triggers.length - 1 && (
                <View style={[styles.divider, { backgroundColor: dividerColor }]} />
              )}
            </View>
          ))}
        </View>

        {/* ── SUMMARY Section (.nt-sec--summary & .nt-card--summary) ──── */}
        <Text style={[styles.groupHeaderLabelSpacing, { color: groupHeaderColor }]}>SUMMARY</Text>

        <NotesCard isDark={isDark} isTrueBlack={isTrueBlack} style={styles.summaryCard}>
          <Text style={[styles.summaryParagraphText, { color: summaryTextColor }]}>
            {summaryParagraph}
          </Text>
        </NotesCard>

        {/* Provenance note (.nt-prov) */}
        <Text style={[styles.disclaimerText, { color: disclaimerTextColor }]}>
          {generatedDateText}
        </Text>

        {/* ── Personal Note Link (.nt-addnote) ───────────────────────── */}
        <Pressable
          style={({ pressed }) => [styles.personalNoteContainer, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Add a personal note"
        >
          <Text style={[styles.personalNoteText, { color: personalNoteColor }]}>
            Add a personal note ›
          </Text>
        </Pressable>
      </ScrollView>

      {/* ── Sticky Floating Bottom Action Panel (.nt-actions) ────────── */}
      <View
        style={[
          styles.bottomPanel,
          {
            bottom: insets.bottom > 0 ? insets.bottom + 8 : 20,
            backgroundColor: bottomPanelBg,
            borderColor: bottomPanelBorder,
            shadowOpacity: isOled ? 0 : 0.35,
          },
        ]}
      >
        {/* Main Appointment Button (.nt-primary) */}
        <Pressable
          style={({ pressed }) => [styles.appointmentButtonWrapper, pressed && styles.buttonPressed]}
          onPress={() => router.push("/paywall" as any)}
          accessibilityRole="button"
          accessibilityLabel="Prepare for my appointment"
        >
          <LinearGradient
            colors={ctaGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.appointmentButtonGradient}
          >
            <SymbolView name="calendar" size={18} tintColor={ctaTextColor} />
            <Text style={[styles.appointmentButtonText, { color: ctaTextColor }]}>Prepare for my appointment</Text>
          </LinearGradient>
        </Pressable>

        {/* Secondary Action Row: Export / Share & Copy Link (.nt-ghost) */}
        <View style={styles.secondaryActionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                backgroundColor: ghostBtnBg,
                borderColor: ghostBtnBorder,
              },
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Export / Share"
          >
            <SymbolView
              name="square.and.arrow.up"
              size={15}
              tintColor={ghostBtnIconColor}
            />
            <Text style={[styles.secondaryBtnText, { color: ghostBtnTextColor }]}>
              Export / Share
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              {
                backgroundColor: ghostBtnBg,
                borderColor: ghostBtnBorder,
              },
              pressed && styles.buttonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Copy link"
          >
            <SymbolView
              name="link"
              size={15}
              tintColor={ghostBtnIconColor}
            />
            <Text style={[styles.secondaryBtnText, { color: ghostBtnTextColor }]}>
              Copy link
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  // ── Top Header (.sx-nav) ─────────────────────────────────────────────────

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    height: 36,
    marginBottom: 8,
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

  // .nt-eyebrow: 11px, 600, 0.2em, uppercase
  categoryLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  // .nt-title: Comfortaa 400, 32px, lineHeight 38px
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    marginBottom: 6,
  },

  // .nt-sub: 14.5px, 1.5
  subtitleText: {
    fontSize: 14.5,
    lineHeight: 21,
    marginBottom: 18,
  },

  // ── Cards (.sx-card) ─────────────────────────────────────────────────────

  card: {
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 3,
  },

  // ── 90-Day Summary Card (.nt-card) ───────────────────────────────────────

  summary90Card: {
    padding: 18,
    marginBottom: 20,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },

  cardHeaderLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  userNameText: {
    fontSize: 19.5,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginTop: 4,
  },

  metaRight: {
    alignItems: "flex-end",
  },

  cardHeaderDate: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },

  checkInsText: {
    fontSize: 11.5,
    fontWeight: "500",
    lineHeight: 18,
  },

  // ── 3 Metric Tiles (.nt-tiles & .nt-tile) ─────────────────────────────────

  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 18,
  },

  metricBox: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "flex-start",
  },

  metricLabel: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  metricValue: {
    fontSize: 23,
    fontWeight: "700",
    letterSpacing: -0.4,
    lineHeight: 26,
  },

  metricSubtext: {
    fontSize: 11.5,
    fontWeight: "500",
    marginTop: 6,
  },

  // ── Top Triggers (.nt-sec--sp & .nt-trig) ─────────────────────────────────

  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginTop: 6,
    marginBottom: 6,
    paddingLeft: 2,
  },

  groupHeaderLabelSpacing: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
    paddingLeft: 2,
  },

  triggersBlock: {
    marginBottom: 8,
  },

  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 14,
  },

  triggerLeftBlock: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },

  triggerTitle: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  triggerSubtitle: {
    fontSize: 13,
    fontWeight: "400",
  },

  impactText: {
    fontSize: 12.5,
    fontWeight: "600",
  },

  divider: {
    height: 1,
  },

  // ── Summary Card (.nt-card--summary) ─────────────────────────────────────

  summaryCard: {
    padding: 18,
    marginBottom: 14,
  },

  summaryParagraphText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: "400",
  },

  disclaimerText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
    marginBottom: 18,
    paddingHorizontal: 2,
  },

  personalNoteContainer: {
    alignSelf: "center",
    paddingVertical: 6,
    marginBottom: 12,
  },

  personalNoteText: {
    fontSize: 14.5,
    fontWeight: "600",
  },

  // ── Floating Action Panel (.nt-actions) ───────────────────────────────────

  bottomPanel: {
    position: "absolute",
    left: 18,
    right: 18,
    zIndex: 20,
    padding: 10,
    borderRadius: 24,
    borderWidth: 1,
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },

  appointmentButtonWrapper: {
    width: "100%",
    height: 52,
    borderRadius: 26,
  },

  appointmentButtonGradient: {
    flex: 1,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  appointmentButtonText: {
    color: "#FFF6F1",
    fontSize: 15.5,
    fontWeight: "600",
  },

  secondaryActionsRow: {
    flexDirection: "row",
    gap: 8,
  },

  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
