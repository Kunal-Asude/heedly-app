import * as Notifications from "expo-notifications";
import { Image, Platform } from "react-native";

import { getActiveTheme } from "@/utils/getActiveTheme";

// ─── Theme-wise orb tile images (.lock-app-icon) ──────────────────────────────
// Static renders of the EnergyOrb per theme, 120×120px (@3x → 40×40pt)
// Design source: Aubade - True Black (OLED).html .lock-app-icon / .lock-app-icon .orb
// animation: none per design spec — static themed PNG per active theme

const ORB_IMAGES = {
  oled: require("../assets/images/notifications/orb_oled.jpg"),
  dusk: require("../assets/images/notifications/orb_dusk.jpg"),
  dawn: require("../assets/images/notifications/orb_dawn.jpg"),
} as const;

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from iOS/Android
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    finalStatus = status;
  }

  return finalStatus === "granted";
}

/**
 * Resolves the themed orb image URI for use as a notification attachment.
 * Reads the user's persisted theme (dawn | dusk | oled) without React context.
 */
async function getOrbAttachmentUri(): Promise<string | null> {
  try {
    const theme = await getActiveTheme();
    const source = Image.resolveAssetSource(ORB_IMAGES[theme]);
    return source?.uri ?? null;
  } catch {
    return null;
  }
}

/**
 * Builds the iOS notification attachments array with the theme-wise orb tile.
 * Falls back to no attachment if the image URI cannot be resolved.
 *
 * Design spec (.lock-app-icon):
 *   width: 40px; height: 40px; border-radius: 11px; overflow: hidden;
 *   orb inside at 30×30; animation: none;
 */
async function buildOrbAttachments(): Promise<Notifications.NotificationContentInput["attachments"]> {
  if (Platform.OS !== "ios") return undefined;

  const uri = await getOrbAttachmentUri();
  if (!uri) return undefined;

  return [
    {
      identifier: "heedly-orb",
      url: uri,
      type: "image/jpeg",
    },
  ];
}

/**
 * Send a real native iOS heads-up notification for Caution/Rest days
 * Title: "A gentler day ahead"
 * Body: "Tomorrow looks like a caution day — worth pacing a little."
 *
 * Notification tile uses the theme-matched orb image per design handoff.
 * (.lock-notif / .lock-app-icon — Aubade True Black OLED.html)
 */
export async function sendTestCautionHeadsUpNotification(): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  const attachments = await buildOrbAttachments();

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "A gentler day ahead",
      body: "Tomorrow looks like a caution day — worth pacing a little.",
      sound: true,
      attachments,
      data: { screen: "today", type: "caution-heads-up" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });

  return notificationId;
}

/**
 * Send a daily check-in reminder
 * Notification tile uses the theme-matched orb image per design handoff.
 */
export async function sendDailyCheckInReminder(): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  const attachments = await buildOrbAttachments();

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "How did yesterday land?",
      body: "A gentle check-in whenever you're ready — even lying down.",
      sound: true,
      attachments,
      data: { screen: "check-in" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });

  return notificationId;
}
