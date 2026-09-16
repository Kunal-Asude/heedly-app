import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground, EnergyOrb } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/constants/themes';
import { useFirstName } from '@/contexts/NameContext';
import { appStorage } from '@/utils/storage';
import { ONBOARDING_COMPLETE_KEY } from '@/utils/storageKeys';

export default function ReadyScreen() {
  const router = useRouter();
  const theme = useTheme();
  const ctaTokens = theme.components.cta;
  const { setFirstName } = useFirstName();
  const [nameInput, setNameInput] = useState('');

  // Optional throughout. An empty field is a complete answer, so nothing is
  // validated and the CTA never gates on it — skipping is a product principle.
  // Skipping must not overwrite a name given earlier, so an empty field writes
  // nothing rather than writing "".
  const handleGoToToday = async () => {
    if (nameInput.trim()) {
      setFirstName(nameInput);
    }
    await appStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.root}>
      {/* ── Aubade Atmospheric Background Gradient ───────────────── */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            style={styles.fill}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}>
            <View style={styles.content}>

          {/* ── Signature Animated Glass Orb (152px, same as Welcome) ──── */}
          <View style={styles.orbContainer}>
            <EnergyOrb state="empty" size={152} />
          </View>

          {/* ── Heading — "heedly is ready." (.ob-h.center-h: Comfortaa, 30px) ── */}
          <View style={styles.headingRow}>
            <Image
              source={require('@/assets/images/heedly-warm-ink.png')}
              style={[styles.wordmarkInline, { tintColor: theme.ink.display }]}
              contentFit="contain"
            />
            <Text style={[styles.headingIs, { color: theme.ink.display }]}>is</Text>
            <Text style={[styles.headingAccent, { color: theme.coral.terracotta }]}>ready.</Text>
          </View>

          {/* ── Lead description (17px, noteColor) ──────────────── */}
          <Text style={[styles.description, { color: theme.components.supportingText.noteColor }]}>
            The more days you check in, the clearer your patterns become.
            {" We'll do the rest quietly."}
          </Text>

          {/* ── Optional first name ───────────────────────────────────
              Asked here rather than on Welcome, where a text field would sit
              directly under "No account needed" and contradict it. A name is
              not an account; it only lets the app address someone warmly. */}
          <View style={styles.nameField}>
            <Text
              style={[
                styles.nameLabel,
                { color: theme.components.supportingText.noteColor },
              ]}>
              What should we call you?
            </Text>
            <TextInput
              style={[
                styles.nameInput,
                {
                  color: theme.ink.display,
                  borderColor: theme.components.onboarding.card.border,
                  backgroundColor: theme.components.onboarding.card.waitingBackground,
                },
              ]}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Name"
              placeholderTextColor={theme.ink.muted}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={40}
              accessibilityLabel="Your first name, optional"
            />
            <Text
              style={[
                styles.nameHint,
                { color: theme.components.supportingText.noteColor },
              ]}>
              You can skip this.
            </Text>
          </View>

          {/* ── Primary CTA (Theme-aware gradient) ──── */}
          <Pressable
            style={({ pressed }) => [
              styles.buttonWrapper,
              {
                shadowColor: ctaTokens.shadowColor,
                shadowOpacity: ctaTokens.shadowOpacity,
              },
              pressed && styles.buttonPressed,
            ]}
            onPress={handleGoToToday}
            accessibilityRole="button"
            accessibilityLabel="Go to today">
            <LinearGradient
              colors={ctaTokens.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.buttonGradient, { borderColor: ctaTokens.borderColor }]}>
              <Text style={[styles.buttonText, { color: ctaTokens.textColor }]}>Go to today</Text>
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

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  },

  fill: {
    flex: 1,
  },

  // Carries the centring and the 26pt gutter the screen had before the
  // keyboard wrappers existed. Applied once, here, so nothing doubles it.
  scrollContent: {
    flexGrow: 1,
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

  // ── Optional first name ───────────────────────────────────────────────────
  // ── Optional first name ───────────────────────────────────────────────────
  // Sized and shaped like the onboarding cards and the CTA: a 1pt light border
  // over the warm card fill, a full pill radius, and the same soft shadow. The
  // screen is centred throughout, so the field is too.
  nameField: {
    width: '100%',
    alignItems: 'center',
    marginTop: 26,
  },

  nameLabel: {
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
    marginBottom: 12,
  },

  nameInput: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    paddingHorizontal: 22,
    fontSize: 17,
    textAlign: 'center',
  },

  nameHint: {
    fontSize: 14.5,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
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
    marginRight: -20,
  },

  // .ob-h.center-h text: Comfortaa 400, 30px
  headingIs: {
    fontFamily: Fonts.display.regular,
    fontSize: 30,
  },

  // .ob-h em
  headingAccent: {
    fontFamily: Fonts.display.regular,
    fontSize: 30,
  },

  // ── Lead description (17px, line-height 25px, max-width 320px) ──
  description: {
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
    marginTop: 18,
    maxWidth: 320,
  },

  // ── Primary CTA (height 62px, radius 31px) ──
  buttonWrapper: {
    width: '100%',
    height: 62,
    borderRadius: 31,
    marginTop: 30,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 31,
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
    right: 22,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
