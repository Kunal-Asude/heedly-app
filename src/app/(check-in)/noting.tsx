import { SymbolView } from "@/components/ui/symbol";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { DawnBackground } from "@/components/core";
import { CORAL, Fonts, INK } from "@/constants/theme";
import { useTheme } from "@/constants/themes";
import { useCheckIn } from "@/contexts/CheckInContext";
import { useThemeMode } from "@/contexts/ThemeContext";
import { useCheckInConfig, useTagCatalogue } from '@/hooks/data';
import { useCheckInPalette } from '@/constants/checkInPalette';

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
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const ci = useCheckInPalette();
  const { periodDays } = useCheckInConfig();
  const { categories, allTags } = useTagCatalogue();
  const {
    currentEntry: activeEntry,
    updateEntry,
    isEditing: contextIsEditing,
    cancelEdit,
    commitEdit,
  } = useCheckIn();
  const params = useLocalSearchParams<{
    isEditing?: string;
    openPeriod?: string;
  }>();

  const isEditing = params.isEditing === 'true' || contextIsEditing;
  const openPeriod = params.openPeriod === 'true';

  // Seeded only from what the person has actually chosen. Seeding this with a
  // default set made those defaults indistinguishable from real selections:
  // every exit wrote them, and handleToggleTag carried them along with the
  // first real tap. Untouched means no tags, not three.
  const initialTags = new Set(activeEntry.tags ?? []);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(initialTags);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Open by default so categories show without a tap; the filter button hides them.
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Period bottom sheet modal state
  const initialPeriodDay = activeEntry.periodInfo && activeEntry.periodInfo.startsWith('Day ')
    ? Number(activeEntry.periodInfo.replace('Day ', '').split(' ')[0])
    : null;
  const [isPeriodModalVisible, setIsPeriodModalVisible] = useState<boolean>(openPeriod);
  const [selectedPeriodDay, setSelectedPeriodDay] = useState<number | null>(initialPeriodDay);

  // Selecting `period` asks for the cycle day in a sheet over the tags. Every
  // way out of that sheet returns here, so the rest of the tags can still be
  // chosen; only the main Save finishes the check-in.
  const handleToggleTag = (tag: string) => {
    const next = new Set(selectedTags);
    const clearsPeriod = tag === 'period' && next.has(tag);
    if (next.has(tag)) {
      next.delete(tag);
      if (tag === 'period') {
        setSelectedPeriodDay(null);
      }
    } else {
      next.add(tag);
      if (tag === 'period') {
        setIsPeriodModalVisible(true);
      }
    }
    setSelectedTags(next);
    updateEntry(
      clearsPeriod
        ? { tags: Array.from(next), periodInfo: null }
        : { tags: Array.from(next) },
    );
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
      cancelEdit();
      router.push("/(check-in)/saved");
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(check-in)/body");
    }
  };

  const handleSkip = () => {
    navigateToSaved(undefined);
  };

  const navigateToSaved = (periodInfo?: string) => {
    setIsPeriodModalVisible(false);
    updateEntry({
      tags: Array.from(selectedTags),
      periodInfo: periodInfo !== undefined ? periodInfo : activeEntry.periodInfo ?? null,
    });
    // Every route through here is a deliberate forward move, so it is the
    // commit boundary. Back is the only discard, and it does not come here.
    if (isEditing) {
      commitEdit();
    }
    router.push("/(check-in)/saved");
  };

  const handleSaveButtonPress = () => {
    navigateToSaved(undefined);
  };

  // Arriving from the CYCLE row on `saved` (`openPeriod`) means the cycle day
  // is the only thing being changed, so the sheet goes straight back there.
  // Opened from the tag, it returns to the tags instead.
  const handlePeriodSave = () => {
    const periodInfo = selectedPeriodDay ? `Day ${selectedPeriodDay}` : undefined;
    if (openPeriod) {
      navigateToSaved(periodInfo);
      return;
    }
    if (periodInfo !== undefined) {
      updateEntry({ periodInfo });
    }
    setIsPeriodModalVisible(false);
  };

  const handlePeriodSkip = () => {
    if (openPeriod) {
      navigateToSaved(undefined);
      return;
    }
    setIsPeriodModalVisible(false);
  };

  // Filter tags by search query and category
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const baseTags = activeCategory ? activeCategory.tags : allTags;

  const filteredTags = baseTags.filter((tag) =>
    tag.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <View style={styles.root}>
      {/* Exact Atmosphere Background */}
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
            <SymbolView name="chevron.left" size={21} tintColor={ci.back} />
          </Pressable>

          {/* Progress indicator (Question 3 of 3: dot, dot, active pill) */}
          <View style={styles.progressRow}>
            <View
              style={[
                styles.progressDot,
                { backgroundColor: ci.dotOff },
              ]}
            />
            <View
              style={[
                styles.progressDot,
                { backgroundColor: ci.dotOff },
              ]}
            />
            <LinearGradient
              colors={ci.dotOn}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
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
            <Text
              style={[
                styles.skipText,
                { color: ci.skip },
              ]}
            >
              Skip
            </Text>
          </Pressable>
        </View>

        {/* ── Fixed Viewport Content ──────────────────────────────────── */}
        <View style={[styles.contentArea, isPeriodModalVisible && styles.bgDimmed]}>
          {/* ── Question Eyebrow (.ci-eyebrow) ─────────────────────────── */}
          <Text
            style={[
              styles.questionLabel,
              { color: ci.skip },
            ]}
          >
            QUESTION 3 OF 3
          </Text>

          {/* ── Question Heading (.ob-h) ───────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={{ color: ci.heading }}>Anything from{"\n"}</Text>
            <Text style={{ color: ci.accent }}>today worth noting?</Text>
          </Text>

          {/* ── Supporting Subtitle (.ob-sub) ──────────────────────────── */}
          <Text
            style={[
              styles.supportingText,
              { color: ci.sub },
            ]}
          >
            Tap any that apply. Skip if nothing fits.
          </Text>

          {/* ── Search & Filter Row (.ci-find: .ci-filter-btn + .ci-search) ── */}
          <View style={styles.searchRow}>
            {/* Filter icon button (.ci-filter-btn) */}
            <Pressable
              onPress={handleToggleCategoryDrawer}
              style={({ pressed }) => [
                styles.filterButton,
                {
                  backgroundColor: isCategoryDrawerOpen ? ci.filterOnBg : ci.fieldBg,
                  borderColor: isCategoryDrawerOpen ? ci.filterOnBorder : ci.fieldBorder,
                },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Browse by category"
            >
              <SymbolView
                name="slider.horizontal.3"
                size={20}
                tintColor={isCategoryDrawerOpen ? ci.filterOnIcon : ci.fieldIcon}
              />
            </Pressable>

            {/* Search Input bar (.ci-search) */}
            <View
              style={[
                styles.searchBar,
                { backgroundColor: ci.fieldBg, borderColor: ci.fieldBorder },
              ]}
            >
              <SymbolView
                name="magnifyingglass"
                size={17}
                tintColor={ci.searchIcon}
              />
              <TextInput
                style={[
                  styles.searchInput,
                  { color: ci.searchText },
                ]}
                placeholder="Search tags..."
                placeholderTextColor={isDark ? (isTrueBlack ? "rgba(154, 138, 145, 0.65)" : "rgba(199, 180, 191, 0.54)") : "rgba(74, 58, 57, 0.4)"}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </View>
          </View>

          {/* ── Browse by Category Drawer (.ci-browse) ────────────────── */}
          {isCategoryDrawerOpen && categories.length > 0 && (
            <View
              style={[
                styles.categoryDrawer,
                { backgroundColor: ci.browseBg, borderColor: ci.browseBorder },
              ]}
            >
              <Text
                style={[
                  styles.categoryDrawerTitle,
                  { color: ci.browseLabel },
                ]}
              >
                BROWSE BY CATEGORY
              </Text>
              <View style={styles.categoryPillsRow}>
                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => handleSelectCategory(cat.id)}
                      style={({ pressed }) => [
                        styles.categoryPill,
                        isSelected
                          ? { backgroundColor: ci.tagOnBg ?? "transparent", borderColor: ci.tagOnBorder }
                          : { backgroundColor: ci.chipBg, borderColor: ci.chipBorder },
                        isSelected && ci.tagOnBg === null && styles.coralLift,
                        pressed && styles.pressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={cat.label}
                    >
                      {isSelected && ci.tagOnBg === null && (
                        <LinearGradient
                          colors={ci.dotOn}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.coralFill}
                        />
                      )}
                      <Text
                        style={[
                          styles.categoryPillText,
                          { color: isSelected ? ci.tagOnText : ci.chipText },
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
              const isSelected = selectedTags.has(tag.id);
              return (
                <Pressable
                  key={tag.id}
                  onPress={() => handleToggleTag(tag.id)}
                  style={({ pressed }) => [
                    styles.tagChip,
                    isSelected
                      ? { backgroundColor: ci.tagOnBg ?? "transparent", borderColor: ci.tagOnBorder }
                      : { backgroundColor: ci.tagBg, borderColor: ci.tagBorder },
                    isSelected && ci.tagOnBg === null && styles.coralLift,
                    isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={tag.label}
                >
                  {isSelected && ci.tagOnBg === null && (
                    <LinearGradient
                      colors={ci.dotOn}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.coralFill}
                    />
                  )}
                  {isSelected && (
                    <SymbolView name="checkmark" size={13} tintColor={ci.tagCheck} />
                  )}
                  <Text
                    style={[
                      styles.tagText,
                      { color: isSelected ? ci.tagOnText : ci.tagText },
                    ]}
                  >
                    {tag.label}
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
              isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
            ]}
            onPress={handleSaveButtonPress}
            accessibilityRole="button"
            accessibilityLabel="Save and continue"
          >
            <LinearGradient
              colors={
                isDark
                  ? isTrueBlack
                    ? ["#574049", "#241A20"]
                    : ["#634256", "#8A5D7C", "#9E768E"]
                  : [theme.coral.light, theme.coral.mid, theme.coral.primary]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.saveButtonGradient,
                isDark && isTrueBlack && {
                  borderColor: "rgba(255, 255, 255, 0.06)",
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.saveButtonText, isDark && isTrueBlack && { color: "#EADCD4" }]}>Save</Text>
              <View style={styles.saveArrowContainer}>
                <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 5l7 7-7 7"
                    stroke={isDark && isTrueBlack ? "#EADCD4" : "#fff8f4"}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </LinearGradient>
          </Pressable>

          <Text
            style={[
              styles.bottomHelperText,
              { color: isDark ? (isTrueBlack ? "#9A8A91" : "rgba(199, 180, 191, 0.65)") : "rgba(74, 58, 57, 0.5)" },
            ]}
          >
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
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: ci.scrim },
          ]}
        >
          {/* Dismissible Backdrop */}
          <Pressable style={styles.modalDismissArea} onPress={handlePeriodSkip} />

          {/* Bottom Sheet Container */}
          <View
            style={[
              styles.periodSheetContainer,
              {
                backgroundColor: ci.sheetBg,
                borderColor: ci.sheetBorder ?? "transparent",
                borderWidth: ci.sheetBorder ? 1 : 0,
                shadowOpacity: isDark ? 0.4 : 0.22,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 28,
              },
            ]}
          >
            {/* Sheet Drag Handle Bar (.nd-grip) */}
            <View
              style={[
                styles.handleBar,
                { backgroundColor: ci.grip },
              ]}
            />

            {/* Sheet Title (.nd-sheet h3: Comfortaa 400, 26px) */}
            <Text style={styles.sheetHeading}>
              <Text
                style={[
                  styles.sheetHeadingDark,
                  { color: ci.heading },
                ]}
              >
                What day of your{" "}
              </Text>
              <Text
                style={[
                  styles.sheetHeadingAccent,
                  { color: ci.accent },
                ]}
              >
                period?
              </Text>
            </Text>

            {/* Helper Description (.nd-body: 14.5px, line-height 21px) */}
            <Text
              style={[
                styles.sheetDescription,
                { color: ci.sheetSub },
              ]}
            >
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
                      isSelected
                        ? { backgroundColor: ci.tagOnBg ?? "transparent", borderColor: ci.dayOnBorder }
                        : { backgroundColor: ci.dayBg, borderColor: ci.dayBorder },
                      isSelected && ci.tagOnBg === null && styles.dayNumberBtnSelectedShadow,
                      pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`Day ${day}`}
                  >
                    {isSelected && ci.tagOnBg === null && (
                      <LinearGradient
                        colors={ci.dotOn}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.dayFill}
                      />
                    )}
                    <Text
                      style={[
                        styles.dayNumberText,
                        { color: isSelected ? ci.dayOnText : ci.dayText },
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
                { shadowOpacity: ci.ctaShadowOpacity },
                ci.ctaShadowOpacity === 0 && { elevation: 0 },
              ]}
              onPress={handlePeriodSave}
              accessibilityRole="button"
              accessibilityLabel="Save period entry"
            >
              <LinearGradient
                colors={ci.cta}
                start={{ x: 0, y: ci.ctaHorizontal ? 0.5 : 0 }}
                end={{ x: 1, y: ci.ctaHorizontal ? 0.5 : 1 }}
                style={styles.sheetSaveBtnGradient}
              >
                <Text style={[styles.sheetSaveBtnText, { color: ci.ctaText }]}>Save</Text>
                <View style={styles.sheetSaveArrowContainer}>
                  <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M8 5l7 7-7 7"
                      stroke={ci.ctaText}
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </LinearGradient>
            </Pressable>

            {/* Sheet Skip Link */}
            <Pressable
              onPress={handlePeriodSkip}
              style={({ pressed }) => [styles.sheetSkipBtn, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Skip"
            >
              <Text
                style={[
                  styles.sheetSkipText,
                  { color: ci.sheetSkip },
                ]}
              >
                Skip
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
    backgroundColor: "transparent",
  },

  safeArea: {
    flex: 1,
    paddingTop: 8,
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
    height: 30,
    marginBottom: 26,
  },

  navButton: {
    height: 30,
    minWidth: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  backChevron: {
    width: 21,
    height: 21,
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
    letterSpacing: -0.31,
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
    maxWidth: 260,
    marginBottom: 18,
  },

  // ── Search & Filter Row (.ci-find: .ci-filter-btn + .ci-search) ──────────

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
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
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 14,
    paddingRight: 16,
    gap: 9,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#4f3c3a",
    paddingVertical: 0,
  },

  // ── Category Drawer (.ci-browse) ─────────────────────────────────────────

  categoryDrawer: {
    borderRadius: 18,
    borderWidth: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 16,
    marginBottom: 14,
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 0,
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
    borderWidth: 1,
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
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: "#BE968C",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 4.5,
    elevation: 1,
  },

  // .ci-tag.coral: shadow 0 4px 12px rgba(224,115,95,0.26)
  coralLift: {
    shadowColor: "#E0735F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26,
    shadowRadius: 6,
  },
  coralFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 999,
  },
  // rounded itself so the day keeps its iOS shadow (overflow would clip it)
  dayFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
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
    paddingBottom: 6,
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
    shadowRadius: 10,
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
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: "400",
    color: "rgba(74, 58, 57, 0.5)",
    textAlign: "center",
  },

  // ── Period Bottom Sheet Modal Styles (.nd-sheet) ─────────────────────────

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalDismissArea: {
    flex: 1,
  },

  periodSheetContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 30,
    shadowColor: "#785A5A",
    shadowOffset: { width: 0, height: -12 },
    shadowRadius: 17,
    elevation: 20,
  },

  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },

  sheetHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.25,
  },

  sheetHeadingDark: {
    color: INK.display,
  },

  sheetHeadingAccent: {
    color: CORAL.terracottaDeep,
  },

  sheetDescription: {
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 10,
  },

  dayNumbersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 22,
    marginBottom: 6,
  },

  dayNumberBtn: {
    flex: 1,
    height: 44,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  dayNumberBtnSelectedShadow: {
    shadowColor: "#E0735F",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 7,
    elevation: 4,
  },

  dayNumberText: {
    fontSize: 15,
    fontWeight: "600",
  },

  sheetSaveBtnWrapper: {
    width: "100%",
    height: 58,
    borderRadius: 29,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 6,
    marginTop: 22,
  },

  sheetSaveBtnGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  sheetSaveBtnText: {
    fontSize: 16.5,
    fontWeight: "600",
  },

  sheetSaveArrowContainer: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },

  sheetSkipBtn: {
    alignSelf: "center",
    marginTop: 14,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },

  sheetSkipText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
