import { Stack } from 'expo-router';

export default function CheckInLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="energy" />
      <Stack.Screen name="body" />
      <Stack.Screen name="noting" />
      <Stack.Screen name="saved" />
    </Stack>
  );
}
