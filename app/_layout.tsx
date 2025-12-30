import '../global.css';

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { use, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import useAuthStore from '@/lib/store/auth.store';

export default function Layout() {
  const [fontLoaded, error] = useFonts({
    'QuickSand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    'QuickSand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'QuickSand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
    'QuickSand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'QuickSand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
  });

  const { isloading, fetchAuthenticatedUser } = useAuthStore();

  useEffect(() => {
    if (error) throw error;
    if (fontLoaded) SplashScreen.hideAsync();
  }, [fontLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
