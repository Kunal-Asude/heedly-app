import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/constants/themes';
import { useThemeMode } from '@/contexts/ThemeContext';

// ─── Dot Rating Indicator Component ────────────────────────────────────────────

function FiveDotRating({ value, isDark }: { value: number; isDark: boolean }) {
  return (
    <View style={styles.dotRatingRow}>
      {[1, 2, 3, 4, 5].map((idx) => (
        <View
          key={idx}
          style={[
            styles.ratingDot,
            {
              backgroundColor:
                idx <= value
                  ? isDark
                    ? '#E8907A'
                    : '#ec7d5e'
                  : isDark
                  ? 'rgba(199, 180, 191, 0.24)'
                  : 'rgba(120, 90, 90, 0.18)',
            },
          ]}
        />
      ))}
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckInSavedScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const params = useLocalSearchParams<{
    yesterdayIndex?: string;
    yesterdayLabel?: string;
    energyIndex?: string;
    energyLabel?: string;
    bodyIndex?: string;
    bodyLabel?: string;
    tags?: string;
    periodInfo?: string;
    isFirstTime?: string;
    isCrash?: string;
  }>();

  const isCrash = params.isCrash === 'true';
  const isFirstTime = params.isFirstTime === 'true';

  const yesterdayLabel = params.yesterdayLabel;
  const energyLabel = params.energyLabel ?? (isFirstTime ? 'okay' : 'middling');
  const energyRating = params.energyIndex ? Number(params.energyIndex) + 1 : 3;
  const bodyLabel = params.bodyLabel ?? 'tender';
  const bodyRating = params.bodyIndex ? Number(params.bodyIndex) + 1 : 3;
  const tagsText = params.tags && params.tags.length > 0 ? params.tags : 'social · screens · warm room';
  const periodInfo = params.periodInfo;

  const currentParams = {
    energyIndex: params.energyIndex,
    energyLabel: params.energyLabel,
    yesterdayIndex: params.yesterdayIndex,
    yesterdayLabel: params.yesterdayLabel,
    bodyIndex: params.bodyIndex,
    bodyLabel: params.bodyLabel,
    tags: params.tags,
    periodInfo: params.periodInfo,
    isFirstTime: params.isFirstTime,
    isEditing: 'true',
    isCrash: params.isCrash,
  };

  const handleEditEnergy = () => {
    router.push({
      pathname: '/(check-in)/energy',
      params: currentParams,
    });
  };

  const handleEditBody = () => {
    router.push({
      pathname: '/(check-in)/body',
      params: currentParams,
    });
  };

  const handleEditNotable = () => {
    router.push({
      pathname: '/(check-in)/noting',
      params: currentParams,
    });
  };

  const handleEditYesterday = () => {
    router.push({
      pathname: '/(check-in)/yesterday',
      params: currentParams,
    });
  };

  const handleEditCycle = () => {
    router.push({
      pathname: '/(check-in)/noting',
      params: {
        ...currentParams,
        openPeriod: 'true',
      },
    });
  };

  const handleBackToToday = () => {
    if (isCrash) {
      router.replace('/(tabs)?mode=rest' as any);
    } else if (isFirstTime) {
      router.replace('/(tabs)?mode=fd-wearable' as any);
    } else {
      router.replace('/(tabs)?mode=steady' as any);
    }
  };

  return (
    <View style={styles.root}>
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentArea}>
          <View style={styles.iconContainer}>
            {isCrash ? (
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: isDark ? '#723E3A' : '#FCE4E6',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  },
                ]}
              >
                <SymbolView
                  name="moon"
                  size={23}
                  tintColor={isDark ? '#F5D5C8' : '#DC6B76'}
                />
              </View>
            ) : (
              <View
                style={[
                  styles.iconBadge,
                  {
                    backgroundColor: isDark ? '#466650' : '#c1dac8',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#a0c4ab',
                  },
                ]}
              >
                <SymbolView
                  name="checkmark"
                  size={23}
                  tintColor={isDark ? '#D2E8DA' : '#4f7359'}
                />
              </View>
            )}
          </View>

          {isCrash ? (
            <Text style={styles.heading}>
              <Text style={{ color: isDark ? '#F3E7E1' : theme.ink.display }}>{'Logged.\n'}</Text>
              <Text style={{ color: isDark ? '#E8907A' : theme.coral.terracottaDeep }}>Rest now, Sam.</Text>
            </Text>
          ) : isFirstTime ? (
            <Text style={styles.heading}>
              <Text style={{ color: isDark ? '#F3E7E1' : theme.ink.display }}>{'Thank you, '}</Text>
              <Text style={{ color: isDark ? '#E8907A' : theme.coral.terracottaDeep }}>Sam.</Text>
            </Text>
          ) : (
            <Text style={styles.heading}>
              <Text style={{ color: isDark ? '#F3E7E1' : theme.ink.display }}>{'Saved.\n'}</Text>
              <Text style={{ color: isDark ? '#E8907A' : theme.coral.terracottaDeep }}>Rest well, Sam.</Text>
            </Text>
          )}

          {isCrash ? (
            <Text
              style={[
                styles.description,
                { color: isDark ? 'rgba(199, 180, 191, 0.95)' : 'rgba(74, 58, 57, 0.72)' },
              ]}
            >
              {"We've noted this as a crash day. No more questions."}
            </Text>
          ) : isFirstTime ? (
            <Text
              style={[
                styles.description,
                { color: isDark ? 'rgba(199, 180, 191, 0.95)' : 'rgba(74, 58, 57, 0.72)' },
              ]}
            >
              {"That's your first piece of the picture.\nEach check-in teaches heedly a little\nmore about you."}
            </Text>
          ) : (
            <Text
              style={[
                styles.description,
                { color: isDark ? 'rgba(199, 180, 191, 0.95)' : 'rgba(74, 58, 57, 0.72)' },
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
                  {
                    backgroundColor: isDark ? 'rgba(51, 37, 56, 0.72)' : 'rgba(255, 252, 248, 0.72)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(255, 255, 255, 0.8)',
                  },
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
                      { color: isDark ? 'rgba(199, 180, 191, 0.68)' : 'rgba(74, 58, 57, 0.5)' },
                    ]}
                  >
                    {isFirstTime ? 'FEELING' : 'ENERGY'}
                  </Text>
                  <View style={styles.rowValueBlock}>
                    <Text style={[styles.rowValueText, { color: isDark ? '#F3E7E1' : '#4f3c3a' }]}>
                      {energyLabel}
                    </Text>
                    <FiveDotRating value={energyRating} isDark={isDark} />
                  </View>
                </Pressable>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: isDark ? 'rgba(199, 180, 191, 0.12)' : 'rgba(120, 90, 90, 0.1)' },
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
                      { color: isDark ? 'rgba(199, 180, 191, 0.68)' : 'rgba(74, 58, 57, 0.5)' },
                    ]}
                  >
                    BODY
                  </Text>
                  <View style={styles.rowValueBlock}>
                    <Text style={[styles.rowValueText, { color: isDark ? '#F3E7E1' : '#4f3c3a' }]}>
                      {bodyLabel}
                    </Text>
                    <FiveDotRating value={bodyRating} isDark={isDark} />
                  </View>
                </Pressable>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: isDark ? 'rgba(199, 180, 191, 0.12)' : 'rgba(120, 90, 90, 0.1)' },
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
                      { color: isDark ? 'rgba(199, 180, 191, 0.68)' : 'rgba(74, 58, 57, 0.5)' },
                    ]}
                  >
                    NOTABLE
                  </Text>
                  <Text style={[styles.rowValueTextNotable, { color: isDark ? '#F3E7E1' : '#5a4644' }]}>
                    {tagsText}
                  </Text>
                </Pressable>

                {!isFirstTime && yesterdayLabel && (
                  <>
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: isDark ? 'rgba(199, 180, 191, 0.12)' : 'rgba(120, 90, 90, 0.1)' },
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
                          { color: isDark ? 'rgba(199, 180, 191, 0.68)' : 'rgba(74, 58, 57, 0.5)' },
                        ]}
                      >
                        YESTERDAY
                      </Text>
                      <Text style={[styles.rowValueText, { color: isDark ? '#F3E7E1' : '#4f3c3a' }]}>
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
                        { backgroundColor: isDark ? 'rgba(199, 180, 191, 0.12)' : 'rgba(120, 90, 90, 0.1)' },
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
                          { color: isDark ? 'rgba(199, 180, 191, 0.68)' : 'rgba(74, 58, 57, 0.5)' },
                        ]}
                      >
                        CYCLE
                      </Text>
                      <Text style={[styles.rowValueTextNotable, { color: isDark ? '#F3E7E1' : '#5a4644' }]}>
                        {periodInfo}
                      </Text>
                    </Pressable>
                  </>
                )}
              </View>

              <Text
                style={[
                  styles.helperText,
                  { color: isDark ? 'rgba(199, 180, 191, 0.68)' : 'rgba(74, 58, 57, 0.5)' },
                ]}
              >
                Tap any line to edit before you go.
              </Text>
            </>
          )}
        </View>

        <View style={styles.bottomSection}>
          <Pressable
            style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonPressed]}
            onPress={handleBackToToday}
            accessibilityRole="button"
            accessibilityLabel="Back to today"
          >
            <LinearGradient
              colors={
                isDark
                  ? ['#634256', '#8A5D7C', '#9E768E']
                  : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 252, 248, 0.85)']
              }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[
                styles.buttonGradient,
                !isDark && {
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.85)',
                },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: isDark ? '#FFF6F1' : '#463332' },
                ]}
              >
                Back to today
              </Text>
            </LinearGradient>
          </Pressable>
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
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 8,
  },

  iconContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },

  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2,
  },

  heading: {
    fontFamily: Fonts.display.regular,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: 26,
    paddingHorizontal: 12,
  },

  summaryCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 3,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  summaryRowTopAligned: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginLeft: 16,
  },

  divider: {
    height: 1,
  },

  dotRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  helperText: {
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },

  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },

  buttonWrapper: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 4,
  },

  buttonPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.15,
  },
});
