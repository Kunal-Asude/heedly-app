import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LearningScreenLayout, TodayScreenLayout } from "@/components/today";
import { Fonts } from "@/constants/theme";
import { useTheme } from "@/constants/themes";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useForecast } from "@/hooks/data";
import type { TodayStatusMode } from "@/types/forecast";

// ─── Component ────────────────────────────────────────────────────────────────

export default function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const params = useLocalSearchParams<{ mode?: string }>();

  const validParamMode =
    params.mode === "fd-empty" ||
    params.mode === "fd-wearable" ||
    params.mode === "steady" ||
    params.mode === "caution" ||
    params.mode === "rest"
      ? (params.mode as TodayStatusMode)
      : null;

  const [customMode, setCustomMode] = useState<TodayStatusMode | null>(null);
  const statusMode = customMode ?? validParamMode ?? "fd-empty";
  const [isWhyModalOpen, setIsWhyModalOpen] = useState(false);
  const [whyModalType, setWhyModalType] = useState<"caution" | "rest">(
    "caution",
  );

  const { statusConfigs, whyModalConfigs } = useForecast(statusMode);
  const currentConfig = statusConfigs[statusMode];
  const activeWhyData = whyModalConfigs[whyModalType];

  const cycleStatusMode = () => {
    const modes: TodayStatusMode[] = [
      "fd-empty",
      "fd-wearable",
      "steady",
      "caution",
      "rest",
    ];
    const idx = modes.indexOf(statusMode);
    const nextMode = modes[(idx + 1) % modes.length];
    setCustomMode(nextMode);
  };

  const handleCtaPress = () => {
    if (statusMode === 'fd-empty') {
      router.push({
        pathname: '/(check-in)/energy',
        params: { isFirstTime: 'true' },
      });
    } else {
      router.push('/(check-in)/yesterday');
    }
  };

  const handleOpenWhyModal = () => {
    if (statusMode === "rest") {
      setWhyModalType("rest");
    } else {
      setWhyModalType("caution");
    }
    setIsWhyModalOpen(true);
  };

  const handleFooterPress = () => {
    if (currentConfig.footerNote === "Planning something this week?") {
      router.push("/(check-in)/plan" as any);
    }
  };

  const isLearningState =
    statusMode === "fd-empty" || statusMode === "fd-wearable";

  // Dynamic modal theme tokens
  const modalTokens = {
    backdrop: isDark ? "rgba(18, 10, 20, 0.62)" : "rgba(74, 58, 57, 0.34)",
    sheetBg: isDark ? "#332538" : "#fbf3ec",
    sheetBorder: isDark ? "rgba(199, 180, 191, 0.14)" : "transparent",
    handle: isDark ? "rgba(199, 180, 191, 0.28)" : "rgba(120, 90, 90, 0.2)",
    headingDark: isDark ? "#F3E7E1" : theme.ink.display,
    headingAccent: isDark ? "#E8907A" : theme.coral.terracottaDeep,
    subtitle: isDark ? "rgba(199, 180, 191, 0.95)" : theme.ink.muted,
    badgeBg:
      whyModalType === "rest"
        ? isDark
          ? "rgba(226, 122, 140, 0.18)"
          : "#FCE4E6"
        : isDark
          ? "rgba(232, 168, 124, 0.18)"
          : "#F4E2C7",
    badgeBorder:
      whyModalType === "rest"
        ? isDark
          ? "rgba(226, 122, 140, 0.30)"
          : "transparent"
        : isDark
          ? "rgba(232, 168, 124, 0.30)"
          : "transparent",
    badgeDot:
      whyModalType === "rest"
        ? isDark
          ? "#E792A4"
          : "#DC6B76"
        : isDark
          ? "#E8A87C"
          : "#D4A545",
    badgeText:
      whyModalType === "rest"
        ? isDark
          ? "#E792A4"
          : "#DC6B76"
        : isDark
          ? "#E8A87C"
          : "#B57E32",
    iconBg: isDark ? "rgba(138, 75, 60, 0.35)" : "#F3E3D6",
    iconBorder: isDark ? "rgba(232, 168, 124, 0.22)" : "transparent",
    iconTint: isDark ? "#F3D9CD" : "#785344",
    itemTitle: isDark ? "#F3E7E1" : theme.ink.display,
    itemDesc: isDark ? "rgba(199, 180, 191, 0.88)" : "rgba(74, 58, 57, 0.66)",
    reassurance: isDark ? "rgba(199, 180, 191, 0.82)" : "rgba(74, 58, 57, 0.6)",
  };

  return (
    <View style={styles.root}>
      {isLearningState ? (
        <LearningScreenLayout
          dateText="TUESDAY · 10 JUNE"
          greeting="Hello, Sam."
          onSettingsPress={() => router.push("/(tabs)/settings" as any)}
          orbState={currentConfig.waterState}
          orbSize={currentConfig.orbSize}
          headline1={currentConfig.headline1}
          headline2={currentConfig.headline2}
          isHeadlineAccent={true}
          isFirstDay={currentConfig.isFirstDay}
          indicatorText={currentConfig.indicatorText}
          indicatorDotColor={currentConfig.indicatorDotColor}
          onBadgePress={cycleStatusMode}
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
          ctaLabel={currentConfig.ctaText}
          onCtaPress={handleCtaPress}
          footerNote={currentConfig.footerNote}
          onFooterPress={handleFooterPress}
        />
      ) : (
        <TodayScreenLayout
          dateText="TUESDAY · 10 JUNE"
          greeting="Hello, Sam."
          onSettingsPress={() => router.push("/(tabs)/settings" as any)}
          orbState={currentConfig.waterState}
          headline1={currentConfig.headline1}
          headline2={currentConfig.headline2}
          isHeadlineAccent={true}
          isFirstDay={currentConfig.isFirstDay}
          indicatorText={currentConfig.indicatorText}
          indicatorDotColor={currentConfig.indicatorDotColor}
          onBadgePress={cycleStatusMode}
          supportingText={currentConfig.microText}
          forecast={currentConfig.forecast}
          learningNote={undefined}
          secondaryText={currentConfig.whyText}
          isSecondaryLink={Boolean(currentConfig.whyText)}
          onSecondaryPress={handleOpenWhyModal}
          ctaLabel={currentConfig.ctaText}
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
                  borderWidth: isDark ? 1 : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.modalBadgeDot,
                  { backgroundColor: modalTokens.badgeDot },
                ]}
              />
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
                {activeWhyData.headingPrefix}{" "}
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
              {activeWhyData.items.map((item) => (
                <View key={item.id} style={styles.modalItemRow}>
                  <View
                    style={[
                      styles.modalIconBadge,
                      {
                        backgroundColor: modalTokens.iconBg,
                        borderColor: modalTokens.iconBorder,
                        borderWidth: isDark ? 1 : 0,
                      },
                    ]}
                  >
                    <SymbolView
                      name={item.icon as any}
                      size={18}
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
              ]}
              onPress={() => setIsWhyModalOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Okay"
            >
              <LinearGradient
                colors={
                  isDark
                    ? ["#634256", "#8A5D7C", "#9E768E"]
                    : [theme.coral.light, theme.coral.mid, theme.coral.primary]
                }
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.modalOkayBtnGradient}
              >
                <Text style={styles.modalOkayBtnText}>Okay</Text>
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

  modalSheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.35,
    shadowRadius: 34,
    elevation: 16,
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  modalBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 5.5,
    paddingHorizontal: 13,
    borderRadius: 16,
    marginBottom: 12,
  },

  modalBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  modalBadgeText: {
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  modalHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 27,
    lineHeight: 32,
    letterSpacing: -0.25,
    marginBottom: 8,
  },

  modalSubtitle: {
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 20,
  },

  modalItemsList: {
    gap: 16,
    marginBottom: 20,
  },

  modalItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
  },

  modalIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  modalItemTextBlock: {
    flex: 1,
    gap: 3,
  },

  modalItemTitle: {
    fontSize: 15.5,
    fontWeight: "600",
    lineHeight: 21,
  },

  modalItemDesc: {
    fontSize: 14,
    lineHeight: 20,
  },

  modalReassurance: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 22,
    textAlign: "center",
  },

  modalOkayBtnWrapper: {
    width: "100%",
    height: 58,
    borderRadius: 29,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 5,
  },

  modalOkayBtnGradient: {
    flex: 1,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },

  modalOkayBtnText: {
    color: "#FFF6F1",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.15,
  },
});
