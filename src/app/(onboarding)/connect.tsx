import { SymbolView, type SymbolViewProps } from 'expo-symbols';
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
  cardBg: '#FFFBF8',
  cardSelectedBg: '#F0D5C8',
  cardSelectedBorder: '#D4917E',
  iconCircleBg: '#F2DDD4',
  iconTint: '#B07A68',
  skipMuted: '#6B4C3E',
  skipAccent: '#9E5E48',
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
};

// ─── Card data ────────────────────────────────────────────────────────────────

type SymbolName = SymbolViewProps['name'];

type DeviceId = 'oura' | 'apple-watch' | 'apple-health' | 'garmin' | 'whoop' | 'other';

type WearableCard = {
  id: DeviceId;
  /** SF Symbol name for iOS */
  icon: SymbolName;
  label: string;
  /** Optional secondary description (Apple Health only) */
  subtitle?: string;
};

const WEARABLES: WearableCard[] = [
  { id: 'oura', icon: 'circle.circle', label: 'Oura' },
  { id: 'apple-watch', icon: 'applewatch', label: 'Apple Watch' },
  { id: 'apple-health', icon: 'heart', label: 'Apple Health', subtitle: 'Fitbit, Polar,\nWithings & more' },
  { id: 'garmin', icon: 'clock', label: 'Garmin' },
  { id: 'whoop', icon: 'ellipsis.rectangle', label: 'Whoop' },
  { id: 'other', icon: 'waveform.path.ecg', label: 'Other' },
];

const CARD_GAP = 12;
const TOTAL_COLUMNS = 3;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConnectWearableScreen() {
  const router = useRouter();
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

          {/* ── Progress indicator ──────────────────────────────────────── */}
          <View style={styles.progressRow}>
            <View style={styles.progressActive} />
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
          </View>

          {/* ── Heading ─────────────────────────────────────────────────── */}
          <Text style={styles.heading}>
            <Text style={styles.headingDark}>Connect your{'\n'}</Text>
            <Text style={styles.headingAccent}>wearable.</Text>
          </Text>

          {/* ── Supporting text ──────────────────────────────────────────── */}
          <Text style={styles.supportingText}>
            heedly reads your data quietly in the{'\n'}background.
          </Text>

          {/* ── Card grid ───────────────────────────────────────────────── */}
          <View style={styles.grid}>
            {WEARABLES.map((card) => {
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
                  {/* Icon circle */}
                  <View style={styles.iconCircle}>
                    <SymbolView
                      name={card.icon}
                      size={20}
                      tintColor={COLORS.iconTint}
                    />
                  </View>

                  {/* Label */}
                  <Text style={styles.cardLabel}>{card.label}</Text>

                  {/* Optional subtitle (Apple Health) */}
                  {card.subtitle && (
                    <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  )}

                  {/* Connect / Connected action */}
                  <Text style={styles.cardConnect}>
                    {isSelected ? '✓ Connected' : 'Connect'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Skip text (placed before Continue button) ──────────────── */}
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

          {/* ── Continue button (always reserves layout space so UI does not shift) ── */}
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              selectedDevice === null && styles.continueButtonHidden,
              pressed && selectedDevice !== null && styles.continueButtonPressed,
            ]}
            onPress={selectedDevice !== null ? handleContinue : undefined}
            pointerEvents={selectedDevice !== null ? 'auto' : 'none'}
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

  progressActive: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },

  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4B8AE',
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

  // ── Card grid ──────────────────────────────────────────────────────────

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: Spacing.four,
  },

  card: {
    // Each card takes up (100% - gaps) / 3 columns.
    flexBasis: `${(100 - ((TOTAL_COLUMNS - 1) * CARD_GAP * 100) / 342) / TOTAL_COLUMNS}%`,
    flexGrow: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    // Subtle elevation matching reference
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.85,
  },

  cardSelected: {
    backgroundColor: COLORS.cardSelectedBg,
    borderColor: COLORS.cardSelectedBorder,
  },

  // ── Card contents ──────────────────────────────────────────────────────

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.iconCircleBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },

  cardLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13,
    color: COLORS.headingDark,
    textAlign: 'center',
    marginBottom: 2,
  },

  cardSubtitle: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 10,
    lineHeight: 14,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginBottom: 2,
  },

  cardConnect: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13,
    color: COLORS.accent,
    textAlign: 'center',
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
    marginBottom: Spacing.three,
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  continueButtonHidden: {
    opacity: 0,
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

  // ── Skip text ──────────────────────────────────────────────────────────

  skipContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },

  skipText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: COLORS.skipMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  skipLink: {
    color: COLORS.skipAccent,
    textDecorationLine: 'underline',
    fontFamily: 'AvenirNext-Demibold',
    fontSize: 14,

  },
});
