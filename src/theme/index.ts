import { lightColors, darkColors, ThemeColors } from './colors';
import { typography, Typography } from './typography';
import { spacing, Spacing } from './spacing';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
}

export const createTheme = (mode: ThemeMode): Theme => ({
  mode,
  colors: mode === 'light' ? lightColors : darkColors,
  typography,
  spacing,
});

export * from './colors';
export * from './typography';
export * from './spacing';
