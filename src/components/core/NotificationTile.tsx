import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";

import { EnergyOrb } from "./EnergyOrb";

export interface NotificationTileProps extends ViewProps {
  size?: number;
  orbSize?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Heedly Lock-Screen / Notification App Tile.
 *
 * Source of truth: Aubade - Dawn (light).html (.lock-app-icon + .orb).
 * - App tile: 40px × 40px, radius 11px, overflow clipped.
 * - Orb: 30px, animation disabled, cream/pearl treatment (state="empty", showHalo=false).
 */
export function NotificationTile({
  size = 40,
  orbSize = 30,
  style,
  ...rest
}: NotificationTileProps) {
  return (
    <LinearGradient
      colors={["#fbe6d2", "#f6d3ad"]}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.275), // 11px for 40px tile
        },
        style,
      ]}
      {...rest}
    >
      <View style={styles.orbWrapper}>
        <EnergyOrb
          size={orbSize}
          animated={false}
          showHalo={false}
          state="empty"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#785032",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  orbWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
