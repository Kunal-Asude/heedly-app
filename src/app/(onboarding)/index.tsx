import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* ── Aubade Atmospheric Dawn Background Gradient ───── */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* ── Signature Multi-color Logo Orb (152px) ─────── */}
          <View style={styles.orbContainer}>
            <EnergyOrb state="empty" size={152} />
          </View>

          {/* ── Brand Wordmark Asset (heedly-warm-ink.png) ──── */}
          <Image
            source={require('@/assets/images/heedly-warm-ink.png')}
            style={styles.brandLogo}
            contentFit="contain"
          />

          {/* ── Tagline (Comfortaa, 22px, terracotta-deep) ─── */}
          <Text style={styles.taglineText}>Works lying down.</Text>

          {/* ── Lead Description (SF Pro, 15px, ink-soft) ──── */}
          <Text style={styles.description}>
            Your energy companion for ME/CFS,{'\n'}
            Long COVID, POTS, Fibromyalgia and{'\n'}
            related conditions.
          </Text>

          {/* ── Primary CTA Button (.ob-cta 3-color gradient) ── */}
          <Pressable
            style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonPressed]}
            onPress={() => router.push('/(onboarding)/connect')}
            accessibilityRole="button"
            accessibilityLabel="Get started">
            <LinearGradient
              colors={[CORAL.light, CORAL.mid, CORAL.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Get started</Text>
              <View style={styles.buttonArrowContainer}>
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

          {/* ── Footnote / Privacy Text (.ob-foot) ─────────── */}
          <Text style={styles.privacyText}>
            {"No account needed. Your data is private by default, and we don't sell your data."}
          </Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 26,
  },

  content: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Orb Container (.ob-orb: margin 0 0 26px) ──────────────────────────────
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },

  // ── Wordmark (.wordmark: height 58px) ─────────────────────────────────────
  brandLogo: {
    width: 160,
    height: 68,
    tintColor: INK.display,
  },

  // ── Tagline (.tagline: Comfortaa, 22px, #b0532f, margin-top 6px) ─────────
  taglineText: {
    fontFamily: Fonts.display.regular,
    fontSize: 22,
    lineHeight: 28,
    color: CORAL.terracottaDeep,
    textAlign: 'center',
    marginTop: 6,
  },

  // ── Lead description (.lead: 15px, line-height 1.55, ink-soft, max-width 30ch)
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: INK.soft,
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 300,
  },

  // ── Primary CTA Button (.ob-cta: height 58px, radius 29px, gradient, shadow)
  buttonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    marginTop: 30,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  buttonText: {
    color: '#fff8f4',
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    textAlign: 'center',
  },

  buttonArrowContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Footnote (.ob-foot: 12.5px, line-height 1.5, rgba(74,58,57,0.5), margin-top 14px)
  privacyText: {
    fontSize: 12.5,
    lineHeight: 19,
    color: 'rgba(74, 58, 57, 0.5)',
    textAlign: 'center',
    marginTop: 14,
    maxWidth: 340,
  },
});
