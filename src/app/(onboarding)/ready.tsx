import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  /** Warm pastel peach background — matches all onboarding screens */
  background: '#F5DDD5',

  /** "heedly is" — dark brown */
  headingDark: '#2C1810',

  /** "ready." — terracotta accent */
  accent: '#C0634A',

  /** Description — muted warm brown */
  description: '#785344',

  /** Button */
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReadyScreen() {
  const router = useRouter();

  const handleGoToToday = () => {
    // Replace the entire onboarding stack so the user cannot navigate back
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      {/* Atmospheric glow — same technique as Welcome screen */}
      <View style={styles.glowInner} pointerEvents="none" />

      <SafeAreaView style={styles.safeArea}>

        {/* Top flex spacer — pushes the orb into the upper-middle zone */}
        <View style={styles.topSpacer} />

        {/* ── Hero orb — reuses existing asset from Welcome screen ──────── */}
        <View style={styles.orbContainer}>
          <Image
            source={require('@/assets/images/heedly-orb.png')}
            style={styles.orb}
            contentFit="contain"
          />
        </View>

        {/* ── Content block — heading, description, button ──────────────── */}
        <View style={styles.contentBlock}>

          {/* Heading — "heedly is ready." on one line */}
          <Text style={styles.heading}>
            <Text style={styles.headingDark}>heedly</Text>
            <Text style={styles.headingIs}> is </Text>
            <Text style={styles.headingAccent}>ready.</Text>
          </Text>

          {/* Supporting description */}
          <Text style={styles.description}>
            The more days you check in, the clearer your patterns become.
            {"We'll do the rest quietly."}
          </Text>

          {/* Go to today button — same coral pill as existing Continue buttons */}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleGoToToday}
            accessibilityRole="button"
            accessibilityLabel="Go to today">
            <Text style={styles.buttonText}>Go to today</Text>
            <Text style={styles.buttonArrow}>›</Text>
          </Pressable>

        </View>

        {/* Bottom flex spacer — breathing room above home indicator */}
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
    overflow: 'hidden',
  },

  // ── Background glow — same as Welcome screen ─────────────────────────────

  glowInner: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#EEDCE0',
    opacity: 0.45,
    top: '14%',
    alignSelf: 'center',
  },

  safeArea: {
    flex: 1,
    alignItems: 'center',
  },

  // ── Vertical rhythm spacers ──────────────────────────────────────────────

  topSpacer: {
    flex: 0.25,
  },

  bottomSpacer: {
    flex: 1,
  },

  // ── Orb — same sizing as Welcome screen ──────────────────────────────────

  orbContainer: {
    width: '70%',
    top: 10,
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
    paddingHorizontal: Spacing.four,
    gap: 10,
  },

  // ── Heading ──────────────────────────────────────────────────────────────

  heading: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 30,
    lineHeight: 50,
    textAlign: 'center',
  },

  headingIs: {
    color: COLORS.headingDark,
  },

  headingDark: {
    color: COLORS.headingDark,

  },

  headingAccent: {
    color: COLORS.accent,
  },

  // ── Description ──────────────────────────────────────────────────────────

  description: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15,
    lineHeight: 25,
    color: COLORS.description,
    textAlign: 'center',
    maxWidth: '75%',
  },

  // ── Button — identical to existing onboarding Continue buttons ───────────

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 50,
    paddingVertical: 18,
    paddingLeft: Spacing.four,
    paddingRight: Spacing.three,
    alignSelf: 'stretch',
    marginTop: Spacing.three,
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
});
