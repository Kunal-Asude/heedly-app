import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  /** Warm pastel peach background */
  background: '#F5DDD5',

  /** "heedly" wordmark — deep warm brown */
  brandText: '#432b22ff',

  /** "Works lying down." — warm coral */
  tagline: '#814332ff',

  /** Body description — muted warm gray */
  description: '#785344ff',

  /** Privacy notice — lighter muted warm */
  privacyText: '#a38778ff',

  /** Get Started button */
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* ── Atmospheric glow behind the orb ─────────────────────────────
       *   Two soft circular views simulate the diffuse pink/lavender radiance
       *   visible in the reference design. They are absolutely positioned
       *   and pointer-events disabled so they never interfere with layout.
       */}
      {/* <View style={styles.glowOuter} pointerEvents="none" /> */}
      <View style={styles.glowInner} pointerEvents="none" />
      <SafeAreaView style={styles.safeArea}>

        {/*
         * Top flex spacer — pushes the orb into the upper-middle zone.
         * Takes ~25% of available safe-area height on any screen size.
         */}
        <View style={styles.topSpacer} />

        {/* ── Hero orb placeholder ───────────────────────────────────────
         *   Size is expressed as a percentage of screen width so it scales
         *   across SE → standard → Pro Max.
         *   Replace the source with the final asset when provided.
         */}
        <View style={styles.orbContainer}>
          <Image
            source={require('@/assets/images/heedly-orb.png')}
            style={styles.orb}
            contentFit="contain"
          />
        </View>

        {/* ── Content block — everything below the orb ──────────────────── */}
        <View style={styles.contentBlock}>

          {/* Brand name + tagline — tight grouping */}
          <View style={styles.brandingBlock}>
            <Text style={styles.brandName}>heedly</Text>
            <Text style={styles.taglineText}>Works lying down.</Text>
          </View>

          {/* Description copy */}
          <Text style={styles.description}>
            Your energy companion for ME/CFS,{'\n'}
            Long COVID, POTS, Fibromyalgia and{'\n'}
            related conditions.
          </Text>

          {/* Get Started button */}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => router.push('/(onboarding)/connect')}
            accessibilityRole="button"
            accessibilityLabel="Get started">
            <Text style={styles.buttonText}>Get started</Text>
            <Text style={styles.buttonArrow}>›</Text>
          </Pressable>

          {/* Privacy notice */}
          <Text style={styles.privacyText}>
            No account needed. Your data is private by default,{'\n'}
            {"and we don't sell your data."}
          </Text>
        </View>

        {/*
         * Bottom flex spacer — provides comfortable breathing room above
         * the home indicator without hardcoding a pixel value.
         */}
        <View style={styles.bottomSpacer} />

      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Root & safe area ─────────────────────────────────────────────────────

  root: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden', // clip glow circles that extend beyond screen edges
  },

  // ── Background glow layers ───────────────────────────────────────────────

  /**
   * Large, soft lavender-pink circle. Positioned toward the upper-left of
   * the orb zone to match the reference's off-center atmospheric wash.
   * The circle is intentionally much larger than the orb so the edges
   * dissolve invisibly into the peach background.
   */
  glowOuter: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: '#E8C8D8', // muted lavender-pink
    opacity: 0.35,
    top: '10%',
    alignSelf: 'center',
    left: '2%',
  },

  /**
   * Smaller, warmer pink circle nested closer to the orb center.
   * Adds the slightly warmer bloom visible just behind the glass sphere.
   */
  glowInner: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#EEDCE0', // warm pink blush
    opacity: 0.45,
    top: '14%',
    alignSelf: 'center',
  },

  safeArea: {
    flex: 1,
    alignItems: 'center',
    // No justifyContent — we use flex spacers for vertical rhythm instead.
  },

  // ── Vertical rhythm spacers (flex-based, not pixel-based) ────────────────

  /**
   * Small top spacer — keeps the orb in the upper-middle zone.
   * flex: 0.25 means the top gap is about 20% of remaining free space.
   * On a 750pt usable height with ~480pt of content, remaining ~270pt:
   *   top gets ~55pt, bottom gets ~215pt — visually matching the reference.
   */
  topSpacer: {
    flex: 0.25,
  },

  /** Absorbs the bulk of remaining vertical space below the content cluster */
  bottomSpacer: {
    flex: 1,
  },

  // ── Orb ──────────────────────────────────────────────────────────────────

  /**
   * The orb container uses a percentage-based width so it scales across
   * all iPhone sizes. On a 390pt wide iPhone 15 this is ~254pt; on a
   * 320pt SE it is ~208pt; on a 430pt Pro Max it is ~280pt.
   */
  orbContainer: {
    width: '70%',
    aspectRatio: 1,
    marginBottom: -30,  // 8pt — tighter connection to branding below
  },

  orb: {
    width: '100%',
    height: '100%',
  },

  // ── Content block ────────────────────────────────────────────────────────

  contentBlock: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingHorizontal: Spacing.four, // 24pt — comfortable on all phones
    gap: 10,                         // tighter than 16pt to match reference
  },

  // ── Branding ─────────────────────────────────────────────────────────────

  brandingBlock: {
    alignItems: 'center',
    gap: 2,
  },

  brandName: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 44,
    color: COLORS.brandText,
    letterSpacing: -1,
    lineHeight: 56,
    textAlign: 'center',
  },

  taglineText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 22,
    color: COLORS.tagline,
    lineHeight: 30,
    textAlign: 'center',
  },

  // ── Description ──────────────────────────────────────────────────────────

  description: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: COLORS.description,
    textAlign: 'center',
    lineHeight: 22,
    // No extra paddingHorizontal — contentBlock already handles side padding
  },

  // ── Button ───────────────────────────────────────────────────────────────

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 50,
    paddingVertical: 18,
    paddingLeft: Spacing.four,
    paddingRight: Spacing.three,
    alignSelf: 'stretch',       // fills contentBlock width — responsive
    marginTop: Spacing.two,     // 8pt — extra breath above button matches reference
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.86,
  },

  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  buttonArrow: {
    color: COLORS.buttonText,
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 28,
    opacity: 0.85,
  },

  // ── Privacy notice ───────────────────────────────────────────────────────

  privacyText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.privacyText,
    textAlign: 'center',
    lineHeight: 19,
    // 78% width forces a clean 2-line break on all iPhone sizes.
    // Wide enough to fit each line comfortably; narrow enough to avoid 3-line wrap.
    maxWidth: '100%',
  },
});
