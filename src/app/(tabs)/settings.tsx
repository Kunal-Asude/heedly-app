import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';
import { useUserSettings } from '@/hooks/data';
import { sendTestCautionHeadsUpNotification } from '@/services/notifications';

// ─── Options ──────────────────────────────────────────────────────────────────

const HORMONAL_OPTIONS = [
  'Cycling regularly',
  'Cycling irregularly',
  'Hormonal birth control',
  'Pregnant',
  'Postpartum',
  'Peri/menopausal',
  'HRT',
  'N/A',
  'Prefer not to say',
];

// ─── Custom Toggle Component (.sx-toggle) ─────────────────────────────────────

type CustomToggleProps = {
  value: boolean;
  onValueChange: (val: boolean) => void;
};

function CustomToggle({ value, onValueChange }: CustomToggleProps) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={styles.toggleTouchArea}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}>
      {value ? (
        <LinearGradient
          colors={['#f0a07e', '#e0735f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.toggleTrack}>
          <View style={[styles.toggleThumb, styles.toggleThumbActive]} />
        </LinearGradient>
      ) : (
        <View style={[styles.toggleTrack, styles.toggleTrackInactive]}>
          <View style={[styles.toggleThumb, styles.toggleThumbInactive]} />
        </View>
      )}
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
  const [isHormonalOptionsOpen, setIsHormonalOptionsOpen] = useState(false);
  const [selectedHormonalContext, setSelectedHormonalContext] = useState('Cycling regularly');
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

        {/* ── Top Header (.sx-nav) ──────────────────────────────────────── */}
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

        {/* .sx-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5) */}
        <Text style={styles.sectionLabel}>SETTINGS</Text>

        {/* .sx-title: Comfortaa 400, 31px, lineHeight 36px, #463332 */}
        <Text style={styles.mainHeading}>Your heedly</Text>

        {/* ── 1. APPEARANCE (.sx-sec) ───────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>APPEARANCE</Text>

        <View style={styles.card}>
          {/* Theme Row */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>Theme</Text>
              {/* Segmented Control (.sx-seg) */}
              <View style={styles.segmentedTrack}>
                <Pressable
                  style={styles.segmentBtnWrapper}
                  onPress={() => setThemeMode('system')}>
                  {themeMode === 'system' ? (
                    <LinearGradient
                      colors={['#f0a07e', '#e0735f']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.segmentBtnActiveGradient}>
                      <Text style={styles.segmentTextActive}>System</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.segmentBtnInactive}>
                      <Text style={styles.segmentTextInactive}>System</Text>
                    </View>
                  )}
                </Pressable>

                <Pressable
                  style={styles.segmentBtnWrapper}
                  onPress={() => setThemeMode('light')}>
                  {themeMode === 'light' ? (
                    <LinearGradient
                      colors={['#f0a07e', '#e0735f']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.segmentBtnActiveGradient}>
                      <Text style={styles.segmentTextActive}>Light</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.segmentBtnInactive}>
                      <Text style={styles.segmentTextInactive}>Light</Text>
                    </View>
                  )}
                </Pressable>

                <Pressable
                  style={styles.segmentBtnWrapper}
                  onPress={() => setThemeMode('dark')}>
                  {themeMode === 'dark' ? (
                    <LinearGradient
                      colors={['#f0a07e', '#e0735f']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.segmentBtnActiveGradient}>
                      <Text style={styles.segmentTextActive}>Dark</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.segmentBtnInactive}>
                      <Text style={styles.segmentTextInactive}>Dark</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
            <Text style={styles.rowDescription}>
              {themeMode === 'system'
                ? "Follows your device's light or dark setting automatically."
                : themeMode === 'light'
                ? "Always light, whatever your device does."
                : "Always dark, whatever your device does."}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* True black (OLED) */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>True black (OLED)</Text>
              <CustomToggle value={isTrueBlack} onValueChange={setIsTrueBlack} />
            </View>
            <Text style={styles.rowDescription}>
              For severe light sensitivity. Flattens dark mode to near-pure black. Applies whenever dark mode is on.
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Reduce motion */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>Reduce motion</Text>
              <CustomToggle value={isReduceMotion} onValueChange={setIsReduceMotion} />
            </View>
            <Text style={styles.rowDescription}>
              Softer transitions, no drifting backgrounds
            </Text>
          </View>
        </View>

        {/* ── 2. WEARABLE (.sx-sec) ─────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>WEARABLE</Text>

        <View style={styles.card}>
          {/* Connected Wearable */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>{settings.connectedWearableName}</Text>
              <Pressable
                style={({ pressed }) => [styles.changeLink, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Change wearable">
                <View style={styles.greenDot} />
                <Text style={styles.changeText}>Change</Text>
                <Text style={styles.changeChev}>›</Text>
              </Pressable>
            </View>
            <Text style={styles.rowDescription}>
              {settings.connectedWearableStatus}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Add another */}
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Add another wearable">
            <View style={styles.rowBetween}>
              <View style={styles.addAnotherLeft}>
                <View style={styles.plusBadge}>
                  <SymbolView name="plus" size={16} tintColor={CORAL.terracottaDeep} />
                </View>
                <Text style={styles.rowTitle}>Add another</Text>
              </View>
              <Text style={styles.chevronRight}>›</Text>
            </View>
            <Text style={[styles.rowDescription, { paddingLeft: 42 }]}>
              Apple Watch, Garmin, Whoop, Apple Health …
            </Text>
          </Pressable>
        </View>

        {/* ── 3. AI INSIGHTS (.sx-sec) ─────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>AI INSIGHTS</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>AI insights</Text>
              <CustomToggle value={isAiInsights} onValueChange={setIsAiInsights} />
            </View>
            <Text style={styles.rowDescription}>
              {"On: short anonymized patterns (never your raw data) are sent to generate warmer, plain-language insights. Off: the same patterns are shown using on-device wording. Either way, pattern detection always runs on your phone."}
            </Text>
          </View>
        </View>

        {/* ── 4. HORMONAL CONTEXT (.sx-sec) ────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>HORMONAL CONTEXT</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>Cycle & hormones</Text>
            </View>

            {/* Selection Dropdown Button (.sx-select) */}
            <Pressable
              style={({ pressed }) => [styles.cycleSelectButton, pressed && styles.pressed]}
              onPress={() => setIsHormonalOptionsOpen(!isHormonalOptionsOpen)}
              accessibilityRole="button"
              accessibilityLabel={`Hormonal context: ${selectedHormonalContext}`}>
              <Text style={styles.cycleSelectButtonText}>{selectedHormonalContext}</Text>
              <Text style={styles.cycleSelectChev}>{isHormonalOptionsOpen ? '▲' : '›'}</Text>
            </Pressable>

            {/* Expandable Options List (.sx-opts) */}
            {isHormonalOptionsOpen && (
              <View style={styles.hormonalOptionsContainer}>
                {HORMONAL_OPTIONS.map((opt) => {
                  const isSelected = selectedHormonalContext === opt;
                  return (
                    <Pressable
                      key={opt}
                      style={[
                        styles.hormonalOptionRow,
                        isSelected && styles.hormonalOptionRowSelected,
                      ]}
                      onPress={() => {
                        setSelectedHormonalContext(opt);
                        setIsHormonalOptionsOpen(false);
                      }}>
                      <View
                        style={[
                          styles.hormonalRadioDot,
                          isSelected && styles.hormonalRadioDotSelected,
                        ]}
                      />
                      <Text
                        style={[
                          styles.hormonalOptionText,
                          isSelected && styles.hormonalOptionTextSelected,
                        ]}>
                        {opt}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Don't predict phase from periods toggle */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={[styles.rowTitle, { flex: 1, marginRight: 12 }]}>
                {"Don't predict phase from my periods"}
              </Text>
              <CustomToggle value={isCycleNotTypical} onValueChange={setIsCycleNotTypical} />
            </View>
            <Text style={styles.rowDescription}>
              For irregular or atypical cycles.
            </Text>
          </View>
        </View>

        {/* ── 5. SUBSCRIPTION (.sx-sec) ────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>SUBSCRIPTION</Text>

        <View style={styles.card}>
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => router.push('/paywall' as any)}
            accessibilityRole="button"
            accessibilityLabel="Manage subscription">
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>Manage subscription</Text>
              <Text style={styles.chevronRight}>›</Text>
            </View>
            <Text style={styles.rowDescription}>
              Update your plan or cancel anytime in the App Store. Your history stays on your phone either way.
            </Text>
          </Pressable>
        </View>

        {/* ── 6. PRIVACY (.sx-sec) ─────────────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>PRIVACY</Text>

        <View style={styles.card}>
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            onPress={() => router.push('/(tabs)/your-data' as any)}
            accessibilityRole="button"
            accessibilityLabel="Your data">
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>Your data</Text>
              <Text style={styles.chevronRight}>›</Text>
            </View>
            <Text style={styles.rowDescription}>
              See everything heedly keeps, where it lives, and who sees it.
            </Text>
          </Pressable>
        </View>

        {/* ── 7. NOTIFICATIONS (.sx-sec) ───────────────────────────────── */}
        <Text style={styles.groupHeaderLabel}>NOTIFICATIONS</Text>

        <View style={styles.card}>
          {/* Daily check-in reminder */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>Daily check-in reminder</Text>
              <CustomToggle value={isDailyReminder} onValueChange={setIsDailyReminder} />
            </View>
            <Text style={styles.rowDescription}>
              A gentle nudge to check in — you pick the time.
            </Text>
          </View>

          {isDailyReminder && (
            <>
              <View style={styles.divider} />
              {/* Reminder time */}
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel="Reminder time 9:00 AM">
                <View style={styles.rowBetween}>
                  <Text style={styles.rowTitle}>Reminder time</Text>
                  <View style={styles.rightValueRow}>
                    <Text style={styles.timeValueText}>9:00 AM</Text>
                    <Text style={styles.chevronRight}>›</Text>
                  </View>
                </View>
              </Pressable>
            </>
          )}

          <View style={styles.divider} />

          {/* Heads-up before harder days */}
          <View style={styles.row}>
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
          </View>

          <View style={styles.divider} />

          {/* Weekly recap */}
          <View style={styles.row}>
            <View style={styles.rowBetween}>
              <Text style={styles.rowTitle}>Weekly recap</Text>
              <CustomToggle value={isWeeklyRecap} onValueChange={setIsWeeklyRecap} />
            </View>
            <Text style={styles.rowDescription}>
              A short summary of what heedly noticed this week.
            </Text>
          </View>
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
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
  },

  pressed: {
    opacity: 0.75,
  },

  // ── Header (.sx-nav) ────────────────────────────────────────────────────

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    marginBottom: 12,
  },

  backButton: {
    width: 36,
    height: 36,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
    color: 'rgba(74, 58, 57, 0.62)',
  },

  versionText: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.46,
    color: 'rgba(74, 58, 57, 0.42)',
  },

  // .sx-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5)
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  // .sx-title: Comfortaa 400, 31px, line-height 36px, #463332
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: INK.display,
    marginBottom: 6,
  },

  // ── Group Headers & Cards (.sx-sec & .sx-card) ───────────────────────────

  // .sx-sec: 11px, 600, letter-spacing 0.16em, uppercase, rgba(74,58,57,0.5)
  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    color: 'rgba(74, 58, 57, 0.5)',
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 8,
  },

  // .sx-card: bg rgba(255,252,248,0.82), border 1px rgba(255,255,255,0.85), radius 18px, shadow
  card: {
    backgroundColor: 'rgba(255, 252, 248, 0.82)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  // .sx-row: padding 14px 0
  row: {
    paddingVertical: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // .sx-row-title: 14.5px, 600, #4f3c3a
  rowTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    color: '#4f3c3a',
    lineHeight: 20,
  },

  // .sx-row-desc: 12.5px, 450, color rgba(74,58,57,0.62)
  rowDescription: {
    fontSize: 12.5,
    fontWeight: '400',
    lineHeight: 18,
    color: 'rgba(74, 58, 57, 0.62)',
    marginTop: 5,
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(120, 90, 80, 0.1)',
  },

  chevronRight: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.34)',
    paddingLeft: 4,
  },

  // ── Segmented Control (.sx-seg) ──────────────────────────────────────────

  segmentedTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(120, 90, 90, 0.1)',
    borderRadius: 11,
    padding: 3,
    gap: 2,
  },

  segmentBtnWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
  },

  segmentBtnActiveGradient: {
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E0735F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 2,
  },

  segmentBtnInactive: {
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  segmentTextInactive: {
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.6)',
  },

  segmentTextActive: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#fff8f4',
  },

  // ── Wearable Row ─────────────────────────────────────────────────────────

  changeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7e9b6a',
    marginRight: 2,
  },

  changeText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: CORAL.terracottaDeep,
  },

  changeChev: {
    fontSize: 16,
    color: 'rgba(176, 83, 52, 0.5)',
  },

  addAnotherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  plusBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: 'rgba(244, 164, 126, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hormonal Context (.sx-select & .sx-opts) ─────────────────────────────

  cycleSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(244, 164, 126, 0.16)',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(224, 115, 95, 0.22)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
  },

  cycleSelectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f3c3a',
  },

  cycleSelectChev: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(176, 83, 52, 0.6)',
  },

  hormonalOptionsContainer: {
    marginTop: 8,
    gap: 6,
  },

  hormonalOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(120, 90, 90, 0.14)',
    backgroundColor: 'rgba(255, 252, 248, 0.7)',
  },

  hormonalOptionRowSelected: {
    backgroundColor: 'rgba(224, 115, 95, 0.1)',
    borderColor: 'rgba(224, 115, 95, 0.42)',
  },

  hormonalRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.5,
    borderColor: 'rgba(74, 58, 57, 0.3)',
    backgroundColor: 'transparent',
  },

  hormonalRadioDotSelected: {
    borderColor: '#e0735f',
    backgroundColor: '#e0735f',
  },

  hormonalOptionText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#5a4644',
  },

  hormonalOptionTextSelected: {
    fontWeight: '600',
    color: '#4f3c3a',
  },

  // ── Notifications Row ────────────────────────────────────────────────────

  rightValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f3c3a',
  },

  previewLinkRow: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
  },

  previewLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORAL.terracottaDeep,
    textDecorationLine: 'underline',
  },

  // ── Custom Toggle Switch Styles (.sx-toggle) ─────────────────────────────

  toggleTouchArea: {
    padding: 2,
  },

  toggleTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },

  toggleTrackInactive: {
    backgroundColor: 'rgba(120, 90, 90, 0.2)',
  },

  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },

  toggleThumbInactive: {
    alignSelf: 'flex-start',
  },

  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
