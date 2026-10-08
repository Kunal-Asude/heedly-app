import { ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useTabBarInset } from "@/components/app-tabs";
import { DawnBackground, EnergyOrbState } from "@/components/core";
import { Spacing } from "@/constants/theme";

import { TodayBadge } from "./TodayBadge";
import { TodayCtaButton } from "./TodayCtaButton";
import { TodayFooterNote } from "./TodayFooterNote";
import { ForecastDay, TodayForecastCard } from "./TodayForecastCard";
import { TodayHeader } from "./TodayHeader";
import { TodayHeadline } from "./TodayHeadline";
import { TODAY_ORB_SIZE, TodayOrbContainer } from "./TodayOrbContainer";
import { TodaySecondaryLink } from "./TodaySecondaryLink";
import { TodaySupportingText } from "./TodaySupportingText";

export interface TodayScreenLayoutProps {
  // Header
  dateText?: string;
  greeting?: string;
  onSettingsPress?: () => void;

  // Orb
  orbState: EnergyOrbState;
  orbSize?: number;

  // Headline
  headline1: string;
  headline2: string;
  isHeadlineAccent?: boolean;

  // State Badge
  isFirstDay?: boolean;
  indicatorText: string;
  indicatorDotColor: string;
  onBadgePress?: () => void;

  // Supporting Text
  supportingText?: string;

  // Forecast Card or Learning Note
  forecast?: ForecastDay[];
  learningNote?: string;

  // Secondary Link / Explanatory Text
  secondaryText?: string;
  isSecondaryLink?: boolean;
  onSecondaryPress?: () => void;

  // Primary CTA Button
  ctaLabel: string;
  onCtaPress: () => void;

  // Footer Note
  footerNote?: string;
  onFooterPress?: () => void;
}

// Header (8 + 56 + 4) + orb gap 13 + headline block 103 + status line 44 +
// outlook 9 + 66 + why link 30 + CTA gap 16 + CTA 60 + planning link 40.
const MAIN_FIXED_HEIGHT = 450;

