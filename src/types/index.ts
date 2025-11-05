import { ThemeMode } from '../theme';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Gender = 'male' | 'female';

export type ActivityLevel = 
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extra_active';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: MealType;
  date: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: Gender;
  activityLevel?: ActivityLevel;
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
