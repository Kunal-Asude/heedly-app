import { LinearGradient } from 'expo-linear-gradient';
import { openURL } from 'expo-linking';
import { useRouter } from 'expo-router';
import { SymbolView } from '@/components/ui/symbol';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import HeedlyNative from '@/services/heedlyNative';

import { DawnBackground } from '@/components/core';
import { BackButton } from '@/components/ui/back-button';
import { Fonts } from '@/constants/theme';
import { useCheckInPalette } from '@/constants/checkInPalette';
import { useTheme } from '@/constants/themes';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useUserSettings } from '@/hooks/data';
import type { DeviceId } from '@/types/user';

// ─── Design tokens ────────────────────────────────────────────────────────────

const CARD_GAP = 11;
const TOTAL_COLUMNS = 3;

const VIA_APPLE_HEALTH: ReadonlySet<DeviceId> = new Set<DeviceId>([
  'oura',
  'apple-watch',
  'garmin',
  'whoop',
]);

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConnectWearableScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const ci = useCheckInPalette();
  const { isDark, isTrueBlack } = useThemeMode();
  const ctaTokens = theme.components.cta;
  const { wearables } = useUserSettings();
  const [selectedDevice, setSelectedDevice] = useState<DeviceId | null>(null);
  const [isNoDataSheetVisible, setIsNoDataSheetVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  // A count, never a measurement — what the bridge contract allows across. It
  // is the only thing that separates "nothing arrived" from "we never asked".
  const [importOutcome, setImportOutcome] = useState<string | null>(null);
  const [openHealthError, setOpenHealthError] = useState<string | null>(null);


  const selectedDeviceObj = wearables.find((w) => w.id === selectedDevice);
  const deviceName = selectedDeviceObj?.label ?? null;

  // Choosing a card is the commitment: there is no separate Continue step.
  // Tapping again (e.g. after the no-data sheet) retries the connection.
  const handleCardPress = (id: DeviceId) => {
    if (isConnecting) return;
    setSelectedDevice(id);
    void connectAppleHealth();
  };

  // Connect Apple Health, then decide what the person is told based on whether
  // anything actually arrived.
  //
  // The count is rows, not days, and is only ever read as zero / non-zero. A
  // person who declined and a person who granted access but has nothing Heedly
  // can read both produce 0 — Apple does not disclose a refusal, so the two are
  // indistinguishable here and the sheet speaks to both.
  //
  // A throw lands in the same place. `ERR_HEALTH_DATA_UNAVAILABLE` and
  // `ERR_HEALTH_AUTHORIZATION` are diagnostics, not something to put in front of
  // someone mid-onboarding, and connecting is optional either way.
  const connectAppleHealth = async () => {
    setIsConnecting(true);
    try {
      const rowsWritten = await HeedlyNative.connectHealthKit();
      if (rowsWritten > 0) {
        router.push('/(onboarding)/conditions');
        return;
      }

      const tank = await HeedlyNative.getTankState();
      if (tank.dataState !== 'no_data') {
        router.push('/(onboarding)/conditions');
        return;
      }

      setImportOutcome('Apple Health returned no records Heedly can read.');
      setIsNoDataSheetVisible(true);
    } catch (error) {
      console.warn('[Connect] Apple Health connection failed:', error);
      // Distinct from an empty result: this one never got as far as asking.
      setImportOutcome('Heedly could not reach Apple Health on this device.');
      setIsNoDataSheetVisible(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDismissSheet = () => {
    setIsNoDataSheetVisible(false);
  };

  const handleProceedToConditions = () => {
    setIsNoDataSheetVisible(false);
    router.push('/(onboarding)/conditions');
  };

  const handleOpenAppleHealth = async () => {
    setOpenHealthError(null);
    try {
      await openURL('x-apple-health://');
    } catch {
      setOpenHealthError('Heedly could not open Apple Health from here.');
    }
  };

  return (
    <View style={styles.root}>
      {/* Exact Atmosphere Background (no orb on connect screen) */}
      <DawnBackground hasOrb={false} />

      <SafeAreaView style={styles.safeArea}>
        {/* ── Back + progress — fixed; content scrolls out of view below it ── */}
        <View style={styles.stickyHeader}>
          {/* ── Progress indicator (.ob-progress) ───────────────────────── */}
          <View style={styles.progressRow}>
            <BackButton fallback="/(onboarding)" style={styles.backButton} />
            <View style={[styles.progressActive, { backgroundColor: isTrueBlack ? '#B85F47' : theme.coral.primary }]} />
            <View style={[styles.progressDot, { backgroundColor: isTrueBlack ? 'rgba(255,255,255,0.07)' : isDark ? 'rgba(255,255,255,0.18)' : 'rgba(120,90,80,0.18)' }]} />
            <View style={[styles.progressDot, { backgroundColor: isTrueBlack ? 'rgba(255,255,255,0.07)' : isDark ? 'rgba(255,255,255,0.18)' : 'rgba(120,90,80,0.18)' }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}>

          {/* ── Heading (.ob-h) ── */}
          <Text style={styles.heading}>
            <Text style={[styles.headingDark, { color: theme.ink.display }]}>Connect your </Text>
            <Text style={[styles.headingAccent, { color: theme.coral.terracotta }]}>wearable.</Text>
          </Text>

          {/* ── Supporting text (.ob-sub) ──── */}
          <Text style={[styles.supportingText, { color: theme.components.supportingText.noteColor }]}>
            heedly reads your data quietly in the background.
          </Text>

          {/* ── Card grid (.ob-grid: gap 11px, margin-top 26px) ─────────── */}
          <View style={styles.grid}>
            {wearables.map((card) => {
              const isSelected = selectedDevice === card.id;
              // Backfill runs to completion before resolving, so this state can
              // last a while. Calling it "No data yet" told testers they had
              // failed while it was still working.
              const isBusy = isSelected && isConnecting;
              const isWaiting = isSelected && (isNoDataSheetVisible || isConnecting);
              const cardTokens = theme.components.onboarding.card;

              return (
                <Pressable
                  key={card.id}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: cardTokens.background,
                      borderColor: cardTokens.border,
                      shadowColor: cardTokens.shadowColor,
                      shadowOpacity: cardTokens.shadowOpacity,
                    },
                    isSelected && {
                      backgroundColor: cardTokens.selectedBackground,
                      borderColor: cardTokens.selectedBorder,
                    },
                    isWaiting && {
                      backgroundColor: cardTokens.waitingBackground,
                      borderColor: cardTokens.waitingBorder,
                    },
                    pressed && !isSelected && styles.cardPressed,
                  ]}
                  onPress={() => handleCardPress(card.id)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isSelected ? `${card.label} connected` : `Connect ${card.label}`
                  }>
                  {/* Icon circle (.ob-card .ic) */}
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isWaiting
                          ? cardTokens.waitingIconBackground
                          : isSelected
                            ? cardTokens.selectedIconBackground
                            : cardTokens.iconBackground,
                      },
                    ]}>
                    <SymbolView
                      name={card.icon}
                      size={20}
                      tintColor={
                        isWaiting
                          ? cardTokens.waitingIconColor
                          : isSelected
                            ? cardTokens.selectedIconColor
                            : cardTokens.iconColor
                      }
                    />
                  </View>

                  {/* Label (.ob-card .nm) */}
                  <Text style={[styles.cardLabel, { color: isSelected ? cardTokens.selectedTextColor : theme.ink.display }]}>
                    {card.label}
                  </Text>

                  {/* Reserved 25px meta-information slot (.ob-card .meta) */}
                  <View style={styles.metaSlot}>
                    {card.subtitle ? (
                      <Text style={[styles.cardSubtitle, { color: theme.ink.muted }]}>{card.subtitle}</Text>
                    ) : null}
                  </View>

                  {/* Connect / Connected action (.ob-card .act) */}
                  <Text
                    style={[
                      styles.cardConnect,
                      { color: theme.coral.terracotta },
                      isSelected && { color: cardTokens.selectedActionColor },
                      isWaiting && { color: cardTokens.waitingActionColor },
                    ]}>
                    {isBusy
                      ? 'Reading…'
                      : isWaiting
                        ? 'No data yet'
                        : isSelected
                          ? '✓ Connected'
                          : VIA_APPLE_HEALTH.has(card.id)
                            ? 'Via Apple Health'
                            : 'Connect'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* ── Skip text (.ob-foot with offset underline) ────────── */}
          <Pressable
            style={styles.skipContainer}
            onPress={() => router.push('/(onboarding)/conditions')}
            accessibilityRole="button"
            accessibilityLabel="Skip for now, you can connect later">
            <View style={styles.skipRow}>
              <Text style={[styles.skipText, { color: ci.foot }]}>
                Skip for now —{' '}
              </Text>
              <View
                style={[
                  styles.linkUnderlineWrapper,
                  { borderBottomColor: `${theme.coral.terracotta}80` },
                ]}>
                <Text style={[styles.skipLink, { color: theme.coral.terracotta }]}>
                  you can connect later
                </Text>
              </View>
            </View>
          </Pressable>

        </ScrollView>
      </SafeAreaView>

      {/* ── "No data coming through" Bottom Sheet Modal (.nd-sheet) ────── */}
      <Modal
        visible={isNoDataSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleDismissSheet}>
        <View style={[styles.modalBackdrop, { backgroundColor: isDark ? (isTrueBlack ? 'rgba(0, 0, 0, 0.72)' : 'rgba(18, 10, 20, 0.58)') : 'rgba(74, 58, 57, 0.34)' }]}>
          <Pressable
            style={styles.modalOverlayDismiss}
            onPress={handleDismissSheet}
          />

          <View
            style={[
              styles.modalSheetContainer,
              {
                backgroundColor: isDark ? (isTrueBlack ? '#16111B' : '#332538') : '#fbf3ec',
                borderTopColor: isDark ? (isTrueBlack ? 'rgba(255, 255, 255, 0.07)' : 'rgba(199, 180, 191, 0.14)') : 'transparent',
                borderTopWidth: isDark ? 1 : 0,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 34,
              },
            ]}>
            {/* Grip Handle (.nd-grip) */}
            <View style={[styles.modalHandle, { backgroundColor: isDark ? (isTrueBlack ? 'rgba(255, 255, 255, 0.18)' : 'rgba(199, 180, 191, 0.28)') : 'rgba(120, 90, 90, 0.2)' }]} />

            {/* Title: Comfortaa 400, 27px */}
            <Text style={styles.sheetTitle}>
              <Text style={{ color: theme.ink.display }}>No data </Text>
              <Text style={{ color: theme.coral.terracotta }}>coming through.</Text>
            </Text>

            {/* Subtitle / Body text (.nd-body: 17px, matching description text) */}
            <Text style={[styles.sheetBody, { color: theme.components.supportingText.noteColor }]}>
              {deviceName ? `heedly reads your ${deviceName} data through ` : 'heedly reads your data through '}
              <Text style={[styles.sheetBodyBold, { color: theme.ink.display }]}>Apple Health</Text>
              {', and nothing has arrived yet.'}
            </Text>

            {importOutcome !== null && (
              <Text
                style={[
                  styles.sheetBody,
                  { color: theme.components.supportingText.noteColor },
                ]}>
                {importOutcome}
              </Text>
            )}

            {openHealthError !== null && (
              <Text
                style={[
                  styles.sheetBody,
                  { color: theme.components.supportingText.noteColor },
                ]}>
                {openHealthError}
              </Text>
            )}

            {/* Numbered Steps (.nd-steps) */}
            <View style={styles.stepsContainer}>
              {/* Step 1 */}
              <View style={styles.stepRow}>
                <View style={[styles.stepBadge, { backgroundColor: isDark ? (isTrueBlack ? 'rgba(190, 106, 92, 0.14)' : 'rgba(226, 122, 108, 0.18)') : 'rgba(244, 164, 126, 0.20)' }]}>
                  <Text style={[styles.stepBadgeText, { color: theme.coral.terracotta }]}>1</Text>
                </View>
                <Text style={[styles.stepText, { color: isDark ? (isTrueBlack ? '#E9DDD6' : 'rgba(199, 180, 191, 0.90)') : 'rgba(74, 58, 57, 0.78)' }]}>
                  {'In '}
                  <Text style={[styles.stepTextBold, { color: theme.ink.display }]}>
                    Apple Health → Sharing → Apps → heedly
                  </Text>
                  {', turn on sleep, heart rate and activity.'}
                </Text>
              </View>

              {/* Step 2 */}
              <View style={styles.stepRow}>
                <View style={[styles.stepBadge, { backgroundColor: isDark ? (isTrueBlack ? 'rgba(190, 106, 92, 0.14)' : 'rgba(226, 122, 108, 0.18)') : 'rgba(244, 164, 126, 0.20)' }]}>
                  <Text style={[styles.stepBadgeText, { color: theme.coral.terracotta }]}>2</Text>
                </View>
                <Text style={[styles.stepText, { color: isDark ? (isTrueBlack ? '#E9DDD6' : 'rgba(199, 180, 191, 0.90)') : 'rgba(74, 58, 57, 0.78)' }]}>
                  {'Open the '}
                  <Text style={[styles.stepTextBold, { color: theme.ink.display }]}>{deviceName ? `${deviceName} app` : 'app for your device'}</Text>
                  {' once so it writes today\'s data across.'}
                </Text>
              </View>
            </View>


            {/* Primary Action Button: Open Apple Health (.ob-cta) */}
            <Pressable
              style={({ pressed }) => [
                styles.sheetCtaWrapper,
                {
                  shadowColor: ctaTokens.shadowColor,
                  shadowOpacity: ctaTokens.shadowOpacity,
                },
                pressed && styles.sheetCtaPressed,
              ]}
              onPress={handleOpenAppleHealth}
              accessibilityRole="button"
              accessibilityLabel="Open Apple Health">
              <LinearGradient
                colors={ctaTokens.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.sheetCtaGradient, { borderColor: ctaTokens.borderColor }]}>
                <Text style={[styles.sheetCtaText, { color: ctaTokens.textColor }]}>Open Apple Health</Text>
              </LinearGradient>
            </Pressable>

            {/* Check again / Skip button (.nd-skip) */}
            <Pressable
              style={({ pressed }) => [
                styles.sheetSkipButton,
                pressed && styles.sheetSkipPressed,
              ]}
              onPress={handleProceedToConditions}
              accessibilityRole="button"
              accessibilityLabel="Continue without Apple Health">
              <Text style={[styles.sheetSkipText, { color: ci.foot }]}>
                Continue without Apple Health
              </Text>
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
  stickyHeader: {
    paddingHorizontal: 26,
  },

  scrollContent: {
    paddingHorizontal: 26,
    paddingBottom: 42,
  },

  // ── Progress indicator (.ob-progress: gap 6px, margin-bottom 30px) ─────
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 30,
    marginBottom: 14,
  },

  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  // .ob-progress i.on: width 20px, height 6px, radius 3px
  progressActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },

  // .ob-progress i: width 6px, height 6px, radius 50%
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // ── Heading (.ob-h: Comfortaa 400, 31px, line-height 1.15) ────
  heading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    marginBottom: 0,
  },

  headingDark: {},
  headingAccent: {},

  // ── Supporting text (17px, line-height 25px, margin 12px 0 0)
  supportingText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '400',
    marginTop: 12,
    maxWidth: 260,
  },

  // ── Card grid (.ob-grid: gap 11px, margin-top 26px) ───────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginTop: 26,
  },

  // .ob-card: fixed height 150px, radius 20px, shadow
  card: {
    flexBasis: `${(100 - ((TOTAL_COLUMNS - 1) * CARD_GAP * 100) / 342) / TOTAL_COLUMNS}%`,
    flexGrow: 1,
    height: 150,
    borderRadius: 20,
    paddingTop: 15,
    paddingBottom: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.85,
  },

  // .ob-card .ic: 42px, radius 50%
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  // .ob-card .nm: 13px, 600, line-height 1.1
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    height: 14,
    marginTop: 2,
    marginBottom: 8,
  },

  // .ob-card .meta: 25px reserved slot
  metaSlot: {
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  // .ob-card .meta: 9.5px, line-height 1.3
  cardSubtitle: {
    fontSize: 9.5,
    lineHeight: 12,
    textAlign: 'center',
  },

  // .ob-card .act: 11.5px, 600
  cardConnect: {
    fontSize: 11.5,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
  },

  // .ob-card.connected .act
  cardConnectActive: {},

  // ── Skip (.ob-foot: 14.5px, line-height 21px, margin-top: 26px) ───────────
  skipContainer: {
    alignSelf: 'center',
    marginTop: 26,
    marginBottom: 20,
  },

  skipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  skipText: {
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: 'center',
  },

  linkUnderlineWrapper: {
    borderBottomWidth: 1,
    paddingBottom: 1,
  },

  // .ob-link: 14.5px, 500
  skipLink: {
    fontSize: 12.5,
    lineHeight: 19,
    fontWeight: '400',
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
    justifyContent: 'flex-end',
  },

  modalOverlayDismiss: {
    flex: 1,
  },

  modalSheetContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 14,
    paddingHorizontal: 24,
    shadowColor: '#785A5A',
    shadowOffset: { width: 0, height: -12 },
    shadowOpacity: 0.22,
    shadowRadius: 17,
    elevation: 16,
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },

  sheetTitle: {
    fontFamily: Fonts.display.regular,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.25,
  },

  sheetTitleDark: {},
  sheetTitleAccent: {},

  sheetBody: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '400',
    marginTop: 12,
  },

  sheetBodyBold: {
    fontWeight: '600',
  },

  stepsContainer: {
    gap: 12,
    marginTop: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  stepText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    fontWeight: '400',
    marginTop: 2,
  },

  stepTextBold: {
    fontWeight: '600',
  },

  sheetCtaWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    marginTop: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
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
  },

  sheetCtaText: {
    fontSize: 16.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  sheetSkipButton: {
    alignSelf: 'center',
    marginTop: 14,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },

  sheetSkipPressed: {
    opacity: 0.7,
  },

  sheetSkipText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
