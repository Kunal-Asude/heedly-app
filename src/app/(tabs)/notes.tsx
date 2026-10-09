import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "@/components/ui/symbol";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DawnBackground, EmptyState } from "@/components/core";
import { Fonts } from "@/constants/theme";
import { useCheckIn } from "@/contexts/CheckInContext";
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

  // .nt-card: #fffcf8c4 (light), #2E2738 (Dusk)
  const cardGradientColors: [string, string, string] = isDark
    ? ["#2E2738", "#2E2738", "#2E2738"]
    : ["rgba(255, 252, 248, 0.77)", "rgba(255, 252, 248, 0.77)", "rgba(255, 252, 248, 0.77)"];

  return (
    <LinearGradient
      colors={cardGradientColors}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 1, y: 0.7 }}
      style={[
        styles.card,
        {
          borderColor: isDark ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.85)",
          shadowColor: isDark ? "#000000" : "#BE968C",
          shadowOpacity: isDark ? 0.29 : 0.16,
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
  // The action panel floats over the screen; the scroll area stops at its top edge.
  const panelBottom = insets.bottom > 0 ? insets.bottom + 8 : 20;
  const [panelHeight, setPanelHeight] = useState(0);
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const { isHydrating, hasEverCheckedIn } = useCheckIn();
  const showEmptyState = !isHydrating && !hasEverCheckedIn;

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

  const eyebrowColor = isDark ? (isOled ? "#9A8A91" : "rgba(199, 180, 191, 0.68)") : "rgba(74, 58, 57, 0.5)";
  const mainHeadingColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : theme.ink.display;
  const subtitleColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 1)") : "rgba(74, 58, 57, 0.78)";
  const cardHeaderLabelColor = isDark ? (isOled ? "#9A8A91" : "rgba(199, 180, 191, 0.68)") : "rgba(74, 58, 57, 0.5)";
  const userNameColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : theme.ink.display;
  const cardHeaderDateColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 1)") : "rgba(74, 58, 57, 0.74)";
  const checkInsCountColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.78)") : "rgba(74, 58, 57, 0.58)";

  // Metric tiles (.nt-tile)
  const metricBoxBg = isDark ? (isOled ? "#16111B" : "rgba(112, 72, 94, 0.65)") : "#f8d9bf";
  // OLED .screen .nt-tile: #16111B with a 1px rgba(255,255,255,0.07) border
  const metricBoxBorder = isOled ? "rgba(255, 255, 255, 0.07)" : "transparent";
  const metricLabelColor = isDark ? (isOled ? "#9A8A91" : "#F3E7E1") : "rgba(120, 72, 48, 0.72)";
  const metricValueColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : "#463130";
  const metricSubtextColor = isDark ? (isOled ? "#9A8A91" : "#F3E7E1") : "rgba(74, 58, 57, 0.6)";

  // Top triggers (.nt-trig)
  const groupHeaderColor = isDark ? (isOled ? "#9A8A91" : "rgba(199, 180, 191, 0.68)") : "rgba(74, 58, 57, 0.5)";
  const triggerTitleColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : theme.ink.display;
  const triggerSubtitleColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.81)") : "rgba(74, 58, 57, 0.6)";
  const impactTextColor = isDark ? (isOled ? "#C97B60" : "#E8907A") : "#b6634a";
  const dividerColor = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(120, 90, 80, 0.13)";

  // Summary (.nt-card--summary)
  const summaryTextColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 1)") : "rgba(74, 58, 57, 0.82)";
  const disclaimerTextColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.81)") : "rgba(74, 58, 57, 0.6)";
  const personalNoteColor = isDark ? (isOled ? "#C97B60" : "#E8907A") : "#b0532f";

  // Floating actions bar (.nt-actions)
  const bottomPanelBg = isDark ? (isOled ? "#16111B" : "rgba(51, 37, 56, 0.72)") : "rgba(255, 255, 255, 0.5)";
  const bottomPanelBorder = isDark ? (isOled ? "rgba(255, 255, 255, 0.07)" : "rgba(199, 180, 191, 0.14)") : "rgba(255, 255, 255, 0.65)";
  const ctaGradient: [string, string, ...string[]] = isDark
    ? (isOled ? ["#574049", "#241A20"] : ["#634256", "#8A5D7C", "#9E768E"])
    : ["#f4a47e", "#ea846a", "#e0735f"];
  const ctaTextColor = isDark ? (isOled ? "#EADCD4" : "#FFF6F1") : "#FFF8F4";
  const ghostBtnBg = isDark ? (isOled ? "#16111B" : "rgba(74, 57, 80, 0.85)") : "rgba(255, 255, 255, 0.46)";
  const ghostBtnBorder = "transparent";
  const ghostBtnTextColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.97)") : "rgba(74, 58, 57, 0.72)";
  const ghostBtnIconColor = isDark ? (isOled ? "#C97B60" : "#E8907A") : "#c0764f";

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

      {/* ── Back header — fixed; content scrolls out of view below it ── */}
      <View style={[styles.stickyHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <SymbolView name="chevron.left" size={22} tintColor={isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.84)") : "rgba(74, 58, 57, 0.62)"} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={[styles.scrollView, { marginBottom: panelBottom + panelHeight + 12 }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 24 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Category Label & Heading (.nt-eyebrow & .nt-title) ─────── */}
        <Text style={[styles.categoryLabel, { color: eyebrowColor }]}>FOR YOUR APPOINTMENT</Text>

        <Text style={[styles.mainHeading, { color: mainHeadingColor }]}>Your notes</Text>

        <Text style={[styles.subtitleText, { color: subtitleColor }]}>
          {"Everything you've been living, now on one page."}
        </Text>

        {showEmptyState ? (
          <EmptyState
            title="Nothing to bring yet."
            body={"Once you've checked in for a few days, your notes will collect here — ready to take to an appointment."}
          />
        ) : (
        <>
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
                {totalCheckInsCount === null ? "" : `${totalCheckInsCount} daily check-ins`}
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
                    borderWidth: isOled ? 1 : 0,
                  },
                ]}
              >
                {!isOled && (
                  <LinearGradient
                    colors={isDark ? ["#634256", "#8A5D7C", "#9E768E"] : ["#f8d9bf", "#f3c7a6"]}
                    start={isDark ? { x: 0, y: 0.5 } : { x: 0.35, y: 0 }}
                    end={isDark ? { x: 1, y: 0.5 } : { x: 0.65, y: 1 }}
                    style={styles.metricFill}
                  />
                )}
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
        </>
        )}
      </ScrollView>

      {/* ── Sticky Floating Bottom Action Panel (.nt-actions) ────────── */}
      <View
        onLayout={(e) => setPanelHeight(e.nativeEvent.layout.height)}
        style={[
          styles.bottomPanel,
          {
            bottom: panelBottom,
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
            <SymbolView name="calendar" size={19} tintColor={ctaTextColor} />
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
              size={17}
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
              size={17}
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

  // .nt-eyebrow: 11px, 600, 0.2em, uppercase
  categoryLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  // .nt-title: Comfortaa 400, 32px, lineHeight 38px
  mainHeading: {
    fontFamily: Fonts.display.medium,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.3,
  },

  // .nt-sub: 14.5px, 1.5
  subtitleText: {
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 12,
    maxWidth: 260,
  },

  // ── Cards (.sx-card) ─────────────────────────────────────────────────────

  card: {
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 13,
    elevation: 0,
  },

  // ── 90-Day Summary Card (.nt-card) ───────────────────────────────────────

  summary90Card: {
    padding: 18,
    marginTop: 22,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },

  cardHeaderLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.76,
    textTransform: "uppercase",
  },

  userNameText: {
    fontFamily: Fonts.display.medium,
    fontSize: 19,
    lineHeight: 23,
    marginTop: 6,
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
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },

  // ── 3 Metric Tiles (.nt-tiles & .nt-tile) ─────────────────────────────────

  metricsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  metricBox: {
    flex: 1,
    borderRadius: 16,
    paddingTop: 13,
    paddingHorizontal: 13,
    paddingBottom: 14,
    alignItems: "flex-start",
    overflow: "hidden",
  },

  metricFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // .nt-tile-label: 9.5px, 600, letter-spacing 0.13em
  metricLabel: {
    fontSize: 9.5,
    fontWeight: "600",
    letterSpacing: 1.24,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  metricValue: {
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: -0.32,
    lineHeight: 23,
  },

  metricSubtext: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 7,
  },

  // ── Top Triggers (.nt-sec--sp & .nt-trig) ─────────────────────────────────

  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.76,
    textTransform: "uppercase",
    marginTop: 26,
    marginBottom: 6,
  },

  groupHeaderLabelSpacing: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.76,
    textTransform: "uppercase",
    marginTop: 26,
    marginBottom: 8,
  },

  triggersBlock: {
    marginBottom: 0,
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
    gap: 4,
  },

  triggerTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  triggerSubtitle: {
    fontSize: 12.5,
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
  },

  summaryParagraphText: {
    fontSize: 13.5,
    lineHeight: 22,
    fontWeight: "400",
  },

  disclaimerText: {
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: "500",
    marginTop: 20,
  },

  personalNoteContainer: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 4,
    marginTop: 26,
  },

  personalNoteText: {
    fontSize: 14.5,
    fontWeight: "600",
  },

  // ── Floating Action Panel (.nt-actions) ───────────────────────────────────

  bottomPanel: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 20,
    padding: 12,
    borderRadius: 26,
    borderWidth: 1,
    gap: 10,
    shadowColor: "#B48282",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 15,
    // no Android elevation: it shows through the translucent panel
    elevation: 0,
  },

  appointmentButtonWrapper: {
    width: "100%",
    height: 52,
    borderRadius: 17,
  },

  appointmentButtonGradient: {
    flex: 1,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  appointmentButtonText: {
    color: "#FFF8F4",
    fontSize: 15.5,
    fontWeight: "600",
    letterSpacing: -0.16,
  },

  secondaryActionsRow: {
    flexDirection: "row",
    gap: 10,
  },

  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  secondaryBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
  },
});
