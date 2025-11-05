import { ThemeMode } from '../theme';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFats?: number;
}

export interface AppState {
  profile: UserProfile;
  meals: Meal[];
  theme: ThemeMode;
}

export const defaultProfile: UserProfile = {
  name: 'User',
};

export const defaultAppState: AppState = {
  profile: defaultProfile,
  meals: [],
  theme: 'light',
};
