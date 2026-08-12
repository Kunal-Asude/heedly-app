import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#2C1810',
  accent: '#C0634A',
  bodyText: '#785344',
  mutedText: '#a38778',
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
  cardBg: 'rgba(255, 251, 248, 0.75)',
  cardBorder: 'rgba(212, 184, 174, 0.35)',
  settingsBg: 'rgba(255, 251, 248, 0.65)',
  settingsBorder: 'rgba(212, 184, 174, 0.3)',
  settingsIcon: '#9E8578',
  greenDot: '#8BA888',
  cautionDot: '#D4A545',
  divider: 'rgba(212, 184, 174, 0.4)',
};

// ─── Dynamic date ─────────────────────────────────────────────────────────────

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

function getFormattedDate(): string {
  const now = new Date();
  const day = DAYS[now.getDay()];
  const date = now.getDate();
  const month = MONTHS[now.getMonth()];
  return `${day} · ${date} ${month}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TodayScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      {/* Atmospheric glow — matching onboarding screens */}
      <View style={styles.glowInner} pointerEvents="none" />

      <View
        style={[
          styles.contentArea,
          { paddingTop: insets.top + 8 },
        ]}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
            <Text style={styles.greeting}>
              <Text style={styles.greetingBold}>Hello, </Text>
              <Text style={styles.greetingRegular}>Sam.</Text>
            </Text>
          </View>

          {/* Settings button */}
          <View style={styles.settingsButton}>
            <SymbolView
              name="gearshape"
              size={22}
              tintColor={COLORS.settingsIcon}
            />
          </View>
        </View>

        {/* ── Today orb ──────────────────────────────────────────────────── */}
        <View style={styles.orbContainer}>
          <Image
            source={require('@/assets/images/today-orb.png')}
            style={styles.orb}
            contentFit="contain"
          />
        </View>

        {/* ── Main status ────────────────────────────────────────────────── */}
        <View style={styles.statusBlock}>
          <Text style={styles.statusHeading}>
            <Text style={styles.statusDark}>Today, you have{'\n'}</Text>
            <Text style={styles.statusAccent}>good reserves.</Text>
          </Text>

          {/* Holding steady indicator */}
          <View style={styles.holdingRow}>
            <View style={styles.greenDot} />
            <Text style={styles.holdingText}>holding steady</Text>
          </View>
        </View>

        {/* ── Forecast card ──────────────────────────────────────────────── */}
        <View style={styles.forecastCard}>
          {/* Today column */}
          <View style={styles.forecastColumn}>
            <Text style={styles.forecastLabel}>TODAY</Text>
            <View style={styles.forecastStatusRow}>
              <View style={[styles.forecastDot, { backgroundColor: COLORS.greenDot }]} />
              <Text style={styles.forecastValue}>Steady</Text>
            </View>
          </View>

          <View style={styles.forecastDivider} />

          {/* Tomorrow column */}
          <View style={styles.forecastColumn}>
            <Text style={styles.forecastLabel}>TOMORROW</Text>
            <View style={styles.forecastStatusRow}>
              <View style={[styles.forecastDot, { backgroundColor: COLORS.greenDot }]} />
              <Text style={styles.forecastValue}>Steady</Text>
            </View>
          </View>

          <View style={styles.forecastDivider} />

          {/* Day After column */}
          <View style={styles.forecastColumn}>
            <Text style={styles.forecastLabel}>DAY AFTER</Text>
            <View style={styles.forecastStatusRow}>
              <View style={[styles.forecastDot, { backgroundColor: COLORS.cautionDot }]} />
              <Text style={styles.forecastValue}>Caution</Text>
            </View>
          </View>
        </View>

        {/* ── Primary button ─────────────────────────────────────────────── */}
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/(check-in)/energy')}
          accessibilityRole="button"
          accessibilityLabel="How is it going?">
          <Text style={styles.buttonText}>How is it going?</Text>
        </Pressable>

        {/* ── Planning link ──────────────────────────────────────────────── */}
        <Pressable
          style={styles.planningContainer}
          accessibilityRole="button"
          accessibilityLabel="Planning something this week?">
          <Text style={styles.planningText}>Planning something this week?</Text>
        </Pressable>

      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
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

  contentArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },

  // ── Header ──────────────────────────────────────────────────────────────

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },

  headerTextBlock: {
    flex: 1,
    gap: 2,
  },

  dateText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 12,
    color: COLORS.mutedText,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  greeting: {
    fontSize: 32,
    lineHeight: 40,
  },

  greetingBold: {
    fontFamily: 'AvenirNext-DemiBold',
    color: COLORS.headingDark,
  },

  greetingRegular: {
    fontFamily: 'AvenirNext-Regular',
    color: COLORS.headingDark,
  },

  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.settingsBg,
    borderWidth: 1,
    borderColor: COLORS.settingsBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Orb ──────────────────────────────────────────────────────────────────

  orbContainer: {
    width: '120%',
    aspectRatio: 1,
    alignSelf: 'center',
    marginBottom: 0,
    top: -60
  },

  orb: {
    width: '100%',
    height: '100%',
  },

  // ── Status ───────────────────────────────────────────────────────────────

  statusBlock: {
    alignItems: 'center',
    marginBottom: Spacing.three,
    top: -150,

  },

  statusHeading: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 32,
    lineHeight: 42,
    textAlign: 'center',
    marginBottom: 10,
  },

  statusDark: {
    color: COLORS.headingDark,
  },

  statusAccent: {
    color: COLORS.accent,
  },

  holdingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.greenDot,
  },

  holdingText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15,
    color: COLORS.bodyText,
  },

  // ── Forecast card ────────────────────────────────────────────────────────

  forecastCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginBottom: 32,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    top: -140,

  },

  forecastColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },

  forecastDivider: {
    width: 1,
    backgroundColor: COLORS.divider,
    alignSelf: 'stretch',
  },

  forecastLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 11,
    color: COLORS.mutedText,
    letterSpacing: 1.5,
  },

  forecastStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  forecastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  forecastValue: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 14,
    color: COLORS.headingDark,
  },

  // ── Button ───────────────────────────────────────────────────────────────

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: Spacing.four,
    alignSelf: 'stretch',
    marginBottom: Spacing.four,
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    top: -130,
    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.86,
  },

  buttonText: {
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.1,

  },

  // ── Planning link ────────────────────────────────────────────────────────

  planningContainer: {
    alignSelf: 'center',
    marginBottom: 36,
    top: -130,

  },

  planningText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15,
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
});
