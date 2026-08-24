import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LearningScreenLayout, TodayScreenLayout } from "@/components/today";
import { CORAL, Fonts, INK } from "@/constants/theme";
import { useForecast } from "@/hooks/data";
import type { TodayStatusMode } from "@/types/forecast";

// ─── Component ────────────────────────────────────────────────────────────────

export default function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();

  const initialMode: TodayStatusMode =
    params.mode === "fd-empty" ||
    params.mode === "fd-wearable" ||
    params.mode === "steady" ||
    params.mode === "caution" ||
    params.mode === "rest"
      ? (params.mode as TodayStatusMode)
      : "fd-empty";

  const [statusMode, setStatusMode] = useState<TodayStatusMode>(initialMode);
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
    setStatusMode(nextMode);
  };

  const handleCtaPress = () => {
    if (statusMode === 'fd-empty') {
      setStatusMode('fd-wearable');
    } else if (statusMode === 'fd-wearable') {
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
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalOverlayDismiss}
            onPress={() => setIsWhyModalOpen(false)}
          />

          <View
            style={[
              styles.modalSheetContainer,
              { paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 24 },
            ]}
          >
            <View style={styles.modalHandle} />

            <View
              style={[
                styles.modalBadge,
                { backgroundColor: activeWhyData.badgeBg },
              ]}
            >
              <View
                style={[
                  styles.modalBadgeDot,
                  { backgroundColor: activeWhyData.badgeDotColor },
                ]}
              />
              <Text
                style={[
                  styles.modalBadgeText,
                  { color: activeWhyData.badgeTextColor },
                ]}
              >
                {activeWhyData.badgeLabel}
              </Text>
            </View>

            <Text style={styles.modalHeading}>
              <Text style={styles.modalHeadingDark}>
                {activeWhyData.headingPrefix}{" "}
              </Text>
              <Text style={styles.modalHeadingAccent}>
                {activeWhyData.headingAccent}
              </Text>
            </Text>

            <Text style={styles.modalSubtitle}>
              {activeWhyData.subtitleText}
            </Text>

            <View style={styles.modalItemsList}>
              {activeWhyData.items.map((item) => (
                <View key={item.id} style={styles.modalItemRow}>
                  <View style={styles.modalIconBadge}>
                    <SymbolView
                      name={item.icon as any}
                      size={18}
                      tintColor="#785344"
                    />
                  </View>
                  <View style={styles.modalItemTextBlock}>
                    <Text style={styles.modalItemTitle}>{item.title}</Text>
                    <Text style={styles.modalItemDesc}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.modalReassurance}>
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
                colors={[CORAL.light, CORAL.mid, CORAL.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
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
    backgroundColor: "rgba(74, 58, 57, 0.34)",
    justifyContent: "flex-end",
  },

  modalOverlayDismiss: {
    flex: 1,
  },

  modalSheetContainer: {
    backgroundColor: "#fbf3ec",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 14,
    paddingHorizontal: 24,
    shadowColor: "#785A5A",
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.22,
    shadowRadius: 34,
    elevation: 16,
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(120, 90, 90, 0.2)",
    alignSelf: "center",
    marginBottom: 16,
  },

  modalBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  modalBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  modalBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  modalHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.25,
    marginBottom: 8,
  },

  modalHeadingDark: {
    color: INK.display,
  },

  modalHeadingAccent: {
    color: CORAL.terracottaDeep,
  },

  modalSubtitle: {
    fontSize: 14.5,
    lineHeight: 22,
    color: "rgba(74, 58, 57, 0.72)",
    marginBottom: 18,
  },

  modalItemsList: {
    gap: 14,
    marginBottom: 18,
  },

  modalItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  modalIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3E3D6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  modalItemTextBlock: {
    flex: 1,
    gap: 2,
  },

  modalItemTitle: {
    fontSize: 14.5,
    fontWeight: "600",
    lineHeight: 20,
    color: INK.display,
  },

  modalItemDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(74, 58, 57, 0.66)",
  },

  modalReassurance: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "rgba(74, 58, 57, 0.6)",
    marginBottom: 18,
    textAlign: "center",
  },

  modalOkayBtnWrapper: {
    width: "100%",
    height: 54,
    borderRadius: 27,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
  },

  modalOkayBtnGradient: {
    flex: 1,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },

  modalOkayBtnText: {
    color: "#fff8f4",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.15,
  },
});
