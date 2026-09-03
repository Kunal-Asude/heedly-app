import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { DawnBackground, EnergyOrb } from "@/components/core";
import { Fonts } from "@/constants/theme";
import { useAppTheme, useThemeMode } from "@/contexts/ThemeContext";

// ─── Feature Row Sub-Component ────────────────────────────────────────────────

function FeatureRow({
  text,
  textColor,
  isOled,
  isDark,
}: {
  text: string;
  textColor: string;
  isOled: boolean;
  isDark: boolean;
}) {
  return (
    <View style={styles.featureRow}>
      <View
        style={[
          styles.checkBadge,
          {
            backgroundColor: isOled
              ? "#2C4235"
              : isDark
                ? "rgba(100, 180, 140, 0.2)"
                : "#529668",
          },
        ]}
      >
        <Text
          style={[
            styles.checkBadgeIcon,
            { color: isOled ? "#9FB8A6" : "#FFFFFF" },
          ]}
        >
          ✓
        </Text>
      </View>
      <Text style={[styles.featureText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const isOled = isDark && isTrueBlack;

  const [selectedPlan, setSelectedPlan] = useState<"annual" | "monthly">("annual");

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSubscribe = () => {
    handleBack();
  };

  // ─── Theme-Aware Colors (Aubade - True Black (OLED).html:1116-1163) ──────────

  const titleMainColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : theme.ink.display;
  const titleAccentColor = isDark ? (isOled ? "#C97B60" : "#E8907A") : "#D9735A";
  const subtitleColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.72)") : "rgba(74, 58, 57, 0.75)";

  const cardBg = isDark ? (isOled ? "#16111B" : "rgba(46, 33, 50, 0.95)") : "rgba(252, 246, 240, 0.96)";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(220, 200, 192, 0.3)";

  const featureTextColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : "#3A2420";

  const planSelectedBg = isDark
    ? (isOled ? "rgba(201, 123, 96, 0.25)" : "rgba(226, 122, 108, 0.14)")
    : "rgba(255, 243, 237, 0.7)";
  const planSelectedBorder = isDark
    ? (isOled ? "rgba(255, 255, 255, 0.08)" : "rgba(226, 122, 108, 0.6)")
    : "#D9735A";

  const planUnselectedBg = isDark ? (isOled ? "#16111B" : "rgba(38, 26, 42, 0.65)") : "#FFFFFF";
  const planUnselectedBorder = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(210, 195, 188, 0.55)";

  const planNameColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : "#3A2420";
  const planPriceColor = isDark ? (isOled ? "#E9DDD6" : "#F3E7E1") : "#3A2420";
  const planSubColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.72)") : "#6E5044";

  // BEST VALUE badge (.pw-tag)
  const bestValueBorder = isDark ? (isOled ? "#6E9678" : "rgba(120, 190, 150, 0.5)") : "transparent";
  const bestValueBg = isDark ? (isOled ? "transparent" : "rgba(100, 180, 140, 0.08)") : "#D9735A";
  const bestValueTextColor = isDark ? (isOled ? "#6E9678" : "#8FB996") : "#FFFFFF";

  // CTA Button (.pw-cta)
  const ctaGradient: [string, string, ...string[]] = isDark
    ? (isOled ? ["#574049", "#241A20"] : ["#634256", "#8A5D7C", "#9E768E"])
    : ["#f0a07e", "#e88970", "#e0735f"];
  const ctaTextColor = isDark ? (isOled ? "#EADCD4" : "#FFF6F1") : "#FFF6F1";
  const ctaArrowColor = isDark ? (isOled ? "#EADCD4" : "#FFF6F1") : "#FFF6F1";

  // Footer & Disclosure (.pw-disclosure & .pw-links)
  const disclaimerColor = isDark ? (isOled ? "#A8979E" : "rgba(199, 180, 191, 0.65)") : "#6E5044";
  const linkColor = isDark ? (isOled ? "#C97B60" : "#E8907A") : "#9B6E5C";
  const linkDotColor = isDark ? (isOled ? "rgba(168,151,158,0.55)" : "rgba(199, 180, 191, 0.45)") : "#907A72";

  return (
    <View style={styles.root}>
      {/* Exact Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ── Hero Orb (.pw-orb) ──────────────────────────────────────── */}
          <View style={styles.orbContainer}>
            <EnergyOrb state="empty" size={137} />
          </View>

          {/* ── Headline (.pw-headline: Comfortaa 500 with "step ahead." accent) ── */}
          <Text style={[styles.mainTitle, { color: titleMainColor }]}>
            Stay a <Text style={{ color: titleAccentColor }}>step ahead.</Text>
          </Text>

          {/* ── Subtitle (.pw-sub) ───────────────────────────────────────── */}
          <Text style={[styles.subtitleText, { color: subtitleColor }]}>
            {"heedly learns your patterns and gives you\na gentle heads-up before a crash."}
          </Text>

          {/* ── Full-Width Bottom Sheet (.pw-sheet) ──────────────────────── */}
          <View
            style={[
              styles.bottomCard,
              {
                backgroundColor: cardBg,
                borderColor: cardBorder,
                shadowOpacity: isOled ? 0 : 0.12,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 24,
              },
            ]}
          >
            {/* ── Feature Bullets (.pw-values) ─────────────────────────── */}
            <View style={styles.featuresList}>
              <FeatureRow text="Crash forecasts 24–72 hours ahead" textColor={featureTextColor} isOled={isOled} isDark={isDark} />
              <FeatureRow text="Patterns learned just for you" textColor={featureTextColor} isOled={isOled} isDark={isDark} />
              <FeatureRow text="Private by default — your data stays yours" textColor={featureTextColor} isOled={isOled} isDark={isDark} />
              <FeatureRow text="No ads." textColor={featureTextColor} isOled={isOled} isDark={isDark} />
            </View>

            {/* ── Annual Plan Option (.pw-plan) ─────────────────────────── */}
            <Pressable
              onPress={() => setSelectedPlan("annual")}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedPlan === "annual" }}
              accessibilityLabel="Annual plan 79.99 per year"
            >
              {isOled && selectedPlan === "annual" ? (
                <LinearGradient
                  colors={["#291D26", "#4A2A30"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.planBox, { borderColor: planSelectedBorder }]}
                >
                  <View style={styles.planLeft}>
                    <View style={[styles.radioOuter, styles.radioOuterSelected, { backgroundColor: "#B85F47" }]}>
                      <Text style={styles.radioCheck}>✓</Text>
                    </View>
                    <View>
                      <View style={styles.planTitleRow}>
                        <Text style={[styles.planName, { color: planNameColor }]}>Annual </Text>
                        <Text style={[styles.planPrice, { color: planPriceColor }]}> $79.99/yr</Text>
                      </View>
                      <Text style={[styles.planSub, { color: planSubColor }]}>about $6.67/mo</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.bestValueBadge,
                      {
                        backgroundColor: bestValueBg,
                        borderColor: bestValueBorder,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text style={[styles.bestValueText, { color: bestValueTextColor }]}>BEST VALUE</Text>
                  </View>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.planBox,
                    {
                      backgroundColor: selectedPlan === "annual" ? planSelectedBg : planUnselectedBg,
                      borderColor: selectedPlan === "annual" ? planSelectedBorder : planUnselectedBorder,
                    },
                  ]}
                >
                  <View style={styles.planLeft}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedPlan === "annual"
                          ? [styles.radioOuterSelected, isOled && { backgroundColor: "#B85F47" }]
                          : [
                              styles.radioOuterUnselected,
                              {
                                backgroundColor: isDark ? "transparent" : "#FFFFFF",
                                borderColor: isOled ? "rgba(255, 255, 255, 0.07)" : (isDark ? "rgba(199, 180, 191, 0.4)" : "rgba(170, 150, 140, 0.5)"),
                              },
                            ],
                      ]}
                    >
                      {selectedPlan === "annual" && (
                        <Text style={styles.radioCheck}>✓</Text>
                      )}
                    </View>
                    <View>
                      <View style={styles.planTitleRow}>
                        <Text style={[styles.planName, { color: planNameColor }]}>Annual </Text>
                        <Text style={[styles.planPrice, { color: planPriceColor }]}> $79.99/yr</Text>
                      </View>
                      <Text style={[styles.planSub, { color: planSubColor }]}>about $6.67/mo</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.bestValueBadge,
                      {
                        backgroundColor: bestValueBg,
                        borderColor: bestValueBorder,
                        borderWidth: isDark ? 1 : 0,
                      },
                    ]}
                  >
                    <Text style={[styles.bestValueText, { color: bestValueTextColor }]}>BEST VALUE</Text>
                  </View>
                </View>
              )}
            </Pressable>

            {/* ── Monthly Plan Option (.pw-plan) ────────────────────────── */}
            <Pressable
              onPress={() => setSelectedPlan("monthly")}
              style={styles.planBoxMonthly}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedPlan === "monthly" }}
              accessibilityLabel="Monthly plan 9.99 per month"
            >
              {isOled && selectedPlan === "monthly" ? (
                <LinearGradient
                  colors={["#291D26", "#4A2A30"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.planBox, { borderColor: planSelectedBorder }]}
                >
                  <View style={styles.planLeft}>
                    <View style={[styles.radioOuter, styles.radioOuterSelected, { backgroundColor: "#B85F47" }]}>
                      <Text style={styles.radioCheck}>✓</Text>
                    </View>
                    <View style={styles.planTitleRow}>
                      <Text style={[styles.planName, { color: planNameColor }]}>Monthly </Text>
                      <Text style={[styles.planPrice, { color: planPriceColor }]}> $9.99/mo</Text>
                    </View>
                  </View>
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.planBox,
                    {
                      backgroundColor: selectedPlan === "monthly" ? planSelectedBg : planUnselectedBg,
                      borderColor: selectedPlan === "monthly" ? planSelectedBorder : planUnselectedBorder,
                    },
                  ]}
                >
                  <View style={styles.planLeft}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedPlan === "monthly"
                          ? [styles.radioOuterSelected, isOled && { backgroundColor: "#B85F47" }]
                          : [
                              styles.radioOuterUnselected,
                              {
                                backgroundColor: isDark ? "transparent" : "#FFFFFF",
                                borderColor: isOled ? "rgba(255, 255, 255, 0.07)" : (isDark ? "rgba(199, 180, 191, 0.4)" : "rgba(170, 150, 140, 0.5)"),
                              },
                            ],
                      ]}
                    >
                      {selectedPlan === "monthly" && (
                        <Text style={styles.radioCheck}>✓</Text>
                      )}
                    </View>
                    <View style={styles.planTitleRow}>
                      <Text style={[styles.planName, { color: planNameColor }]}>Monthly </Text>
                      <Text style={[styles.planPrice, { color: planPriceColor }]}> $9.99/mo</Text>
                    </View>
                  </View>
                </View>
              )}
            </Pressable>

            {/* ── Footer Container (.pw-foot) pushed to bottom ─────────── */}
            <View style={styles.footerContainer}>
              {/* ── CTA Button (.pw-cta) ─────────────────────────────────── */}
              <Pressable
                style={({ pressed }) => [
                  styles.ctaButtonWrapper,
                  isOled && { shadowOpacity: 0 },
                  pressed && styles.ctaPressed,
                ]}
                onPress={handleSubscribe}
                accessibilityRole="button"
                accessibilityLabel="Start my 14 days free"
              >
                <LinearGradient
                  colors={ctaGradient}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[
                    styles.ctaButtonGradient,
                    isOled && { borderWidth: 0, borderColor: "transparent" },
                  ]}
                >
                  <Text style={[styles.ctaText, { color: ctaTextColor }]}>Start my 14 days free</Text>
                  <View style={styles.ctaArrowContainer}>
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M9 5l7 7-7 7"
                        stroke={ctaArrowColor}
                        strokeWidth={2.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </LinearGradient>
              </Pressable>

              {/* ── Disclaimer (.pw-disclosure) ─────────────────────────── */}
              <Text style={[styles.disclaimer, { color: disclaimerColor }]}>
                14 days free, then your plan renews automatically until you cancel. Manage or cancel anytime in the App Store.
              </Text>

              {/* ── Footer Links (.pw-links) ─────────────────────────────── */}
              <View style={styles.linksRow}>
                <Pressable hitSlop={8} style={({ pressed }) => pressed && styles.linkPressed}>
                  <View style={[styles.linkUnderlineWrapper, { borderBottomColor: `${linkColor}80` }]}>
                    <Text style={[styles.link, { color: linkColor }]}>Restore purchases</Text>
                  </View>
                </Pressable>
                <Text style={[styles.linkDot, { color: linkDotColor }]}>·</Text>
                <Pressable hitSlop={8} style={({ pressed }) => pressed && styles.linkPressed}>
                  <View style={[styles.linkUnderlineWrapper, { borderBottomColor: `${linkColor}80` }]}>
                    <Text style={[styles.link, { color: linkColor }]}>Terms</Text>
                  </View>
                </Pressable>
                <Text style={[styles.linkDot, { color: linkDotColor }]}>·</Text>
                <Pressable hitSlop={8} style={({ pressed }) => pressed && styles.linkPressed}>
                  <View style={[styles.linkUnderlineWrapper, { borderBottomColor: `${linkColor}80` }]}>
                    <Text style={[styles.link, { color: linkColor }]}>Privacy</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
  },

  // ── Orb (.pw-orb) ─────────────────────────────────────────────────────────

  orbContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 14,
    overflow: "visible",
  },

  // ── Typography (.pw-headline & .pw-sub) ───────────────────────────────────

  mainTitle: {
    fontFamily: Fonts.display.regular,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.3,
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 0,
  },

  subtitleText: {
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
    marginTop: 9,
    marginBottom: 18,
    paddingHorizontal: 24,
    alignSelf: "center",
    maxWidth: 320,
  },

  // ── Bottom Sheet (.pw-sheet) ──────────────────────────────────────────────

  bottomCard: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },

  // ── Features (.pw-values) ─────────────────────────────────────────────────

  featuresList: {
    gap: 12,
    marginBottom: 18,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  checkBadge: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    alignItems: "center",
    justifyContent: "center",
  },

  checkBadgeIcon: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 12,
  },

  featureText: {
    fontSize: 13.5,
    fontWeight: "500",
    lineHeight: 18,
    flex: 1,
  },

  // ── Plan Options (.pw-plans & .pw-plan) ───────────────────────────────────

  planBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 17,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },

  planBoxMonthly: {
    marginTop: 9,
  },

  planLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    flex: 1,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    borderWidth: 0,
  },

  radioOuterUnselected: {
    borderWidth: 2,
  },

  radioCheck: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 12,
  },

  planTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 9,
  },

  planName: {
    fontSize: 15.5,
    fontWeight: "600",
  },

  planPrice: {
    fontSize: 15.5,
    fontWeight: "600",
  },

  planSub: {
    fontSize: 12.5,
    fontWeight: "500",
    lineHeight: 16,
    marginTop: 3,
  },

  bestValueBadge: {
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  bestValueText: {
    fontSize: 9.5,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },

  // ── Footer Container (.pw-foot) ───────────────────────────────────────────

  footerContainer: {
    marginTop: "auto",
    paddingTop: 18,
  },

  // ── CTA Button (.pw-cta) ──────────────────────────────────────────────────

  ctaButtonWrapper: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },

  ctaButtonGradient: {
    flex: 1,
    borderRadius: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },

  ctaPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF6F1",
  },

  ctaArrowContainer: {
    position: "absolute",
    right: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Footer & Disclosures (.pw-disclosure & .pw-links) ─────────────────────

  disclaimer: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 8,
    marginTop: 12,
    marginBottom: 12,
  },

  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },

  linkPressed: {
    opacity: 0.75,
  },

  linkUnderlineWrapper: {
    borderBottomWidth: 1,
    paddingBottom: 2,
    alignSelf: "center",
  },

  link: {
    fontSize: 12,
    fontWeight: "500",
    textDecorationLine: "none",
    letterSpacing: 0,
  },

  linkDot: {
    fontSize: 12,
  },
});

