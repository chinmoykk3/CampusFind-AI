/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A', // Navy foreground
    background: '#F8FAFC', // Slate 50
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#1E3A5F', // Institutional Navy
    textSecondary: '#A16207', // Amber Accent
  },
  dark: {
    text: '#F8FAFC',
    background: '#050B14', // Deepest Navy
    backgroundElement: '#0F172A',
    backgroundSelected: '#A16207',
    textSecondary: '#CBD5E1',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'ui-serif', // Force serif for standard text in Brutalism
    serif: 'ui-serif',
    rounded: 'ui-serif',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'serif',
    serif: 'serif',
    rounded: 'serif',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-sans)',
    serif: 'var(--font-display)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
