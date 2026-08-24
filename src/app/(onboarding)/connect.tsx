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
import type { DeviceId } from '@/types/user';

// ─── Design tokens (from Aubade Dawn HTML / surfaces.css / colors.css) ─────────

const CARD_GAP = 11;        // .ob-grid gap: 11px
const TOTAL_COLUMNS = 3;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConnectWearableScreen() {
  const router = useRouter();
  const { wearables } = useUserSettings();
  const [selectedDevice, setSelectedDevice] = useState<DeviceId | null>(null);

  const handleCardPress = (id: DeviceId) => {
    setSelectedDevice((current) => (current === id ? null : id));
  };

  const handleContinue = () => {
    router.push('/(onboarding)/conditions');
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

          {/* ── Progress indicator (.ob-progress) ───────────────────────── */}
          <View style={styles.progressRow}>
            <View style={styles.progressActive} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>

          {/* ── Heading (.ob-h: Comfortaa 400, 31px, #463332 / em #b0532f) ── */}
          <Text style={styles.heading}>
            <Text style={styles.headingDark}>Connect your{'\n'}</Text>
            <Text style={styles.headingAccent}>wearable.</Text>
          </Text>

          {/* ── Supporting text (.ob-sub: 14.5px, rgba(74,58,57,0.66)) ──── */}
          <Text style={styles.supportingText}>
            heedly reads your data quietly in the{'\n'}background.
          </Text>

          {/* ── Card grid (.ob-grid: gap 11px, margin-top 26px) ─────────── */}
          <View style={styles.grid}>
            {wearables.map((card) => {
              const isSelected = selectedDevice === card.id;
              return (
                <Pressable
                  key={card.id}
                  style={({ pressed }) => [
                    styles.card,
                    isSelected && styles.cardSelected,
                    pressed && !isSelected && styles.cardPressed,
                  ]}
                  onPress={() => handleCardPress(card.id)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isSelected ? `${card.label} connected` : `Connect ${card.label}`
                  }>
                  {/* Icon circle (.ob-card .ic) */}
                  <View style={styles.iconCircle}>
                    <SymbolView
                      name={card.icon}
                      size={20}
                      tintColor="#9a6a52"
                    />
                  </View>

                  {/* Label (.ob-card .nm: 13px, 600, #4f3c3a) */}
                  <Text style={styles.cardLabel}>{card.label}</Text>

                  {/* Optional subtitle (.ob-card .meta: 9.5px) */}
                  {card.subtitle && (
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  )}

                  {/* Connect / Connected action (.ob-card .act) */}
                  <Text style={[styles.cardConnect, isSelected && styles.cardConnectActive]}>
                    {isSelected ? '✓ Connected' : 'Connect'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Skip text (.ob-foot: 12.5px, rgba(74,58,57,0.5)) ────────── */}
          <Pressable
            style={styles.skipContainer}
            onPress={() => router.push('/(onboarding)/conditions')}
            accessibilityRole="button"
            accessibilityLabel="Skip for now">
            <Text style={styles.skipText}>
              Skip for now — {' '}
              <Text style={styles.skipLink}>you can connect later</Text>
            </Text>
          </Pressable>

          {/* ── Continue button (.ob-cta gradient, height 58, radius 29) ── */}
          <Pressable
            style={({ pressed }) => [
              styles.continueWrapper,
              selectedDevice === null && styles.continueButtonHidden,
              pressed && selectedDevice !== null && styles.continueButtonPressed,
            ]}
            onPress={selectedDevice !== null ? handleContinue : undefined}
            pointerEvents={selectedDevice !== null ? 'auto' : 'none'}
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

  // .ob: padding 70px 26px 42px → approx paddingHorizontal 26, top/bottom via safe area
  scrollContent: {
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

  // .ob-progress i.on: width 20px, height 6px, radius 3px, gradient
  progressActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: CORAL.primary,
  },

  // .ob-progress i: width 6px, height 6px, radius 50%, bg rgba(74,58,57,0.18)
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(74, 58, 57, 0.18)',
  },

  // ── Heading (.ob-h: Comfortaa 400, 31px, line-height 1.15, #463332) ────
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

  // ── Supporting text (.ob-sub: 14.5px, line-height 1.5, rgba(74,58,57,0.66), weight 450, margin 12px 0 0)
  supportingText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '400',
    color: 'rgba(74, 58, 57, 0.66)',
    marginTop: 12,
    marginBottom: 0,
    maxWidth: 310,
  },

  // ── Card grid (.ob-grid: gap 11px, margin-top 26px) ───────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginTop: 26,
    marginBottom: 26,
  },

  // .ob-card: bg rgba(255,252,248,0.82), border 1px rgba(255,255,255,0.75), radius 20px, shadow
  card: {
    flexBasis: `${(100 - ((TOTAL_COLUMNS - 1) * CARD_GAP * 100) / 342) / TOTAL_COLUMNS}%`,
    flexGrow: 1,
    backgroundColor: 'rgba(255, 252, 248, 0.82)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    gap: 8,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.85,
  },

  // .ob-card.connected: bg rgba(244,164,126,0.14), border-color rgba(224,115,95,0.5)
  cardSelected: {
    backgroundColor: 'rgba(244, 164, 126, 0.14)',
    borderColor: 'rgba(224, 115, 95, 0.5)',
  },

  // .ob-card .ic: 42px, radius 50%, gradient bg, shadow
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6cdb8',
  },

  // .ob-card .nm: 13px, 600, #4f3c3a, line-height 1.1
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f3c3a',
    textAlign: 'center',
    lineHeight: 14,
  },

  // .ob-card .meta: 9.5px, line-height 1.3, color rgba(74,58,57,0.5)
  cardSubtitle: {
    fontSize: 9.5,
    lineHeight: 12,
    color: 'rgba(74, 58, 57, 0.5)',
    textAlign: 'center',
  },

  // .ob-card .act: 11.5px, 600, color rgba(176,83,52,0.85)
  cardConnect: {
    fontSize: 11.5,
    fontWeight: '600',
    color: 'rgba(176, 83, 52, 0.85)',
    textAlign: 'center',
  },

  // .ob-card.connected .act: color #cf6a4c
  cardConnectActive: {
    color: '#cf6a4c',
  },

  // ── Skip (.ob-foot: 12.5px, line-height 1.5, rgba(74,58,57,0.5), margin-top from layout)
  skipContainer: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 20,
  },

  skipText: {
    fontSize: 12.5,
    lineHeight: 19,
    color: 'rgba(74, 58, 57, 0.5)',
    textAlign: 'center',
  },

  // .ob-link: color #b05334, underline
  skipLink: {
    color: '#b05334',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },

  // ── Continue CTA (.ob-cta: height 58px, radius 29px, gradient, shadow) ──
  continueWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
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

  continueButtonHidden: {
    opacity: 0,
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
