import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { DawnBackground } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';
import { useCheckInConfig } from '@/hooks/data';

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

          {/* ── Top Header (.sx-nav & .pl-*) ───────────────────────────────── */}
          <View style={styles.headerBlock}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Text style={styles.backChevron}>‹</Text>
            </Pressable>

            {/* .pl-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5) */}
            <Text style={styles.sectionLabel}>PLAN AHEAD</Text>

            {/* .pl-title: Comfortaa 400, 31px, lineHeight 36px, #463332 */}
            <Text style={styles.mainHeading}>Planning something?</Text>

            {/* .pl-sub: 14.5px, 1.5, rgba(74,58,57,0.78) */}
            <Text style={styles.subtitleText}>
              {"See what it might cost you — before you\nsay yes."}
            </Text>
          </View>

          {/* ── PICK A DAY Section (.pl-sec) ─────────────────────────────── */}
          <View style={styles.sectionBlock}>
            <Text style={styles.groupLabel}>PICK A DAY</Text>

            {/* Presets Row (.pl-quick) */}
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

            {/* Date Cards Row (.pl-dates) */}
            <View style={styles.dateCardsRow}>
              {planningDays.map((item) => {
                const isSelected = selectedDayId === item.id;
                return (
                  <Pressable
                    key={item.id}
                    style={({ pressed }) => [
                      styles.dateCardWrapper,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleSelectDay(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.day} ${item.date}`}>
                    {isSelected ? (
                      <LinearGradient
                        colors={[CORAL.light, CORAL.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.dateCardSelectedGradient}>
                        <Text style={styles.dateCardDayLabelSelected}>
                          {item.day}
                        </Text>
                        <Text style={styles.dateCardNumberSelected}>
                          {item.date}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.dateCardInactive}>
                        <Text style={styles.dateCardDayLabel}>
                          {item.day}
                        </Text>
                        <Text style={styles.dateCardNumber}>
                          {item.date}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ── WHAT KIND OF THING? Section (.pl-sec) ────────────────────── */}
          <View style={styles.sectionBlock}>
            <View style={styles.groupLabelRow}>
              <Text style={styles.groupLabel}>WHAT KIND OF THING?</Text>
              <Text style={styles.optionalLabel}> (optional)</Text>
            </View>

            {/* Activity Type Chips Wrap (.pl-kinds) */}
            <View style={styles.activityWrap}>
              {planningActivities.map((activity) => {
                const isSelected = selectedActivities.includes(activity);
                return (
                  <Pressable
                    key={activity}
                    style={({ pressed }) => [
                      styles.activityChipWrapper,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => handleToggleActivity(activity)}
                    accessibilityRole="button"
                    accessibilityLabel={activity}>
                    {isSelected ? (
                      <LinearGradient
                        colors={[CORAL.light, CORAL.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.activityChipSelectedGradient}>
                        <Text style={styles.activityChipTextSelected}>
                          {activity}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.activityChipInactive}>
                        <Text style={styles.activityChipText}>
                          {activity}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.flexSpacer} />

          {/* ── Bottom Action Button (.pl-cta gradient) ─────────────────── */}
          <Pressable
            style={({ pressed }) => [styles.ctaButtonWrapper, pressed && styles.buttonPressed]}
            onPress={handleCheckCost}
            accessibilityRole="button"
            accessibilityLabel="Check the cost">
            <LinearGradient
              colors={[CORAL.light, CORAL.mid, CORAL.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaButtonGradient}>
              <Text style={styles.ctaButtonText}>Check the cost</Text>
              <View style={styles.ctaArrowContainer}>
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

  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },

  pressed: {
    opacity: 0.8,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  flexSpacer: {
    flex: 1,
  },

  // ── Header ──────────────────────────────────────────────────────────────

  headerBlock: {
    marginBottom: 18,
  },

  backButton: {
    width: 36,
    height: 36,
    marginLeft: -6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  backChevron: {
    fontSize: 30,
    lineHeight: 30,
    color: 'rgba(74, 58, 57, 0.62)',
  },

  // .pl-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5)
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  // .pl-title: Comfortaa 400, 31px, lineHeight 36px, #463332
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: INK.display,
    marginBottom: 8,
  },

  // .pl-sub: 14.5px, 1.5, rgba(74,58,57,0.78)
  subtitleText: {
    fontSize: 14.5,
    lineHeight: 22,
    color: 'rgba(74, 58, 57, 0.78)',
  },

  // ── Sections ────────────────────────────────────────────────────────────

  sectionBlock: {
    marginBottom: 20,
  },

  groupLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  // .pl-sec: 11px, 600, letter-spacing 0.16em, uppercase, rgba(74,58,57,0.5)
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    color: 'rgba(74, 58, 57, 0.5)',
    textTransform: 'uppercase',
  },

  optionalLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(74, 58, 57, 0.4)',
  },

  // ── Presets (.pl-quick) ──────────────────────────────────────────────────

  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },

  // .pl-chip: padding 10px 17px, radius 999px, bg #fffdfa, border 1.5px rgba(120,90,80,0.16)
  presetChip: {
    paddingVertical: 10,
    paddingHorizontal: 17,
    borderRadius: 999,
    backgroundColor: '#fffdfa',
    borderWidth: 1.5,
    borderColor: 'rgba(120, 90, 80, 0.16)',
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 9,
    elevation: 1,
  },

  // .pl-chip.sel: bg linear-gradient(135deg, rgba(244,164,126,0.2), rgba(224,115,95,0.16)), border rgba(224,115,95,0.42)
  presetChipActive: {
    backgroundColor: 'rgba(244, 164, 126, 0.2)',
    borderColor: 'rgba(224, 115, 95, 0.42)',
  },

  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f3c3a',
  },

  presetTextActive: {
    color: '#4f3c3a',
  },

  // ── Dates Grid (.pl-dates) ───────────────────────────────────────────────

  dateCardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },

  dateCardWrapper: {
    flex: 1,
    borderRadius: 16,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  dateCardInactive: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: '#fffdfa',
    borderWidth: 1.5,
    borderColor: 'rgba(120, 90, 80, 0.13)',
    gap: 3,
  },

  dateCardSelectedGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 16,
    gap: 3,
    shadowColor: '#E0735F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 4,
  },

  // .dow: 9.5px, 700, 0.1em, uppercase, rgba(74,58,57,0.46)
  dateCardDayLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.95,
    textTransform: 'uppercase',
    color: 'rgba(74, 58, 57, 0.46)',
  },

  dateCardDayLabelSelected: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.95,
    textTransform: 'uppercase',
    color: '#fff8f4',
  },

  // .num: 17px, 600, #463332
  dateCardNumber: {
    fontSize: 17,
    fontWeight: '600',
    color: '#463332',
  },

  dateCardNumberSelected: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff8f4',
  },

  // ── Activity Chips (.pl-kinds) ───────────────────────────────────────────

  activityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  activityChipWrapper: {
    borderRadius: 999,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 9,
    elevation: 1,
  },

  activityChipInactive: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#fffdfa',
    borderWidth: 1.5,
    borderColor: 'rgba(120, 90, 80, 0.16)',
  },

  activityChipSelectedGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    shadowColor: '#E0735F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.26,
    shadowRadius: 18,
    elevation: 4,
  },

  // .pl-kind: 13.5px, 600, #4f3c3a
  activityChipText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#4f3c3a',
  },

  activityChipTextSelected: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#fff8f4',
  },

  // ── Primary CTA Button (.pl-cta) ─────────────────────────────────────────

  ctaButtonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 5,
  },

  ctaButtonGradient: {
    flex: 1,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  ctaButtonText: {
    color: '#fff8f4',
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
    textAlign: 'center',
  },

  ctaArrowContainer: {
    position: 'absolute',
    right: 22,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
