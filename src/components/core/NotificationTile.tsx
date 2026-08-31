import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, ViewProps, ViewStyle } from "react-native";

import { useThemeMode } from "@/contexts/ThemeContext";

import { EnergyOrb } from "./EnergyOrb";

export interface NotificationTileProps extends ViewProps {
  size?: number;
  orbSize?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Heedly Lock-Screen / Notification App Tile.
 *
 * Source of truth:
 *   Aubade - Dawn (light).html / Aubade - Dusk (dark).html / Aubade - True Black (OLED).html
 *   (.lock-app-icon + .orb)
 *
 * Dawn: 40×40px rounded tile, warm peach-to-apricot gradient, soft shadow,
 *   white translucent border.
 * Dusk: 40×40px rounded tile, deep plum translucent gradient matching the orb
 *   headspace (rgba(38,26,42) → rgba(52,38,58)), luminous rimmed border.
 * True Black (OLED): 40×40px rounded tile, flat #16111B surface, 1px
 *   rgba(255,255,255,0.07) hairline, zero shadow.
 */
export function NotificationTile({
  size = 40,
  orbSize = 30,
  style,
  ...rest
}: NotificationTileProps) {
  const { isDark, isTrueBlack } = useThemeMode();
  const borderRadius = Math.round(size * 0.275); // 11px for 40px tile

  if (isDark && isTrueBlack) {
    // True Black (OLED): flat #16111B tile, subtle hairline border, zero shadow
    return (
      <View
        style={[
          styles.tile,
          styles.tileOled,
          { width: size, height: size, borderRadius },
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
      </View>
    );
  }

  if (isDark) {
    // Dusk: deep plum tile matching orb headspace, luminous frosted rim
    return (
      <LinearGradient
        colors={["rgba(44,32,52,0.96)", "rgba(36,24,44,0.98)"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[
          styles.tile,
          styles.tileDusk,
          { width: size, height: size, borderRadius },
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

  // Dawn: warm peach-to-apricot gradient tile
  return (
    <LinearGradient
      colors={["#fbe6d2", "#f6d3ad"]}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      style={[
        styles.tile,
        styles.tileDawn,
        { width: size, height: size, borderRadius },
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
  },

  // Dawn: warm peach shadow, translucent white rim
  tileDawn: {
    shadowColor: "#785032",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },

  // Dusk: darker shadow, luminous frosted plum rim
  tileDusk: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(233, 214, 226, 0.28)",
  },

  // True Black / OLED: flat #16111B, 1px subtle hairline, no shadow
  tileOled: {
    backgroundColor: "#16111B",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
  },

  orbWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});


