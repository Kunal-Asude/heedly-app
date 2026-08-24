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

import { DawnBackground, EnergyOrb } from "@/components/core";
import { Fonts, INK } from "@/constants/theme";

// ─── Design Tokens (pixel-matched to screenshot) ─────────────────────────────

const COLORS = {
  headingDark: "#3A2420",
  accent: "#D9735A",
  bodyText: "#6E5044",
  mutedText: "#907A72",
  linkText: "#9B6E5C",
  cardBg: "#f8ede5ff",
  cardBorder: "rgba(220, 200, 192, 0.3)",
  checkGreen: "#5F9C5A",
  planSelectedBg: "rgba(255, 243, 237, 0.7)",
  planBorderSelected: "#D9735A",
  planBorderUnselected: "rgba(210, 195, 188, 0.55)",
  bestValueBg: "#D9735A",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  return (
    <View style={styles.root}>
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
            <EnergyOrb state="empty" size={152} />
          </View>

          {/* ── Headline (Comfortaa 400) ────────────────────────────────── */}
          <Text style={styles.mainTitle}>Stay a step ahead.</Text>

          {/* ── Subtitle ───────────────────────────────────────────────── */}
          <Text style={styles.subtitleText}>
            {"heedly learns your patterns and gives you\na gentle heads-up before a crash."}
          </Text>

          {/* ── Full-Width Bottom Card ──────────────────────────────────── */}
          <View
            style={[
              styles.bottomCard,
              { paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 32 },
            ]}
          >
            {/* ── Feature Bullets ─────────────────────────────────────── */}
            <View style={styles.featuresList}>
              <FeatureRow text="Crash forecasts 24–72 hours ahead" />
              <FeatureRow text="Patterns learned just for you" />
              <FeatureRow text="Private by default — your data stays yours" />
              <FeatureRow text="No ads." />
            </View>

            {/* ── Annual Plan ─────────────────────────────────────────── */}
            <Pressable
              onPress={() => setSelectedPlan("annual")}
              style={[
                styles.planBox,
                selectedPlan === "annual"
                  ? styles.planBoxSelected
                  : styles.planBoxUnselected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedPlan === "annual" }}
              accessibilityLabel="Annual plan 79.99 per year"
            >
              <View style={styles.planLeft}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedPlan === "annual" && styles.radioOuterSelected,
                  ]}
                >
                  {selectedPlan === "annual" && (
                    <Text style={styles.radioCheck}>✓</Text>
                  )}
                </View>
                <View>
                  <View style={styles.planTitleRow}>
                    <Text style={styles.planName}>Annual</Text>
                    <Text style={styles.planPrice}>  $79.99/yr</Text>
                  </View>
                  <Text style={styles.planSub}>about $6.67/mo</Text>
                </View>
              </View>
              <View style={styles.bestValueBadge}>
                <Text style={styles.bestValueText}>BEST VALUE</Text>
              </View>
            </Pressable>

            {/* ── Monthly Plan ────────────────────────────────────────── */}
            <Pressable
              onPress={() => setSelectedPlan("monthly")}
              style={[
                styles.planBox,
                styles.planBoxMonthly,
                selectedPlan === "monthly"
                  ? styles.planBoxSelected
                  : styles.planBoxUnselected,
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
                      : styles.radioOuterUnselected,
                  ]}
                >
                  {selectedPlan === "monthly" && (
                    <Text style={styles.radioCheck}>✓</Text>
                  )}
                </View>
                <View style={styles.planTitleRow}>
                  <Text style={styles.planName}>Monthly</Text>
                  <Text style={styles.planPrice}>  $9.99/mo</Text>
                </View>
              </View>
            </Pressable>

            {/* ── CTA ─────────────────────────────────────────────────── */}
            <Pressable
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && styles.ctaPressed,
              ]}
              onPress={handleSubscribe}
              accessibilityRole="button"
              accessibilityLabel="Start my 14 days free"
            >
              <Text style={styles.ctaText}>Start my 14 days free</Text>
              <Text style={styles.ctaArrow}>›</Text>
            </Pressable>

            {/* ── Disclaimer ──────────────────────────────────────────── */}
            <Text style={styles.disclaimer}>
              14 days free, then your plan renews automatically until you cancel. Manage or cancel anytime in the App Store.
            </Text>

            {/* ── Footer Links ────────────────────────────────────────── */}
            <View style={styles.linksRow}>
              <Pressable hitSlop={8}>
                <Text style={styles.link}>Restore purchases</Text>
              </Pressable>
              <Text style={styles.linkDot}>·</Text>
              <Pressable hitSlop={8}>
                <Text style={styles.link}>Terms</Text>
              </Pressable>
              <Text style={styles.linkDot}>·</Text>
              <Pressable hitSlop={8}>
                <Text style={styles.link}>Privacy</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Feature Row Sub-Component ────────────────────────────────────────────────

function FeatureRow({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.checkMark}>✓</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5DDD5",
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
    marginTop: 20,
    marginBottom: 14,
  },

  // ── Typography ───────────────────────────────────────────────────────────

  // .mainTitle: Comfortaa 400, 32px, lineHeight 38px, #3A2420
  mainTitle: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    color: INK.display,
    textAlign: "center",
    marginBottom: 10,
  },

  subtitleText: {
    fontSize: 14.5,
    fontWeight: "400",
    lineHeight: 21,
    color: COLORS.bodyText,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },

  // ── Bottom Card ──────────────────────────────────────────────────────────

  bottomCard: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    shadowColor: "#A08070",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
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

  checkMark: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.checkGreen,
    width: 22,
    textAlign: "center",
  },

  featureText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
    color: COLORS.headingDark,
    flex: 1,
  },

  // ── Plan Options ─────────────────────────────────────────────────────────

  planBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  planBoxMonthly: {
    marginTop: 10,
  },

  planBoxSelected: {
    backgroundColor: COLORS.planSelectedBg,
    borderColor: COLORS.planBorderSelected,
  },

  planBoxUnselected: {
    backgroundColor: "#FFFFFF",
    borderColor: COLORS.planBorderUnselected,
  },

  planLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  radioOuterSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },

  radioOuterUnselected: {
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(170, 150, 140, 0.5)",
  },

  radioCheck: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 14,
  },

  planTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  planName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.headingDark,
  },

  planPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.headingDark,
  },

  planSub: {
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    color: COLORS.bodyText,
    marginTop: 1,
  },

  bestValueBadge: {
    backgroundColor: COLORS.bestValueBg,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },

  bestValueText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },

  // ── CTA Button ───────────────────────────────────────────────────────────

  ctaButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 28,
    marginBottom: 14,
    shadowColor: "#8E5040",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },

  ctaPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  ctaText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  ctaArrow: {
    fontSize: 22,
    fontWeight: "400",
    color: "#FFFFFF",
    lineHeight: 24,
  },

  // ── Footer ───────────────────────────────────────────────────────────────

  disclaimer: {
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 19,
    color: "#6E5044",
    textAlign: "center",
    paddingHorizontal: 8,
    marginBottom: 14,
  },

  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  link: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#9B6E5C",
    textDecorationLine: "underline",
  },

  linkDot: {
    fontSize: 13,
    color: "#907A72",
  },
});
