import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#2C1810',
  accent: '#C0634A',
  bodyText: '#785344',
  mutedText: '#a38778',
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
  progressInactive: '#E5C4B7',
  inputBg: 'rgba(255, 251, 248, 0.85)',
  inputBorder: 'rgba(212, 184, 174, 0.35)',
  tagSelectedBg: '#E07860',
  tagSelectedText: '#FFFFFF',
  tagUnselectedBg: 'rgba(255, 251, 248, 0.85)',
  tagUnselectedText: '#2C1810',
  tagUnselectedBorder: 'rgba(212, 184, 174, 0.4)',
};

// ─── Initial Tags List ────────────────────────────────────────────────────────

const ALL_TAGS = [
  'social interaction',
  'screens',
  'warm room',
  'deep focus',
  'physical activity',
  'heat exposure',
  'standing',
  'walking',
  'brain fog',
  'headache',
  'poor sleep',
  'pain flare',
  'joint pain',
  'sore throat',
  'heart racing',
  'breathlessness',
  'nausea',
  'dizziness',
  'noise',
];

const INITIAL_SELECTED = ['social interaction', 'screens', 'warm room'];

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    energyIndex?: string;
    energyLabel?: string;
    bodyIndex?: string;
    bodyLabel?: string;
  }>();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(INITIAL_SELECTED));
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleToggleTag = (tag: string) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    setSelectedTags(next);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const handleSave = () => {
    const tagsString = Array.from(selectedTags).join(' · ');
    router.push({
      pathname: '/(check-in)/saved',
      params: {
        energyIndex: params.energyIndex ?? '2',
        energyLabel: params.energyLabel ?? 'middling',
        bodyIndex: params.bodyIndex ?? '2',
        bodyLabel: params.bodyLabel ?? 'tender',
        tags: tagsString,
      },
    });
  };

  const filteredTags = ALL_TAGS.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <View style={styles.root}>
      {/* Atmospheric background glow */}
      <View style={styles.glowInner} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Top navigation bar ───────────────────────────────────────── */}
        <View style={styles.topNav}>
          {/* Back button */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Question 2">
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
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Skip">
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* ── Fixed Viewport Content (Non-scrollable) ──────────────────── */}
        <View style={styles.contentArea}>
          {/* ── Question Label ─────────────────────────────────────────── */}
          <Text style={styles.questionLabel}>QUESTION 3 OF 3</Text>

          {/* ── Question Heading ───────────────────────────────────────── */}
          <Text style={styles.questionHeading}>
            <Text style={styles.headingDark}>Anything from{'\n'}</Text>
            <Text style={styles.headingAccent}>today worth noting?</Text>
          </Text>

          {/* ── Supporting Subtitle ────────────────────────────────────── */}
          <Text style={styles.supportingText}>
            Tap any that apply. Skip if nothing fits.
          </Text>

          {/* ── Search & Filter Row ────────────────────────────────────── */}
          <View style={styles.searchRow}>
            {/* Filter icon button */}
            <View style={styles.filterButton}>
              <SymbolView
                name="slider.horizontal.3"
                size={20}
                tintColor={COLORS.headingDark}
              />
            </View>

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

          {/* ── Tag Chips Cloud ────────────────────────────────────────── */}
          <View style={styles.tagsContainer}>
            {filteredTags.map((tag) => {
              const isSelected = selectedTags.has(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => handleToggleTag(tag)}
                  style={({ pressed }) => [
                    styles.tagChip,
                    isSelected ? styles.tagChipSelected : styles.tagChipUnselected,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={tag}>
                  <Text
                    style={[
                      styles.tagText,
                      isSelected ? styles.tagTextSelected : styles.tagTextUnselected,
                    ]}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Bottom Section: Save Button & Helper Text ────────────────── */}
        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && styles.buttonPressed]}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save">
            <Text style={styles.saveButtonText}>Save</Text>
            <Text style={styles.nextArrow}>›</Text>
          </Pressable>

          <Text style={styles.bottomHelperText}>
            You can do this lying down.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },

  glowInner: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#EEDCE0',
    opacity: 0.45,
    top: '8%',
    alignSelf: 'center',
  },

  safeArea: {
    flex: 1,
  },

  pressed: {
    opacity: 0.7,
  },

  // ── Top Nav ──────────────────────────────────────────────────────────────

  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    height: 44,
  },

  navButton: {
    padding: 6,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.bodyText,
  },

  skipText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    color: COLORS.mutedText,
  },

  // ── Progress Bar ─────────────────────────────────────────────────────────

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

  // ── Question Label ───────────────────────────────────────────────────────

  questionLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 12,
    color: COLORS.mutedText,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  // ── Question Heading ─────────────────────────────────────────────────────

  questionHeading: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 6,
  },

  headingDark: {
    color: COLORS.headingDark,
  },

  headingAccent: {
    color: COLORS.accent,
  },

  // ── Supporting Text ──────────────────────────────────────────────────────

  supportingText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.bodyText,
    marginBottom: 14,
  },

  // ── Search Row ───────────────────────────────────────────────────────────

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchBar: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    color: COLORS.headingDark,
    paddingVertical: 0,
  },

  // ── Tag Chips Cloud ──────────────────────────────────────────────────────

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
  },

  tagChipSelected: {
    backgroundColor: COLORS.tagSelectedBg,
    borderColor: COLORS.tagSelectedBg,
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },

  tagChipUnselected: {
    backgroundColor: COLORS.tagUnselectedBg,
    borderColor: COLORS.tagUnselectedBorder,
  },

  tagText: {
    fontSize: 15,
    textAlign: 'center',
  },

  tagTextSelected: {
    fontFamily: 'AvenirNext-DemiBold',
    color: COLORS.tagSelectedText,
  },

  tagTextUnselected: {
    fontFamily: 'AvenirNext-DemiBold',
    color: COLORS.tagUnselectedText,
  },

  // ── Bottom Section ───────────────────────────────────────────────────────

  bottomSection: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    alignItems: 'center',
    gap: 12,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 50,
    paddingVertical: 18,
    paddingLeft: Spacing.four,
    paddingRight: Spacing.three,
    alignSelf: 'stretch',
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.86,
  },

  saveButtonText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  nextArrow: {
    color: COLORS.buttonText,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 28,
    opacity: 0.85,
  },

  bottomHelperText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
  },
});
