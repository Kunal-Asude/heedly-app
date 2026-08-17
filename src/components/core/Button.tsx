import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { BORDERS, CORAL, INK, RADII, SHADOWS, SURFACES } from '@/constants/theme';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

/**
 * Primary coral-gradient CTA or quiet secondary button.
 */
export function Button({
  variant = 'primary',
  children,
  style,
  textStyle,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        isPrimary ? styles.primaryBtn : styles.secondaryBtn,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      {...rest}>
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.baseText,
            isPrimary ? styles.primaryText : styles.secondaryText,
            textStyle,
          ]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.cta,
    paddingHorizontal: 28,
  },

  primaryBtn: {
    height: 56,
    backgroundColor: CORAL.primary,
    ...SHADOWS.cta,
  },

  secondaryBtn: {
    height: 48,
    backgroundColor: SURFACES.card,
    borderWidth: 1.5,
    borderColor: BORDERS.card,
    ...SHADOWS.chip,
  },

  pressed: {
    transform: [{ scale: 0.975 }],
    opacity: 0.9,
  },

  baseText: {
    fontFamily: 'AvenirNext-DemiBold',
    letterSpacing: -0.15,
  },

  primaryText: {
    fontSize: 17,
    color: '#FFFFFF',
  },

  secondaryText: {
    fontSize: 15,
    color: INK.subtle,
  },
});
