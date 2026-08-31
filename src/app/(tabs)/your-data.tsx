import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
  Modal,
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

// ─── Data Card Component (.sx-card with subtle gradient / flat OLED) ─────

function DataCard({
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

export default function YourDataScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/settings" as any);
    }
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalVisible(false);
    // Reset to fresh state on today
    router.replace("/(tabs)?mode=fd-empty" as any);
  };

  // Theme-aware tokens (Dawn vs Dusk vs True Black / OLED)
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
    : "rgba(74, 58, 57, 0.7)";
  const groupHeaderColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.65)"
    : "rgba(74, 58, 57, 0.55)";
  const itemTitleColor = isDark
    ? isTrueBlack
      ? "#E9DDD6"
      : "#F3E7E1"
    : "#4f3c3a";
  const itemDescColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.72)"
    : "rgba(74, 58, 57, 0.62)";
  const dividerColor = isDark
    ? isTrueBlack
      ? "rgba(255, 255, 255, 0.07)"
      : "rgba(255, 255, 255, 0.06)"
    : "rgba(120, 90, 90, 0.1)";
  const chevronColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.45)"
    : "rgba(74, 58, 57, 0.34)";
  const actionDeleteColor = isDark
    ? isTrueBlack
      ? "#BE6A5C"
      : "#E8907A"
    : "#c0533c";
  const footnoteColor = isDark
    ? isTrueBlack
      ? "#9A8A91"
      : "rgba(199, 180, 191, 0.55)"
    : "rgba(74, 58, 57, 0.55)";


  return (
    <View style={styles.root}>
      {/* Atmosphere Background */}
      <DawnBackground />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Top Header Navigation (.sx-nav) ──────────────────────────── */}
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Settings"
          >
            <Text style={[styles.backChevron, { color: isDark ? theme.ink.muted : "rgba(74, 58, 57, 0.62)" }]}>‹</Text>
          </Pressable>
        </View>

        {/* ── Screen Title Header ──────────────────────────────────────── */}
        <Text style={[styles.sectionLabel, { color: eyebrowColor }]}>PRIVACY</Text>
        <Text style={[styles.mainHeading, { color: mainHeadingColor }]}>Your data</Text>
        <Text style={[styles.supportingSubtitle, { color: subtitleColor }]}>
          {"Here's everything heedly keeps, in plain English."}
        </Text>

        {/* ── 1. WHAT HEEDLY KEEPS (.sx-sec) ─────────────────────────── */}
        <Text style={[styles.groupHeaderLabel, { color: groupHeaderColor }]}>WHAT HEEDLY KEEPS</Text>

        <DataCard isDark={isDark} isTrueBlack={isTrueBlack}>
          {/* Wearable data */}
          <View style={styles.itemRow}>
            <View
              style={[
                styles.iconBadge,
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
                name="waveform.path.ecg"
                size={17}
                tintColor={isDark ? (isTrueBlack ? "#C97B60" : "#FFF0EB") : "#b0532f"}
              />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: itemTitleColor }]}>Wearable data</Text>
              <Text style={[styles.itemDescription, { color: itemDescColor }]}>
                Heart rate, HRV, sleep and activity from your connected device.
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Daily check-ins */}
          <View style={styles.itemRow}>
            <View
              style={[
                styles.iconBadge,
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
                name="list.clipboard"
                size={17}
                tintColor={isDark ? (isTrueBlack ? "#C97B60" : "#FFF0EB") : "#b0532f"}
              />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: itemTitleColor }]}>Daily check-ins</Text>
              <Text style={[styles.itemDescription, { color: itemDescColor }]}>
                Your energy, body and the things you note each day.
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Conditions */}
          <View style={styles.itemRow}>
            <View
              style={[
                styles.iconBadge,
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
                name="heart"
                size={17}
                tintColor={isDark ? (isTrueBlack ? "#C97B60" : "#FFF0EB") : "#b0532f"}
              />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: itemTitleColor }]}>Conditions</Text>
              <Text style={[styles.itemDescription, { color: itemDescColor }]}>
                {"What you're living with, to shape your patterns."}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Period days */}
          <View style={styles.itemRow}>
            <View
              style={[
                styles.iconBadge,
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
                name="moon"
                size={17}
                tintColor={isDark ? (isTrueBlack ? "#C97B60" : "#FFF0EB") : "#b0532f"}
              />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: itemTitleColor }]}>Period days</Text>
              <Text style={[styles.itemDescription, { color: itemDescColor }]}>
                {"The cycle days you've logged, if you've added any."}
              </Text>
            </View>
          </View>
        </DataCard>

        {/* ── 2. WHERE IT LIVES (.sx-sec) ────────────────────────────── */}
        <Text style={[styles.groupHeaderLabelSpacing, { color: groupHeaderColor }]}>WHERE IT LIVES</Text>

        <DataCard isDark={isDark} isTrueBlack={isTrueBlack}>
          {/* On your device */}
          <View style={styles.itemRow}>
            <View
              style={[
                styles.iconBadge,
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
                name="iphone"
                size={17}
                tintColor={isDark ? (isTrueBlack ? "#9FB8A6" : "#E0F2E6") : "#5d7a52"}
              />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: itemTitleColor }]}>On your device</Text>
              <Text style={[styles.itemDescription, { color: itemDescColor }]}>
                Patterns are detected here, on your phone.
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Encrypted backup */}
          <View style={styles.itemRow}>
            <View
              style={[
                styles.iconBadge,
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
                name="lock"
                size={17}
                tintColor={isDark ? (isTrueBlack ? "#9FB8A6" : "#E0F2E6") : "#5d7a52"}
              />
            </View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemTitle, { color: itemTitleColor }]}>Encrypted backup</Text>
              <Text style={[styles.itemDescription, { color: itemDescColor }]}>
                {"Stored privately in iCloud, so it's there when you change phones."}
              </Text>
            </View>
          </View>
        </DataCard>

        {/* ── 3. WHO ELSE SEES IT (.sx-sec) ──────────────────────────── */}
        <Text style={[styles.groupHeaderLabelSpacing, { color: groupHeaderColor }]}>WHO ELSE SEES IT</Text>

        <DataCard isDark={isDark} isTrueBlack={isTrueBlack} style={{ paddingVertical: 14 }}>
          <Text style={[styles.itemTitle, { color: itemTitleColor }]}>Private by default.</Text>
          <Text style={[styles.paragraphDescription, { color: itemDescColor }]}>
            {"We don't sell your data. Everything is worked out on your phone — the only thing that leaves it is the optional AI insights: anonymized patterns (no name, no raw data) used to write your insights in plainer language. You can turn that off anytime in settings."}
          </Text>
        </DataCard>

        {/* ── 4. ACTIONS ─────────────────────────────────────────────── */}
        <DataCard isDark={isDark} isTrueBlack={isTrueBlack} style={{ marginTop: 18 }}>
          {/* Export my data */}
          <Pressable
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Export my data"
          >
            <Text style={[styles.actionText, { color: itemTitleColor }]}>Export my data</Text>
            <Text style={[styles.actionChevron, { color: chevronColor }]}>›</Text>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Delete all my data */}
          <Pressable
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            onPress={() => setIsDeleteModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Delete all my data"
          >
            <Text style={[styles.actionDeleteText, { color: actionDeleteColor }]}>Delete all my data</Text>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/* Read full privacy policy */}
          <Pressable
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Read full privacy policy"
          >
            <Text style={[styles.actionText, { color: itemTitleColor }]}>Read full privacy policy</Text>
            <Text style={[styles.actionChevron, { color: chevronColor }]}>›</Text>
          </Pressable>
        </DataCard>

        {/* Footnote */}
        <Text style={[styles.footnoteText, { color: footnoteColor }]}>
          {"Deleting asks you to confirm first — it can't be undone."}
        </Text>
      </ScrollView>

      {/* ── "Delete everything?" Bottom Sheet Modal ──────────────────── */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: isDark
                ? isTrueBlack
                  ? "rgba(0, 0, 0, 0.72)"
                  : "rgba(18, 10, 20, 0.65)"
                : "rgba(74, 58, 57, 0.34)",
            },
          ]}
        >
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => setIsDeleteModalVisible(false)}
          />

          <View
            style={[
              styles.sheetContainer,
              {
                backgroundColor: isDark ? (isTrueBlack ? "#16111B" : "#332538") : "#fbf3ec",
                borderTopColor: isDark
                  ? isTrueBlack
                    ? "rgba(255, 255, 255, 0.07)"
                    : "rgba(199, 180, 191, 0.14)"
                  : "transparent",
                borderTopWidth: isDark ? 1 : 0,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 28,
              },
            ]}
          >
            <View
              style={[
                styles.handleBar,
                {
                  backgroundColor: isDark
                    ? isTrueBlack
                      ? "rgba(255, 255, 255, 0.18)"
                      : "rgba(199, 180, 191, 0.28)"
                    : "rgba(120, 90, 90, 0.2)",
                },
              ]}
            />

            <Text
              style={[
                styles.sheetTitle,
                { color: isDark ? (isTrueBlack ? "#E9DDD6" : "#F3E7E1") : theme.ink.display },
              ]}
            >
              Delete everything?
            </Text>

            <Text
              style={[
                styles.sheetBodyText,
                {
                  color: isDark
                    ? isTrueBlack
                      ? "#9A8A91"
                      : "rgba(199, 180, 191, 0.95)"
                    : "rgba(74, 58, 57, 0.72)",
                },
              ]}
            >
              {"This erases everything heedly keeps — every check-in and all your patterns, on this phone and in your iCloud backup. It can't be undone."}
            </Text>

            <Text
              style={[
                styles.sheetHelperText,
                {
                  color: isDark
                    ? isTrueBlack
                      ? "#9A8A91"
                      : "rgba(199, 180, 191, 0.68)"
                    : "rgba(74, 58, 57, 0.55)",
                },
              ]}
            >
              {"If you have a subscription, cancel it separately in the App Store. Deleting here won't stop billing."}
            </Text>

            {/* Delete everything button (Destructive Outline) */}
            <Pressable
              style={({ pressed }) => [
                styles.deleteOutlineButton,
                {
                  backgroundColor: isDark
                    ? isTrueBlack
                      ? "rgba(190, 106, 92, 0.14)"
                      : "rgba(51, 37, 56, 0.85)"
                    : "#FCE4E6",
                  borderColor: isDark
                    ? isTrueBlack
                      ? "rgba(255, 255, 255, 0.07)"
                      : "rgba(226, 122, 108, 0.38)"
                    : "#c0533c",
                },
                pressed && styles.buttonPressed,
              ]}
              onPress={handleConfirmDelete}
              accessibilityRole="button"
              accessibilityLabel="Confirm delete everything"
            >
              <Text
                style={[
                  styles.deleteOutlineButtonText,
                  { color: isDark ? (isTrueBlack ? "#BE6A5C" : "#E8907A") : "#c0533c" },
                ]}
              >
                Delete everything
              </Text>
            </Pressable>

            {/* Keep my data button (Solid Dark Mauve / Flat OLED) */}
            <Pressable
              style={({ pressed }) => [
                styles.keepDataButton,
                {
                  backgroundColor: isDark
                    ? isTrueBlack
                      ? "#16111B"
                      : "#5C3E50"
                    : "rgba(120, 90, 80, 0.12)",
                  borderColor: isDark && isTrueBlack ? "rgba(255, 255, 255, 0.07)" : "transparent",
                  borderWidth: isDark && isTrueBlack ? 1 : 0,
                },
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setIsDeleteModalVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Keep my data"
            >
              <Text
                style={[
                  styles.keepDataButtonText,
                  { color: isDark ? (isTrueBlack ? "#E9DDD6" : "#FFF6F1") : "#4f3c3a" },
                ]}
              >
                Keep my data
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  // ── Header Navigation (.sx-nav) ──────────────────────────────────────────

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
    marginBottom: 6,
  },

  // .sx-intro: 14.5px, 1.5
  supportingSubtitle: {
    fontSize: 14.5,
    lineHeight: 21,
    marginBottom: 16,
  },

  // .sx-sec: 11px, 600, letter-spacing 0.16em, uppercase
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

  // ── Cards (.sx-card) ─────────────────────────────────────────────────────

  card: {
    borderRadius: 22,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 3,
  },

  // .sx-keep: padding 14px 0
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    paddingVertical: 14,
  },

  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  itemTextContainer: {
    flex: 1,
    gap: 4,
  },

  // .sx-row-title: 15.5px, 600
  itemTitle: {
    fontSize: 15.5,
    fontWeight: "600",
    letterSpacing: -0.15,
    lineHeight: 21,
  },

  // .sx-row-desc: 13.5px, 400
  itemDescription: {
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 19.5,
  },

  paragraphDescription: {
    fontSize: 13.5,
    fontWeight: "400",
    lineHeight: 20,
    marginTop: 8,
  },

  divider: {
    height: 1,
  },

  // ── Actions Card ─────────────────────────────────────────────────────────

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  actionText: {
    fontSize: 15.5,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  actionDeleteText: {
    fontSize: 15.5,
    fontWeight: "600",
    letterSpacing: -0.15,
  },

  actionChevron: {
    fontSize: 18,
    fontWeight: "600",
    paddingLeft: 4,
  },

  footnoteText: {
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 14,
    textAlign: "center",
  },

  // ── Modal Styles ─────────────────────────────────────────────────────────

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalDismissArea: {
    flex: 1,
  },

  sheetContainer: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 14,
    paddingHorizontal: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.35,
    shadowRadius: 36,
    elevation: 20,
  },

  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },

  sheetTitle: {
    fontFamily: Fonts.display.regular,
    fontSize: 27,
    lineHeight: 33,
    letterSpacing: -0.3,
    marginBottom: 12,
  },

  sheetBodyText: {
    fontSize: 14.5,
    lineHeight: 21,
    marginBottom: 12,
  },

  sheetHelperText: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 24,
  },

  deleteOutlineButton: {
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  deleteOutlineButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  keepDataButton: {
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },

  keepDataButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
