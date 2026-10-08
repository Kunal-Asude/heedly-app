import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/constants/themes';
import { useThemeMode } from '@/contexts/ThemeContext';
import {
  DAILY_REMINDER_DEFAULT,
  readDailyReminderTime,
  reconcileDailyReminder,
  setDailyReminderEnabled,
} from '@/services/dailyReminder';
import { HEADS_UP_DEFAULT, readHeadsUpPreference, setHeadsUpPreference } from '@/services/headsUp';
import { requestNotificationPermissions } from '@/services/notifications';
import { DEFAULT_REMINDER_TIME, formatReminderTime } from '@/utils/reminderTime';

type Palette = {
  dotOff: string;
  dotOn: [string, string, ...string[]];
  sub: string;
  cardBackground: string;
  cardBorder: string;
  cardShadow: string;
  cardShadowOpacity: number;
  rowTitle: string;
  rowDesc: string;
  toggleOff: string;
  toggleOn: [string, string, ...string[]];
  note: string;
};

const LIGHT: Palette = {
  dotOff: 'rgba(74,58,57,0.18)',
  dotOn: ['#f0a07e', '#e0735f'],
  sub: 'rgba(74,58,57,0.66)',
  cardBackground: 'rgba(255,252,248,0.72)',
  cardBorder: 'rgba(255,255,255,0.8)',
  cardShadow: '#BE968C',
  cardShadowOpacity: 0.1,
  rowTitle: '#4f3c3a',
  rowDesc: 'rgba(74,58,57,0.62)',
  toggleOff: 'rgba(120,90,90,0.2)',
  toggleOn: ['#f0a07e', '#e0735f'],
  note: 'rgba(74,58,57,0.52)',
};

const DUSK: Palette = {
  dotOff: 'rgba(199,180,191,0.24)',
  dotOn: ['#E28266', '#D9735A'],
  sub: 'rgba(199,180,191,0.89)',
  cardBackground: '#3E2F44',
  cardBorder: 'rgba(255,255,255,0.09)',
  cardShadow: '#000000',
  cardShadowOpacity: 0.18,
  rowTitle: '#F3E7E1',
  rowDesc: 'rgba(199,180,191,0.84)',
  toggleOff: 'rgba(46,39,56,0.85)',
  toggleOn: ['#634256', '#8A5D7C', '#9E768E'],
  note: 'rgba(199,180,191,0.68)',
};

const OLED: Palette = {
  dotOff: 'rgba(255,255,255,0.07)',
  dotOn: ['#B85F47', '#B85F47'],
  sub: '#A8979E',
  cardBackground: '#16111B',
  cardBorder: 'rgba(255,255,255,0.07)',
  cardShadow: '#000000',
  cardShadowOpacity: 0.18,
  rowTitle: '#E9DDD6',
  rowDesc: '#A8979E',
  toggleOff: '#16111B',
  toggleOn: ['#B85F47', '#B85F47'],
  note: '#9A8A91',
};

