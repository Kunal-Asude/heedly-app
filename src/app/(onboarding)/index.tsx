import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { CORAL, INK, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* ── Aubade Atmospheric Dawn Background Gradient ───── */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* Top spacer — pushes the orb into the upper-middle zone */}
        <View style={styles.topSpacer} />

        {/* ── Signature Animated Glass Orb (Pure glass, no waves, scaled down) ── */}
        <View style={styles.orbContainer}>
          <EnergyOrb state="empty" size={152} />
        </View>

        {/* ── Content Block ──────────────────────────────────────────────── */}
        <View style={styles.contentBlock}>
          {/* Original Wordmark Logo Asset (heedly-warm-ink.png) */}
          <Image
            source={require('@/assets/images/heedly-warm-ink.png')}
            style={styles.brandLogo}
            contentFit="contain"
          />

          {/* Tagline */}
          <Text style={styles.taglineText}>Works lying down.</Text>

          {/* Description Copy */}
          <Text style={styles.description}>
            Your energy companion for ME/CFS,{'\n'}
            Long COVID, POTS, Fibromyalgia and{'\n'}
            related conditions.
          </Text>

          {/* Coral Gradient Primary CTA Button (.ob-cta) */}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => router.push('/(onboarding)/connect')}
            accessibilityRole="button"
            accessibilityLabel="Get started">
            <Text style={styles.buttonText}>Get started</Text>
            <Text style={styles.buttonArrow}>›</Text>
          </Pressable>

          {/* Privacy Copy / Disclaimer */}
          <Text style={styles.privacyText}>
            {"No account needed. Your data is private by default, and we don't sell your data."}
          </Text>
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

  // ── Vertical Rhythm Spacers (Positions CTA at ~70% screen height) ─────

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
  },

  // ── Content Block ────────────────────────────────────────────────────────

  contentBlock: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: 1,
  },

  // ── Branding & Typography ────────────────────────────────────────────────

  brandLogo: {
    width: 190,
    height: 100,
    tintColor: INK.display,
  },

  taglineText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 26,
    color: CORAL.terracotta,
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: 12,
  },

  description: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16.5,
    color: '#463332',
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 2,
    marginBottom: 6,
  },

  // ── Primary Button (.ob-cta) ─────────────────────────────────────────────

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
    marginTop: 15,
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

  // ── Privacy Copy ─────────────────────────────────────────────────────────

  privacyText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14.5,
    color: '#6d5755ff',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 350,
    marginTop: 20,
  },
});
