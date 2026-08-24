import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';

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
        <View style={styles.content}>

          {/* ── Signature Animated Glass Orb (152px, same as Welcome) ──── */}
          <View style={styles.orbContainer}>
            <EnergyOrb state="empty" size={152} />
          </View>

          {/* ── Heading — "heedly is ready." (.ob-h.center-h: Comfortaa, 30px) ── */}
          <View style={styles.headingRow}>
            <Image
              source={require('@/assets/images/heedly-warm-ink.png')}
              style={styles.wordmarkInline}
              contentFit="contain"
            />
            <Text style={styles.headingIs}>is</Text>
            <Text style={styles.headingAccent}>ready.</Text>
          </View>

          {/* ── Lead description (.lead: 15px, ink-soft) ──────────────── */}
          <Text style={styles.description}>
            The more days you check in, the clearer your patterns become.
            {" We'll do the rest quietly."}
          </Text>

          {/* ── Primary CTA (.ob-cta gradient, height 58, radius 29) ──── */}
          <Pressable
            style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonPressed]}
            onPress={handleGoToToday}
            accessibilityRole="button"
            accessibilityLabel="Go to today">
            <LinearGradient
              colors={[CORAL.light, CORAL.mid, CORAL.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Go to today</Text>
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

  // .ob.center: justify-content center, align-items center, text-align center
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

  // ── Heading (.ob-h.center-h: margin-top 22px, font-size 30px, nowrap) ──────
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 22,
    marginBottom: 0,
  },

  // .wordmark-inline: height 1.15em, inline
  wordmarkInline: {
    width: 128,
    height: 46,
    tintColor: INK.display,
    marginRight: -20,
  },

  // .ob-h.center-h text: Comfortaa 400, 30px, #463332
  headingIs: {
    fontFamily: Fonts.display.regular,
    fontSize: 30,
    color: INK.display,
  },

  // .ob-h em: color #b0532f
  headingAccent: {
    fontFamily: Fonts.display.regular,
    fontSize: 30,
    color: CORAL.terracottaDeep,
  },

  // ── Lead description (.lead: 15px, line-height 1.55, ink-soft, max-width 30ch) ──
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: INK.soft,
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 300,
  },

  // ── Primary CTA (.ob.center .ob-cta: margin-top 30px, height 58, radius 29, gradient) ──
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

  // .ob-cta text: 16.5px, 600, #fff8f4
  buttonText: {
    color: '#fff8f4',
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    textAlign: 'center',
  },

  // .ob-cta .arr: position absolute, right 20px
  buttonArrowContainer: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