function NotifyToggle({
  value,
  onValueChange,
  palette,
  isTrueBlack,
  label,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  palette: Palette;
  isTrueBlack: boolean;
  label: string;
}) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      hitSlop={6}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}>
      {value ? (
        <LinearGradient
          colors={palette.toggleOn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.toggleTrack}>
          <View style={[styles.toggleThumb, styles.toggleThumbOn]} />
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.toggleTrack,
            {
              backgroundColor: palette.toggleOff,
              borderWidth: isTrueBlack ? 1 : 0,
              borderColor: isTrueBlack ? 'rgba(255,255,255,0.07)' : 'transparent',
            },
          ]}>
          <View style={[styles.toggleThumb, styles.toggleThumbOff]} />
        </View>
      )}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const ctaTokens = theme.components.cta;
  const palette = isTrueBlack ? OLED : isDark ? DUSK : LIGHT;

  const [headsUp, setHeadsUp] = useState(HEADS_UP_DEFAULT);
  const [daily, setDaily] = useState(DAILY_REMINDER_DEFAULT);
  const [reminderTime, setReminderTime] = useState(DEFAULT_REMINDER_TIME);

  useEffect(() => {
    let active = true;
    void readHeadsUpPreference().then((stored) => {
      if (active && stored !== null) setHeadsUp(stored);
    });
    void readDailyReminderTime().then((stored) => {
      if (active) setReminderTime(stored);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleContinue = async () => {
    await setHeadsUpPreference(headsUp);
    await setDailyReminderEnabled(daily);
    if (headsUp || daily) await requestNotificationPermissions();
    await reconcileDailyReminder();
    router.push('/(onboarding)/ready');
  };

  return (
    <View style={styles.root}>
      <DawnBackground hasOrb={false} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.progressRow}>
            <View style={[styles.progressDot, { backgroundColor: palette.dotOff }]} />
            <View style={[styles.progressDot, { backgroundColor: palette.dotOff }]} />
            <View style={[styles.progressDot, { backgroundColor: palette.dotOff }]} />
            <LinearGradient
              colors={palette.dotOn}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.progressActive}
            />
          </View>

          <Text style={styles.heading}>
            <Text style={{ color: theme.ink.display }}>A heads-up </Text>
            <Text style={{ color: theme.coral.terracottaDeep }}>when it matters</Text>
          </Text>

          <Text style={[styles.supportingText, { color: palette.sub }]}>
            Get a heads-up when your patterns suggest a heavier day may be ahead.
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: palette.cardBackground,
                borderColor: palette.cardBorder,
                shadowColor: palette.cardShadow,
                shadowOpacity: palette.cardShadowOpacity,
              },
            ]}>
            <View style={styles.row}>
              <View style={styles.rowLine}>
                <Text style={[styles.rowTitle, { color: palette.rowTitle }]}>
                  Heads-up before harder days
                </Text>
                <NotifyToggle
                  value={headsUp}
                  onValueChange={setHeadsUp}
                  palette={palette}
                  isTrueBlack={isTrueBlack}
                  label="Heads-up before harder days"
                />
              </View>
              <Text style={[styles.rowDescription, { color: palette.rowDesc }]}>
                Only when your patterns shift heavier.
              </Text>
            </View>
          </View>

          <Text style={[styles.supportingText, styles.secondSupporting, { color: palette.sub }]}>
            A gentle daily reminder to check in, so heedly keeps learning what works for you.
          </Text>

          <View
            style={[
              styles.card,
              styles.secondCard,
              {
                backgroundColor: palette.cardBackground,
                borderColor: palette.cardBorder,
                shadowColor: palette.cardShadow,
                shadowOpacity: palette.cardShadowOpacity,
              },
            ]}>
            <View style={styles.row}>
              <View style={styles.rowLine}>
                <Text style={[styles.rowTitle, { color: palette.rowTitle }]}>
                  Daily check-in reminder
                </Text>
                <NotifyToggle
                  value={daily}
                  onValueChange={setDaily}
                  palette={palette}
                  isTrueBlack={isTrueBlack}
                  label="Daily check-in reminder"
                />
              </View>
              <Text style={[styles.rowDescription, { color: palette.rowDesc }]}>
                {daily
                  ? `Every day at ${formatReminderTime(reminderTime)}. Change the time in Settings.`
                  : 'A gentle nudge to log how you feel.'}
              </Text>
            </View>
          </View>

          <View style={styles.bottom}>
            <Pressable
              style={({ pressed }) => [
                styles.ctaWrapper,
                { shadowColor: ctaTokens.shadowColor, shadowOpacity: ctaTokens.shadowOpacity },
                pressed && styles.ctaPressed,
              ]}
              onPress={handleContinue}
              accessibilityRole="button"
              accessibilityLabel="Continue">
              <LinearGradient
                colors={ctaTokens.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.ctaGradient, { borderColor: ctaTokens.borderColor }]}>
                <Text style={[styles.ctaText, { color: ctaTokens.textColor }]}>Continue</Text>
                <View style={styles.ctaArrow}>
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

            <Text style={[styles.note, { color: palette.note }]}>
              You can change this any time in Settings.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 42,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 30,
  },

  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  progressActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
  },

  heading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
  },

  supportingText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 12,
    maxWidth: 248,
  },

  secondSupporting: {
    marginTop: 28,
  },

  secondCard: {
    marginTop: 16,
  },

  card: {
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 18,
    elevation: 3,
  },

  row: {
    paddingVertical: 17,
    paddingHorizontal: 18,
    minHeight: 58,
  },

  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  rowTitle: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 19,
    letterSpacing: -0.15,
  },

  rowDescription: {
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 18,
    marginTop: 5,
  },

  toggleTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
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

  toggleThumbOff: {
    alignSelf: 'flex-start',
  },

  toggleThumbOn: {
    alignSelf: 'flex-end',
  },

  bottom: {
    marginTop: 'auto',
  },

  ctaWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },

  ctaGradient: {
    flex: 1,
    borderRadius: 29,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  ctaPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  ctaText: {
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.17,
    textAlign: 'center',
  },

  ctaArrow: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  note: {
    fontSize: 11.5,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 10,
  },
});
