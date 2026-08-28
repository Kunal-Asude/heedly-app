import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/constants/themes';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useUserSettings } from '@/hooks/data';

const CHIP_GAP = 16;

export default function ConditionsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const ctaTokens = theme.components.cta;
  const { conditions } = useUserSettings();
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
      {/* Atmosphere Background (no orb on conditions screen) */}
      <DawnBackground hasOrb={false} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}>

          {/* ── Progress indicator (.ob-progress, step 3 active) ─────── */}
          <View style={styles.progressRow}>
            <View style={[styles.progressDot, { backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(120,90,80,0.18)' }]} />
            <View style={[styles.progressDot, { backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(120,90,80,0.18)' }]} />
            <View style={[styles.progressActive, { backgroundColor: theme.coral.primary }]} />
          </View>

          {/* ── Heading (.ob-h) ── */}
          <Text style={styles.heading}>
            <Text style={[styles.headingDark, { color: theme.ink.display }]}>What are you{'\n'}</Text>
            <Text style={[styles.headingAccent, { color: theme.coral.terracottaDeep }]}>living with?</Text>
          </Text>

          {/* ── Supporting text (.ob-sub) ──────────────────────────────── */}
          <Text style={[styles.supportingText, { color: theme.components.supportingText.noteColor }]}>
            Select all that apply. You can change this{'\n'}later.
          </Text>

          {/* ── 2-Column Condition Chips (.ob-chips) ──────────────────── */}
          <View style={styles.grid}>
            {conditions.map((condition) => {
              const isSelected = selectedConditions.includes(condition);
              const chipTokens = theme.components.onboarding.chip;

              return (
                <Pressable
                  key={condition}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: chipTokens.background,
                      borderColor: chipTokens.border,
                      shadowColor: isDark ? '#000000' : '#BE968C',
                      shadowOpacity: isDark ? 0.18 : 0.08,
                    },
                    isSelected && {
                      backgroundColor: chipTokens.selectedBackground,
                      borderColor: chipTokens.selectedBorder,
                    },
                    pressed && !isSelected && styles.chipPressed,
                  ]}
                  onPress={() => toggleCondition(condition)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={condition}>

                  {/* Circular Checkbox (.ob-chip .ring) */}
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: chipTokens.checkboxBorder,
                      },
                      isSelected && {
                        backgroundColor: theme.coral.primary,
                        borderColor: 'transparent',
                      },
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
                  <Text style={[styles.chipText, { color: chipTokens.textColor }]}>{condition}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Information note (.ob-help) ── */}
          <Text style={[styles.infoText, { color: theme.ink.muted }]}>
            This helps heedly understand your experience and personalize{'\n'}
            your patterns. You can update this any time.
          </Text>

          {/* ── Continue Button (Theme-aware CTA) ────────────────────── */}
          <Pressable
            style={({ pressed }) => [
              styles.continueWrapper,
              {
                shadowColor: ctaTokens.shadowColor,
                shadowOpacity: ctaTokens.shadowOpacity,
              },
              pressed && styles.continueButtonPressed,
            ]}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue">
            <LinearGradient
              colors={ctaTokens.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.continueGradient, { borderColor: ctaTokens.borderColor }]}>
              <Text style={[styles.continueButtonText, { color: ctaTokens.textColor }]}>Continue</Text>
              <View style={styles.continueArrowContainer}>
                <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M8 5l7 7-7 7"
                    stroke={ctaTokens.textColor}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </LinearGradient>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  safeArea: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 42,
  },

  // ── Progress indicator (.ob-progress) ─────
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 30,
  },

  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  progressActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },

  // ── Heading (.ob-h) ──
  heading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 0,
  },

  headingDark: {},
  headingAccent: {},

  // ── Supporting text (17px, line-height 25px) ──────
  supportingText: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '400',
    marginTop: 12,
    maxWidth: 330,
  },

  // ── Chip grid (.ob-chips) ────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CHIP_GAP,
    marginTop: 26,
  },

  chip: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderWidth: 1,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },

  chipPressed: {
    opacity: 0.85,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipText: {
    fontSize: 14.5,
    fontWeight: '600',
    flexShrink: 1,
  },

  // ── Information text (13px, line-height 19px) ──────────
  infoText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'left',
    marginTop: 30,
  },

  // ── Continue CTA (height 62px, radius 31px) ──
  continueWrapper: {
    width: '100%',
    height: 62,
    borderRadius: 31,
    marginTop: 'auto',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },

  continueGradient: {
    flex: 1,
    borderRadius: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
  },

  continueButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  continueButtonText: {
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: -0.17,
    textAlign: 'center',
  },

  continueArrowContainer: {
    position: 'absolute',
    right: 22,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