export function TodayScreenLayout({
  dateText,
  greeting,
  onSettingsPress,
  orbState,
  orbSize,
  headline1,
  headline2,
  isHeadlineAccent = true,
  isFirstDay = false,
  indicatorText,
  indicatorDotColor,
  onBadgePress,
  supportingText,
  forecast,
  learningNote,
  secondaryText,
  isSecondaryLink = false,
  onSecondaryPress,
  ctaLabel,
  onCtaPress,
  footerNote,
  onFooterPress,
}: TodayScreenLayoutProps) {
  const { height: windowHeight } = useWindowDimensions();
  const { top: safeTop } = useSafeAreaInsets();
  const tabBarInset = useTabBarInset();
  const requestedOrbSize = orbSize ?? (orbState === "empty" ? 152 : TODAY_ORB_SIZE);
  // Everything but the orb takes MAIN_FIXED_HEIGHT, so the orb gets what is
  // left: the full 254 on a 402x874 iPhone, smaller on shorter screens so the
  // CTA and planning link stay above the tab bar without scrolling.
  const actualOrbSize = Math.max(
    152,
    Math.min(requestedOrbSize, windowHeight - safeTop - tabBarInset - MAIN_FIXED_HEIGHT),
  );

  return (
    <View style={styles.root}>
      <DawnBackground />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          style={[styles.scrollArea, { marginBottom: tabBarInset }]}
          contentContainerStyle={[styles.contentContainer, styles.mainContentContainer]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TodayHeader
            dateText={dateText}
            greeting={greeting}
            accentName
            onSettingsPress={onSettingsPress}
          />

          {/* Gaps follow the mockup's absolute positions (402x874 frame). */}
          <View style={styles.topSpacer} />
          <View style={styles.mainContentGroup}>
            <View style={[styles.orbSlot, styles.mainOrbSlot]}>
              <TodayOrbContainer state={orbState} size={actualOrbSize} />
            </View>

            <View style={[styles.headlineSlot, styles.mainHeadlineSlot]}>
              <TodayHeadline
                headline1={headline1}
                headline2={headline2}
                isAccent={isHeadlineAccent}
              />
            </View>

            <View style={styles.badgeSlot}>
              <TodayBadge
                isFirstDay={isFirstDay}
                indicatorText={indicatorText}
                indicatorDotColor={indicatorDotColor}
                onPress={onBadgePress}
              />
            </View>

            {supportingText ? (
              <View style={styles.supportingSlot}>
                <TodaySupportingText text={supportingText} />
              </View>
            ) : null}

            <View style={[styles.forecastSlot, styles.mainForecastSlot]}>
              <TodayForecastCard
                forecast={forecast}
                learningNote={learningNote}
              />
            </View>

            {/* .qlink.why: text 12px under the outlook. The slot keeps its
                height without a link, so the CTA sits at the same y in every
                state, as in the design. */}
            <View style={styles.whySlot}>
              <TodaySecondaryLink
                text={secondaryText}
                isLink={isSecondaryLink}
                onPress={onSecondaryPress}
              />
            </View>
          </View>

          <View style={styles.ctaSpacer} />

          <View style={styles.actionAreaGroup}>
            <TodayCtaButton label={ctaLabel} onPress={onCtaPress} />
            <TodayFooterNote text={footerNote} onPress={onFooterPress} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export interface LearningScreenLayoutProps {
  dateText?: string;
  greeting?: string;
  onSettingsPress?: () => void;
  orbState: EnergyOrbState;
  orbSize?: number;
  headline1: string;
  headline2: string;
  isHeadlineAccent?: boolean;
  isFirstDay?: boolean;
  indicatorText: string;
  indicatorDotColor: string;
  onBadgePress?: () => void;
  supportingText?: string;
  forecast?: ForecastDay[];
  learningNote?: string;
  secondaryText?: string;
  isSecondaryLink?: boolean;
  onSecondaryPress?: () => void;
  ctaLabel: string;
  onCtaPress: () => void;
  footerNote?: string;
  onFooterPress?: () => void;
}

export function LearningScreenLayout({
  dateText,
  greeting,
  onSettingsPress,
  orbState,
  orbSize,
  headline1,
  headline2,
  isHeadlineAccent = true,
  isFirstDay = false,
  indicatorText,
  indicatorDotColor,
  onBadgePress,
  supportingText,
  forecast,
  learningNote,
  secondaryText,
  isSecondaryLink = false,
  onSecondaryPress,
  ctaLabel,
  onCtaPress,
  footerNote,
  onFooterPress,
}: LearningScreenLayoutProps) {
  const { height: windowHeight } = useWindowDimensions();
  const tabBarInset = useTabBarInset();
  const requestedOrbSize = orbSize ?? (orbState === "empty" ? 152 : TODAY_ORB_SIZE);
  const actualOrbSize = Math.min(requestedOrbSize, Math.round(windowHeight * 0.27));
  const isSmallOrb = orbState === "empty";

  return (
    <View style={styles.root}>
      <DawnBackground />

      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          style={[styles.scrollArea, { marginBottom: tabBarInset }]}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <TodayHeader
            dateText={dateText}
            greeting={greeting}
            onSettingsPress={onSettingsPress}
          />

          <View style={styles.learningContentGroup}>
            <View style={[styles.orbSlot, isSmallOrb && styles.smallOrbSlot]}>
              <TodayOrbContainer state={orbState} size={actualOrbSize} />
            </View>

            <View style={[styles.headlineSlot, isSmallOrb && styles.smallOrbHeadlineSlot]}>
              <TodayHeadline
                headline1={headline1}
                headline2={headline2}
                isAccent={isHeadlineAccent}
              />
            </View>

            <View style={[styles.badgeSlot, styles.learningBadgeSlot]}>
              <TodayBadge
                isFirstDay={isFirstDay}
                indicatorText={indicatorText}
                indicatorDotColor={indicatorDotColor}
                onPress={onBadgePress}
              />
            </View>

            <View style={[styles.supportingSlot, styles.learningSupportingSlot]}>
              <TodaySupportingText text={supportingText} />
            </View>

            <View style={[styles.forecastSlot, isSmallOrb && styles.smallOrbForecastSlot]}>
              <TodayForecastCard
                forecast={forecast}
                learningNote={learningNote}
              />
            </View>
          </View>

          <View style={styles.secondaryCenterRegion}>
            <TodaySecondaryLink
              text={secondaryText}
              isLink={isSecondaryLink}
              onPress={onSecondaryPress}
            />
          </View>

          <View style={styles.actionAreaGroup}>
            <TodayCtaButton label={ctaLabel} onPress={onCtaPress} />
            <TodayFooterNote text={footerNote} onPress={onFooterPress} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "transparent",
  },

  safeArea: {
    flex: 1,
  },

  scrollArea: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },

  mainContentGroup: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  learningContentGroup: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  orbSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 8,
  },

  smallOrbSlot: {
    marginTop: 64,
    marginBottom: 0,
  },

  headlineSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 10,
  },

  smallOrbHeadlineSlot: {
    marginTop: 57,
    marginBottom: 28,
  },

  badgeSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  supportingSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  forecastSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 4,
  },

  smallOrbForecastSlot: {
    marginTop: 6,
    marginBottom: 0,
  },

  // .fd-status: 11px between the chip and the micro line
  learningBadgeSlot: {
    marginBottom: 4,
  },

  learningSupportingSlot: {
    marginBottom: 0,
  },

  secondaryCenterRegion: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 0,
  },

  secondarySlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 0,
  },

  flexibleSpacer: {
    flex: 1,
    minHeight: 0,
  },

  learningFlexibleSpacer: {
    flex: 1,
    minHeight: 0,
  },

  // Header text ends 22px above the orb (.head 72 → .orb-stage 150)
  mainOrbSlot: {
    marginTop: 13,
    marginBottom: 0,
  },

  // .editorial starts 17px under the orb and the status line 13px under it
  mainHeadlineSlot: {
    marginTop: 17,
    marginBottom: 4,
  },

  // .outlook starts 32px under the status line
  mainForecastSlot: {
    marginTop: 9,
    marginBottom: 0,
  },

  whySlot: {
    width: "100%",
    height: 18,
    alignItems: "center",
    marginTop: 12,
  },

  // Every gap below is fixed to the design. Height a screen has beyond the
  // 402x874 frame goes here, above the orb.
  topSpacer: {
    flex: 1,
  },

  // .cta sits 16px under the why link
  ctaSpacer: {
    height: 16,
  },

  mainContentContainer: {
    paddingBottom: 0,
  },

  actionAreaGroup: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
});
