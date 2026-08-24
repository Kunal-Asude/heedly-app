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
import { CORAL, Fonts, INK } from "@/constants/theme";

export default function YourDataScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
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
        <View style={[styles.topRow, isDeleteModalVisible && styles.bgDimmed]}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Settings"
          >
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>
        </View>

        {/* ── Screen Title Header ──────────────────────────────────────── */}
        <View style={isDeleteModalVisible && styles.bgDimmed}>
          {/* .sx-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5) */}
          <Text style={styles.sectionLabel}>PRIVACY</Text>

          {/* .sx-title: Comfortaa 400, 31px, lineHeight 36px, #463332 */}
          <Text style={styles.mainHeading}>Your data</Text>

          {/* .sx-intro: 14.5px, 1.5, rgba(74,58,57,0.7) */}
          <Text style={styles.supportingSubtitle}>
            {"Here's everything heedly keeps, in plain English."}
          </Text>

          {/* ── 1. WHAT HEEDLY KEEPS (.sx-sec) ─────────────────────────── */}
          <Text style={styles.groupHeaderLabel}>WHAT HEEDLY KEEPS</Text>

          <View style={styles.card}>
            {/* Wearable data */}
            <View style={styles.itemRow}>
              <View style={styles.coralBadge}>
                <SymbolView
                  name="waveform.path.ecg"
                  size={16}
                  tintColor={CORAL.terracottaDeep}
                />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>Wearable data</Text>
                <Text style={styles.itemDescription}>
                  Heart rate, HRV, sleep and activity from your connected device.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Daily check-ins */}
            <View style={styles.itemRow}>
              <View style={styles.coralBadge}>
                <SymbolView
                  name="list.clipboard"
                  size={16}
                  tintColor={CORAL.terracottaDeep}
                />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>Daily check-ins</Text>
                <Text style={styles.itemDescription}>
                  Your energy, body and the things you note each day.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Conditions */}
            <View style={styles.itemRow}>
              <View style={styles.coralBadge}>
                <SymbolView name="heart" size={16} tintColor={CORAL.terracottaDeep} />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>Conditions</Text>
                <Text style={styles.itemDescription}>
                  {"What you're living with, to shape your patterns."}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Period days */}
            <View style={styles.itemRow}>
              <View style={styles.coralBadge}>
                <SymbolView name="moon" size={16} tintColor={CORAL.terracottaDeep} />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>Period days</Text>
                <Text style={styles.itemDescription}>
                  {"The cycle days you've logged, if you've added any."}
                </Text>
              </View>
            </View>
          </View>

          {/* ── 2. WHERE IT LIVES (.sx-sec) ────────────────────────────── */}
          <Text style={styles.groupHeaderLabelSpacing}>WHERE IT LIVES</Text>

          {/* On your device */}
          <View style={styles.cardSeparate}>
            <View style={styles.itemRow}>
              <View style={styles.greenBadge}>
                <SymbolView
                  name="iphone"
                  size={16}
                  tintColor="#5d7a52"
                />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>On your device</Text>
                <Text style={styles.itemDescription}>
                  Patterns are detected here, on your phone.
                </Text>
              </View>
            </View>
          </View>

          {/* Encrypted backup */}
          <View style={styles.cardSeparate}>
            <View style={styles.itemRow}>
              <View style={styles.greenBadge}>
                <SymbolView
                  name="lock"
                  size={16}
                  tintColor="#5d7a52"
                />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>Encrypted backup</Text>
                <Text style={styles.itemDescription}>
                  {"Stored privately in iCloud, so it's there when you change phones."}
                </Text>
              </View>
            </View>
          </View>

          {/* ── 3. WHO ELSE SEES IT (.sx-sec) ──────────────────────────── */}
          <Text style={styles.groupHeaderLabelSpacing}>WHO ELSE SEES IT</Text>

          <View style={styles.cardPadding}>
            <Text style={styles.itemTitle}>Private by default.</Text>
            <Text style={styles.paragraphDescription}>
              {"We don't sell your data. Everything is worked out on your phone — the only thing that leaves it is the optional AI insights: anonymized patterns (no name, no raw data) used to write your insights in plainer language. You can turn that off anytime in settings."}
            </Text>
          </View>

          {/* ── 4. ACTIONS ─────────────────────────────────────────────── */}
          <View style={[styles.card, { marginTop: 24 }]}>
            {/* Export my data */}
            <Pressable
              style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Export my data"
            >
              <Text style={styles.actionText}>Export my data</Text>
              <Text style={styles.actionChevron}>›</Text>
            </Pressable>

            <View style={styles.divider} />

            {/* Delete all my data */}
            <Pressable
              style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
              onPress={() => setIsDeleteModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Delete all my data"
            >
              <Text style={styles.actionDeleteText}>Delete all my data</Text>
            </Pressable>

            <View style={styles.divider} />

            {/* Read full privacy policy */}
            <Pressable
              style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Read full privacy policy"
            >
              <Text style={styles.actionText}>Read full privacy policy</Text>
              <Text style={styles.actionChevron}>›</Text>
            </Pressable>
          </View>

          {/* Footnote */}
          <Text style={styles.footnoteText}>
            {"Deleting asks you to confirm first — it can't be undone."}
          </Text>
        </View>
      </ScrollView>

      {/* ── "Delete everything?" Bottom Sheet Modal ──────────────────── */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => setIsDeleteModalVisible(false)}
          />

          <View
            style={[
              styles.sheetContainer,
              { paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 28 },
            ]}
          >
            <View style={styles.handleBar} />

            <Text style={styles.sheetTitle}>Delete everything?</Text>

            <Text style={styles.sheetBodyText}>
              {"This erases everything heedly keeps — every check-in and all your patterns, on this phone and in your iCloud backup. It can't be undone."}
            </Text>

            <Text style={styles.sheetHelperText}>
              {"If you have a subscription, cancel it separately in the App Store. Deleting here won't stop billing."}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.deleteOutlineButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleConfirmDelete}
              accessibilityRole="button"
              accessibilityLabel="Confirm delete everything"
            >
              <Text style={styles.deleteOutlineButtonText}>
                Delete everything
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.keepDataButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setIsDeleteModalVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Keep my data"
            >
              <Text style={styles.keepDataButtonText}>Keep my data</Text>
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
    backgroundColor: "transparent",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
  },

  pressed: {
    opacity: 0.75,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  bgDimmed: {
    opacity: 0.12,
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
    color: "rgba(74, 58, 57, 0.62)",
  },

  // .sx-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5)
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(74, 58, 57, 0.5)",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  // .sx-title: Comfortaa 400, 31px, lineHeight 36px, #463332
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: INK.display,
    marginBottom: 8,
  },

  // .sx-intro: 14.5px, 1.5, rgba(74,58,57,0.7)
  supportingSubtitle: {
    fontSize: 14.5,
    lineHeight: 22,
    color: "rgba(74, 58, 57, 0.7)",
    marginBottom: 20,
  },

  // .sx-sec: 11px, 600, letter-spacing 0.16em, uppercase, rgba(74,58,57,0.5)
  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.76,
    color: "rgba(74, 58, 57, 0.5)",
    textTransform: "uppercase",
    marginBottom: 8,
  },

  groupHeaderLabelSpacing: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.76,
    color: "rgba(74, 58, 57, 0.5)",
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 24,
  },

  // ── Cards (.sx-card) ─────────────────────────────────────────────────────

  card: {
    backgroundColor: "rgba(255, 252, 248, 0.82)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  cardPadding: {
    backgroundColor: "rgba(255, 252, 248, 0.82)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  cardSeparate: {
    backgroundColor: "rgba(255, 252, 248, 0.82)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  // .sx-keep: padding 14px 0
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
    paddingVertical: 14,
  },

  coralBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "rgba(244, 164, 126, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },

  greenBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "rgba(126, 155, 106, 0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },

  itemTextContainer: {
    flex: 1,
    gap: 3,
  },

  // .sx-row-title: 14.5px, 600, #4f3c3a
  itemTitle: {
    fontSize: 14.5,
    fontWeight: "600",
    letterSpacing: -0.15,
    color: "#4f3c3a",
    lineHeight: 20,
  },

  // .sx-row-desc: 12.5px, 450, color rgba(74,58,57,0.62)
  itemDescription: {
    fontSize: 12.5,
    fontWeight: "400",
    lineHeight: 18,
    color: "rgba(74, 58, 57, 0.62)",
  },

  paragraphDescription: {
    fontSize: 12.5,
    fontWeight: "400",
    lineHeight: 19,
    color: "rgba(74, 58, 57, 0.62)",
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(120, 90, 80, 0.1)",
  },

  // ── Actions Card ─────────────────────────────────────────────────────────

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  actionText: {
    fontSize: 14.5,
    fontWeight: "600",
    letterSpacing: -0.15,
    color: "#4f3c3a",
  },

  actionDeleteText: {
    fontSize: 14.5,
    fontWeight: "600",
    letterSpacing: -0.15,
    color: "#c0533c",
  },

  actionChevron: {
    fontSize: 17,
    fontWeight: "600",
    color: "rgba(74, 58, 57, 0.34)",
  },

  footnoteText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "rgba(74, 58, 57, 0.55)",
    marginTop: 12,
    textAlign: "center",
  },

  // ── Modal Styles ─────────────────────────────────────────────────────────

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(74, 58, 57, 0.34)",
    justifyContent: "flex-end",
  },

  modalDismissArea: {
    flex: 1,
  },

  sheetContainer: {
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

  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(120, 90, 90, 0.2)",
    alignSelf: "center",
    marginBottom: 16,
  },

  sheetTitle: {
    fontFamily: Fonts.display.regular,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: INK.display,
    marginBottom: 10,
  },

  sheetBodyText: {
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(74, 58, 57, 0.72)",
    marginBottom: 12,
  },

  sheetHelperText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: "rgba(74, 58, 57, 0.55)",
    marginBottom: 24,
  },

  deleteOutlineButton: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#c0533c",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  deleteOutlineButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#c0533c",
  },

  keepDataButton: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(120, 90, 80, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  keepDataButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4f3c3a",
  },
});
