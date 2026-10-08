import { SymbolView as ExpoSymbolView, type SymbolViewProps } from 'expo-symbols';

/**
 * SF Symbols exist only on iOS. On Android and web, expo-symbols draws Material
 * Symbols, and renders nothing at all when a name has no `android`/`web` entry.
 * Screens keep passing SF names; this fills in the Material equivalent.
 *
 * Adding a new SF name? Add its Material name here (https://fonts.google.com/icons),
 * or the icon will be blank on Android.
 */
const MATERIAL: Record<string, string> = {
  'antenna.radiowaves.left.and.right.slash': 'signal_wifi_off',
  'applewatch': 'watch',
  'arrow.down.right': 'south_east',
  'arrow.up.right.square': 'open_in_new',
  'bolt.fill': 'bolt',
  'bolt.slash': 'flash_off',
  'brain': 'psychology',
  'calendar': 'calendar_today',
  'checkmark.circle': 'check_circle',
  'checkmark': 'check',
  'chevron.left': 'chevron_left',
  'chevron.right': 'chevron_right',
  'circle.circle': 'radio_button_checked',
  'clock.fill': 'schedule',
  'clock': 'schedule',
  'doc.text': 'description',
  'ellipsis.rectangle': 'more_horiz',
  'figure.walk': 'directions_walk',
  'gearshape': 'settings',
  'heart': 'favorite',
  'hourglass': 'hourglass_empty',
  'house': 'home',
  'iphone': 'smartphone',
  'link': 'link',
  'list.clipboard': 'assignment',
  'lock': 'lock',
  'magnifyingglass': 'search',
  'moon.fill': 'bedtime',
  'moon': 'bedtime',
  'person.2.fill': 'group',
  'person.2': 'group',
  'plus': 'add',
  'slider.horizontal.3': 'tune',
  'square.and.arrow.up': 'ios_share',
  'square.stack.3d.up': 'stacks',
  'sun.max.fill': 'light_mode',
  'sun.max': 'light_mode',
  'tag': 'sell',
  'waveform.path.ecg': 'monitor_heart',
  'waveform.path': 'graphic_eq',
  'waveform': 'graphic_eq',
};

export function SymbolView({ name, ...props }: SymbolViewProps) {
  if (typeof name === 'string') {
    const material = MATERIAL[name] as never;
    name = { ios: name, android: material, web: material };
  }
  return <ExpoSymbolView name={name} {...props} />;
}
