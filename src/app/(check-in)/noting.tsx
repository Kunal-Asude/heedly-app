import { LinearGradient } from "expo-linear-gradient";
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
import Svg, { Path } from "react-native-svg";

import { DawnBackground } from "@/components/core";
import { CORAL, Fonts, INK } from "@/constants/theme";
import { useCheckInConfig } from "@/hooks/data";

// ─── Design tokens (from Aubade Dawn HTML) ─────────────────────────────────────

const COLORS = {
  background: "#F5DDD5",
  headingDark: "#463332",
  accent: "#b0532f",
  bodyText: "#463332",
  mutedText: "rgba(74, 58, 57, 0.5)",
  progressInactive: "rgba(74, 58, 57, 0.18)",
  inputBg: "rgba(255, 252, 248, 0.82)",
  inputBorder: "rgba(255, 255, 255, 0.8)",
  drawerBg: "rgba(255, 252, 248, 0.7)",
  drawerBorder: "rgba(255, 255, 255, 0.8)",
  tagUnselectedBg: "rgba(255, 252, 248, 0.76)",
  tagUnselectedBorder: "rgba(255, 255, 255, 0.8)",
  tagUnselectedText: "#5a4644",
  tagSelectedBg: "rgba(244, 164, 126, 0.2)",
  tagSelectedBorder: "rgba(224, 115, 95, 0.42)",
  tagSelectedText: "#4f3c3a",
  modalBg: "#fbf3ec",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotingScreen() {
  const router = useRouter();
  const { categories, allTags, initialSelectedTags, periodDays } = useCheckInConfig();
  const params = useLocalSearchParams<{
    yesterdayIndex?: string;
    yesterdayLabel?: string;
    energyIndex?: string;
    energyLabel?: string;
    bodyIndex?: string;
    bodyLabel?: string;
    tags?: string;
    periodInfo?: string;
    isFirstTime?: string;
    isEditing?: string;
    openPeriod?: string;
  }>();

  const isEditing = params.isEditing === 'true';
  const openPeriod = params.openPeriod === 'true';

  const initialTags = params.tags && params.tags.trim().length > 0
    ? new Set(params.tags.split(' · ').map((t) => t.trim()))
    : new Set(initialSelectedTags);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(initialTags);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Period bottom sheet modal state
  const initialPeriodDay = params.periodInfo && params.periodInfo.startsWith('Day ')
    ? Number(params.periodInfo.replace('Day ', ''))
    : null;
  const [isPeriodModalVisible, setIsPeriodModalVisible] = useState<boolean>(openPeriod);
  const [selectedPeriodDay, setSelectedPeriodDay] = useState<number | null>(initialPeriodDay);

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
    if (isEditing) {
      router.push({
        pathname: "/(check-in)/saved",
        params: {
          ...params,
        },
      });
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    if (isEditing) {
      router.push({
        pathname: "/(check-in)/saved",
        params: {
          ...params,
        },
      });
      return;
    }
    handleOpenPeriodSheet();
  };

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
        isFirstTime: params.isFirstTime,
      },
    });
  };

  const handleSaveButtonPress = () => {
    if (isEditing) {
      navigateToSaved(params.periodInfo);
    } else {
      handleOpenPeriodSheet();
    }
  };

  const handlePeriodSave = () => {
    const periodInfo = selectedPeriodDay ? `Day ${selectedPeriodDay}` : undefined;
    navigateToSaved(periodInfo);
  };

  const handlePeriodSkip = () => {
    navigateToSaved(undefined);
  };

  // Filter tags by search query and category
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const baseTags = activeCategory ? activeCategory.tags : allTags;

  const filteredTags = baseTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Top navigation bar (.ci-head) ────────────────────────────── */}
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
            <LinearGradient
              colors={['#f0a07e', '#e0735f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressActive}
            />
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
          {/* ── Question Label (.ci-eyebrow) ───────────────────────────── */}
          <Text style={styles.questionLabel}>QUESTION 3 OF 3</Text>

          {/* ── Question Heading (.ob-h: 31px, Comfortaa 400) ──────────── */}
          <Text style={styles.questionHeading}>
            <Text style={styles.headingDark}>Anything from{"\n"}</Text>
            <Text style={styles.headingAccent}>today worth noting?</Text>
          </Text>

          {/* ── Supporting Subtitle (.ob-sub: 14.5px) ──────────────────── */}
          <Text style={styles.supportingText}>
            Tap any that apply. Skip if nothing fits.
          </Text>

          {/* ── Search & Filter Row (.ci-find: .ci-filter-btn + .ci-search) ── */}
          <View style={styles.searchRow}>
            {/* Filter icon button (.ci-filter-btn) */}
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
                tintColor={isCategoryDrawerOpen ? "#c9603f" : "rgba(74, 58, 57, 0.6)"}
              />
            </Pressable>

            {/* Search Input bar (.ci-search) */}
            <View style={styles.searchBar}>
              <SymbolView
                name="magnifyingglass"
                size={17}
                tintColor="rgba(74, 58, 57, 0.42)"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tags..."
                placeholderTextColor="rgba(74, 58, 57, 0.4)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
          </View>

          {/* ── Browse by Category Drawer (.ci-browse) ────────────────── */}
          {isCategoryDrawerOpen && (
            <View style={styles.categoryDrawer}>
              <Text style={styles.categoryDrawerTitle}>BROWSE BY CATEGORY</Text>
              <View style={styles.categoryPillsRow}>
                {categories.map((cat) => {
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

          {/* ── Tag Chips Cloud (.ci-tags) ─────────────────────────────── */}
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
                  {isSelected && (
                    <Text style={styles.tagCheckIcon}>✓ </Text>
                  )}
                  <Text
                    style={[
                      styles.tagText,
                      isSelected
                        ? styles.tagTextSelected
                        : styles.tagTextUnselected,
                    ]}
                  >
                    {tag}
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
              styles.saveButtonWrapper,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSaveButtonPress}
            accessibilityRole="button"
            accessibilityLabel="Save and continue"
          >
            <LinearGradient
              colors={[CORAL.light, CORAL.mid, CORAL.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save</Text>
              <View style={styles.saveArrowContainer}>
                <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 5l7 7-7 7"
                    stroke="#fff8f4"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </LinearGradient>
          </Pressable>

          <Text style={styles.bottomHelperText}>
            You can do this lying down.
          </Text>
        </View>
      </SafeAreaView>

      {/* ── Period Bottom Sheet Modal (.nd-sheet / .ci-sheet) ─────────── */}
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
            {/* Sheet Drag Handle Bar (.nd-grip) */}
            <View style={styles.handleBar} />

            {/* Sheet Title (.nd-sheet h3: Comfortaa 400, 25px) */}
            <Text style={styles.sheetHeading}>
              <Text style={styles.sheetHeadingDark}>What day of your </Text>
              <Text style={styles.sheetHeadingAccent}>period?</Text>
            </Text>

            {/* Helper Description (.nd-body: 14.5px, line-height 22px) */}
            <Text style={styles.sheetDescription}>
              Day 1 = first day of bleeding. This helps heedly understand your cycle over time. Skippable anytime.
            </Text>

            {/* 7 Days Number Row */}
            <View style={styles.dayNumbersRow}>
              {periodDays.map((day) => {
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

            {/* Sheet Save CTA Button (.ob-cta gradient) */}
            <Pressable
              style={({ pressed }) => [
                styles.sheetSaveBtnWrapper,
                pressed && styles.buttonPressed,
              ]}
              onPress={handlePeriodSave}
              accessibilityRole="button"
              accessibilityLabel="Save period entry"
            >
              <LinearGradient
                colors={[CORAL.light, CORAL.mid, CORAL.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sheetSaveBtnGradient}
              >
                <Text style={styles.sheetSaveBtnText}>Save</Text>
                <View style={styles.saveArrowContainer}>
                  <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M8 5l7 7-7 7"
                      stroke="#fff8f4"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </LinearGradient>
            </Pressable>

            {/* Sheet Skip Link (.nd-skip: 14px, 600, color rgba(74,58,57,0.5)) */}
            <Pressable
              onPress={handlePeriodSkip}
              style={({ pressed }) => [styles.sheetSkipBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Skip period entry"
            >
              <Text style={styles.sheetSkipText}>Skip for now</Text>
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

  safeArea: {
    flex: 1,
    paddingTop: 12,
  },

  pressed: {
    opacity: 0.7,
  },

  bgDimmed: {
    opacity: 0.2,
  },

  // ── Top Nav (.ci-head) ───────────────────────────────────────────────────

  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    height: 52,
    marginBottom: 10,
  },

  navButton: {
    height: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
    color: "rgba(74, 58, 57, 0.6)",
  },

  skipText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "500",
    color: "rgba(74, 58, 57, 0.5)",
  },

  // ── Progress Bar (.ci-dots) ──────────────────────────────────────────────

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  progressActive: {
    width: 22,
    height: 7,
    borderRadius: 4,
  },

  progressDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(74, 58, 57, 0.18)",
  },

  // ── Fixed Viewport Content ───────────────────────────────────────────────

  contentArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },

  // ── Question Label (.ci-eyebrow) ─────────────────────────────────────────

  questionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(74, 58, 57, 0.5)",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 9,
  },

  // ── Question Heading (.ob-h: Comfortaa 400, 31px) ─────────────────────────

  questionHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 12,
  },

  headingDark: {
    color: INK.display,
  },

  headingAccent: {
    color: CORAL.terracottaDeep,
  },

  // ── Supporting Text (.ob-sub: 14.5px, line-height 22px) ──────────────────

  supportingText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: "400",
    color: "rgba(74, 58, 57, 0.66)",
    marginBottom: 16,
  },

  // ── Search & Filter Row (.ci-find: .ci-filter-btn + .ci-search) ──────────

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  // .ci-filter-btn: 46x46, radius 14, border 1px rgba(255,255,255,0.8), bg rgba(255,252,248,0.82)
  filterButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 9,
    elevation: 1,
  },

  filterButtonActive: {
    backgroundColor: "rgba(244, 164, 126, 0.22)",
    borderColor: "rgba(224, 115, 95, 0.42)",
  },

  // .ci-search: height 46, radius 14, border 1px rgba(255,255,255,0.8), bg rgba(255,252,248,0.82)
  searchBar: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#4f3c3a",
    paddingVertical: 0,
  },

  // ── Category Drawer (.ci-browse) ─────────────────────────────────────────

  categoryDrawer: {
    backgroundColor: COLORS.drawerBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.drawerBorder,
    padding: 15,
    marginBottom: 14,
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  // .ci-browse-label: 11px, letter-spacing 0.14em, uppercase, 600, rgba(74,58,57,0.5)
  categoryDrawerTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(74, 58, 57, 0.5)",
    letterSpacing: 1.54,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  categoryPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  // .ci-browse-chip: padding 9px 15px, radius 999, bg rgba(255,255,255,0.72), 13px, 600, #5a4644
  categoryPill: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.85)",
  },

  categoryPillSelected: {
    backgroundColor: CORAL.primary,
    borderColor: "transparent",
  },

  categoryPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5a4644",
  },

  categoryPillTextSelected: {
    color: "#fff8f4",
  },

  // ── Tag Chips Cloud (.ci-tags) ───────────────────────────────────────────

  tagsScrollView: {
    flex: 1,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    paddingBottom: 16,
  },

  // .ci-tag: padding 9px 15px, radius 999, font 13.5px, 600, shadow
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 9,
    elevation: 1,
  },

  tagChipSelected: {
    backgroundColor: "rgba(244, 164, 126, 0.2)",
    borderColor: "rgba(224, 115, 95, 0.42)",
  },

  tagChipUnselected: {
    backgroundColor: "rgba(255, 252, 248, 0.76)",
    borderColor: "rgba(255, 255, 255, 0.8)",
  },

  tagCheckIcon: {
    fontSize: 13,
    fontWeight: "700",
    color: "#cf6a4c",
  },

  tagText: {
    fontSize: 13.5,
    fontWeight: "600",
  },

  tagTextSelected: {
    color: "#4f3c3a",
  },

  tagTextUnselected: {
    color: "#5a4644",
  },

  // ── Bottom Action Section (.ob-cta gradient) ──────────────────────────────

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
    gap: 14,
  },

  saveButtonWrapper: {
    width: "100%",
    height: 58,
    borderRadius: 29,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  saveButtonGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  saveButtonText: {
    color: "#fff8f4",
    fontSize: 16.5,
    fontWeight: "600",
    letterSpacing: -0.15,
    textAlign: "center",
  },

  saveArrowContainer: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  bottomHelperText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
    color: "rgba(74, 58, 57, 0.5)",
    textAlign: "center",
  },

  // ── Period Bottom Sheet Modal Styles (.nd-sheet) ─────────────────────────

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(74, 58, 57, 0.34)",
    justifyContent: "flex-end",
  },

  modalDismissArea: {
    flex: 1,
  },

  periodSheetContainer: {
    backgroundColor: COLORS.modalBg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 30,
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
    marginBottom: 18,
  },

  sheetHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.25,
    marginBottom: 10,
  },

  sheetHeadingDark: {
    color: INK.display,
  },

  sheetHeadingAccent: {
    color: CORAL.terracottaDeep,
  },

  sheetDescription: {
    fontSize: 14.5,
    lineHeight: 22,
    color: "rgba(74, 58, 57, 0.72)",
    marginBottom: 20,
  },

  dayNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  dayNumberBtn: {
    width: 42,
    height: 42,
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
    backgroundColor: CORAL.primary,
    borderColor: "transparent",
  },

  dayNumberText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4f3c3a",
  },

  dayNumberTextSelected: {
    color: "#FFFFFF",
  },

  sheetSaveBtnWrapper: {
    width: "100%",
    height: 58,
    borderRadius: 29,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
    marginTop: 4,
    marginBottom: 14,
  },

  sheetSaveBtnGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },

  sheetSaveBtnText: {
    color: "#fff8f4",
    fontSize: 16.5,
    fontWeight: "600",
    letterSpacing: -0.15,
    textAlign: "center",
  },

  sheetSkipBtn: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 20,
  },

  sheetSkipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(74, 58, 57, 0.5)",
    textAlign: "center",
  },
});
