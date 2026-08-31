import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/constants/themes';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const ctaTokens = theme.components.cta;

  return (
    <View style={styles.root}>
      {/* ── Aubade Atmospheric Background Gradient ───── */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* ── Signature Multi-color Logo Orb (152px) ─────── */}
          <View style={styles.orbContainer}>
            <EnergyOrb state="empty" size={152} />
          </View>

          {/* ── Brand Wordmark Asset (.wordmark: height 58px) ──── */}
          <Image
            source={require('../../../assets/images/heedly-warm-ink.png')}
            style={[styles.brandLogo, { tintColor: theme.ink.display }]}
            contentFit="contain"
          />

          {/* ── Tagline (.tagline: Comfortaa, 22px, #C97B60 in OLED / #E8907A in Dusk) ─── */}
          <Text style={[styles.taglineText, { color: theme.coral.terracotta }]}>
            Works lying down.
          </Text>

          {/* ── Lead Description (17px, noteColor) ──── */}
          <Text
            style={[
              styles.description,
              { color: theme.components.supportingText.noteColor },
            ]}
          >
            Your energy companion for ME/CFS,{'\n'}
            Long COVID, POTS, Fibromyalgia and{'\n'}
            related conditions.
          </Text>

          {/* ── Primary CTA Button (.ob-cta: 17px, 600) ── */}
          <Pressable
            style={({ pressed }) => [
              styles.buttonWrapper,
              {
                shadowColor: ctaTokens.shadowColor,
                shadowOpacity: ctaTokens.shadowOpacity,
              },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push('/(onboarding)/connect')}
            accessibilityRole="button"
            accessibilityLabel="Get started">
            <LinearGradient
              colors={ctaTokens.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.buttonGradient, { borderColor: ctaTokens.borderColor }]}>
              <Text style={[styles.buttonText, { color: ctaTokens.textColor }]}>Get started</Text>
              <View style={styles.buttonArrowContainer}>
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

          {/* ── Footnote / Privacy Text (.ob-foot: 12.5px, line-height 1.5, rgba(199,180,191,0.68)) ─── */}
          <Text style={[styles.privacyText, { color: theme.ink.muted }]}>
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
    width: 148,
    height: 58,
  },

  // ── Tagline (.tagline: Comfortaa, 22px, margin-top 6px) ──────────────────
  taglineText: {
    fontFamily: Fonts.display.regular,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    marginTop: 6,
  },

  // ── Lead description (17px, line-height 25px, max-width 320px) ───────
  description: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 320,
  },

  // ── Primary CTA Button (.ob-cta: height 60px, radius 30px, gradient, shadow)
  buttonWrapper: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    marginTop: 30,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  buttonText: {
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: -0.17,
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

  // ── Footnote (.ob-foot: 12.5px, line-height 19px (1.5), margin-top 14px) ───
  privacyText: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 14,
    maxWidth: 340,
  },
});
