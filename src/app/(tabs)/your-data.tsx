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
import { Spacing } from "@/constants/theme";

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: "#F5DDD5",
  headingDark: "#463332",
  accent: "#C0634A",
  bodyText: "#785344",
  mutedText: "#a38778",
  helperText: "#8A6A5E",
  deleteText: "#C0533C",
  buttonFill: "#D9735A",
  cardBg: "rgba(255, 251, 248, 0.85)",
  cardBorder: "rgba(212, 184, 174, 0.35)",
  divider: "rgba(212, 184, 174, 0.35)",
  coralBadgeBg: "#F09A85",
  greenBadgeBg: "#C8E3D0",
  greenBadgeIcon: "#2E5A3E",
  modalBg: "#FFFBF8",
  modalBorder: "rgba(212, 184, 174, 0.4)",
};

// ─── Component ────────────────────────────────────────────────────────────────

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
        {/* ── Top Header Navigation ────────────────────────────────────── */}
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
          <Text style={styles.sectionLabel}>PRIVACY</Text>
          <Text style={styles.mainHeading}>Your data</Text>
          <Text style={styles.supportingSubtitle}>
            {"Here's everything heedly keeps, in plain\nEnglish."}
          </Text>

          {/* ── 1. WHAT HEEDLY KEEPS ───────────────────────────────────── */}
          <Text style={styles.groupHeaderLabel}>WHAT HEEDLY KEEPS</Text>

          <View style={styles.card}>
            {/* Wearable data */}
            <View style={styles.itemRow}>
              <View style={styles.coralBadge}>
                <SymbolView
                  name="waveform.path.ecg"
                  size={18}
                  tintColor="#FFFFFF"
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
                  size={18}
                  tintColor="#FFFFFF"
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
                <SymbolView name="heart" size={18} tintColor="#FFFFFF" />
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
                <SymbolView name="moon" size={18} tintColor="#FFFFFF" />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>Period days</Text>
                <Text style={styles.itemDescription}>
                  {"The cycle days you've logged, if you've added any."}
                </Text>
              </View>
            </View>
          </View>

          {/* ── 2. WHERE IT LIVES ──────────────────────────────────────── */}
          <Text style={styles.groupHeaderLabelSpacing}>WHERE IT LIVES</Text>

          {/* On your device */}
          <View style={styles.cardSeparate}>
            <View style={styles.itemRow}>
              <View style={styles.greenBadge}>
                <SymbolView
                  name="iphone"
                  size={18}
                  tintColor={COLORS.greenBadgeIcon}
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
                  size={18}
                  tintColor={COLORS.greenBadgeIcon}
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

          {/* ── 3. WHO ELSE SEES IT ────────────────────────────────────── */}
          <Text style={styles.groupHeaderLabelSpacing}>WHO ELSE SEES IT</Text>

          <View style={styles.card}>
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
          {/* Dismiss backdrop */}
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => setIsDeleteModalVisible(false)}
          />

          {/* Sheet Container */}
          <View style={styles.sheetContainer}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Title */}
            <Text style={styles.sheetTitle}>Delete everything?</Text>

            {/* Paragraph 1 */}
            <Text style={styles.sheetBodyText}>
              {"This erases everything heedly keeps — every check-in and all your patterns, on this phone and in your iCloud backup. It can't be undone."}
            </Text>

            {/* Paragraph 2 */}
            <Text style={styles.sheetHelperText}>
              {"If you have a subscription, cancel it separately in the App Store. Deleting here won't stop billing."}
            </Text>

            {/* Outlined "Delete everything" Button */}
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

            {/* Filled "Keep my data" Button */}
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
    paddingHorizontal: Spacing.four,
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

  // ── Header Navigation ────────────────────────────────────────────────────

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 4,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  backChevron: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 32,
    lineHeight: 34,
    color: COLORS.headingDark,
  },

  sectionLabel: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 12,
    color: COLORS.mutedText,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  mainHeading: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 36,
    lineHeight: 44,
    color: COLORS.headingDark,
    marginBottom: 8,
  },

  supportingSubtitle: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 16,
    lineHeight: 23,
    color: COLORS.bodyText,
    marginBottom: 24,
  },

  groupHeaderLabel: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 11,
    color: COLORS.mutedText,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  groupHeaderLabelSpacing: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 11,
    color: COLORS.mutedText,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 24,
  },

  // ── Cards ────────────────────────────────────────────────────────────────

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: "#8C6A6A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },

  cardSeparate: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: "#8C6A6A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },

  coralBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.coralBadgeBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  greenBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.greenBadgeBg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  itemTextContainer: {
    flex: 1,
  },

  itemTitle: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.headingDark,
    marginBottom: 3,
  },

  itemDescription: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 14,
    lineHeight: 19.5,
    color: COLORS.bodyText,
  },

  paragraphDescription: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 14,
    lineHeight: 20.5,
    color: COLORS.bodyText,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 14,
  },

  // ── Actions ──────────────────────────────────────────────────────────────

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  actionText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 16,
    color: COLORS.headingDark,
  },

  actionDeleteText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 16,
    color: COLORS.deleteText,
  },

  actionChevron: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 22,
    lineHeight: 22,
    color: COLORS.mutedText,
  },

  footnoteText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 13.5,
    lineHeight: 19,
    color: COLORS.helperText,
    marginTop: 12,
    paddingHorizontal: 4,
  },

  // ── Bottom Sheet Modal ───────────────────────────────────────────────────

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(45, 25, 20, 0.52)",
    justifyContent: "flex-end",
  },

  modalDismissArea: {
    flex: 1,
  },

  sheetContainer: {
    backgroundColor: COLORS.modalBg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: COLORS.modalBorder,
    shadowColor: "#301510",
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 16,
  },

  handleBar: {
    width: 38,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: "rgba(180, 150, 140, 0.55)",
    alignSelf: "center",
    marginBottom: 18,
  },

  sheetTitle: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 28,
    lineHeight: 34,
    color: COLORS.headingDark,
    marginBottom: 12,
  },

  sheetBodyText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 14.5,
    lineHeight: 21,
    color: "rgba(74, 58, 57, 0.78)",
    marginBottom: 14,
  },

  sheetHelperText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 13.5,
    lineHeight: 19.5,
    color: "rgba(110, 80, 70, 0.72)",
    marginBottom: 24,
  },

  deleteOutlineButton: {
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: COLORS.buttonFill,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#8C6A6A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  deleteOutlineButtonText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 16.5,
    color: COLORS.deleteText,
  },

  keepDataButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.buttonFill,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },

  keepDataButtonText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 16.5,
    color: "#FFFFFF",
  },
});
