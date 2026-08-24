import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Spacing } from '@/constants/theme';
import { useCheckInConfig } from '@/hooks/data';

// ─── Design tokens ────────────────────────────────────────────────────────────

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#463332',
  accent: '#b05334',
  bodyText: '#463332',
  mutedText: '#6B4C3E',
  buttonFill: '#D9735A',
  buttonText: '#FFFFFF',
  chipBg: 'rgba(255, 251, 248, 0.85)',
  chipBorder: 'rgba(212, 184, 174, 0.35)',
  chipSelectedBg: '#D9735A',
  chipSelectedText: '#FFFFFF',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlanScreen() {
  const router = useRouter();
  const { planningDays, planningActivities } = useCheckInConfig();

  // Selection states (pre-selected values matching reference screenshot)
  const [selectedPreset, setSelectedPreset] = useState<'tomorrow' | 'weekend' | null>('weekend');
  const [selectedDayId, setSelectedDayId] = useState<string>('sat-24');
  const [selectedActivities, setSelectedActivities] = useState<string[]>(['Social']);

  const handleSelectPreset = (preset: 'tomorrow' | 'weekend') => {
    setSelectedPreset(preset);
    if (preset === 'tomorrow') {
      setSelectedDayId('thu-22');
    } else {
      setSelectedDayId('sat-24');
    }
  };

  const handleSelectDay = (dayId: string) => {
    setSelectedDayId(dayId);
    if (dayId === 'thu-22') {
      setSelectedPreset('tomorrow');
    } else if (dayId === 'sat-24' || dayId === 'sun-25') {
      setSelectedPreset('weekend');
    } else {
      setSelectedPreset(null);
    }
  };

  const handleToggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  const handleCheckCost = () => {
    const selectedDayObj = planningDays.find((d) => d.id === selectedDayId);
    const dayNameMap: Record<string, string> = {
      WED: 'Wednesday',
      THU: 'Thursday',
      FRI: 'Friday',
      SAT: 'Saturday',
      SUN: 'Sunday',
      MON: 'Monday',
    };
    const dayName = selectedDayObj ? dayNameMap[selectedDayObj.day] || 'Saturday' : 'Saturday';
    const activityLabel = selectedActivities.length > 0 ? selectedActivities[0] : 'Social';

    router.push({
      pathname: '/(check-in)/plan-result',
      params: { dayName, activityLabel },
    });
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          {/* ── Top Header ────────────────────────────────────────────────── */}
          <View style={styles.headerBlock}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Text style={styles.backChevron}>‹</Text>
            </Pressable>

            <Text style={styles.sectionLabel}>PLAN AHEAD</Text>

            <Text style={styles.mainHeading}>Planning something?</Text>

            <Text style={styles.subtitleText}>
              {"See what it might cost you — before you\nsay yes."}
            </Text>
          </View>

          {/* ── PICK A DAY Section ────────────────────────────────────────── */}
          <View style={styles.sectionBlock}>
            <Text style={styles.groupLabel}>PICK A DAY</Text>

            {/* Presets Row */}
            <View style={styles.presetsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.presetChip,
                  selectedPreset === 'tomorrow' && styles.presetChipActive,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleSelectPreset('tomorrow')}
                accessibilityRole="button"
                accessibilityLabel="Tomorrow">
                <Text
                  style={[
                    styles.presetText,
                    selectedPreset === 'tomorrow' && styles.presetTextActive,
                  ]}>
                  Tomorrow
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.presetChip,
                  selectedPreset === 'weekend' && styles.presetChipActive,
                  pressed && styles.pressed,
                ]}
                onPress={() => handleSelectPreset('weekend')}
                accessibilityRole="button"
                accessibilityLabel="This weekend">
                <Text
                  style={[
                    styles.presetText,
                    selectedPreset === 'weekend' && styles.presetTextActive,
                  ]}>
                  This weekend
                </Text>
              </Pressable>
            </View>

            {/* Date Cards Row */}
            <View style={styles.dateCardsRow}>
              {planningDays.map((item) => {
                const isSelected = selectedDayId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.dateCard,
                      isSelected && styles.dateCardSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleSelectDay(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.day} ${item.date}`}>
                    <Text
                      style={[
                        styles.dateCardDayLabel,
                        isSelected && styles.dateCardDayLabelSelected,
                      ]}>
                      {item.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateCardNumber,
                        isSelected && styles.dateCardNumberSelected,
                      ]}>
                      {item.date}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ── WHAT KIND OF THING? Section ──────────────────────────────── */}
          <View style={styles.sectionBlock}>
            <View style={styles.groupLabelRow}>
              <Text style={styles.groupLabel}>WHAT KIND OF THING?</Text>
              <Text style={styles.optionalLabel}> (optional)</Text>
            </View>

            {/* Activity Type Chips Wrap */}
            <View style={styles.activityWrap}>
              {planningActivities.map((activity) => {
                const isSelected = selectedActivities.includes(activity);
                return (
                  <Pressable
                    key={activity}
                    style={({ pressed }) => [
                      styles.activityChip,
                      isSelected && styles.activityChipSelected,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleToggleActivity(activity)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={activity}>
                    <Text
                      style={[
                        styles.activityChipText,
                        isSelected && styles.activityChipTextSelected,
                      ]}>
                      {activity}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Spacer to push CTA button to bottom */}
          <View style={styles.flexSpacer} />

          {/* ── Bottom Action Button ─────────────────────────────────────── */}
          <Pressable
            style={({ pressed }) => [styles.ctaButton, pressed && styles.buttonPressed]}
            onPress={handleCheckCost}
            accessibilityRole="button"
            accessibilityLabel="Check the cost">
            <Text style={styles.ctaButtonText}>Check the cost</Text>
            <Text style={styles.ctaArrow}>›</Text>
          </Pressable>

        </View>
      </SafeAreaView>
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

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: 8,
    paddingBottom: Spacing.four,
  },

  pressed: {
    opacity: 0.85,
  },

  buttonPressed: {
    opacity: 0.88,
  },

  flexSpacer: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────

  headerBlock: {
    marginBottom: Spacing.three,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 4,
  },

  backChevron: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.bodyText,
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
    fontSize: 34,
    lineHeight: 42,
    color: COLORS.headingDark,
    marginBottom: 8,
  },

  subtitleText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16.5,
    lineHeight: 23,
    color: '#463332',
  },

  // ── Section & Group Labels ─────────────────────────────────────────────

  sectionBlock: {
    marginTop: Spacing.three,
  },

  groupLabelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },

  groupLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.mutedText,
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  optionalLabel: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 12,
    color: COLORS.mutedText,
    textTransform: 'lowercase',
  },

  // ── Presets ─────────────────────────────────────────────────────────────

  presetsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },

  presetChip: {
    backgroundColor: COLORS.chipBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  presetChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(212, 184, 174, 0.45)',
  },

  presetText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15,
    color: COLORS.headingDark,
  },

  presetTextActive: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15,
    color: COLORS.headingDark,
  },

  // ── Date Cards ──────────────────────────────────────────────────────────

  dateCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },

  dateCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.chipBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
    paddingVertical: 12,
    gap: 4,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  dateCardSelected: {
    backgroundColor: COLORS.chipSelectedBg,
    borderColor: COLORS.chipSelectedBg,
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    elevation: 5,
  },

  dateCardDayLabel: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 10,
    letterSpacing: 0.8,
    color: COLORS.mutedText,
  },

  dateCardDayLabelSelected: {
    color: 'rgba(255, 255, 255, 0.85)',
  },

  dateCardNumber: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 18,
    color: COLORS.headingDark,
  },

  dateCardNumberSelected: {
    color: COLORS.chipSelectedText,
  },

  // ── Activity Chips ──────────────────────────────────────────────────────

  activityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  activityChip: {
    backgroundColor: COLORS.chipBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.chipBorder,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#C8A090',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  activityChipSelected: {
    backgroundColor: COLORS.chipSelectedBg,
    borderColor: COLORS.chipSelectedBg,
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
    elevation: 5,
  },

  activityChipText: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 15,
    color: COLORS.headingDark,
  },

  activityChipTextSelected: {
    color: COLORS.chipSelectedText,
  },

  // ── Bottom Action Button ────────────────────────────────────────────────

  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonFill,
    borderRadius: 50,
    paddingVertical: 18,
    paddingHorizontal: Spacing.four,
    gap: 8,
    shadowColor: '#C05A3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },

  ctaButtonText: {
    color: COLORS.buttonText,
    fontSize: 17,
    fontWeight: '600',
  },

  ctaArrow: {
    color: COLORS.buttonText,
    fontSize: 20,
    fontWeight: '600',
  },
});
