import { useCallback, useState } from "react";

import HeedlyNative from "@heedly/native";
import type { ConnectionState } from "@heedly/native";

import { MOCK_USER_CONTEXT_DATA } from "@/data/mock";
import type { UserContextData, UserSettings } from "@/types/user";

/** `conditions` and `wearables` stay mock — picker vocabularies, not claims
 *  about this person. The wearable card reads the bridge and never falls back
 *  to the mock.
 *
 *  `refresh` is driven by the screen's `useFocusEffect`, as `useForecast` is:
 *  connecting Apple Health writes rows this hook has already read past. */
export function useUserSettings() {
  const [contextData, setContextData] = useState<UserContextData>(MOCK_USER_CONTEXT_DATA);
  const [connection, setConnection] = useState<ConnectionState | null>(null);
  const [isConnectionLoaded, setIsConnectionLoaded] = useState(false);

  const refreshConnection = useCallback(async () => {
    try {
      setConnection(await HeedlyNative.getConnectionState());
    } catch {
      setConnection(null);
    } finally {
      setIsConnectionLoaded(true);
    }
  }, []);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setContextData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    }));
  };

  return {
    conditions: contextData.conditions,
    wearables: contextData.wearables,
    settings: contextData.settings,
    updateSetting,
    connection,
    isConnectionLoaded,
    refreshConnection,
  };
}
