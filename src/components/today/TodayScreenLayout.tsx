import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const actualOrbSize = orbSize ?? (orbState === "empty" ? 152 : TODAY_ORB_SIZE);

  return (
    <View style={styles.root}>
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <TodayHeader
            dateText={dateText}
            greeting={greeting}
            onSettingsPress={onSettingsPress}
          />

          <View style={styles.mainContentGroup}>
            <View style={styles.orbSlot}>
              <TodayOrbContainer state={orbState} size={actualOrbSize} />
            </View>

            <View style={styles.headlineSlot}>
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

            <View style={styles.supportingSlot}>
              <TodaySupportingText text={supportingText} />
            </View>

            <View style={styles.forecastSlot}>
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
        </View>
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
  const actualOrbSize = orbSize ?? (orbState === "empty" ? 152 : TODAY_ORB_SIZE);

  return (
    <View style={styles.root}>
      <DawnBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <TodayHeader
            dateText={dateText}
            greeting={greeting}
            onSettingsPress={onSettingsPress}
          />

          <View style={styles.learningContentGroup}>
            <View style={styles.orbSlot}>
              <TodayOrbContainer state={orbState} size={actualOrbSize} />
            </View>

            <View style={styles.headlineSlot}>
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

            <View style={styles.supportingSlot}>
              <TodaySupportingText text={supportingText} />
            </View>

            <View style={styles.forecastSlot}>
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
        </View>
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

  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: 76, // Shifts the CTA button slightly lower down towards the floating tab bar
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
    marginTop: 88,
    marginBottom: 18,
  },

  headlineSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 12,
  },

  smallOrbHeadlineSlot: {
    marginTop: 24,
    marginBottom: 16,
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
    marginTop: 22,
    marginBottom: 4,
  },

  smallOrbForecastSlot: {
    marginTop: 22,
    marginBottom: 6,
  },

  secondaryCenterRegion: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 28,
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

  actionAreaGroup: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
});
