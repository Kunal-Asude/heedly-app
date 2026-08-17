import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#463332',
  accent: '#b05334',
  bodyText: '#463332',
  mutedText: '#6B4C3E',
  chipBg: '#FFFBF8',
  chipSelectedBg: '#F0D5C8',
  chipSelectedBorder: '#D4917E',
  checkboxOutline: '#D4B8AE',
  checkboxFilled: '#D9735A',
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
};

// ─── Condition items ──────────────────────────────────────────────────────────

const CONDITIONS = [
  'ME/CFS',
  'Long COVID',
  'POTS',
  'Fibromyalgia',
  'Dysautonomia',
  'MCAS',
  'Something else',
];

const CHIP_GAP = 12;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConditionsScreen() {
  const router = useRouter();
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((item) => item !== condition)
        : [...prev, condition]
    );
  };

  const handleContinue = () => {
    router.push('/(onboarding)/ready');
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}>

          {/* ── Progress indicator (step 3 active) ───────────────────────── */}
          <View style={styles.progressRow}>
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressActive} />
          </View>

          {/* ── Heading ─────────────────────────────────────────────────── */}
          <Text style={styles.heading}>
            <Text style={styles.headingDark}>What are you{'\n'}</Text>
            <Text style={styles.headingAccent}>living with?</Text>
          </Text>

          {/* ── Supporting text ──────────────────────────────────────────── */}
          <Text style={styles.supportingText}>
            Select all that apply. You can change this{'\n'}later.
          </Text>

          {/* ── 2-Column Condition Chips ─────────────────────────────────── */}
          <View style={styles.grid}>
            {CONDITIONS.map((condition) => {
              const isSelected = selectedConditions.includes(condition);
              return (
                <Pressable
                  key={condition}
                  style={({ pressed }) => [
                    styles.chip,
                    isSelected && styles.chipSelected,
                    pressed && !isSelected && styles.chipPressed,
                  ]}
                  onPress={() => toggleCondition(condition)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={condition}>

                  {/* Circular Checkbox */}
                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}>
                    {isSelected && (
                      <SymbolView
                        name="checkmark"
                        size={12}
                        weight="bold"
                        tintColor="#FFFFFF"
                      />
                    )}
                  </View>

                  {/* Condition Label */}
                  <Text style={styles.chipText}>{condition}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Information note ────────────────────────────────────────── */}
          <Text style={styles.infoText}>
            This helps heedly understand your experience and personalize{'\n'}
            your patterns. You can update this any time.
          </Text>

          {/* ── Continue Button ─────────────────────────────────────────── */}
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.continueButtonPressed,
            ]}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue">
            <Text style={styles.continueButtonText}>Continue</Text>
            <Text style={styles.continueArrow}>›</Text>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Root & background ──────────────────────────────────────────────────

  root: {
    flex: 1,
    backgroundColor: 'transparent',
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
  },

  // ── Progress indicator ─────────────────────────────────────────────────

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.four,
  },

  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4B8AE',
  },

  progressActive: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },

  // ── Heading ────────────────────────────────────────────────────────────

  heading: {
    fontSize: 34,
    lineHeight: 42,
    fontFamily: 'AvenirNext-Regular',
    marginBottom: Spacing.two,
  },

  headingDark: {
    color: COLORS.headingDark,
  },

  headingAccent: {
    color: COLORS.accent,
  },

  // ── Supporting text ────────────────────────────────────────────────────

  supportingText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16.5,
    lineHeight: 23,
    color: '#463332',
    marginBottom: Spacing.four,
  },

  // ── Grid ───────────────────────────────────────────────────────────────

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CHIP_GAP,
    marginBottom: Spacing.four,
  },

  chip: {
    // 2 columns with CHIP_GAP spacing
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 10,
    // Subtle elevation matching reference
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  chipPressed: {
    opacity: 0.85,
  },

  chipSelected: {
    backgroundColor: COLORS.chipSelectedBg,
    borderColor: COLORS.chipSelectedBorder,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.checkboxOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: COLORS.checkboxFilled,
    borderColor: COLORS.checkboxFilled,
  },

  chipText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 14,
    color: COLORS.headingDark,
    flexShrink: 1,
  },

  // ── Information text ───────────────────────────────────────────────────

  infoText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.mutedText,
    textAlign: 'left',
    marginBottom: Spacing.four,
    marginTop: Spacing.two,
  },

  // ── Continue button ────────────────────────────────────────────────────

  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 50,
    paddingVertical: 18,
    paddingLeft: Spacing.four,
    paddingRight: Spacing.three,
    alignSelf: 'stretch',
    marginTop: 'auto',
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  continueButtonPressed: {
    opacity: 0.86,
  },

  continueButtonText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  continueArrow: {
    color: COLORS.buttonText,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 28,
    opacity: 0.85,
  },
});
