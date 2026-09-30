import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { useSocket } from '../hooks/useSocket';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  useSocket();

  useEffect(() => {
    checkAuth().finally(() => {
      setAppIsReady(true);
      SplashScreen.hideAsync(); // Dismiss native splash once auth finishes
    });
  }, [checkAuth]);

  useEffect(() => {
    if (!appIsReady) return;

    // Check if the route is inside the (auth) group
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // If not authenticated and trying to access secure pages, boot to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // If securely authenticated but stranded on auth stack, bypass to core tabs
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, appIsReady, segments]);

  if (!appIsReady) {
    return null; // Will show SplashScreen natively
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

const BrutalistLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E3A5F',
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#0F172A',
    notification: '#A16207',
  },
};

const BrutalistDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#A16207',
    background: '#050B14',
    card: '#0F172A',
    text: '#F8FAFC',
    border: '#CBD5E1',
    notification: '#1E3A5F',
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? BrutalistDarkTheme : BrutalistLightTheme}>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
