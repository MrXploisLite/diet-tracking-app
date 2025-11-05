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
  photoUri?: string;
  isFavorite?: boolean;
}

export interface WaterIntake {
  id: string;
  amount: number; // in ml
  date: string;
  timestamp: number;
}

export interface WeightEntry {
  id: string;
  weight: number; // in kg
  date: string;
  timestamp: number;
}

export type AchievementType = 
  | 'first_meal'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'meals_10'
  | 'meals_50'
  | 'meals_100'
  | 'water_goal'
  | 'calorie_goal'
  | 'weight_logged';

export interface Achievement {
  id: AchievementType;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  isUnlocked: boolean;
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
  targetWater?: number; // daily water goal in ml
  currentStreak?: number;
  longestStreak?: number;
  lastLoggedDate?: string;
}

export interface AppState {
  profile: UserProfile;
  meals: Meal[];
  waterIntakes: WaterIntake[];
  weightEntries: WeightEntry[];
  achievements: Achievement[];
  theme: ThemeMode;
}

export const defaultProfile: UserProfile = {
  name: 'User',
  targetWater: 2000, // 2L default
  currentStreak: 0,
  longestStreak: 0,
};

export const defaultAchievements: Achievement[] = [
  { id: 'first_meal', title: 'First Step', description: 'Log your first meal', icon: '🎯', isUnlocked: false },
  { id: 'streak_3', title: '3 Day Streak', description: 'Log meals for 3 days in a row', icon: '🔥', isUnlocked: false },
  { id: 'streak_7', title: 'Week Warrior', description: 'Log meals for 7 days in a row', icon: '⚡', isUnlocked: false },
  { id: 'streak_30', title: 'Monthly Master', description: 'Log meals for 30 days in a row', icon: '👑', isUnlocked: false },
  { id: 'meals_10', title: 'Getting Started', description: 'Log 10 meals', icon: '🍽️', isUnlocked: false },
  { id: 'meals_50', title: 'Dedicated Tracker', description: 'Log 50 meals', icon: '📊', isUnlocked: false },
  { id: 'meals_100', title: 'Century Club', description: 'Log 100 meals', icon: '💯', isUnlocked: false },
  { id: 'water_goal', title: 'Hydration Hero', description: 'Reach your water goal', icon: '💧', isUnlocked: false },
  { id: 'calorie_goal', title: 'On Target', description: 'Hit your calorie goal', icon: '🎯', isUnlocked: false },
  { id: 'weight_logged', title: 'Weight Watcher', description: 'Log your first weight', icon: '⚖️', isUnlocked: false },
];

export const defaultAppState: AppState = {
  profile: defaultProfile,
  meals: [],
  waterIntakes: [],
  weightEntries: [],
  achievements: defaultAchievements,
  theme: 'light',
};
