import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

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
 * Send a real native iOS heads-up notification for Caution/Rest days
 * Title: "A gentler day ahead"
 * Body: "Tomorrow looks like a caution day — worth pacing a little."
 */
export async function sendTestCautionHeadsUpNotification(): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "A gentler day ahead",
      body: "Tomorrow looks like a caution day — worth pacing a little.",
      sound: true,
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
 */
export async function sendDailyCheckInReminder(): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "How did yesterday land?",
      body: "A gentle check-in whenever you're ready — even lying down.",
      sound: true,
      data: { screen: "check-in" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });

  return notificationId;
}
