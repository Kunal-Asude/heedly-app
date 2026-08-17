import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle } from 'react-native';

import { INK, STATES } from '@/constants/theme';

export type EnergyState = 'steady' | 'caution' | 'rest';

export interface StateBadgeProps extends ViewProps {
  state?: EnergyState;
  labelOverride?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

/**
 * State dot + word — the only allowed state presentation (word + color together).
 */
export function StateBadge({
  state = 'steady',
  labelOverride,
  style,
  textStyle,
  ...rest
}: StateBadgeProps) {
  const config = STATES[state] || STATES.steady;
  const label = labelOverride ?? config.label;

  return (
    <View style={[styles.container, style]} {...rest}>
      <View
        style={[
          styles.dotOuterRing,
          { backgroundColor: config.ring },
        ]}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
      </View>
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  dotOuterRing: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },

  label: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 13.5,
    color: INK.subtle,
    letterSpacing: -0.15,
  },
});
