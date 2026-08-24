import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();
  const { wearables } = useUserSettings();
  const [selectedDevice, setSelectedDevice] = useState<DeviceId | null>(null);
  const [isNoDataSheetVisible, setIsNoDataSheetVisible] = useState(false);

  const selectedDeviceObj = wearables.find((w) => w.id === selectedDevice);
  const deviceName = selectedDeviceObj ? selectedDeviceObj.label : 'Oura';

  const handleCardPress = (id: DeviceId) => {
    setSelectedDevice((current) => (current === id ? null : id));
  };

  const handleContinue = () => {
    setIsNoDataSheetVisible(true);
  };

  const handleDismissSheet = () => {
    setIsNoDataSheetVisible(false);
  };

  const handleProceedToConditions = () => {
    setIsNoDataSheetVisible(false);
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
              const isWaiting = isSelected && isNoDataSheetVisible;
              return (
                <Pressable
                  key={card.id}
                  style={({ pressed }) => [
                    styles.card,
                    isSelected && styles.cardSelected,
                    isWaiting && styles.cardWaiting,
                    pressed && !isSelected && styles.cardPressed,
                  ]}
                  onPress={() => handleCardPress(card.id)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isSelected ? `${card.label} connected` : `Connect ${card.label}`
                  }>
                  {/* Icon circle (.ob-card .ic) */}
                  <View style={[styles.iconCircle, isWaiting && styles.iconCircleWaiting]}>
                    <SymbolView
                      name={card.icon}
                      size={20}
                      tintColor={isWaiting ? 'rgba(74, 58, 57, 0.5)' : '#9a6a52'}
                    />
                  </View>

                  {/* Label (.ob-card .nm: 13px, 600, #4f3c3a) */}
                  <Text style={styles.cardLabel}>{card.label}</Text>

                  {/* Reserved 25px meta-information slot (.ob-card .meta) */}
                  <View style={styles.metaSlot}>
                    {card.subtitle ? (
                      <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                    ) : null}
                  </View>

                  {/* Connect / Connected action (.ob-card .act) */}
                  <Text
                    style={[
                      styles.cardConnect,
                      isSelected && styles.cardConnectActive,
                      isWaiting && styles.cardConnectWaiting,
                    ]}>
                    {isWaiting ? 'No data yet' : isSelected ? '✓ Connected' : 'Connect'}
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

      {/* ── "No data coming through" Bottom Sheet Modal (.nd-sheet) ────── */}
      <Modal
        visible={isNoDataSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleDismissSheet}>
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.modalOverlayDismiss}
            onPress={handleDismissSheet}
          />

          <View
            style={[
              styles.modalSheetContainer,
              { paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 34 },
            ]}>
            {/* Grip Handle (.nd-grip) */}
            <View style={styles.modalHandle} />

            {/* Title: Comfortaa 400, 25px */}
            <Text style={styles.sheetTitle}>
              <Text style={styles.sheetTitleDark}>No data </Text>
              <Text style={styles.sheetTitleAccent}>coming through.</Text>
            </Text>

            {/* Subtitle / Body text (.nd-body) */}
            <Text style={styles.sheetBody}>
              {`heedly reads your ${deviceName} data through `}
              <Text style={styles.sheetBodyBold}>Apple Health</Text>
              {', and nothing has arrived yet.'}
            </Text>

            {/* Numbered Steps (.nd-steps) */}
            <View style={styles.stepsContainer}>
              {/* Step 1 */}
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  {'In '}
                  <Text style={styles.stepTextBold}>
                    Apple Health → Sharing → Apps → heedly
                  </Text>
                  {', turn on sleep, heart rate and activity.'}
                </Text>
              </View>

              {/* Step 2 */}
              <View style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  {'Open the '}
                  <Text style={styles.stepTextBold}>{`${deviceName} app`}</Text>
                  {' once so it writes today\'s data across.'}
                </Text>
              </View>
            </View>

            {/* Primary Action Button: Open Apple Health (.ob-cta) */}
            <Pressable
              style={({ pressed }) => [
                styles.sheetCtaWrapper,
                pressed && styles.sheetCtaPressed,
              ]}
              onPress={handleProceedToConditions}
              accessibilityRole="button"
              accessibilityLabel="Open Apple Health">
              <LinearGradient
                colors={[CORAL.light, CORAL.mid, CORAL.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sheetCtaGradient}>
                <Text style={styles.sheetCtaText}>Open Apple Health</Text>
              </LinearGradient>
            </Pressable>

            {/* Secondary Action Link: Check again (.nd-skip) */}
            <Pressable
              style={({ pressed }) => [
                styles.sheetSkipButton,
                pressed && styles.sheetSkipPressed,
              ]}
              onPress={handleProceedToConditions}
              accessibilityRole="button"
              accessibilityLabel="Check again">
              <Text style={styles.sheetSkipText}>Check again</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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

  // .ob-card: fixed height 150px, bg rgba(255,252,248,0.82), border 1px rgba(255,255,255,0.75), radius 20px, shadow
  card: {
    flexBasis: `${(100 - ((TOTAL_COLUMNS - 1) * CARD_GAP * 100) / 342) / TOTAL_COLUMNS}%`,
    flexGrow: 1,
    height: 150,
    backgroundColor: 'rgba(255, 252, 248, 0.82)',
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
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
    marginBottom: 6,
  },

  // .ob-card .nm: 13px, 600, #4f3c3a, line-height 1.1
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f3c3a',
    textAlign: 'center',
    lineHeight: 14,
    height: 14,
    marginBottom: 6,
  },

  // .ob-card .meta: 25px reserved slot
  metaSlot: {
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
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
    lineHeight: 15,
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

  // .ob-card.waiting: bg rgba(255,252,248,0.6), border-color rgba(74,58,57,0.14)
  cardWaiting: {
    backgroundColor: 'rgba(255, 252, 248, 0.6)',
    borderColor: 'rgba(74, 58, 57, 0.14)',
  },

  iconCircleWaiting: {
    backgroundColor: '#f3eae4',
  },

  cardConnectWaiting: {
    color: 'rgba(74, 58, 57, 0.55)',
  },

  // ── No Data Bottom Sheet Modal (.nd-scrim & .nd-sheet) ───────────────────

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(74, 58, 57, 0.34)',
    justifyContent: 'flex-end',
  },

  modalOverlayDismiss: {
    flex: 1,
  },

  modalSheetContainer: {
    backgroundColor: '#fbf3ec',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 14,
    paddingHorizontal: 24,
    shadowColor: '#785A5A',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.22,
    shadowRadius: 34,
    elevation: 16,
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(120, 90, 90, 0.2)',
    alignSelf: 'center',
    marginBottom: 18,
  },

  sheetTitle: {
    fontFamily: Fonts.display.regular,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.25,
    color: INK.display,
    marginBottom: 0,
  },

  sheetTitleDark: {
    color: INK.display,
  },

  sheetTitleAccent: {
    color: CORAL.terracottaDeep,
  },

  sheetBody: {
    fontSize: 14.5,
    lineHeight: 22.5,
    fontWeight: '400',
    color: 'rgba(74, 58, 57, 0.72)',
    marginTop: 12,
    marginBottom: 20,
  },

  sheetBodyBold: {
    fontWeight: '600',
    color: '#463332',
  },

  stepsContainer: {
    gap: 12,
    marginBottom: 24,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },

  stepBadge: {
    width: 23,
    height: 23,
    borderRadius: 11.5,
    backgroundColor: 'rgba(244, 164, 126, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b0532f',
  },

  stepText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    color: 'rgba(74, 58, 57, 0.78)',
    fontWeight: '400',
  },

  stepTextBold: {
    fontWeight: '600',
    color: '#463332',
  },

  sheetCtaWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  sheetCtaPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  sheetCtaGradient: {
    flex: 1,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  sheetCtaText: {
    color: '#fff8f4',
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    textAlign: 'center',
  },

  sheetSkipButton: {
    alignSelf: 'center',
    marginTop: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  sheetSkipPressed: {
    opacity: 0.7,
  },

  sheetSkipText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
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
