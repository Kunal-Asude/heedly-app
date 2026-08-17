import { StyleSheet, View } from "react-native";

import { EnergyOrb, EnergyOrbState } from "@/components/core";

export const TODAY_ORB_SIZE = 280;

interface TodayOrbContainerProps {
  state: EnergyOrbState;
  size?: number;
}

export function TodayOrbContainer({
  state,
  size = TODAY_ORB_SIZE,
}: TodayOrbContainerProps) {
  return (
    <View style={[styles.orbSlot, { height: size }]}>
      <EnergyOrb size={size} state={state} />
    </View>
  );
}

const styles = StyleSheet.create({
  orbSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    marginBottom: 8,
  },
});
