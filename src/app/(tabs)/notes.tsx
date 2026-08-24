import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { DawnBackground } from '@/components/core';
import { CORAL, Fonts, INK } from '@/constants/theme';
import { useNotes } from '@/hooks/data';

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    userName,
    dateRange,
    totalCheckInsCount,
    metrics,
    triggers,
    summaryParagraph,
    generatedDateText,
  } = useNotes();

  const handleBack = () => {
    router.replace('/(tabs)/patterns');
  };

  return (
    <View style={styles.root}>
      {/* Exact Aubade Dawn Atmosphere Background */}
      <DawnBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: 8, paddingBottom: insets.bottom + 190 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}>

          {/* ── Back Chevron (.sx-nav) ─────────────────────────────────── */}
          <View style={styles.topRow}>
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <Text style={styles.backChevron}>‹</Text>
            </Pressable>
          </View>

          {/* ── Category Label & Heading (.nt-eyebrow & .nt-title) ─────── */}
          <Text style={styles.categoryLabel}>FOR YOUR APPOINTMENT</Text>

          <Text style={styles.mainHeading}>Your notes</Text>

          <Text style={styles.subtitleText}>
            {"Everything you've been living, now on one page."}
          </Text>

          {/* ── 90-DAY SUMMARY Card (.nt-card) ─────────────────────────── */}
          <View style={styles.summary90Card}>
            {/* Header Row (.nt-card-head) */}
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.cardHeaderLabel}>90-DAY SUMMARY</Text>
                <Text style={styles.userNameText}>{userName}</Text>
              </View>
              <View style={styles.metaRight}>
                <Text style={styles.cardHeaderDate}>{dateRange}</Text>
                <Text style={styles.checkInsText}>{totalCheckInsCount} daily check-ins</Text>
              </View>
            </View>

            {/* 3 Metric Tiles Row (.nt-tiles) */}
            <View style={styles.metricsRow}>
              {metrics.map((metric, idx) => (
                <LinearGradient
                  key={idx}
                  colors={['#f8d9bf', '#f3c7a6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.metricBox}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricSubtext}>{metric.subtext}</Text>
                </LinearGradient>
              ))}
            </View>
          </View>

          {/* ── TOP TRIGGERS Section (.nt-sec--sp) ─────────────────────── */}
          <Text style={styles.groupHeaderLabel}>TOP TRIGGERS</Text>

          <View style={styles.triggersBlock}>
            {triggers.map((trigger, index) => (
              <View key={trigger.id}>
                <View style={styles.triggerRow}>
                  <View style={styles.triggerLeftBlock}>
                    <Text style={styles.triggerTitle}>{trigger.title}</Text>
                    <Text style={styles.triggerSubtitle}>{trigger.subtitle}</Text>
                  </View>
                  <Text style={styles.impactText}>{trigger.impactText}</Text>
                </View>
                {index < triggers.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          {/* ── SUMMARY Section (.nt-sec--summary & .nt-card--summary) ──── */}
          <Text style={styles.groupHeaderLabel}>SUMMARY</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryParagraphText}>
              {summaryParagraph}
            </Text>
          </View>

          {/* Provenance note (.nt-prov) */}
          <Text style={styles.disclaimerText}>
            {generatedDateText}
          </Text>

          {/* ── Personal Note Link (.nt-addnote) ───────────────────────── */}
          <Pressable
            style={({ pressed }) => [styles.personalNoteContainer, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Add a personal note">
            <Text style={styles.personalNoteText}>Add a personal note ›</Text>
          </Pressable>

        </ScrollView>

        {/* ── Sticky Floating Bottom Action Panel (.nt-actions) ────────── */}
        <View style={[styles.bottomPanel, { bottom: insets.bottom > 0 ? insets.bottom + 8 : 16 }]}>
          {/* Main Appointment Button (.nt-primary) */}
          <Pressable
            style={({ pressed }) => [styles.appointmentButtonWrapper, pressed && styles.buttonPressed]}
            onPress={() => router.push('/paywall' as any)}
            accessibilityRole="button"
            accessibilityLabel="Prepare for my appointment">
            <LinearGradient
              colors={[CORAL.light, CORAL.mid, CORAL.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.appointmentButtonGradient}>
              <SymbolView name="calendar" size={18} tintColor="#fff8f4" />
              <Text style={styles.appointmentButtonText}>Prepare for my appointment</Text>
            </LinearGradient>
          </Pressable>

          {/* Secondary Action Row: Export / Share & Copy Link (.nt-ghost) */}
          <View style={styles.secondaryActionsRow}>
            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Export / Share">
              <SymbolView name="square.and.arrow.up" size={15} tintColor="#4f3c3a" />
              <Text style={styles.secondaryBtnText}>Export / Share</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Copy link">
              <SymbolView name="link" size={15} tintColor="#4f3c3a" />
              <Text style={styles.secondaryBtnText}>Copy link</Text>
            </Pressable>
          </View>
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 24,
  },

  pressed: {
    opacity: 0.75,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },

  // ── Top Header (.sx-nav) ─────────────────────────────────────────────────

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 36,
    marginBottom: 8,
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

  // .nt-eyebrow: 11px, 600, 0.2em, uppercase, rgba(74,58,57,0.5)
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.5)',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 7,
  },

  // .nt-title: Comfortaa 400, 30px, lineHeight 36px, #463332
  mainHeading: {
    fontFamily: Fonts.display.regular,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.3,
    color: INK.display,
    marginBottom: 6,
  },

  // .nt-sub: 14.5px, 1.5, rgba(74,58,57,0.78)
  subtitleText: {
    fontSize: 14.5,
    lineHeight: 22,
    color: 'rgba(74, 58, 57, 0.78)',
    marginBottom: 16,
  },

  // ── 90-Day Summary Card (.nt-card) ───────────────────────────────────────

  summary90Card: {
    backgroundColor: 'rgba(255, 252, 248, 0.82)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 18,
    marginBottom: 20,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 3,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },

  cardHeaderLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: 'rgba(74, 58, 57, 0.5)',
  },

  userNameText: {
    fontFamily: Fonts.display.regular,
    fontSize: 19,
    color: INK.display,
    marginTop: 4,
  },

  metaRight: {
    alignItems: 'flex-end',
  },

  cardHeaderDate: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(74, 58, 57, 0.74)',
    lineHeight: 18,
  },

  checkInsText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(74, 58, 57, 0.58)',
    lineHeight: 18,
  },

  // ── 3 Metric Tiles (.nt-tiles & .nt-tile) ─────────────────────────────────

  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },

  metricBox: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 11,
    alignItems: 'flex-start',
    shadowColor: '#E0735F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },

  // .nt-tile-label: 9.5px, 600, 0.13em, uppercase, rgba(120,72,48,0.72)
  metricLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.23,
    textTransform: 'uppercase',
    color: 'rgba(120, 72, 48, 0.72)',
    marginBottom: 8,
  },

  // .nt-tile-val: 21px, 700, -0.015em, #463130
  metricValue: {
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: '#463130',
    lineHeight: 22,
  },

  // .nt-tile-cap: 11px, 500, rgba(74,58,57,0.6)
  metricSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(74, 58, 57, 0.6)',
    marginTop: 7,
  },

  // ── Top Triggers (.nt-sec--sp & .nt-trig) ─────────────────────────────────

  groupHeaderLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: 'rgba(74, 58, 57, 0.5)',
    marginBottom: 8,
    marginTop: 10,
  },

  triggersBlock: {
    marginBottom: 16,
  },

  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 14,
  },

  triggerLeftBlock: {
    flex: 1,
    minWidth: 0,
  },

  // .nt-trig-title: 15px, 600, #463332
  triggerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: INK.display,
  },

  // .nt-trig-detail: 12.5px, rgba(74,58,57,0.6)
  triggerSubtitle: {
    fontSize: 12.5,
    color: 'rgba(74, 58, 57, 0.6)',
    marginTop: 4,
  },

  // .nt-trig-badge: 12.5px, 600, #b6634a
  impactText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#b6634a',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(120, 90, 80, 0.13)',
  },

  // ── Summary Card (.nt-card--summary) ─────────────────────────────────────

  summaryCard: {
    backgroundColor: 'rgba(255, 252, 248, 0.82)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#BE968C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  // .nt-para: 13.5px, 1.62 (22px), rgba(74,58,57,0.82)
  summaryParagraphText: {
    fontSize: 13.5,
    lineHeight: 22,
    color: 'rgba(74, 58, 57, 0.82)',
    fontWeight: '400',
  },

  // .nt-prov: 12.5px, 1.55, rgba(74,58,57,0.6)
  disclaimerText: {
    fontSize: 12.5,
    lineHeight: 19.5,
    color: 'rgba(74, 58, 57, 0.6)',
    fontWeight: '500',
    marginBottom: 20,
  },

  // .nt-addnote: 14.5px, 600, #b0532f
  personalNoteContainer: {
    alignSelf: 'center',
    paddingVertical: 6,
    marginBottom: 12,
  },

  personalNoteText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: CORAL.terracottaDeep,
  },

  // ── Floating Action Panel (.nt-actions) ───────────────────────────────────

  bottomPanel: {
    position: 'absolute',
    left: 18,
    right: 18,
    zIndex: 20,
    padding: 10,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    gap: 8,
    shadowColor: '#B48282',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 26,
    elevation: 6,
  },

  appointmentButtonWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    shadowColor: '#6E5656',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
  },

  appointmentButtonGradient: {
    flex: 1,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  appointmentButtonText: {
    color: '#fff8f4',
    fontSize: 15.5,
    fontWeight: '600',
  },

  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // .nt-ghost: 40px height, radius 20px, bg rgba(255,255,255,0.7)
  secondaryBtn: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f3c3a',
  },
});
