import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from '@/components/ui/symbol';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useCheckInPalette } from '@/constants/checkInPalette';
import { useTheme } from '@/constants/themes';
import { useThemeMode } from '@/contexts/ThemeContext';

import { useCheckIn } from '@/contexts/CheckInContext';
import { greetingWithName, useFirstName } from '@/contexts/NameContext';
import { dayLabel, editableEarlierDate, hasCheckIn } from '@/services/checkinHistory';
import { getRecordedCheckInDate } from '@/services/checkinStorage';
import { useTagCatalogue } from '@/hooks/data';

// ─── Dot Rating Indicator Component ────────────────────────────────────────────

function FiveDotRating({ value, isDark, isTrueBlack = false }: { value: number; isDark: boolean; isTrueBlack?: boolean }) {
  const ci = useCheckInPalette();
  return (
    <View style={styles.dotRatingRow}>
      {[1, 2, 3, 4, 5].map((idx) => (
        <View
          key={idx}
          style={[
            styles.ratingDot,
            { backgroundColor: idx <= value ? ci.summaryDotOn : ci.summaryDotOff },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckInSavedScreen() {
  const ci = useCheckInPalette();
  const router = useRouter();
  const theme = useTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const { activeEntry, saveCheckIn, beginEdit, editingDate, loadExistingCheckIn } = useCheckIn();
  const { allTags } = useTagCatalogue();
  const { firstName } = useFirstName();

  const isEarlierDay = editingDate !== null && editingDate !== getRecordedCheckInDate();
  const earlierDayLabel = isEarlierDay ? dayLabel(editingDate) : null;

  const earlierDate = useMemo(() => editableEarlierDate(), []);
  const [canEditEarlier, setCanEditEarlier] = useState(false);

  useEffect(() => {
    let isMounted = true;
    hasCheckIn(earlierDate).then((exists) => {
      if (isMounted) setCanEditEarlier(exists);
    });
    return () => {
      isMounted = false;
    };
  }, [earlierDate]);

  const isCrash = Boolean(activeEntry.isCrash);
  const isFirstTime = Boolean(activeEntry.isFirstTime) && !isEarlierDay;

  // An unanswered question is shown as unanswered. These previously substituted
  // a plausible middle answer — a label, three filled dots, three tag names —
  // for values that were never given, so the screen asserted answers the store
  // did not hold. The rows stay visible because each one is the edit affordance
  // ("Tap any line to edit before you go"), and because a skipped answer is
  // itself information: the person showed up and declined to answer.
  const yesterdayLabel = activeEntry.yesterdayLabel;
  const energyLabel = activeEntry.energyLabel ?? 'skipped';
  const energyRating =
    activeEntry.energyIndex !== undefined && activeEntry.energyIndex !== null
      ? activeEntry.energyIndex + 1
      : 0;
  const bodyLabel = activeEntry.bodyLabel ?? 'skipped';
  const bodyRating =
    activeEntry.bodyIndex !== undefined && activeEntry.bodyIndex !== null
      ? activeEntry.bodyIndex + 1
      : 0;
  const tagsText =
    activeEntry.tags && activeEntry.tags.length > 0
      ? activeEntry.tags
          // Entries store tag ids; show the catalogue's words, falling back to the id.
          .map((id) => allTags.find((tag) => tag.id === id)?.label ?? id)
          .join(' · ')
      : 'nothing noted';
  const periodInfo = activeEntry.periodInfo;

  const handleEditEnergy = () => {
    beginEdit();
    router.push('/(check-in)/energy?isEditing=true');
  };

  const handleEditBody = () => {
    beginEdit();
    router.push('/(check-in)/body?isEditing=true');
  };

  const handleEditNotable = () => {
    beginEdit();
    router.push('/(check-in)/noting?isEditing=true');
  };

  const handleEditYesterday = () => {
    beginEdit();
    router.push('/(check-in)/yesterday?isEditing=true');
  };

  const handleEditCycle = () => {
    beginEdit();
    router.push('/(check-in)/noting?isEditing=true&openPeriod=true');
  };

  const handleBackToToday = async () => {
    await saveCheckIn();
    router.replace('/(tabs)' as any);
  };

  const handleEditEarlier = async () => {
    try {
      await saveCheckIn();
    } catch {
      return;
    }
    await loadExistingCheckIn(earlierDate);
  };

  return (
    <View style={styles.root}>
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentArea}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={isCrash ? ci.doneMoon : ci.doneCheck}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.iconBadge}
            >
              <SymbolView
                name={isCrash ? "moon" : "checkmark"}
                size={27}
                tintColor={isCrash ? ci.doneMoonIcon : ci.doneCheckIcon}
              />
            </LinearGradient>
          </View>

          {isEarlierDay ? (
            <Text style={styles.heading}>
              <Text style={{ color: ci.heading }}>{'Your check-in for\n'}</Text>
              <Text style={{ color: ci.accent }}>{`${earlierDayLabel}.`}</Text>
            </Text>
          ) : isCrash ? (
            <Text style={styles.heading}>
              <Text style={{ color: ci.heading }}>{'Logged.\n'}</Text>
              <Text style={{ color: ci.accent }}>{greetingWithName('Rest now', firstName)}</Text>
            </Text>
          ) : isFirstTime ? (
            <Text style={styles.heading}>
              <Text style={{ color: ci.heading }}>
                {firstName ? 'Thank you, ' : 'Thank you.'}
              </Text>
              {firstName ? (
                <Text style={{ color: ci.accent }}>{`${firstName}.`}</Text>
              ) : null}
            </Text>
          ) : (
            <Text style={styles.heading}>
              <Text style={{ color: ci.heading }}>{'Saved.\n'}</Text>
              <Text style={{ color: ci.accent }}>{greetingWithName('Rest well', firstName)}</Text>
            </Text>
          )}

          {isEarlierDay ? (
            <Text
              style={[
                styles.description,
                { color: ci.lead },
              ]}
            >
              {"Change anything that wasn't right."}
            </Text>
          ) : isCrash ? (
            <Text
              style={[
                styles.description,
                { color: ci.lead },
              ]}
            >
              {"We've noted this as a crash day. No more questions."}
            </Text>
          ) : isFirstTime ? (
            <Text
              style={[
                styles.description,
                { color: ci.lead },
              ]}
            >
              {"That's your first piece of the picture.\nEach check-in teaches heedly a little\nmore about you."}
            </Text>
          ) : (
            <Text
              style={[
                styles.description,
                { color: ci.lead },
              ]}
            >
              {"We'll quietly watch for patterns and only\nping you if something matters."}
            </Text>
          )}

          {!isCrash && (
            <>
              <View
                style={[
                  styles.summaryCard,
                  { backgroundColor: ci.summaryBg, borderColor: ci.summaryBorder },
                  isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
                ]}
              >
                <Pressable
                  style={({ pressed }) => [styles.summaryRow, pressed && styles.rowPressed]}
                  onPress={handleEditEnergy}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${isFirstTime ? 'feeling' : 'energy'}: ${energyLabel}`}
                >
                  <Text
                    style={[
                      styles.rowLabel,
                      { color: ci.summaryKey },
                    ]}
                  >
                    {isFirstTime ? 'FEELING' : 'ENERGY'}
                  </Text>
                  <View style={styles.rowValueBlock}>
                    <Text style={[styles.rowValueText, { color: ci.summaryValue }]}>
                      {energyLabel}
                    </Text>
                    <FiveDotRating value={energyRating} isDark={isDark} isTrueBlack={isTrueBlack} />
                  </View>
                </Pressable>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: ci.summaryDivider },
                  ]}
                />

                <Pressable
                  style={({ pressed }) => [styles.summaryRow, pressed && styles.rowPressed]}
                  onPress={handleEditBody}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit body: ${bodyLabel}`}
                >
                  <Text
                    style={[
                      styles.rowLabel,
                      { color: ci.summaryKey },
                    ]}
                  >
                    BODY
                  </Text>
                  <View style={styles.rowValueBlock}>
                    <Text style={[styles.rowValueText, { color: ci.summaryValue }]}>
                      {bodyLabel}
                    </Text>
                    <FiveDotRating value={bodyRating} isDark={isDark} isTrueBlack={isTrueBlack} />
                  </View>
                </Pressable>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: ci.summaryDivider },
                  ]}
                />

                <Pressable
                  style={({ pressed }) => [styles.summaryRowTopAligned, pressed && styles.rowPressed]}
                  onPress={handleEditNotable}
                  accessibilityRole="button"
                  accessibilityLabel={`Edit notable tags: ${tagsText}`}
                >
                  <Text
                    style={[
                      styles.rowLabelTop,
                      { color: ci.summaryKey },
                    ]}
                  >
                    NOTABLE
                  </Text>
                  <Text style={[styles.rowValueTextNotable, { color: ci.summaryValue }]}>
                    {tagsText}
                  </Text>
                </Pressable>

                {!isFirstTime && yesterdayLabel && (
                  <>
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: ci.summaryDivider },
                      ]}
                    />
                    <Pressable
                      style={({ pressed }) => [styles.summaryRow, pressed && styles.rowPressed]}
                      onPress={handleEditYesterday}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit yesterday: ${yesterdayLabel}`}
                    >
                      <Text
                        style={[
                          styles.rowLabel,
                          { color: ci.summaryKey },
                        ]}
                      >
                        YESTERDAY
                      </Text>
                      <Text style={[styles.rowValueText, { color: ci.summaryValue }]}>
                        {yesterdayLabel}
                      </Text>
                    </Pressable>
                  </>
                )}

                {periodInfo && (
                  <>
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: ci.summaryDivider },
                      ]}
                    />
                    <Pressable
                      style={({ pressed }) => [styles.summaryRowTopAligned, pressed && styles.rowPressed]}
                      onPress={handleEditCycle}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit cycle: ${periodInfo}`}
                    >
                      <Text
                        style={[
                          styles.rowLabelTop,
                          { color: ci.summaryKey },
                        ]}
                      >
                        CYCLE
                      </Text>
                      <Text style={[styles.rowValueTextNotable, { color: ci.summaryValue }]}>
                        {periodInfo}
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>

              <Text
                style={[
                  styles.helperText,
                  { color: ci.summaryKey },
                ]}
              >
                Tap any line to edit before you go.
              </Text>
            </>
          )}

          {!isEarlierDay && canEditEarlier && (
            <Pressable
              onPress={handleEditEarlier}
              style={({ pressed }) => [styles.earlierLink, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel={`Update your check-in for ${dayLabel(earlierDate)}`}>
              <Text style={[styles.earlierLinkText, { color: theme.coral.terracotta }]}>
                {`Update your check-in for ${dayLabel(earlierDate)}`}
              </Text>
            </Pressable>
          )}

          <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [
              styles.buttonWrapper,
              pressed && styles.buttonPressed,
              { shadowOpacity: isDark ? 0.22 : 0.12, shadowColor: isDark ? '#000000' : '#BE968C' },
              isDark && isTrueBlack && { shadowOpacity: 0, elevation: 0 },
            ]}
            onPress={handleBackToToday}
            accessibilityRole="button"
            accessibilityLabel="Back to today"
          >
            <LinearGradient
              colors={ci.secondary}
              start={{ x: 0, y: ci.secondaryHorizontal ? 0.5 : 0 }}
              end={{ x: 1, y: ci.secondaryHorizontal ? 0.5 : 1 }}
              style={[styles.buttonGradient, { borderColor: ci.secondaryBorder }]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: ci.secondaryText },
                ]}
              >
                Back to today
              </Text>
            </LinearGradient>
          </Pressable>
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
  },

  safeArea: {
    flex: 1,
    paddingTop: 8,
  },

  rowPressed: {
    opacity: 0.6,
  },

  contentArea: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heading: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 37,
    letterSpacing: -0.32,
    textAlign: 'center',
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 270,
  },

  summaryCard: {
    alignSelf: 'stretch',
    marginTop: 28,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 18,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 9,
    // no Android elevation: it shows through the translucent card
    elevation: 0,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
  },

  summaryRowTopAligned: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
  },

  rowLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    textTransform: 'uppercase',
  },

  rowLabelTop: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    paddingTop: 2,
  },

  rowValueBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  rowValueText: {
    fontSize: 14,
    fontWeight: '600',
  },

  rowValueTextNotable: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 19,
  },

  divider: {
    height: 1,
  },

  dotRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  ratingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  helperText: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 16,
  },

  earlierLink: {
    alignSelf: 'center',
    marginTop: 18,
    paddingVertical: 6,
  },
  earlierLinkText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    textDecorationLine: 'underline',
  },

  bottomSection: {
    alignSelf: 'stretch',
    marginTop: 26,
  },

  buttonWrapper: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
