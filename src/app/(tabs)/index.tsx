import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LearningScreenLayout, TodayScreenLayout } from "@/components/today";
import { useForecast } from "@/hooks/data";
import type { TodayStatusMode } from "@/types/forecast";

const COLORS = {
  accent: "#B0532F",
  buttonFill: "#D9735A",
  greenDot: "#7E9B6A",
  cautionDot: "#D99843",
  restDot: "#E0735F",
};

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
                {activeWhyData.headingPrefix}
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
                styles.modalOkayBtn,
                pressed && styles.pressed,
              ]}
              onPress={() => setIsWhyModalOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Okay"
            >
              <Text style={styles.modalOkayBtnText}>Okay</Text>
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
    opacity: 0.85,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },

  modalOverlayDismiss: {
    flex: 1,
  },

  modalSheetContainer: {
    backgroundColor: "rgba(255, 252, 249, 0.98)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(180, 160, 150, 0.4)",
    alignSelf: "center",
    marginBottom: 18,
  },

  modalBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 14,
  },

  modalBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  modalBadgeText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 13,
  },

  modalHeading: {
    fontSize: 28,
    lineHeight: 36,
    marginBottom: 10,
  },

  modalHeadingDark: {
    fontFamily: "AvenirNext-Regular",
    color: "#2C1810",
  },

  modalHeadingAccent: {
    fontFamily: "AvenirNext-Regular",
    color: COLORS.accent,
  },

  modalSubtitle: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 16,
    lineHeight: 22,
    color: "#785344",
    marginBottom: 20,
  },

  modalItemsList: {
    gap: 18,
    marginBottom: 22,
  },

  modalItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },

  modalIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F3E3D6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  modalItemTextBlock: {
    flex: 1,
    gap: 3,
  },

  modalItemTitle: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 15,
    lineHeight: 20,
    color: "#2C1810",
  },

  modalItemDesc: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 13.5,
    lineHeight: 18,
    color: "#785344",
  },

  modalReassurance: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 13.5,
    lineHeight: 19,
    color: "rgba(120, 83, 68, 0.8)",
    marginBottom: 20,
    textAlign: "center",
  },

  modalOkayBtn: {
    backgroundColor: COLORS.buttonFill,
    borderRadius: 28,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },

  modalOkayBtnText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
