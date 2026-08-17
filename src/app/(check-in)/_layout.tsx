import { Stack } from 'expo-router';
import React from 'react';

export default function CheckInLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="yesterday" />
      <Stack.Screen name="energy" />
      <Stack.Screen name="body" />
      <Stack.Screen name="noting" />
      <Stack.Screen name="period" />
      <Stack.Screen name="saved" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="plan-result" />
    </Stack>
  );
}
