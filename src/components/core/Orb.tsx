import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

export interface OrbProps extends ViewProps {
  /**
   * 'logo' = full luminous logo orb for Onboarding & Paywall screens (heedly-orb.png)
   * 'today' = tank gauge orb for Today screen (today-orb.png)
   */
  variant?: 'logo' | 'today';
  size?: number;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Shared signature glass orb component matching design system spec (orb.jsx).
 */
export function Orb({ variant = 'logo', size = 250, style, ...rest }: OrbProps) {
  const source =
    variant === 'today'
      ? require('@/assets/images/today-orb.png')
      : require('@/assets/images/heedly-orb.png');

  return (
    <View style={[styles.container, { width: size, height: size }, style]} {...rest}>
      <Image source={source} style={styles.image} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
