import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Spacing } from '@/constants/theme';
import { useUserSettings } from '@/hooks/data';
import { sendTestCautionHeadsUpNotification } from '@/services/notifications';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#564740ff',
  accent: '#C0634A',
  bodyText: '#785344',
  mutedText: '#a38778',
  cardBg: 'rgba(255, 251, 248, 0.85)',
  cardBorder: 'rgba(212, 184, 174, 0.35)',
  divider: 'rgba(212, 184, 174, 0.35)',
  greenDot: '#85B58E',
  switchTrackFalse: '#E2D5CC',
  switchTrackTrue: '#D9735A',
  segmentedBg: '#EFE6DE',
  segmentedActive: '#D9735A',
  cycleBoxBg: 'rgba(245, 220, 205, 0.45)',
  cycleBoxBorder: 'rgba(212, 184, 174, 0.35)',
};

// ─── Custom Toggle Component ──────────────────────────────────────────────────

type CustomToggleProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

function CustomToggle({ value, onValueChange }: CustomToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[
        styles.toggleTrack,
        value ? styles.toggleTrackActive : styles.toggleTrackInactive,
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}>
      <View
        style={[
          styles.toggleThumb,
          value ? styles.toggleThumbActive : styles.toggleThumbInactive,
        ]}
      />
    </Pressable>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings } = useUserSettings();

  // Control states for interactive UI
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>(settings.themeMode);
  const [isTrueBlack, setIsTrueBlack] = useState(settings.isTrueBlack);
  const [isReduceMotion, setIsReduceMotion] = useState(settings.isReduceMotion);
  const [isAiInsights, setIsAiInsights] = useState(settings.isAiInsights);
  const [isCycleNotTypical, setIsCycleNotTypical] = useState(settings.isCycleNotTypical);
  const [isDailyReminder, setIsDailyReminder] = useState(settings.isDailyReminder);
  const [isHarderDaysReminder, setIsHarderDaysReminder] = useState(settings.isHarderDaysReminder);
  const [isWeeklyRecap, setIsWeeklyRecap] = useState(settings.isWeeklyRecap);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}>

        {/* ── Top Header ────────────────────────────────────────────────── */}
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back to Today">
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>
          <Text style={styles.versionText}>V1.0</Text>
        </View>

        <Text style={styles.sectionLabel}>SETTINGS</Text>

        <Text style={styles.mainHeading}>Your heedly</Text>

        {/* ── 1. APPEARANCE ─────────────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>APPEARANCE</Text>

        <View style={styles.card}>
          {/* Theme Row */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Theme</Text>
            {/* Segmented Control */}
            <View style={styles.segmentedTrack}>
              <Pressable
                style={[
                  styles.segmentBtn,
                  themeMode === 'system' && styles.segmentBtnActive,
                ]}
                onPress={() => setThemeMode('system')}>
                <Text
                  style={[
                    styles.segmentText,
                    themeMode === 'system' && styles.segmentTextActive,
                  ]}>
                  System
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.segmentBtn,
                  themeMode === 'light' && styles.segmentBtnActive,
                ]}
                onPress={() => setThemeMode('light')}>
                <Text
                  style={[
                    styles.segmentText,
                    themeMode === 'light' && styles.segmentTextActive,
                  ]}>
                  Light
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.segmentBtn,
                  themeMode === 'dark' && styles.segmentBtnActive,
                ]}
                onPress={() => setThemeMode('dark')}>
                <Text
                  style={[
                    styles.segmentText,
                    themeMode === 'dark' && styles.segmentTextActive,
                  ]}>
                  Dark
                </Text>
              </Pressable>
            </View>
          </View>
          <Text style={styles.rowDescription}>
            {"Follows your device's light or dark setting automatically."}
          </Text>

          <View style={styles.divider} />

          {/* True black (OLED) */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>True black (OLED)</Text>
            <CustomToggle value={isTrueBlack} onValueChange={setIsTrueBlack} />
          </View>
          <Text style={styles.rowDescription}>
            For severe light sensitivity. Flattens dark mode to near-pure black. Applies whenever dark mode is on.
          </Text>

          <View style={styles.divider} />

          {/* Reduce motion */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Reduce motion</Text>
            <CustomToggle value={isReduceMotion} onValueChange={setIsReduceMotion} />
          </View>
          <Text style={styles.rowDescription}>
            Softer transitions, no drifting backgrounds
          </Text>
        </View>

        {/* ── 2. WEARABLE ───────────────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>WEARABLE</Text>

        <View style={styles.card}>
          {/* Connected Wearable */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>{settings.connectedWearableName}</Text>
            <Pressable
              style={({ pressed }) => [styles.changeLink, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Change wearable">
              <View style={styles.greenDot} />
              <Text style={styles.changeText}>Change ›</Text>
            </Pressable>
          </View>
          <Text style={styles.rowDescription}>
            {settings.connectedWearableStatus}
          </Text>

          <View style={styles.divider} />

          {/* Add another */}
          <Pressable
            style={({ pressed }) => [styles.rowBetween, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Add another wearable">
            <View style={styles.addAnotherLeft}>
              <View style={styles.plusBadge}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              <View style={styles.addAnotherTextBlock}>
                <Text style={styles.rowTitle}>Add another</Text>
                <Text style={styles.rowDescriptionNoMargin}>
                  Apple Watch, Garmin, Whoop, Apple Health ...
                </Text>
              </View>
            </View>
            <Text style={styles.chevronRight}>›</Text>
          </Pressable>
        </View>

        {/* ── 3. AI INSIGHTS ────────────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>AI INSIGHTS</Text>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>AI insights</Text>
            <CustomToggle value={isAiInsights} onValueChange={setIsAiInsights} />
          </View>
          <Text style={styles.rowDescription}>
            {"On: short anonymized patterns (never your raw data) are sent to generate warmer, plain-language insights.\nOff: the same patterns are shown using on-device wording. Either way, pattern detection always runs on your phone."}
          </Text>
        </View>

        {/* ── 4. CYCLE AND HORMONES ─────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>CYCLE AND HORMONES</Text>

        <View style={styles.card}>
          <Text style={styles.rowTitle}>Your cycle context</Text>
          <Text style={styles.rowDescription}>
            This helps heedly interpret your patterns. Optional.
          </Text>

          {/* Selection Box */}
          <Pressable
            style={({ pressed }) => [styles.cycleBox, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Cycling regularly">
            <Text style={styles.cycleBoxText}>Cycling regularly</Text>
            <Text style={styles.chevronRight}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* My cycle isn't typical */}
          <View style={styles.rowBetween}>
            <Text style={[styles.rowTitle, { flex: 1, marginRight: 12 }]}>
              {"My cycle isn't typical — don't predict phase from period tags"}
            </Text>
            <CustomToggle value={isCycleNotTypical} onValueChange={setIsCycleNotTypical} />
          </View>
        </View>

        {/* ── 5. SUBSCRIPTION ───────────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>SUBSCRIPTION</Text>

        <View style={styles.card}>
          <Pressable
            style={({ pressed }) => [styles.rowBetween, pressed && styles.pressed]}
            onPress={() => router.push('/paywall' as any)}
            accessibilityRole="button"
            accessibilityLabel="Manage subscription">
            <Text style={styles.rowTitle}>Manage subscription</Text>
            <Text style={styles.chevronRight}>›</Text>
          </Pressable>
          <Text style={styles.rowDescription}>
            Update your plan or cancel anytime in the App Store. Your history stays on your phone either way.
          </Text>
        </View>

        {/* ── 6. PRIVACY ────────────────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>PRIVACY</Text>

        <View style={styles.card}>
          <Pressable
            style={({ pressed }) => [styles.rowBetween, pressed && styles.pressed]}
            onPress={() => router.push('/(tabs)/your-data' as any)}
            accessibilityRole="button"
            accessibilityLabel="Your data">
            <Text style={styles.rowTitle}>Your data</Text>
            <Text style={styles.chevronRight}>›</Text>
          </Pressable>
          <Text style={styles.rowDescription}>
            See everything heedly keeps, where it lives, and who sees it.
          </Text>
        </View>

        {/* ── 7. NOTIFICATIONS ─────────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>NOTIFICATIONS</Text>

        <View style={styles.card}>
          {/* Daily check-in reminder */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Daily check-in reminder</Text>
            <CustomToggle value={isDailyReminder} onValueChange={setIsDailyReminder} />
          </View>
          <Text style={styles.rowDescription}>
            A gentle nudge to check in — you pick the time.
          </Text>

          <View style={styles.divider} />

          {/* Reminder time */}
          <Pressable
            style={({ pressed }) => [styles.rowBetween, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Reminder time 9:00 AM">
            <Text style={styles.rowTitle}>Reminder time</Text>
            <View style={styles.rightValueRow}>
              <Text style={styles.timeValueText}>9:00 AM</Text>
              <Text style={styles.chevronRight}>›</Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          {/* Heads-up before harder days */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Heads-up before harder days</Text>
            <CustomToggle
              value={isHarderDaysReminder}
              onValueChange={(val) => {
                setIsHarderDaysReminder(val);
                if (val) {
                  sendTestCautionHeadsUpNotification();
                }
              }}
            />
          </View>
          <Text style={styles.rowDescription}>
            heedly lets you know when the next few days look heavier, so you can plan ahead.
          </Text>
          <Pressable
            onPress={async () => {
              const id = await sendTestCautionHeadsUpNotification();
              if (id) {
                Alert.alert(
                  'Heads-up notification sent',
                  'A real notification will arrive in 2 seconds. Pull down notification center or lock your device to see it!',
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Permission required', 'Please enable notifications for Heedly in iOS Settings.');
              }
            }}
            style={({ pressed }) => [styles.previewLinkRow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Send test heads-up notification">
            <Text style={styles.previewLinkText}>Send test heads-up notification ›</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* Weekly recap */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowTitle}>Weekly recap</Text>
            <CustomToggle value={isWeeklyRecap} onValueChange={setIsWeeklyRecap} />
          </View>
          <Text style={styles.rowDescription}>
            A short summary of what heedly noticed this week.
          </Text>
        </View>

      </ScrollView>
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

  glowInner: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#EEDCE0',
    opacity: 0.45,
    top: '8%',
    alignSelf: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Spacing.four,
  },

  pressed: {
    opacity: 0.8,
  },

  // ── Header ──────────────────────────────────────────────────────────────

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  backButton: {
    alignSelf: 'flex-start',
  },

  backChevron: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.bodyText,
  },

  versionText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 12,
    color: COLORS.mutedText,
    letterSpacing: 1.2,
  },

  sectionLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 12,
    color: COLORS.mutedText,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  mainHeading: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 36,
    lineHeight: 44,
    color: COLORS.headingDark,
    marginBottom: 12,
  },

  // ── Group Headers & Cards ────────────────────────────────────────────────

  groupHeaderLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 11.5,
    letterSpacing: 1.6,
    color: COLORS.mutedText,
    textTransform: 'uppercase',
    marginTop: 22,
    marginBottom: 8,
  },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: Spacing.two,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rowTitle: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
    color: COLORS.headingDark,
  },

  rowDescription: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13.5,
    lineHeight: 19.5,
    color: '#8C7063',
    marginTop: 8,
  },

  rowDescriptionNoMargin: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 13,
    color: '#8C7063',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(212, 184, 174, 0.3)',
    marginVertical: 18,
  },

  chevronRight: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 20,
    color: COLORS.mutedText,
    paddingLeft: 4,
  },

  // ── Segmented Control ────────────────────────────────────────────────────

  segmentedTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(235, 222, 212, 0.7)',
    borderRadius: 14,
    padding: 5,
    width: 220,
  },

  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },

  segmentBtnActive: {
    backgroundColor: COLORS.segmentedActive,
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },

  segmentText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13.5,
    color: COLORS.bodyText,
    textAlign: 'center',
  },

  segmentTextActive: {
    color: '#FFFFFF',
  },

  // ── Wearable Row ─────────────────────────────────────────────────────────

  changeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.greenDot,
  },

  changeText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 14,
    color: COLORS.accent,
  },

  addAnotherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  plusBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5DDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  plusIcon: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 20,
    color: COLORS.bodyText,
    lineHeight: 22,
  },

  addAnotherTextBlock: {
    flex: 1,
    gap: 2,
  },

  // ── Cycle Context ────────────────────────────────────────────────────────

  cycleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cycleBoxBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cycleBoxBorder,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 14,
  },

  cycleBoxText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15,
    color: COLORS.headingDark,
  },

  // ── Notifications Row ────────────────────────────────────────────────────

  rightValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeValueText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15,
    color: COLORS.headingDark,
  },

  // ── Custom Toggle Switch Styles ──────────────────────────────────────────

  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },

  toggleTrackInactive: {
    backgroundColor: 'rgba(215, 198, 186, 0.7)',
  },

  toggleTrackActive: {
    backgroundColor: COLORS.switchTrackTrue,
  },

  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#666',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  toggleThumbInactive: {
    alignSelf: 'flex-start',
  },

  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  previewLinkRow: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 4,
  },
  previewLinkText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13.5,
    color: COLORS.accent,
  },
});
