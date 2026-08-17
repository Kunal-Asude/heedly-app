import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DawnBackground } from "@/components/core";
import { Spacing } from "@/constants/theme";

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: "#F5DDD5",
  headingDark: "#463332",
  accent: "#b05334",
  bodyText: "#463332",
  mutedText: "#6B4C3E",
  buttonFill: "#D9735A",
  buttonText: "#FFFFFF",
  progressInactive: "#E5C4B7",
  inputBg: "rgba(255, 251, 248, 0.85)",
  inputBorder: "rgba(212, 184, 174, 0.35)",
  drawerBg: "rgba(255, 251, 248, 0.75)",
  drawerBorder: "rgba(212, 184, 174, 0.45)",
  tagSelectedBg: "#E07860",
  tagSelectedText: "#FFFFFF",
  tagUnselectedBg: "rgba(255, 251, 248, 0.85)",
  tagUnselectedText: "#2C1810",
  tagUnselectedBorder: "rgba(212, 184, 174, 0.4)",
  modalBg: "#FFFBF8",
  sheetBorder: "rgba(255, 255, 255, 0.85)",
};

// ─── Categories & Tags ────────────────────────────────────────────────────────

type Category = {
  id: string;
  label: string;
  tags: string[];
};

const CATEGORIES: Category[] = [
  {
    id: "activities",
    label: "Activities",
    tags: [
      "physical activity",
      "walking",
      "standing",
      "deep focus",
      "screens",
      "social interaction",
    ],
  },
  {
    id: "mind_mood",
    label: "Mind & mood",
    tags: ["deep focus", "brain fog", "social interaction", "screens"],
  },
  {
    id: "environment",
    label: "Environment",
    tags: ["warm room", "heat exposure", "noise"],
  },
  {
    id: "symptoms",
    label: "Symptoms",
    tags: [
      "brain fog",
      "headache",
      "poor sleep",
      "pain flare",
      "joint pain",
      "sore throat",
      "heart racing",
      "breathlessness",
      "nausea",
      "dizziness",
    ],
  },
  {
    id: "body",
    label: "Body",
    tags: [
      "poor sleep",
      "pain flare",
      "joint pain",
      "sore throat",
      "heart racing",
      "breathlessness",
      "nausea",
      "dizziness",
    ],
  },
  {
    id: "other",
    label: "Other",
    tags: ["noise", "warm room", "heat exposure"],
  },
];

const ALL_TAGS = [
  "social interaction",
  "screens",
  "warm room",
  "deep focus",
  "physical activity",
  "heat exposure",
  "standing",
  "walking",
  "brain fog",
  "headache",
  "poor sleep",
  "pain flare",
  "joint pain",
  "sore throat",
  "heart racing",
  "breathlessness",
  "nausea",
  "dizziness",
  "noise",
];

