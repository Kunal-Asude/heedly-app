import { StyleSheet, View } from "react-native";

import { EnergyOrb, EnergyOrbState } from "@/components/core";

export const TODAY_ORB_SIZE = 254;

interface TodayOrbContainerProps {
  state: EnergyOrbState;
  size?: number;
}

export function TodayOrbContainer({
  state,
  size = TODAY_ORB_SIZE,
}: TodayOrbContainerProps) {
  return (
    <View style={styles.orbSlot}>
      <EnergyOrb size={size} state={state} />
    </View>
  );
}

const styles = StyleSheet.create({
  orbSlot: {
    width: "100%",
    height: TODAY_ORB_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
