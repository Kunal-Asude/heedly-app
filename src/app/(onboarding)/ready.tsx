import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { CORAL, INK, Spacing, SURFACES } from '@/constants/theme';

export default function ReadyScreen() {
  const router = useRouter();

  const handleGoToToday = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      {/* ── Aubade Atmospheric Dawn Background Gradient ───────────────── */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* ── Signature Animated Glass Orb (Pure glass, no waves, scaled down) ──── */}
        <View style={styles.orbContainer}>
          <EnergyOrb state="empty" size={175} />
        </View>

        {/* ── Content block ────────────────────────────────────────────── */}
        <View style={styles.contentBlock}>

          {/* Heading — "heedly is ready." matching onboarding.jsx */}
          <View style={styles.headingRow}>
            <Image
              source={require('@/assets/images/heedly-warm-ink.png')}
              style={styles.wordmarkInline}
              contentFit="contain"
            />
            <Text style={styles.headingIs}>is </Text>
            <Text style={styles.headingAccent}>ready.</Text>
          </View>

          {/* Supporting description */}
          <Text style={styles.description}>
            The more days you check in, the clearer your patterns become.
            {" We'll do the rest quietly."}
          </Text>

          {/* Go to today button */}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleGoToToday}
            accessibilityRole="button"
            accessibilityLabel="Go to today">
            <Text style={styles.buttonText}>Go to today</Text>
            <Text style={styles.buttonArrow}>›</Text>
          </Pressable>

          {/* Matching bottom balance area to ensure identical CTA positioning */}
          <View style={styles.bottomBalance} />

        </View>

        {/* Bottom spacer */}
        <View style={styles.bottomSpacer} />

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  safeArea: {
    flex: 1,
    alignItems: 'center',
  },

  // ── Vertical Rhythm Spacers (Identical to Welcome Screen) ───────────────

  topSpacer: {
    flex: 1,
  },

  bottomSpacer: {
    flex: 1,
  },

  // ── Orb Container ────────────────────────────────────────────────────────

  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  // ── Content block ────────────────────────────────────────────────────────

  contentBlock: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },

  // ── Heading ──────────────────────────────────────────────────────────────

  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  wordmarkInline: {
    width: 108,
    height: 36,
    tintColor: INK.display,
    marginRight: -18,
  },

  headingIs: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 26,
    color: INK.display,
  },

  headingAccent: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 26,
    color: CORAL.terracotta,
  },

  // ── Description ──────────────────────────────────────────────────────────

  description: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16.5,
    color: '#463332',
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 2,
    marginBottom: 24,
    maxWidth: 320,
  },

  // ── Button ───────────────────────────────────────────────────────────────

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORAL.primary,
    borderRadius: 30,
    height: 56,
    paddingLeft: Spacing.four + 12,
    paddingRight: Spacing.three,
    alignSelf: 'stretch',
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    marginTop: 0,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF8F4',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 17,
    letterSpacing: -0.15,
  },

  buttonArrow: {
    color: '#FFF8F4',
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 28,
    opacity: 0.9,
  },

  bottomBalance: {
    height: 40,
    marginTop: 20,
  },
});
