import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SymbolView } from "@/components/ui/symbol";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DawnBackground } from "@/components/core";
import { Fonts } from "@/constants/theme";
import { useCheckIn } from "@/contexts/CheckInContext";
import { useThemeMode } from "@/contexts/ThemeContext";

// ─── Palette (.sx-data, .sx-badge, .ci-sheet, .sx-sheet-* in Aubade - Today /
//     Dusk Dark Mode / OLED) ──────────────────────────────────────────────────

type Gradient = [string, string, ...string[]];

type DataPalette = {
  back: string;
  eyebrow: string;
  title: string;
  intro: string;
  section: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  cardShadowOpacity: number;
  /** .sx-live background, where it differs from the card */
  liveBg: Gradient | null;
  divider: string;
  rowTitle: string;
  rowDesc: string;
  coralBadge: Gradient;
  coralIcon: string;
  sageBadge: Gradient;
  sageIcon: string;
  action: string;
  danger: string;
  chev: string;
  foot: string;
  scrim: string;
  sheetBg: string;
  sheetBorder: string | null;
  sheetShadow: string;
  sheetShadowOpacity: number;
  grip: string;
  sheetTitle: string;
  sheetBody: string;
  sheetNote: string;
  dangerBtnBg: string;
  dangerBtnBorder: string;
  keepBtn: Gradient;
  keepBtnDiagonal: boolean;
  keepBtnText: string;
};

const DATA: Record<"light" | "dusk" | "oled", DataPalette> = {
  light: {
    back: "rgba(74, 58, 57, 0.62)",
    eyebrow: "rgba(74, 58, 57, 0.5)",
    title: "#463332",
    intro: "rgba(74, 58, 57, 0.82)",
    section: "rgba(74, 58, 57, 0.5)",
    cardBg: "rgba(255, 252, 248, 0.72)",
    cardBorder: "rgba(255, 255, 255, 0.9)",
    cardShadow: "#BE968C",
    cardShadowOpacity: 0.16,
    liveBg: null,
    divider: "rgba(120, 90, 90, 0.12)",
    rowTitle: "#4f3c3a",
    rowDesc: "rgba(74, 58, 57, 0.82)",
    coralBadge: ["#f3a784", "#e7805f"],
    coralIcon: "#fff8f4",
    sageBadge: ["#bcd6c2", "#9cc0aa"],
    sageIcon: "#426150",
    action: "#4f3c3a",
    danger: "#c0492c",
    chev: "rgba(74, 58, 57, 0.34)",
    foot: "rgba(74, 58, 57, 0.62)",
    scrim: "rgba(74, 58, 57, 0.34)",
    sheetBg: "#fbf3ec",
    sheetBorder: null,
    sheetShadow: "#785A5A",
    sheetShadowOpacity: 0.22,
    grip: "rgba(120, 90, 90, 0.2)",
    sheetTitle: "#463332",
    sheetBody: "rgba(74, 58, 57, 0.72)",
    sheetNote: "rgba(74, 58, 57, 0.64)",
    dangerBtnBg: "rgba(255, 255, 255, 0.86)",
    dangerBtnBorder: "rgba(192, 73, 44, 0.5)",
    keepBtn: ["#f4a47e", "#ea846a", "#e0735f"],
    keepBtnDiagonal: true,
    keepBtnText: "#fff8f4",
  },
  dusk: {
    back: "rgba(199, 180, 191, 0.84)",
    eyebrow: "rgba(199, 180, 191, 0.68)",
    title: "#F3E7E1",
    intro: "rgba(199, 180, 191, 1)",
    section: "rgba(199, 180, 191, 0.68)",
    cardBg: "#3E2F44",
    cardBorder: "rgba(255, 255, 255, 0.09)",
    cardShadow: "#000000",
    cardShadowOpacity: 0.29,
    liveBg: ["rgba(46, 39, 56, 0.7)", "rgba(67, 49, 67, 0.7)", "rgba(102, 73, 73, 0.7)"],
    divider: "rgba(85, 68, 91, 0.36)",
    rowTitle: "#F3E7E1",
    rowDesc: "rgba(199, 180, 191, 1)",
    coralBadge: ["#8A4B3C", "#7A4234", "#6B3A2E"],
    coralIcon: "#F3D9CD",
    sageBadge: ["#4A6B55", "#33503F"],
    sageIcon: "#C6DFCB",
    action: "#F3E7E1",
    danger: "#F08A75",
    chev: "rgba(199, 180, 191, 0.46)",
    foot: "rgba(199, 180, 191, 0.84)",
    scrim: "rgba(18, 10, 20, 0.55)",
    sheetBg: "rgba(51, 37, 56, 0.72)",
    sheetBorder: null,
    sheetShadow: "#000000",
    sheetShadowOpacity: 0.4,
    grip: "rgba(199, 180, 191, 0.28)",
    sheetTitle: "#F3E7E1",
    sheetBody: "rgba(199, 180, 191, 0.97)",
    sheetNote: "rgba(199, 180, 191, 0.86)",
    dangerBtnBg: "#3E2F44",
    dangerBtnBorder: "rgba(240, 138, 117, 0.5)",
    keepBtn: ["#634256", "#8A5D7C", "#9E768E"],
    keepBtnDiagonal: false,
    keepBtnText: "#FFF6F1",
  },
  oled: {
    back: "#A8979E",
    eyebrow: "#9A8A91",
    title: "#E9DDD6",
    intro: "#A8979E",
    section: "#9A8A91",
    cardBg: "#16111B",
    cardBorder: "rgba(255, 255, 255, 0.07)",
    cardShadow: "#000000",
    cardShadowOpacity: 0.29,
    liveBg: null,
    divider: "rgba(255, 255, 255, 0.07)",
    rowTitle: "#E9DDD6",
    rowDesc: "#A8979E",
    coralBadge: ["#5A3128", "#5A3128"],
    coralIcon: "#D8BFB4",
    sageBadge: ["#2C4235", "#2C4235"],
    sageIcon: "#9FB8A6",
    action: "#E9DDD6",
    danger: "#C46A55",
    chev: "rgba(168, 151, 158, 0.55)",
    foot: "#A8979E",
    scrim: "rgba(18, 10, 20, 0.55)",
    sheetBg: "#16111B",
    sheetBorder: "rgba(255, 255, 255, 0.07)",
    sheetShadow: "#000000",
    sheetShadowOpacity: 0.4,
    grip: "rgba(255, 255, 255, 0.07)",
    sheetTitle: "#E9DDD6",
    sheetBody: "#A8979E",
    sheetNote: "#A8979E",
    dangerBtnBg: "#16111B",
    dangerBtnBorder: "rgba(196, 106, 85, 0.5)",
    keepBtn: ["#574049", "#241A20"],
    keepBtnDiagonal: true,
    keepBtnText: "#EADCD4",
  },
};

