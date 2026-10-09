import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "@/components/ui/symbol";
import { useCallback, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ForecastState } from "@heedly/native";

import { DawnBackground, GlowDot } from "@/components/core";
import type { EnergyOrbState } from "@/components/core";
import { LearningScreenLayout, TODAY_ORB_SIZE, TodayScreenLayout } from "@/components/today";
import { Fonts } from "@/constants/theme";
import { STATE_DOT, useTheme } from "@/constants/themes";
import { useCheckIn } from "@/contexts/CheckInContext";
import { useThemeMode } from "@/contexts/ThemeContext";
import { greetingWithName, useFirstName } from "@/contexts/NameContext";
import { forecastRow, headline, reasonItem, whyText } from "@/copy/forecast";
import { LEARNING_SHEET_COPY } from "@/copy/today";
import { formatHeaderDate } from "@/services/checkinStorage";
import { useForecast, useTankState, useTodayChrome } from "@/hooks/data";
import type { TodayStatusMode, WhyModalItem } from "@/types/forecast";

/** The forecast owns the headline. The band owns the orb, and only the orb. */
const FORECAST_MODE: Record<ForecastState, TodayStatusMode> = {
  steady: "steady",
  slowing: "caution",
  rest_day: "rest",
};

const ROW_DOT: Record<ForecastState, string> = {
  steady: STATE_DOT.greenDot,
  slowing: STATE_DOT.cautionDot,
  rest_day: STATE_DOT.restDot,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const { isTodayCompleted, startNewCheckIn, hasEverCheckedIn, unratedDay, isHydrating } = useCheckIn();
  const { firstName } = useFirstName();
  const params = useLocalSearchParams<{ mode?: string }>();

  const validParamMode =
    __DEV__ &&
    (params.mode === "fd-empty" ||
      params.mode === "fd-wearable" ||
      params.mode === "steady" ||
      params.mode === "caution" ||
      params.mode === "rest")
      ? (params.mode as TodayStatusMode)
      : null;


  const {
    orbState: tankOrbState,
    isLoaded: isTankLoaded,
    refresh: refreshTank,
  } = useTankState();

  useFocusEffect(
    useCallback(() => {
      void refreshTank();
    }, [refreshTank]),
  );

  const {
    days: forecastDays,
    today: todayForecast,
    isLoaded: isForecastLoaded,
    refresh: refreshForecast,
  } = useForecast();

  useFocusEffect(
    useCallback(() => {
      void refreshForecast();
    }, [refreshForecast]),
  );

  const showEmptyState = !isHydrating && !hasEverCheckedIn;

  const isTodayReady = isTankLoaded && isForecastLoaded;
  const forecastMode =
    isTodayReady && todayForecast?.state ? FORECAST_MODE[todayForecast.state] : null;

  const statusMode = showEmptyState
    ? "fd-empty"
    : forecastMode ?? validParamMode ?? "fd-empty";

  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [isLearningSheetOpen, setIsLearningSheetOpen] = useState(false);
  const [whyModalType, setWhyModalType] = useState<"caution" | "rest" | "steady">(
    "caution",
  );

  const { statusConfigs, whyModalConfigs } = useTodayChrome(statusMode);
  const currentConfig = statusConfigs[statusMode];
  const activeWhyData = whyModalConfigs[whyModalType];

  const forecastHeadline = todayForecast ? headline(todayForecast) : null;
  const forecastWhyText = todayForecast ? whyText(todayForecast) : null;
  const forecastItem = todayForecast ? reasonItem(todayForecast) : null;
  const whyItems: WhyModalItem[] = forecastItem ? [forecastItem] : [];

  const forecastRowItems = forecastDays.flatMap((day) =>
    day.state
      ? [
          {
            ...forecastRow([day])[0],
            dotColor: ROW_DOT[day.state],
          },
        ]
      : [],
  );

  // ⚠️ Provisional. The orb and the headline are the tank (brief §7), so both
  // follow the real band computed natively. The three-day forecast has no
  // engine yet — §6.1 keeps the two apart, and so does this.
  //
  // Null until there is a real band: no data leaves the existing visual alone
  // rather than defaulting to a healthy orb.

  // "empty" is the orb with no water — the honest shape for "no band yet".
  // Loading and no-data look the same deliberately: both mean the engine has
  // not said anything, and the difference is not the orb's to express. The
  // mock waterState is not used — a healthy orb before the real one arrives is
  // a false reassurance (§2), and the orb is the one thing people read.
  const orbState: EnergyOrbState = tankOrbState ?? "empty";

  // The status line names today's state, as the design does: "holding
  // steady" / "caution today" / "resting today". The orb shows the tank.
  const indicatorText = currentConfig.indicatorText;
  const indicatorDotColor = currentConfig.indicatorDotColor;

  const handleCtaPress = () => {
    if (isTodayCompleted) {
      router.push('/(check-in)/saved');
      return;
    }
    // Routed from the store, not from statusMode. statusMode selects the demo
    // visual state of this screen and knows nothing about what was recorded.
    if (!hasEverCheckedIn) {
      // A first-ever check-in has no previous day to rate, so it opens at the
      // energy question rather than the verdict.
      startNewCheckIn(true);
      router.push({
        pathname: '/(check-in)/energy',
        params: { isFirstTime: 'true' },
      });
    } else if (unratedDay) {
      startNewCheckIn(false);
      router.push('/(check-in)/yesterday');
    } else {
      // Returning, and yesterday is already rated — nothing to ask.
      startNewCheckIn(false);
      router.push('/(check-in)/energy');
    }
  };

  const ctaLabel = isTodayCompleted
    ? "Review your check-in"
    : hasEverCheckedIn
      ? "How is it going?"
      : currentConfig.ctaText;

  const handleOpenWhyModal = () => {
    setWhyModalType(
      todayForecast?.state === "rest_day"
        ? "rest"
        : todayForecast?.state === "steady"
          ? "steady"
          : "caution",
    );
    setIsWhyModalOpen(true);
  };

  const handleFooterPress = () => {
    if (currentConfig.footerNote === "Planning something this week?") {
      router.push("/(check-in)/plan" as any);
    }
  };

  const isLearningState =
    statusMode === "fd-empty" || statusMode === "fd-wearable";

  const learningTokens = {
    badgeBg: isDark
      ? isTrueBlack
        ? "rgba(110, 150, 120, 0.14)"
        : "rgba(134, 196, 180, 0.18)"
      : "rgba(126, 155, 106, 0.15)",
    badgeBorder: isDark
      ? isTrueBlack
        ? "rgba(110, 150, 120, 0.14)"
        : "rgba(134, 196, 180, 0.26)"
      : "rgba(126, 155, 106, 0.26)",
    badgeDot: isDark ? (isTrueBlack ? "#6E9678" : "#86C4B4") : "#7e9b6a",
    badgeText: isDark ? (isTrueBlack ? "#6E9678" : "#86C4B4") : "#5d7a52",
    heading: isDark ? (isTrueBlack ? "#E9DDD6" : "#F3E7E1") : "#463332",
    headingAccent: isDark ? (isTrueBlack ? "#C97B60" : "#E8907A") : "#b0532f",
    lead: isDark
      ? isTrueBlack
        ? "#A8979E"
        : "rgba(199, 180, 191, 1)"
      : "rgba(74, 58, 57, 0.84)",
    soft: isDark
      ? isTrueBlack
        ? "#A8979E"
        : "rgba(199, 180, 191, 0.92)"
      : "rgba(74, 58, 57, 0.68)",
  };

  // Dynamic modal theme tokens (Dawn vs Dusk vs True Black / OLED)
  const modalTokens = {
    backdrop: isDark
      ? "rgba(18, 10, 20, 0.55)"
      : "rgba(74, 58, 57, 0.34)",
    sheetBg: isDark
      ? isTrueBlack
        ? "#16111B"
        : "#332538"
      : "#fbf3ec",
    sheetBorder: isDark
      ? isTrueBlack
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(199, 180, 191, 0.14)"
      : "transparent",
    handle: isDark
      ? isTrueBlack
        ? "rgba(255, 255, 255, 0.07)"
        : "rgba(199, 180, 191, 0.28)"
      : "rgba(120, 90, 90, 0.2)",
    headingDark: isDark
      ? isTrueBlack
        ? "#E9DDD6"
        : "#F3E7E1"
      : theme.ink.display,
    headingAccent: isDark
      ? isTrueBlack
        ? "#C97B60"
        : "#E8907A"
      : theme.coral.terracottaDeep,
    subtitle: isDark
      ? isTrueBlack
        ? "#A8979E"
        : "rgba(199, 180, 191, 1)"
      : "rgba(74, 58, 57, 0.84)",
    badgeBg: whyModalType === "rest"
        ? isDark
          ? isTrueBlack
            ? "rgba(190, 106, 92, 0.14)"
            : "rgba(226, 122, 140, 0.18)"
          : "rgba(218, 109, 130, 0.15)"
        : whyModalType === "steady"
          ? isDark
            ? isTrueBlack
              ? "rgba(110, 150, 120, 0.14)"
              : "rgba(134, 196, 180, 0.18)"
            : "rgba(126, 155, 106, 0.15)"
          : isDark
          ? isTrueBlack
            ? "rgba(194, 154, 95, 0.14)"
            : "rgba(232, 168, 124, 0.18)"
          : "rgba(217, 152, 67, 0.16)",
    badgeBorder: whyModalType === "rest"
        ? isDark
          ? isTrueBlack
            ? "rgba(190, 106, 92, 0.3)"
            : "rgba(226, 122, 140, 0.3)"
          : "rgba(218, 109, 130, 0.3)"
        : whyModalType === "steady"
          ? isDark
            ? isTrueBlack
              ? "rgba(110, 150, 120, 0.14)"
              : "rgba(134, 196, 180, 0.26)"
            : "rgba(126, 155, 106, 0.26)"
          : isDark
          ? isTrueBlack
            ? "rgba(194, 154, 95, 0.3)"
            : "rgba(232, 168, 124, 0.3)"
          : "rgba(217, 152, 67, 0.3)",
    badgeDot: whyModalType === "rest"
        ? isDark
          ? isTrueBlack
            ? "#BE6A5C"
            : "#da6d82"
          : "#da6d82"
        : whyModalType === "steady"
          ? isDark
            ? isTrueBlack
              ? "#6E9678"
              : "#86C4B4"
            : "#7e9b6a"
          : isDark
          ? isTrueBlack
            ? "#C29A5F"
            : "#E8A87C"
          : "#d99843",
    badgeText: whyModalType === "rest"
        ? isDark
          ? isTrueBlack
            ? "#BE6A5C"
            : "#E792A4"
          : "#b14a64"
        : whyModalType === "steady"
          ? isDark
            ? isTrueBlack
              ? "#6E9678"
              : "#86C4B4"
            : "#5d7a52"
          : isDark
          ? isTrueBlack
            ? "#C29A5F"
            : "#E8A87C"
          : "#9a6a2a",
    iconBg: isDark
      ? isTrueBlack
        ? "#5A3128"
        : "#7A4234"
      : "#f1bf95",
    iconBorder: "transparent",
    iconTint: isDark
      ? isTrueBlack
        ? "#D8BFB4"
        : "#F3D9CD"
      : "#8a4a25",
    itemTitle: isDark
      ? isTrueBlack
        ? "#E9DDD6"
        : "#F3E7E1"
      : theme.ink.display,
    itemDesc: isDark
      ? isTrueBlack
        ? "#A8979E"
        : "rgba(199, 180, 191, 1)"
      : "rgba(74, 58, 57, 0.74)",
    reassurance: isDark
      ? isTrueBlack
        ? "#A8979E"
        : "rgba(199, 180, 191, 0.92)"
      : "rgba(74, 58, 57, 0.68)",
  };


  if (!showEmptyState && !isTodayReady) {
    return (
      <View style={styles.root}>
        <DawnBackground />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {isLearningState ? (
        <LearningScreenLayout
          dateText={formatHeaderDate()}
          greeting={greetingWithName("Hello", firstName)}
          onSettingsPress={() => router.push("/(tabs)/settings" as any)}
          orbState={orbState}
          orbSize={currentConfig.orbSize}
          headline1={currentConfig.headline1}
          headline2={currentConfig.headline2}
          // OLED: "Still learning you." carries the coral accent (.s-firstday .editorial em).
          isHeadlineAccent={isTrueBlack}
          isFirstDay={currentConfig.isFirstDay}
          indicatorText={indicatorText}
          indicatorDotColor={indicatorDotColor}
          onBadgePress={() => setIsLearningSheetOpen(true)}
          supportingText={currentConfig.microText}
          forecast={
            statusMode === "fd-wearable" ? currentConfig.forecast : undefined
          }
          learningNote={
            statusMode === "fd-empty" ? currentConfig.noteText : undefined
          }
          secondaryText={
            statusMode === "fd-wearable" ? currentConfig.noteText : undefined
          }
          isSecondaryLink={false}
          ctaLabel={ctaLabel}
          onCtaPress={handleCtaPress}
          footerNote={currentConfig.footerNote}
          onFooterPress={handleFooterPress}
        />
      ) : (
        <TodayScreenLayout
          dateText={formatHeaderDate()}
          greeting={greetingWithName("Hello", firstName)}
          onSettingsPress={() => router.push("/(tabs)/settings" as any)}
          orbState={orbState}
          orbSize={TODAY_ORB_SIZE}
          headline1={forecastHeadline?.headline1 ?? currentConfig.headline1}
          headline2={forecastHeadline?.headline2 ?? currentConfig.headline2}
          isHeadlineAccent={true}
          isFirstDay={currentConfig.isFirstDay}
          indicatorText={indicatorText}
          indicatorDotColor={indicatorDotColor}
          supportingText={currentConfig.microText}
          forecast={forecastRowItems.length > 0 ? forecastRowItems : undefined}
          learningNote={undefined}
          secondaryText={forecastWhyText ?? undefined}
          isSecondaryLink={Boolean(forecastWhyText)}
          onSecondaryPress={handleOpenWhyModal}
          ctaLabel={ctaLabel}
          onCtaPress={handleCtaPress}
          footerNote={currentConfig.footerNote}
          onFooterPress={handleFooterPress}
        />
      )}

      {/* ── Bottom Sheet Modal ─────────────────────────────────────────── */}
      <Modal
        visible={isWhyModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsWhyModalOpen(false)}
      >
        <View
          style={[
            styles.modalBackdrop,
            { backgroundColor: modalTokens.backdrop },
          ]}
        >
          <Pressable
            style={styles.modalOverlayDismiss}
            onPress={() => setIsWhyModalOpen(false)}
          />

          <View
            style={[
              styles.modalSheetContainer,
              {
                backgroundColor: modalTokens.sheetBg,
                borderTopColor: modalTokens.sheetBorder,
                borderTopWidth: isDark ? 1 : 0,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 24,
              },
            ]}
          >
            <View
              style={[
                styles.modalHandle,
                { backgroundColor: modalTokens.handle },
              ]}
            />

            <View
              style={[
                styles.modalBadge,
                {
                  backgroundColor: modalTokens.badgeBg,
                  borderColor: modalTokens.badgeBorder,
                },
              ]}
            >
              <GlowDot color={modalTokens.badgeDot} size={8} ring={3} />
              <Text
                style={[
                  styles.modalBadgeText,
                  { color: modalTokens.badgeText },
                ]}
              >
                {activeWhyData.badgeLabel}
              </Text>
            </View>

            <Text style={styles.modalHeading}>
              <Text style={{ color: modalTokens.headingDark }}>
                {activeWhyData.headingPrefix}
              </Text>
              <Text style={{ color: modalTokens.headingAccent }}>
                {activeWhyData.headingAccent}
              </Text>
            </Text>

            <Text
              style={[
                styles.modalSubtitle,
                { color: modalTokens.subtitle },
              ]}
            >
              {activeWhyData.subtitleText}
            </Text>

            <View style={styles.modalItemsList}>
              {whyItems.map((item) => (
                <View key={item.id} style={styles.modalItemRow}>
                  <View
                    style={[
                      styles.modalIconBadge,
                      {
                        backgroundColor: modalTokens.iconBg,
                        borderColor: modalTokens.iconBorder,
                      },
                    ]}
                  >
                    <SymbolView
                      name={item.icon as any}
                      size={17}
                      tintColor={modalTokens.iconTint}
                    />
                  </View>
                  <View style={styles.modalItemTextBlock}>
                    <Text
                      style={[
                        styles.modalItemTitle,
                        { color: modalTokens.itemTitle },
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.modalItemDesc,
                        { color: modalTokens.itemDesc },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <Text
              style={[
                styles.modalReassurance,
                { color: modalTokens.reassurance },
              ]}
            >
              {activeWhyData.reassuranceText}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.modalOkayBtnWrapper,
                pressed && styles.pressed,
                isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
              ]}
              onPress={() => setIsWhyModalOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Okay"
            >
              <LinearGradient
                colors={
                  isDark
                    ? isTrueBlack
                      ? ["#574049", "#241A20"]
                      : ["#634256", "#8A5D7C", "#9E768E"]
                    : [theme.coral.light, theme.coral.mid, theme.coral.primary]
                }
                start={{ x: 0, y: isDark && !isTrueBlack ? 0.5 : 0 }}
                end={{ x: 1, y: isDark && !isTrueBlack ? 0.5 : 1 }}
                style={[
                  styles.modalOkayBtnGradient,
                  isDark && isTrueBlack && {
                    borderColor: "rgba(255, 255, 255, 0.06)",
                    borderWidth: 1,
                  },
                ]}
              >
                <Text style={[styles.modalOkayBtnText, isDark && isTrueBlack && { color: "#EADCD4" }]}>Okay</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isLearningSheetOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsLearningSheetOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <BlurView
            intensity={12}
            tint={isDark ? "dark" : "light"}
            style={styles.sheetBlur}
          />
          <View
            style={[
              styles.sheetScrim,
              { backgroundColor: modalTokens.backdrop },
            ]}
          />
          <Pressable
            style={styles.modalOverlayDismiss}
            onPress={() => setIsLearningSheetOpen(false)}
          />

          <View
            style={[
              styles.modalSheetContainer,
              {
                backgroundColor: modalTokens.sheetBg,
                borderTopColor: modalTokens.sheetBorder,
                borderTopWidth: isDark ? 1 : 0,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 24,
              },
            ]}
          >
            <View
              style={[styles.modalHandle, { backgroundColor: modalTokens.handle }]}
            />

            <View
              style={[
                styles.modalBadge,
                {
                  backgroundColor: learningTokens.badgeBg,
                  borderColor: learningTokens.badgeBorder,
                },
              ]}
            >
              <GlowDot color={learningTokens.badgeDot} size={8} ring={3} />
              <Text
                style={[styles.sheetBadgeText, { color: learningTokens.badgeText }]}
              >
                {LEARNING_SHEET_COPY.badgeLabel}
              </Text>
            </View>

            <Text style={styles.modalHeading}>
              <Text style={{ color: learningTokens.heading }}>
                {LEARNING_SHEET_COPY.headingPrefix}
              </Text>
              <Text style={{ color: learningTokens.headingAccent }}>
                {LEARNING_SHEET_COPY.headingAccent}
              </Text>
            </Text>

            <Text style={[styles.modalSubtitle, { color: learningTokens.lead }]}>
              {LEARNING_SHEET_COPY.leadText}
            </Text>

            <Text style={[styles.sheetBody, { color: learningTokens.lead }]}>
              {LEARNING_SHEET_COPY.bodyText}
            </Text>

            <Text style={[styles.modalReassurance, { color: learningTokens.soft }]}>
              {LEARNING_SHEET_COPY.softText}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.modalOkayBtnWrapper,
                pressed && styles.pressed,
                isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
              ]}
              onPress={() => setIsLearningSheetOpen(false)}
              accessibilityRole="button"
              accessibilityLabel={LEARNING_SHEET_COPY.ctaLabel}
            >
              <LinearGradient
                colors={
                  isDark
                    ? isTrueBlack
                      ? ["#574049", "#241A20"]
                      : ["#634256", "#8A5D7C", "#9E768E"]
                    : [theme.coral.light, theme.coral.mid, theme.coral.primary]
                }
                start={{ x: 0, y: isDark && !isTrueBlack ? 0.5 : 0 }}
                end={{ x: 1, y: isDark && !isTrueBlack ? 0.5 : 1 }}
                style={[
                  styles.modalOkayBtnGradient,
                  isDark && isTrueBlack && {
                    borderColor: "rgba(255, 255, 255, 0.06)",
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modalOkayBtnText,
                    isDark && isTrueBlack && { color: "#EADCD4" },
                  ]}
                >
                  {LEARNING_SHEET_COPY.ctaLabel}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Modal Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },

  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalOverlayDismiss: {
    flex: 1,
  },

  sheetBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  sheetScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  sheetBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },

  sheetBody: {
    fontSize: 14,
    lineHeight: 21.8,
    fontWeight: "500",
    marginTop: 13,
  },

  modalSheetContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 16,
    paddingHorizontal: 24,
    shadowColor: "#785A5A",
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.22,
    shadowRadius: 17,
    elevation: 16,
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },

  modalBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },

  modalBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },

  modalHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.25,
    marginTop: 13,
  },

  modalSubtitle: {
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 12,
  },

  modalItemsList: {
    gap: 15,
    marginTop: 18,
  },

  modalItemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  modalIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  modalItemTextBlock: {
    flex: 1,
    gap: 3,
  },

  modalItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },

  modalItemDesc: {
    fontSize: 13,
    lineHeight: 19,
  },

  modalReassurance: {
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: "500",
    marginTop: 17,
  },

  modalOkayBtnWrapper: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    marginTop: 20,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 5,
  },

  modalOkayBtnGradient: {
    flex: 1,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },

  modalOkayBtnText: {
    color: "#FFF8F4",
    fontSize: 16,
    fontWeight: "600",
  },
});
