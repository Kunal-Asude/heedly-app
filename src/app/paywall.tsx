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

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
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

  // ─── Theme-Aware Colors ─────────────────────────────────────────────────────

  const titleMainColor = isDark ? "#F3E7E1" : theme.ink.display;
  const titleAccentColor = isDark ? (isTrueBlack ? "#C97B60" : "#E8907A") : "#D9735A";
  const subtitleColor = isDark ? "rgba(199, 180, 191, 0.72)" : "rgba(74, 58, 57, 0.75)";

  const cardBg = isDark ? "rgba(46, 33, 50, 0.95)" : "rgba(252, 246, 240, 0.96)";
  const cardBorder = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(220, 200, 192, 0.3)";

  const featureTextColor = isDark ? "#F3E7E1" : "#3A2420";

  const planSelectedBg = isDark ? "rgba(226, 122, 108, 0.14)" : "rgba(255, 243, 237, 0.7)";
  const planSelectedBorder = isDark ? "rgba(226, 122, 108, 0.6)" : "#D9735A";

  const planUnselectedBg = isDark ? "rgba(38, 26, 42, 0.65)" : "#FFFFFF";
  const planUnselectedBorder = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(210, 195, 188, 0.55)";

  const planNameColor = isDark ? "#F3E7E1" : "#3A2420";
  const planPriceColor = isDark ? "#F3E7E1" : "#3A2420";
  const planSubColor = isDark ? "rgba(199, 180, 191, 0.72)" : "#6E5044";

  const bestValueBorder = isDark ? "rgba(120, 190, 150, 0.5)" : "transparent";
  const bestValueBg = isDark ? "rgba(100, 180, 140, 0.08)" : "#D9735A";
  const bestValueTextColor = isDark ? "#8FB996" : "#FFFFFF";

  const disclaimerColor = isDark ? "rgba(199, 180, 191, 0.65)" : "#6E5044";
  const linkColor = isDark ? (isTrueBlack ? "#C97B60" : "#E8907A") : "#9B6E5C";
  const linkDotColor = isDark ? "rgba(199, 180, 191, 0.45)" : "#907A72";

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
          {/* ── Hero Orb ───────────────────────────────────────────────── */}
          <View style={styles.orbContainer}>
            <EnergyOrb state="empty" size={137} />
          </View>

          {/* ── Headline (Comfortaa 400 with "step" accent) ───────────── */}
          <Text style={[styles.mainTitle, { color: titleMainColor }]}>
            Stay a <Text style={{ color: titleAccentColor }}>step</Text> ahead.
          </Text>

          {/* ── Subtitle ───────────────────────────────────────────────── */}
          <Text style={[styles.subtitleText, { color: subtitleColor }]}>
            {"heedly learns your patterns and gives you\na gentle heads-up before a crash."}
          </Text>

          {/* ── Full-Width Bottom Card ──────────────────────────────────── */}
          <View
            style={[
              styles.bottomCard,
              {
                backgroundColor: cardBg,
                borderColor: cardBorder,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 32,
              },
            ]}
          >
            {/* ── Feature Bullets ─────────────────────────────────────── */}
            <View style={styles.featuresList}>
              <FeatureRow text="Crash forecasts 24–72 hours ahead" textColor={featureTextColor} />
              <FeatureRow text="Patterns learned just for you" textColor={featureTextColor} />
              <FeatureRow text="Private by default — your data stays yours" textColor={featureTextColor} />
              <FeatureRow text="No ads." textColor={featureTextColor} />
            </View>

            {/* ── Annual Plan ─────────────────────────────────────────── */}
            <Pressable
              onPress={() => setSelectedPlan("annual")}
              style={[
                styles.planBox,
                {
                  backgroundColor: selectedPlan === "annual" ? planSelectedBg : planUnselectedBg,
                  borderColor: selectedPlan === "annual" ? planSelectedBorder : planUnselectedBorder,
                },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedPlan === "annual" }}
              accessibilityLabel="Annual plan 79.99 per year"
            >
              <View style={styles.planLeft}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedPlan === "annual"
                      ? styles.radioOuterSelected
                      : [
                          styles.radioOuterUnselected,
                          {
                            backgroundColor: isDark ? "transparent" : "#FFFFFF",
                            borderColor: isDark ? "rgba(199, 180, 191, 0.4)" : "rgba(170, 150, 140, 0.5)",
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
            </Pressable>

            {/* ── Monthly Plan ────────────────────────────────────────── */}
            <Pressable
              onPress={() => setSelectedPlan("monthly")}
              style={[
                styles.planBox,
                styles.planBoxMonthly,
                {
                  backgroundColor: selectedPlan === "monthly" ? planSelectedBg : planUnselectedBg,
                  borderColor: selectedPlan === "monthly" ? planSelectedBorder : planUnselectedBorder,
                },
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedPlan === "monthly" }}
              accessibilityLabel="Monthly plan 9.99 per month"
            >
              <View style={styles.planLeft}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedPlan === "monthly"
                      ? styles.radioOuterSelected
                      : [
                          styles.radioOuterUnselected,
                          {
                            backgroundColor: isDark ? "transparent" : "#FFFFFF",
                            borderColor: isDark ? "rgba(199, 180, 191, 0.4)" : "rgba(170, 150, 140, 0.5)",
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
            </Pressable>

            {/* ── CTA Button ──────────────────────────────────────────── */}
            <Pressable
              style={({ pressed }) => [
                styles.ctaButtonWrapper,
                pressed && styles.ctaPressed,
              ]}
              onPress={handleSubscribe}
              accessibilityRole="button"
              accessibilityLabel="Start my 14 days free"
            >
              <LinearGradient
                colors={isDark ? ["#634256", "#8A5D7C", "#9E768E"] : ["#f0a07e", "#e88970", "#e0735f"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.ctaButtonGradient}
              >
                <Text style={styles.ctaText}>Start my 14 days free</Text>
                <View style={styles.ctaArrowContainer}>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M9 5l7 7-7 7"
                      stroke="#FFF6F1"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </LinearGradient>
            </Pressable>

            {/* ── Disclaimer ──────────────────────────────────────────── */}
            <Text style={[styles.disclaimer, { color: disclaimerColor }]}>
              14 days free, then your plan renews automatically until you cancel. Manage or cancel anytime in the App Store.
            </Text>

            {/* ── Footer Links ────────────────────────────────────────── */}
            <View style={styles.linksRow}>
              <Pressable hitSlop={8} style={({ pressed }) => pressed && styles.linkPressed}>
                <View style={[styles.linkUnderlineWrapper, { borderBottomColor: `${linkColor}90` }]}>
                  <Text style={[styles.link, { color: linkColor }]}>Restore purchases</Text>
                </View>
              </Pressable>
              <Text style={[styles.linkDot, { color: linkDotColor }]}>·</Text>
              <Pressable hitSlop={8} style={({ pressed }) => pressed && styles.linkPressed}>
                <View style={[styles.linkUnderlineWrapper, { borderBottomColor: `${linkColor}90` }]}>
                  <Text style={[styles.link, { color: linkColor }]}>Terms</Text>
                </View>
              </Pressable>
              <Text style={[styles.linkDot, { color: linkDotColor }]}>·</Text>
              <Pressable hitSlop={8} style={({ pressed }) => pressed && styles.linkPressed}>
                <View style={[styles.linkUnderlineWrapper, { borderBottomColor: `${linkColor}90` }]}>
                  <Text style={[styles.link, { color: linkColor }]}>Privacy</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Feature Row Sub-Component ────────────────────────────────────────────────

function FeatureRow({ text, textColor }: { text: string; textColor: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={styles.checkBadge}>
        <Text style={styles.checkBadgeIcon}>✓</Text>
      </View>
      <Text style={[styles.featureText, { color: textColor }]}>{text}</Text>
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
  },

  // ── Orb ──────────────────────────────────────────────────────────────────

  orbContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    marginBottom: 26,
  },

  // ── Typography ───────────────────────────────────────────────────────────

  // .mainTitle: Comfortaa 400, 32px, lineHeight 38px
  mainTitle: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    textAlign: "center",
    marginBottom: 10,
  },

  subtitleText: {
    fontSize: 14.5,
    fontWeight: "400",
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },

  // ── Bottom Card ──────────────────────────────────────────────────────────

  bottomCard: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },

  // ── Features ─────────────────────────────────────────────────────────────

  featuresList: {
    gap: 16,
    marginBottom: 24,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  checkBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#529668",
    alignItems: "center",
    justifyContent: "center",
  },

  checkBadgeIcon: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 12,
  },

  featureText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    flex: 1,
  },

  // ── Plan Options ─────────────────────────────────────────────────────────

  planBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  planBoxMonthly: {
    marginTop: 10,
  },

  planLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    backgroundColor: "#E27A6C",
    borderColor: "#E27A6C",
  },

  radioOuterUnselected: {
    borderWidth: 1,
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
  },

  planName: {
    fontSize: 16,
    fontWeight: "600",
  },

  planPrice: {
    fontSize: 16,
    fontWeight: "600",
  },

  planSub: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    marginTop: 1,
  },

  bestValueBadge: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },

  bestValueText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // ── CTA Button ───────────────────────────────────────────────────────────

  ctaButtonWrapper: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    marginTop: 28,
    marginBottom: 14,
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
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },

  // ── Footer ───────────────────────────────────────────────────────────────

  disclaimer: {
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 19,
    textAlign: "center",
    paddingHorizontal: 8,
    marginBottom: 14,
  },

  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  linkPressed: {
    opacity: 0.75,
  },

  linkUnderlineWrapper: {
    borderBottomWidth: 1,
    paddingBottom: 1,
    alignSelf: "center",
  },

  link: {
    fontSize: 13.5,
    fontWeight: "500",
    textDecorationLine: "none",
    letterSpacing: 0,
  },

  linkDot: {
    fontSize: 13,
  },
});

