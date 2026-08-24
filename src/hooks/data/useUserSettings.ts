import { useState } from "react";
import { MOCK_USER_CONTEXT_DATA } from "@/data/mock";
import type { UserContextData, UserSettings } from "@/types/user";

export function useUserSettings() {
  const [contextData, setContextData] = useState<UserContextData>(MOCK_USER_CONTEXT_DATA);

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
  };
}
