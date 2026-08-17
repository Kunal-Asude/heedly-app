import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';

import { BORDERS, RADII, SHADOWS, SURFACES } from '@/constants/theme';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

/**
 * Warm cream reading card — near-opaque, warm border + rose shadow.
 * Never frosted glass.
 */
export function Card({ children, style, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SURFACES.card,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: BORDERS.card,
    paddingVertical: 18,
    paddingHorizontal: 20,
    ...SHADOWS.chip,
  },
});
