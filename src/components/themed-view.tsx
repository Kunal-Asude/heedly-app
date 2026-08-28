import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useLegacyTheme } from '@/hooks/use-legacy-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useLegacyTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}