const KEEPS = [
  { icon: "waveform.path.ecg", title: "Wearable data", desc: "Heart rate, HRV, sleep and activity from your connected device." },
  { icon: "list.clipboard", title: "Daily check-ins", desc: "Your energy, body and the things you note each day." },
  { icon: "heart", title: "Conditions", desc: "What you're living with, to shape your patterns." },
  { icon: "moon", title: "Period days", desc: "The cycle days you've logged, if you've added any." },
] as const;

const LIVES = [
  { icon: "iphone", title: "On your device", desc: "Patterns are detected here, on your phone." },
  {
    icon: "lock",
    title: "Encrypted backup",
    desc: "Stored privately in iCloud, so it's there when you change phones.",
  },
] as const;

function useDataPalette() {
  const { isDark, isTrueBlack } = useThemeMode();
  return DATA[isDark ? (isTrueBlack ? "oled" : "dusk") : "light"];
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

// .sx-data .sx-card
function DataCard({ children, style }: { children: React.ReactNode; style?: object }) {
  const c = useDataPalette();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: c.cardBg,
          borderColor: c.cardBorder,
          shadowColor: c.cardShadow,
          shadowOpacity: c.cardShadowOpacity,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

// .sx-badge: 34px circle, 18px icon
function Badge({ icon, tone }: { icon: string; tone: "coral" | "sage" }) {
  const c = useDataPalette();
  return (
    <LinearGradient
      colors={tone === "coral" ? c.coralBadge : c.sageBadge}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.badge}>
      <SymbolView
        name={icon as any}
        size={18}
        tintColor={tone === "coral" ? c.coralIcon : c.sageIcon}
      />
    </LinearGradient>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function YourDataScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const c = useDataPalette();
  const { isDark } = useThemeMode();
  const { resetAllData } = useCheckIn();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/settings" as any);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    await resetAllData();
    // Reset to fresh state on today
    router.replace("/(tabs)" as any);
  };

  const divider = (inset: object) => (
    <View style={[styles.divider, inset, { backgroundColor: c.divider }]} />
  );

  return (
    <View style={styles.root}>
      {/* Atmosphere Background */}
      <DawnBackground />

      {/* ── Back header (.sx-nav) — fixed; content scrolls out of view below it ── */}
      <View style={[styles.stickyHeader, { paddingTop: insets.top }]}>
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <SymbolView name="chevron.left" size={22} tintColor={c.back} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Screen Title Header ──────────────────────────────────────── */}
        <Text style={[styles.eyebrow, { color: c.eyebrow }]}>PRIVACY</Text>
        <Text style={[styles.mainHeading, { color: c.title }]}>Your data</Text>
        <Text style={[styles.intro, { color: c.intro }]}>
          {"Here's everything heedly keeps, in plain English."}
        </Text>

        {/* ── 1. WHAT HEEDLY KEEPS (.sx-sec) ─────────────────────────── */}
        <Text style={[styles.section, { color: c.section }]}>WHAT HEEDLY KEEPS</Text>

        <DataCard>
          {KEEPS.map((keep, index) => (
            <React.Fragment key={keep.title}>
              {index > 0 && divider(styles.keepDividerInset)}
              {/* .sx-keep */}
              <View style={styles.keepRow}>
                <Badge icon={keep.icon} tone="coral" />
                <View style={styles.keepText}>
                  <Text style={[styles.keepTitle, { color: c.rowTitle }]}>{keep.title}</Text>
                  <Text style={[styles.keepDesc, { color: c.rowDesc }]}>{keep.desc}</Text>
                </View>
              </View>
            </React.Fragment>
          ))}
        </DataCard>

        {/* ── 2. WHERE IT LIVES (.sx-sec + .sx-lives) ────────────────── */}
        <Text style={[styles.section, { color: c.section }]}>WHERE IT LIVES</Text>

        <View style={styles.lives}>
          {LIVES.map((live) => {
            const content = (
              <>
                <Badge icon={live.icon} tone="sage" />
                <View style={styles.keepText}>
                  <Text style={[styles.liveTitle, { color: c.rowTitle }]}>{live.title}</Text>
                  <Text style={[styles.liveDesc, { color: c.rowDesc }]}>{live.desc}</Text>
                </View>
              </>
            );
            return (
              <DataCard key={live.title}>
                {c.liveBg ? (
                  <LinearGradient
                    colors={c.liveBg}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.liveRow}>
                    {content}
                  </LinearGradient>
                ) : (
                  <View style={styles.liveRow}>{content}</View>
                )}
              </DataCard>
            );
          })}
        </View>

        {/* ── 3. WHO ELSE SEES IT (.sx-sec + .sx-card-pad) ───────────── */}
        <Text style={[styles.section, { color: c.section }]}>WHO ELSE SEES IT</Text>

        <DataCard style={styles.cardPad}>
          <Text style={[styles.nobodyTitle, { color: c.rowTitle }]}>Private by default.</Text>
          <Text style={[styles.nobodyBody, { color: c.rowDesc }]}>
            {"We don't sell your data. Everything is worked out on your phone."}
          </Text>
        </DataCard>

        {/* ── 4. ACTIONS (.sx-card + .sx-card: 24px apart) ───────────── */}
        <DataCard style={styles.actionsCard}>
          <Pressable
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Export my data"
          >
            <Text style={[styles.actionText, { color: c.action }]}>Export my data</Text>
            <SymbolView name="chevron.right" size={17} tintColor={c.chev} />
          </Pressable>

          {divider(styles.actionDividerInset)}

          <Pressable
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            onPress={() => setIsDeleteModalVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Delete all my data"
          >
            <Text style={[styles.actionText, { color: c.danger }]}>Delete all my data</Text>
          </Pressable>

          {divider(styles.actionDividerInset)}

          <Pressable
            style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Read full privacy policy"
          >
            <Text style={[styles.actionText, { color: c.action }]}>Read full privacy policy</Text>
            <SymbolView name="chevron.right" size={17} tintColor={c.chev} />
          </Pressable>
        </DataCard>

        {/* .sx-foot */}
        <Text style={[styles.foot, { color: c.foot }]}>
          {"Deleting asks you to confirm first — it can't be undone."}
        </Text>
      </ScrollView>

      {/* ── "Delete everything?" sheet (.ci-sheet + .sx-sheet-*) ──────── */}
      <Modal
        visible={isDeleteModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={12}
            tint={isDark ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]} />
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => setIsDeleteModalVisible(false)}
          />

          <View
            style={[
              styles.sheetContainer,
              {
                backgroundColor: c.sheetBg,
                borderColor: c.sheetBorder ?? "transparent",
                borderWidth: c.sheetBorder ? 1 : 0,
                shadowColor: c.sheetShadow,
                shadowOpacity: c.sheetShadowOpacity,
                paddingBottom: Math.max(30, insets.bottom + 16),
              },
            ]}
          >
            <View style={[styles.grip, { backgroundColor: c.grip }]} />

            <Text style={[styles.sheetTitle, { color: c.sheetTitle }]}>Delete everything?</Text>

            <Text style={[styles.sheetBody, { color: c.sheetBody }]}>
              {"This erases everything heedly keeps — every check-in and all your patterns, on this phone and in your iCloud backup. It can't be undone."}
            </Text>

            <Text style={[styles.sheetNote, { color: c.sheetNote }]}>
              {"If you have a subscription, cancel it separately in the App Store. Deleting here won't stop billing."}
            </Text>

            {/* .sx-sheet-btn.danger */}
            <Pressable
              style={({ pressed }) => [
                styles.sheetBtn,
                styles.dangerBtn,
                { backgroundColor: c.dangerBtnBg, borderColor: c.dangerBtnBorder },
                pressed && styles.buttonPressed,
              ]}
              onPress={handleConfirmDelete}
              accessibilityRole="button"
              accessibilityLabel="Confirm delete everything"
            >
              <Text style={[styles.sheetBtnText, { color: c.danger }]}>Delete everything</Text>
            </Pressable>

            {/* .sx-sheet-btn.keep */}
            <Pressable
              style={({ pressed }) => [styles.keepBtnShadow, pressed && styles.buttonPressed]}
              onPress={() => setIsDeleteModalVisible(false)}
              accessibilityRole="button"
              accessibilityLabel="Keep my data"
            >
              <LinearGradient
                colors={c.keepBtn}
                start={c.keepBtnDiagonal ? { x: 0, y: 0 } : { x: 0, y: 0.5 }}
                end={c.keepBtnDiagonal ? { x: 1, y: 1 } : { x: 1, y: 0.5 }}
                style={styles.sheetBtn}
              >
                <Text style={[styles.sheetBtnText, { color: c.keepBtnText }]}>Keep my data</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
// Values from .sx-data in the Aubade handoff. CSS blur radius B maps to RN
// shadowRadius B / 2.

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  // .sx: padding 0 22px
  scrollContent: {
    paddingHorizontal: 22,
  },

  pressed: {
    opacity: 0.75,
  },

  // .sx-sheet-btn:active: scale 0.985
  buttonPressed: {
    transform: [{ scale: 0.985 }],
  },

  // ── Header Navigation (.sx-nav) ──────────────────────────────────────────

  stickyHeader: {
    paddingHorizontal: 22,
  },

  // .sx-nav: height 30px, margin-bottom 13px
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    marginBottom: 13,
  },

  // .sx-back: 30x30, margin-left -5px
  backButton: {
    width: 30,
    height: 30,
    marginLeft: -5,
    alignItems: "center",
    justifyContent: "center",
  },

  // .sx-eyebrow: 11px, 600, letter-spacing 0.2em, margin-bottom 7px
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  // .sx-title: Comfortaa 500, 30px, letter-spacing -0.01em
  mainHeading: {
    fontFamily: Fonts.display.medium,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.3,
  },

  // .sx-intro: 14.5px, line-height 1.5, margin-top 12px, max-width 30ch
  intro: {
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 12,
    maxWidth: 268, // 30ch at 14.5px
  },

  // .sx-sec: 11px, 600, letter-spacing 0.16em, margin 23px 0 10px
  section: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.76,
    textTransform: "uppercase",
    marginTop: 23,
    marginBottom: 10,
  },

  // ── Cards (.sx-data .sx-card) ────────────────────────────────────────────

  // radius 22px, shadow 0 10px 26px
  card: {
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 13,
  },

  // .sx-card-pad: padding 16px 17px
  cardPad: {
    paddingVertical: 16,
    paddingHorizontal: 17,
  },

  // .sx-data .sx-card + .sx-card: margin-top 24px
  actionsCard: {
    marginTop: 24,
  },

  divider: {
    height: 1,
  },

  // .sx-keep::before: left 63px, right 16px
  keepDividerInset: {
    marginLeft: 63,
    marginRight: 16,
  },

  // .sx-action::before: left 17px, right 17px
  actionDividerInset: {
    marginHorizontal: 17,
  },

  // .sx-data .sx-keep: padding 15px 16px, min-height 64px, gap 13px
  keepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
    paddingVertical: 15,
    paddingHorizontal: 16,
    minHeight: 64,
  },

  // .sx-badge: 34x34 circle
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  // .sx-keep-main / .sx-live-text: gap 3px
  keepText: {
    flex: 1,
    gap: 3,
  },

  // .sx-row-title: 14.5px, 600, letter-spacing -0.01em, line-height 1.3
  keepTitle: {
    fontSize: 14.5,
    fontWeight: "600",
    letterSpacing: -0.15,
    lineHeight: 19,
  },

  // .sx-row-desc: 12.5px, line-height 1.45
  keepDesc: {
    fontSize: 12.5,
    lineHeight: 18,
  },

  // ── Where it lives (.sx-data .sx-lives / .sx-live) ───────────────────────

  // one column, gap 24px
  lives: {
    gap: 24,
  },

  // .sx-data .sx-live: row, padding 15px 16px, gap 13px
  liveRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
    paddingVertical: 15,
    paddingHorizontal: 16,
    // inside the card's 1px border, so the Dusk gradient follows its corners
    borderRadius: 21,
  },

  // .sx-live-title: 13.5px, 600
  liveTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    lineHeight: 18,
  },

  // .sx-live-desc: 12px, line-height 1.5
  liveDesc: {
    fontSize: 12,
    lineHeight: 18,
  },

  // ── Who else sees it ─────────────────────────────────────────────────────

  // .sx-nobody-title: 15px, 700, margin-bottom 6px
  nobodyTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },

  // .sx-nobody-body: 13px, line-height 1.55
  nobodyBody: {
    fontSize: 13,
    lineHeight: 20,
  },

  // ── Actions (.sx-data .sx-action) ────────────────────────────────────────

  // padding 15px 17px, min-height 54px
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 17,
    minHeight: 54,
  },

  // 14.5px, 600
  actionText: {
    fontSize: 14.5,
    fontWeight: "600",
  },

  // .sx-foot: 12px, line-height 1.4, margin 14px 2px 0
  foot: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 14,
    marginHorizontal: 2,
  },

  // ── Sheet (.ci-sheet + .sx-sheet-*) ──────────────────────────────────────

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalDismissArea: {
    flex: 1,
  },

  // .ci-sheet: radius 26px 26px 0 0, padding 14px 24px 30px, shadow 0 -12px 34px
  sheetContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 14,
    paddingHorizontal: 24,
    shadowOffset: { width: 0, height: -12 },
    shadowRadius: 17,
    elevation: 20,
  },

  // .ci-sheet-grip: 38x4, margin-bottom 18px
  grip: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },

  // .sx-sheet-h: Comfortaa 500, 25px, letter-spacing -0.01em
  sheetTitle: {
    fontFamily: Fonts.display.medium,
    fontSize: 25,
    lineHeight: 29,
    letterSpacing: -0.25,
  },

  // .sx-sheet-body: 13.5px, line-height 1.5, margin-top 12px
  sheetBody: {
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 12,
  },

  // .sx-sheet-note: 12px, line-height 1.45, margin-top 12px
  sheetNote: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
  },

  // .sx-sheet-btn: 54px tall, radius 27px, 12px apart
  sheetBtn: {
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },

  // .sx-sheet-btn.danger: border 1.5px
  dangerBtn: {
    borderWidth: 1.5,
    marginTop: 12,
  },

  // .sx-sheet-btn.keep: shadow 0 8px 20px rgba(110,86,86,0.16)
  keepBtnShadow: {
    marginTop: 12,
    borderRadius: 27,
    shadowColor: "#6E5656",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },

  // .sx-sheet-btn: 16px, 600
  sheetBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
