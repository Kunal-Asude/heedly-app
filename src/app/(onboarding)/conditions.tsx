import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';
import { useUserSettings } from '@/hooks/data';

// ─── Design tokens (from Aubade Dawn HTML) ─────────────────────────────────────

const CHIP_GAP = 16;   // .ob-chips gap: 16px

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConditionsScreen() {
  const router = useRouter();
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
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}>

          {/* ── Progress indicator (.ob-progress, step 3 active) ─────── */}
          <View style={styles.progressRow}>
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={styles.progressActive} />
          </View>

          {/* ── Heading (.ob-h: Comfortaa 400, 31px, #463332 / em #b0532f) ── */}
          <Text style={styles.heading}>
            <Text style={styles.headingDark}>What are you{'\n'}</Text>
            <Text style={styles.headingAccent}>living with?</Text>
          </Text>

          {/* ── Supporting text (.ob-sub) ──────────────────────────────── */}
          <Text style={styles.supportingText}>
            Select all that apply. You can change this{'\n'}later.
          </Text>

          {/* ── 2-Column Condition Chips (.ob-chips) ──────────────────── */}
          <View style={styles.grid}>
            {conditions.map((condition) => {
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

                  {/* Circular Checkbox (.ob-chip .ring) */}
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

          {/* ── Information note (.ob-help: 11.5px, rgba(74,58,57,0.52)) ── */}
          <Text style={styles.infoText}>
            This helps heedly understand your experience and personalize{'\n'}
            your patterns. You can update this any time.
          </Text>

          {/* ── Continue Button (.ob-cta gradient) ────────────────────── */}
          <Pressable
            style={({ pressed }) => [
              styles.continueWrapper,
              pressed && styles.continueButtonPressed,
            ]}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continue">
            <LinearGradient
              colors={[CORAL.light, CORAL.mid, CORAL.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueGradient}>
              <Text style={styles.continueButtonText}>Continue</Text>
              <View style={styles.continueArrowContainer}>
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

  // .ob: padding 70px 26px 42px
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 42,
  },

  // ── Progress indicator (.ob-progress: gap 6px, margin-bottom 30px) ─────
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 30,
  },

  // .ob-progress i: 6px, radius 50%, bg rgba(74,58,57,0.18)
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(74, 58, 57, 0.18)',
  },

  // .ob-progress i.on: width 20px, radius 3px, gradient
  progressActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: CORAL.primary,
  },

  // ── Heading (.ob-h: Comfortaa 400, 31px, line-height 1.15, letter-spacing -0.01em) ──
  heading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 0,
  },

  headingDark: {
    color: INK.display,
  },

  // .ob-h em: color #b0532f
  headingAccent: {
    color: CORAL.terracottaDeep,
  },

  // ── Supporting text (.ob-sub: 14.5px, line-height 1.5, rgba(74,58,57,0.66), weight 450)
  supportingText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '400',
    color: 'rgba(74, 58, 57, 0.66)',
    marginTop: 12,
    maxWidth: 310,
  },

  // ── Chip grid (.ob-chips: grid 1fr 1fr, gap 16px, margin-top 26px) ────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CHIP_GAP,
    marginTop: 26,
  },

  // .ob-chip: padding 15px 18px, radius 999px, bg rgba(255,252,248,0.74), border 1px rgba(255,255,255,0.75)
  chip: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 252, 248, 0.74)',
    borderRadius: 999,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    gap: 10,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  chipPressed: {
    opacity: 0.85,
  },

  // .ob-chip.sel: gradient bg, border rgba(224,115,95,0.42)
  chipSelected: {
    backgroundColor: 'rgba(244, 164, 126, 0.16)',
    borderColor: 'rgba(224, 115, 95, 0.42)',
  },

  // .ob-chip .ring: 20px, radius 50%, border 1.6px rgba(120,90,90,0.32)
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.6,
    borderColor: 'rgba(120, 90, 90, 0.32)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // .ob-chip.sel .ring: gradient bg, no border
  checkboxSelected: {
    backgroundColor: CORAL.primary,
    borderColor: 'transparent',
  },

  // .ob-chip text: 14.5px, 600, #4f3c3a
  chipText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#4f3c3a',
    flexShrink: 1,
  },

  // ── Information text (.ob-help: 11.5px, line-height 1.5, rgba(74,58,57,0.52), margin 30px 0 0)
  infoText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: 'rgba(74, 58, 57, 0.52)',
    textAlign: 'left',
    marginTop: 30,
  },

  // ── Continue CTA (.ob-cta: height 58px, radius 29px, gradient, shadow, margin-top auto) ──
  continueWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    marginTop: 'auto',
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  continueGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  continueButtonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  // .ob-cta text: 16.5px, 600, #fff8f4
  continueButtonText: {
    color: '#fff8f4',
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    textAlign: 'center',
  },

  // .ob-cta .arr: position absolute, right 20px
  continueArrowContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
