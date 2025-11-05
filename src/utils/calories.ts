import { Meal, UserProfile } from '../types';
import { isToday } from './date';

export const DEFAULT_CALORIE_GOAL = 2000;

export const getCalorieGoal = (profile: UserProfile): number => {
  return profile.targetCalories ?? DEFAULT_CALORIE_GOAL;
};

export const getTodaysMeals = (meals: Meal[]): Meal[] => {
  return meals.filter(meal => isToday(meal.date));
};

export const calculateConsumedCalories = (meals: Meal[]): number => {
  return meals.reduce((sum, meal) => sum + meal.calories, 0);
};

export const calculateRemainingCalories = (goal: number, consumed: number): number => {
  return Math.max(0, goal - consumed);
};

export const calculateCalorieProgress = (goal: number, consumed: number): number => {
  if (goal === 0) return 0;
  return Math.min(100, (consumed / goal) * 100);
};

export const getTodaysCalorieData = (profile: UserProfile, meals: Meal[]) => {
  const goal = getCalorieGoal(profile);
  const todaysMeals = getTodaysMeals(meals);
  const consumed = calculateConsumedCalories(todaysMeals);
  const remaining = calculateRemainingCalories(goal, consumed);
  const progress = calculateCalorieProgress(goal, consumed);

  return {
    goal,
    consumed,
    remaining,
    progress,
    mealsCount: todaysMeals.length,
  };
};