const INITIAL_SELECTED = ["social interaction", "screens", "warm room"];
const PERIOD_DAYS = [1, 2, 3, 4, 5, 6, 7];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    yesterdayIndex?: string;
    yesterdayLabel?: string;
    energyIndex?: string;
    energyLabel?: string;
    bodyIndex?: string;
    bodyLabel?: string;
  }>();

  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(INITIAL_SELECTED),
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Period bottom sheet modal state
  const [isPeriodModalVisible, setIsPeriodModalVisible] = useState<boolean>(false);
  const [selectedPeriodDay, setSelectedPeriodDay] = useState<number | null>(null);

  const handleToggleTag = (tag: string) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    setSelectedTags(next);
  };

  const handleToggleCategoryDrawer = () => {
    setIsCategoryDrawerOpen(!isCategoryDrawerOpen);
  };

  const handleSelectCategory = (categoryId: string) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    handleOpenPeriodSheet();
  };

  // Opens period bottom sheet modal
  const handleOpenPeriodSheet = () => {
    setIsPeriodModalVisible(true);
  };

  const navigateToSaved = (periodInfo?: string) => {
    setIsPeriodModalVisible(false);
    const tagsString = Array.from(selectedTags).join(" · ");
    router.push({
      pathname: "/(check-in)/saved",
      params: {
        yesterdayIndex: params.yesterdayIndex,
        yesterdayLabel: params.yesterdayLabel,
        energyIndex: params.energyIndex ?? "2",
        energyLabel: params.energyLabel ?? "middling",
        bodyIndex: params.bodyIndex ?? "2",
        bodyLabel: params.bodyLabel ?? "tender",
        tags: tagsString,
        periodInfo: periodInfo,
      },
    });
  };

  const handlePeriodSave = () => {
    const periodInfo = selectedPeriodDay ? `Day ${selectedPeriodDay}` : undefined;
    navigateToSaved(periodInfo);
  };

  const handlePeriodSkip = () => {
    navigateToSaved(undefined);
  };

  // Filter tags by search query and category
  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategoryId);
  const baseTags = activeCategory ? activeCategory.tags : ALL_TAGS;

  const filteredTags = baseTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Top navigation bar ───────────────────────────────────────── */}
        <View style={[styles.topNav, isPeriodModalVisible && styles.bgDimmed]}>
          {/* Back button */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Question 2"
          >
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>

          {/* Progress indicator (Question 3 of 3: dot, dot, active pill) */}
          <View style={styles.progressRow}>
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressActive} />
          </View>

          {/* Skip link */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Skip"
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* ── Fixed Viewport Content ──────────────────────────────────── */}
        <View style={[styles.contentArea, isPeriodModalVisible && styles.bgDimmed]}>
          {/* ── Question Label ─────────────────────────────────────────── */}
          <Text style={styles.questionLabel}>QUESTION 3 OF 3</Text>

          {/* ── Question Heading ───────────────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={styles.headingDark}>Anything from{"\n"}</Text>
            <Text style={styles.headingAccent}>today worth noting?</Text>
          </Text>

          {/* ── Supporting Subtitle ────────────────────────────────────── */}
          <Text style={styles.supportingText}>
            Tap any that apply. Skip if nothing fits.
          </Text>

          {/* ── Search & Filter Row ────────────────────────────────────── */}
          <View style={styles.searchRow}>
            {/* Filter icon button */}
            <Pressable
              onPress={handleToggleCategoryDrawer}
              style={({ pressed }) => [
                styles.filterButton,
                isCategoryDrawerOpen && styles.filterButtonActive,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Browse by category"
            >
              <SymbolView
                name="slider.horizontal.3"
                size={20}
                tintColor={isCategoryDrawerOpen ? COLORS.accent : COLORS.headingDark}
              />
            </Pressable>

            {/* Search Input bar */}
            <View style={styles.searchBar}>
              <SymbolView
                name="magnifyingglass"
                size={18}
                tintColor={COLORS.mutedText}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tags..."
                placeholderTextColor={COLORS.mutedText}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
          </View>

          {/* ── Browse by Category Drawer ─────────────────────────────── */}
          {isCategoryDrawerOpen && (
            <View style={styles.categoryDrawer}>
              <Text style={styles.categoryDrawerTitle}>BROWSE BY CATEGORY</Text>
              <View style={styles.categoryPillsRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => handleSelectCategory(cat.id)}
                      style={({ pressed }) => [
                        styles.categoryPill,
                        isSelected && styles.categoryPillSelected,
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={cat.label}
                    >
                      <Text
                        style={[
                          styles.categoryPillText,
                          isSelected && styles.categoryPillTextSelected,
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Tag Chips Cloud ────────────────────────────────────────── */}
          <ScrollView
            style={styles.tagsScrollView}
            contentContainerStyle={styles.tagsContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredTags.map((tag) => {
              const isSelected = selectedTags.has(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => handleToggleTag(tag)}
                  style={({ pressed }) => [
                    styles.tagChip,
                    isSelected
                      ? styles.tagChipSelected
                      : styles.tagChipUnselected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={tag}
                >
                  <Text
                    style={[
                      styles.tagText,
                      isSelected
                        ? styles.tagTextSelected
                        : styles.tagTextUnselected,
                    ]}
                  >
                    {isSelected ? `✓ ${tag}` : tag}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Bottom Section: Save Button & Helper Text ────────────────── */}
        <View style={[styles.bottomSection, isPeriodModalVisible && styles.bgDimmed]}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleOpenPeriodSheet}
            accessibilityRole="button"
            accessibilityLabel="Save and continue"
          >
            <Text style={styles.saveButtonText}>Save</Text>
            <Text style={styles.nextArrow}>›</Text>
          </Pressable>

          <Text style={styles.bottomHelperText}>
            You can do this lying down.
          </Text>
        </View>
      </SafeAreaView>

      {/* ── Period Bottom Sheet Modal with Blur & Focus ───────────────── */}
      <Modal
        visible={isPeriodModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handlePeriodSkip}
      >
        <View style={styles.modalOverlay}>
          {/* Dismissible Backdrop */}
          <Pressable style={styles.modalDismissArea} onPress={handlePeriodSkip} />

          {/* Bottom Sheet Container */}
          <View style={styles.periodSheetContainer}>
            {/* Sheet Drag Handle Bar */}
            <View style={styles.handleBar} />

            {/* Sheet Title matching app typography */}
            <Text style={styles.sheetHeading}>
              <Text style={styles.sheetHeadingDark}>What day of your </Text>
              <Text style={styles.sheetHeadingAccent}>period?</Text>
            </Text>

            {/* Helper Description */}
            <Text style={styles.sheetDescription}>
              Day 1 = first day of bleeding. This helps heedly understand your cycle over time. Skippable anytime.
            </Text>

            {/* 7 Days Number Row */}
            <View style={styles.dayNumbersRow}>
              {PERIOD_DAYS.map((day) => {
                const isSelected = selectedPeriodDay === day;
                return (
                  <Pressable
                    key={day}
                    onPress={() => setSelectedPeriodDay(isSelected ? null : day)}
                    style={({ pressed }) => [
                      styles.dayNumberBtn,
                      isSelected && styles.dayNumberBtnSelected,
                      pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`Day ${day}`}
                  >
                    <Text
                      style={[
                        styles.dayNumberText,
                        isSelected && styles.dayNumberTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Sheet Save CTA Button */}
            <Pressable
              style={({ pressed }) => [
                styles.sheetSaveBtn,
                pressed && styles.buttonPressed,
              ]}
              onPress={handlePeriodSave}
              accessibilityRole="button"
              accessibilityLabel="Save period entry"
            >
              <Text style={styles.sheetSaveBtnText}>Save</Text>
              <Text style={styles.nextArrow}>›</Text>
            </Pressable>

            {/* Sheet Skip Link */}
            <Pressable
              onPress={handlePeriodSkip}
              style={({ pressed }) => [styles.sheetSkipBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Skip period entry"
            >
              <Text style={styles.sheetSkipText}>Skip</Text>
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
    overflow: "hidden",
  },

  safeArea: {
    flex: 1,
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

  // ── Top Nav ──────────────────────────────────────────────────────────────

  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    height: 44,
  },

  navButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  backChevron: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.bodyText,
  },

  skipText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 16,
    lineHeight: 22,
    color: COLORS.mutedText,
    paddingBottom: 4,
    paddingRight: 6,
    paddingLeft: 2,
  },

  // ── Progress Bar ─────────────────────────────────────────────────────────

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  progressActive: {
    width: 32,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  progressDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.progressInactive,
  },

  // ── Fixed Viewport Content ───────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },

  questionLabel: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 12,
    color: COLORS.mutedText,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  questionHeading: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 38,
    lineHeight: 46,
    marginBottom: 6,
  },

  headingDark: {
    color: COLORS.headingDark,
  },

  headingAccent: {
    color: COLORS.accent,
  },

  supportingText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 16.5,
    lineHeight: 23,
    color: "#463332",
    marginBottom: 14,
  },

  // ── Search & Filter Row ──────────────────────────────────────────────────

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonActive: {
    backgroundColor: "rgba(224, 120, 96, 0.15)",
    borderColor: COLORS.accent,
  },

  searchBar: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontFamily: "AvenirNext-Regular",
    fontSize: 16,
    color: COLORS.headingDark,
    paddingVertical: 0,
  },

  // ── Category Drawer ──────────────────────────────────────────────────────

  categoryDrawer: {
    backgroundColor: COLORS.drawerBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.drawerBorder,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#8C6A6A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  categoryDrawerTitle: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 11,
    color: "rgba(74, 58, 57, 0.65)",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  categoryPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255, 251, 248, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(212, 184, 174, 0.4)",
  },

  categoryPillSelected: {
    backgroundColor: COLORS.tagSelectedBg,
    borderColor: COLORS.tagSelectedBg,
  },

  categoryPillText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 14,
    color: "#463332",
  },

  categoryPillTextSelected: {
    fontFamily: "AvenirNext-DemiBold",
    color: "#FFFFFF",
  },

  // ── Tag Chips Cloud ──────────────────────────────────────────────────────

  tagsScrollView: {
    flex: 1,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 16,
  },

  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
  },

  tagChipSelected: {
    backgroundColor: COLORS.tagSelectedBg,
    borderColor: COLORS.tagSelectedBg,
  },

  tagChipUnselected: {
    backgroundColor: COLORS.tagUnselectedBg,
    borderColor: COLORS.tagUnselectedBorder,
  },

  tagText: {
    fontSize: 15,
  },

  tagTextSelected: {
    color: COLORS.tagSelectedText,
    fontFamily: "AvenirNext-DemiBold",
  },

  tagTextUnselected: {
    color: COLORS.tagUnselectedText,
    fontFamily: "AvenirNext-Regular",
  },

  // ── Bottom Action Section ─────────────────────────────────────────────────

  bottomSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: 24,
    gap: 12,
  },

  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.buttonFill,
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 24,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 5,
  },

  saveButtonText: {
    flex: 1,
    textAlign: "center",
    color: COLORS.buttonText,
    fontSize: 17,
    fontFamily: "AvenirNext-DemiBold",
    letterSpacing: 0.1,
  },

  nextArrow: {
    color: COLORS.buttonText,
    fontSize: 26,
    fontWeight: "300",
    lineHeight: 28,
    opacity: 0.85,
  },

  bottomHelperText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 13.5,
    color: "#6B4C3E",
    textAlign: "center",
  },

  // ── Period Bottom Sheet Modal Styles ──────────────────────────────────────

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(45, 25, 20, 0.52)",
    justifyContent: "flex-end",
  },

  modalDismissArea: {
    flex: 1,
  },

  periodSheetContainer: {
    backgroundColor: COLORS.modalBg,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: COLORS.sheetBorder,
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

  sheetHeading: {
    fontSize: 30,
    lineHeight: 36,
    marginBottom: 8,
  },

  sheetHeadingDark: {
    fontFamily: "AvenirNext-Regular",
    color: COLORS.headingDark,
  },

  sheetHeadingAccent: {
    fontFamily: "AvenirNext-Regular",
    color: COLORS.accent,
  },

  sheetDescription: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 15,
    lineHeight: 21,
    color: "rgba(70, 51, 50, 0.75)",
    marginBottom: 24,
  },

  dayNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  dayNumberBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(212, 184, 174, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8C6A6A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },

  dayNumberBtnSelected: {
    backgroundColor: COLORS.buttonFill,
    borderColor: COLORS.buttonFill,
  },

  dayNumberText: {
    fontFamily: "AvenirNext-DemiBold",
    fontSize: 16.5,
    color: COLORS.headingDark,
  },

  dayNumberTextSelected: {
    color: "#FFFFFF",
  },

  sheetSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.buttonFill,
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 24,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 5,
    marginBottom: 16,
  },

  sheetSaveBtnText: {
    flex: 1,
    textAlign: "center",
    color: COLORS.buttonText,
    fontSize: 17,
    fontFamily: "AvenirNext-DemiBold",
    letterSpacing: 0.1,
  },

  sheetSkipBtn: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 20,
  },

  sheetSkipText: {
    fontFamily: "AvenirNext-Regular",
    fontSize: 15.5,
    color: COLORS.mutedText,
    textAlign: "center",
  },
});
