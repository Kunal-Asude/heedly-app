import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { appStorage } from '@/utils/storage';
import { ONBOARDING_COMPLETE_KEY } from '@/utils/storageKeys';

/** Returning people go straight to the app; everyone else onboards. */
export default function Index() {
  const [route, setRoute] = useState<'/(tabs)' | '/(onboarding)' | null>(null);

  useEffect(() => {
    appStorage
      .getItem(ONBOARDING_COMPLETE_KEY)
      .then((done) => setRoute(done === 'true' ? '/(tabs)' : '/(onboarding)'))
      .catch(() => setRoute('/(onboarding)'));
  }, []);

  if (route === null) return null;

  return <Redirect href={route} />;
}
