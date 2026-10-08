import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/constants/themes';
import { useThemeMode } from '@/contexts/ThemeContext';
import {
  fromTwelveHour,
  parseReminderTime,
  toReminderTime,
  toTwelveHour,
} from '@/utils/reminderTime';

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 5;

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const PERIODS: ('AM' | 'PM')[] = ['AM', 'PM'];

type SheetPalette = {
  scrim: string;
  sheet: string;
  sheetBorder: string;
  grip: string;
  heading: string;
  option: string;
  optionMuted: string;
  highlight: string;
  skip: string;
};

const LIGHT: SheetPalette = {
  scrim: 'rgba(74,58,57,0.34)',
  sheet: '#fbf3ec',
  sheetBorder: 'transparent',
  grip: 'rgba(120,90,90,0.2)',
  heading: '#463332',
  option: '#463332',
  optionMuted: 'rgba(74,58,57,0.42)',
  highlight: 'rgba(120,90,90,0.08)',
  skip: 'rgba(74,58,57,0.5)',
};

const DUSK: SheetPalette = {
  scrim: 'rgba(18,10,20,0.55)',
  sheet: 'rgba(51,37,56,0.96)',
  sheetBorder: 'transparent',
  grip: 'rgba(199,180,191,0.28)',
  heading: '#F3E7E1',
  option: '#F3E7E1',
  optionMuted: 'rgba(199,180,191,0.5)',
  highlight: 'rgba(255,255,255,0.07)',
  skip: 'rgba(199,180,191,0.68)',
};

const OLED: SheetPalette = {
  scrim: 'rgba(0,0,0,0.66)',
  sheet: '#16111B',
  sheetBorder: 'rgba(255,255,255,0.07)',
  grip: 'rgba(255,255,255,0.07)',
  heading: '#E9DDD6',
  option: '#E9DDD6',
  optionMuted: '#9A8A91',
  highlight: 'rgba(255,255,255,0.07)',
  skip: '#9A8A91',
};

type ColumnProps<T> = {
  values: T[];
  selected: T;
  onSelect: (value: T) => void;
  label: (value: T) => string;
  palette: SheetPalette;
  accessibilityLabel: string;
};

function Column<T>({
  values,
  selected,
  onSelect,
  label,
  palette,
  accessibilityLabel,
}: ColumnProps<T>) {
  const ref = useRef<ScrollView>(null);

  useEffect(() => {
    const index = values.indexOf(selected);
    if (index < 0) return;
    const timer = setTimeout(
      () => ref.current?.scrollTo({ y: index * ROW_HEIGHT, animated: false }),
      0,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectAtOffset = (y: number) => {
    const index = Math.min(values.length - 1, Math.max(0, Math.round(y / ROW_HEIGHT)));
    const value = values[index];
    if (value !== selected) onSelect(value);
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.column}
      contentContainerStyle={styles.columnContent}
      showsVerticalScrollIndicator={false}
      snapToInterval={ROW_HEIGHT}
      decelerationRate="fast"
      disableIntervalMomentum
      onMomentumScrollEnd={(event) => selectAtOffset(event.nativeEvent.contentOffset.y)}
      onScrollEndDrag={(event) => selectAtOffset(event.nativeEvent.contentOffset.y)}
      accessibilityLabel={accessibilityLabel}>
      {values.map((value, index) => {
        const isSelected = value === selected;
        return (
          <Pressable
            key={String(value)}
            style={styles.option}
            onPress={() => {
              ref.current?.scrollTo({ y: index * ROW_HEIGHT, animated: true });
              onSelect(value);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={label(value)}>
            <Text
              style={[
                styles.optionText,
                { color: isSelected ? palette.option : palette.optionMuted },
                isSelected && styles.optionTextSelected,
              ]}>
              {label(value)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function TimePickerSheet({
  value,
  onCancel,
  onConfirm,
}: {
  value: string;
  onCancel: () => void;
  onConfirm: (time: string) => void;
}) {
  const theme = useTheme();
  const { isDark, isTrueBlack } = useThemeMode();
  const ctaTokens = theme.components.cta;
  const palette = isTrueBlack ? OLED : isDark ? DUSK : LIGHT;

  const initial = toTwelveHour(parseReminderTime(value));
  const [twelve, setTwelve] = useState(initial.twelve);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState(initial.period);

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable
          style={[styles.scrim, { backgroundColor: palette.scrim }]}
          onPress={onCancel}
          accessibilityLabel="Close"
        />

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: palette.sheet,
              borderTopColor: palette.sheetBorder,
              borderTopWidth: isTrueBlack ? 1 : 0,
              shadowOpacity: isTrueBlack ? 0 : isDark ? 0.4 : 0.22,
            },
          ]}>
          <View style={[styles.grip, { backgroundColor: palette.grip }]} />

          <Text style={[styles.heading, { color: palette.heading }]}>Reminder time</Text>

          <View style={styles.columns}>
            <View
              style={[styles.highlight, { backgroundColor: palette.highlight }]}
              pointerEvents="none"
            />
            <Column
              values={HOURS}
              selected={twelve}
              onSelect={setTwelve}
              label={(h) => String(h)}
              palette={palette}
              accessibilityLabel="Hour"
            />
            <Column
              values={MINUTES}
              selected={minute}
              onSelect={setMinute}
              label={(m) => String(m).padStart(2, '0')}
              palette={palette}
              accessibilityLabel="Minute"
            />
            <Column
              values={PERIODS}
              selected={period}
              onSelect={setPeriod}
              label={(p) => p}
              palette={palette}
              accessibilityLabel="AM or PM"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.cta,
              { shadowColor: ctaTokens.shadowColor, shadowOpacity: ctaTokens.shadowOpacity },
              pressed && styles.ctaPressed,
            ]}
            onPress={() => onConfirm(toReminderTime(fromTwelveHour(twelve, minute, period)))}
            accessibilityRole="button"
            accessibilityLabel="Done">
            <LinearGradient
              colors={ctaTokens.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.ctaGradient, { borderColor: ctaTokens.borderColor }]}>
              <Text style={[styles.ctaText, { color: ctaTokens.textColor }]}>Done</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.skip}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel">
            <Text style={[styles.skipText, { color: palette.skip }]}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 14,
    paddingHorizontal: 24,
    paddingBottom: 30,
    shadowColor: '#785A5A',
    shadowOffset: { width: 0, height: -12 },
    shadowRadius: 34,
  },

  grip: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 18,
  },

  heading: {
    fontFamily: Fonts.display.regular,
    fontSize: 25,
    letterSpacing: -0.25,
  },

  columns: {
    flexDirection: 'row',
    height: ROW_HEIGHT * VISIBLE_ROWS,
    marginTop: 18,
  },

  highlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: ROW_HEIGHT * 2,
    height: ROW_HEIGHT,
    borderRadius: 12,
  },

  column: {
    flex: 1,
  },

  columnContent: {
    paddingVertical: ROW_HEIGHT * 2,
  },

  option: {
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionText: {
    fontSize: 21,
    fontWeight: '500',
  },

  optionTextSelected: {
    fontWeight: '700',
  },

  cta: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    marginTop: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 5,
  },

  ctaGradient: {
    flex: 1,
    borderRadius: 29,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ctaPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.94,
  },

  ctaText: {
    fontSize: 16.5,
    fontWeight: '600',
    letterSpacing: -0.17,
  },

  skip: {
    marginTop: 14,
    alignSelf: 'center',
    paddingVertical: 4,
  },

  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
