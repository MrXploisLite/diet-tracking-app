import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, defaultAppState, Meal, UserProfile } from '../types';
import { ThemeMode } from '../theme';

const STORAGE_KEYS = {
  APP_STATE: '@app_state',
  PROFILE: '@profile',
  MEALS: '@meals',
  THEME: '@theme',
} as const;

export class StorageService {
  static async getAppState(): Promise<AppState> {
    try {
      const stateJson = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
      if (stateJson) {
        return JSON.parse(stateJson);
      }
      await this.setAppState(defaultAppState);
      return defaultAppState;
    } catch (error) {
      console.error('Error reading app state:', error);
      return defaultAppState;
    }
  }

  static async setAppState(state: AppState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  }

  static async getProfile(): Promise<UserProfile> {
    try {
      const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (profileJson) {
        return JSON.parse(profileJson);
      }
      return defaultAppState.profile;
    } catch (error) {
      console.error('Error reading profile:', error);
      return defaultAppState.profile;
    }
  }

  static async setProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  static async getMeals(): Promise<Meal[]> {
    try {
      const mealsJson = await AsyncStorage.getItem(STORAGE_KEYS.MEALS);
      if (mealsJson) {
        return JSON.parse(mealsJson);
      }
      return [];
    } catch (error) {
      console.error('Error reading meals:', error);
      return [];
    }
  }

  static async setMeals(meals: Meal[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
    } catch (error) {
      console.error('Error saving meals:', error);
    }
  }

  static async getTheme(): Promise<ThemeMode> {
    try {
      const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (theme === 'light' || theme === 'dark') {
        return theme;
      }
      return 'light';
    } catch (error) {
      console.error('Error reading theme:', error);
      return 'light';
    }
  }

  static async setTheme(theme: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}
