import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  background: '#F5DDD5',
  headingDark: '#2C1810',
  mutedText: '#a38778',
};

export default function NotesScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Notes</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 28,
    color: COLORS.headingDark,
  },
  subtitle: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 15,
    color: COLORS.mutedText,
  },
});
