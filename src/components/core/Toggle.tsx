import React from 'react';
import { Pressable, PressableProps, StyleSheet, View, ViewStyle } from 'react-native';

import { CORAL } from '@/constants/theme';

export interface ToggleProps extends Omit<PressableProps, 'style' | 'onChange'> {
  on?: boolean;
  onChange?: (val: boolean) => void;
  style?: ViewStyle | ViewStyle[];
}

/**
 * 46×28 settings toggle — coral when on, warm gray when off.
 */
export function Toggle({ on = false, onChange, style, ...rest }: ToggleProps) {
  return (
    <Pressable
      onPress={() => onChange && onChange(!on)}
      style={[
        styles.track,
        on ? styles.trackOn : styles.trackOff,
        style,
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      {...rest}>
      <View
        style={[
          styles.thumb,
          on ? styles.thumbOn : styles.thumbOff,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },

  trackOff: {
    backgroundColor: 'rgba(120, 90, 90, 0.2)',
  },

  trackOn: {
    backgroundColor: CORAL.primary,
  },

  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 2,
  },

  thumbOff: {
    alignSelf: 'flex-start',
  },

  thumbOn: {
    alignSelf: 'flex-end',
  },
});
