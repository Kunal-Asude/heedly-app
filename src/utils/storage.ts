import { Platform } from "react-native";

let asyncStorageModule: any = null;
let isAsyncStorageAvailable = false;

try {
  // Dynamically require to avoid crash if native module is not yet compiled into running binary
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  if (AsyncStorage && typeof AsyncStorage.getItem === "function") {
    asyncStorageModule = AsyncStorage;
    isAsyncStorageAvailable = true;
  }
} catch {
  isAsyncStorageAvailable = false;
}

const memoryStore: Record<string, string> = {};

export const appStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return memoryStore[key] ?? null;
      }
    }

    if (isAsyncStorageAvailable && asyncStorageModule) {
      try {
        const val = await asyncStorageModule.getItem(key);
        if (val !== null) return val;
      } catch {
        // Fallback to memory store if native storage call fails
      }
    }

    return memoryStore[key] ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    memoryStore[key] = value;

    if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Ignore web storage errors
      }
      return;
    }

    if (isAsyncStorageAvailable && asyncStorageModule) {
      try {
        await asyncStorageModule.setItem(key, value);
      } catch {
        // Ignore native storage error
      }
    }
  },

  async removeItem(key: string): Promise<void> {
    delete memoryStore[key];

    if (Platform.OS === "web" && typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore
      }
      return;
    }

    if (isAsyncStorageAvailable && asyncStorageModule) {
      try {
        await asyncStorageModule.removeItem(key);
      } catch {
        // Ignore
      }
    }
  },
};
