import { Gender, ActivityLevel } from '../types';

export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export const activityLevelLabels: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  lightly_active: 'Lightly Active (1-3 days/week)',
  moderately_active: 'Moderately Active (3-5 days/week)',
  very_active: 'Very Active (6-7 days/week)',
  extra_active: 'Extra Active (intense exercise daily)',
};

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateDailyCalories(
  bmr: number,
  activityLevel: ActivityLevel
): number {
  return Math.round(bmr * activityMultipliers[activityLevel]);
}

export function calculateDailyGoal(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activityLevel: ActivityLevel
): number {
  const bmr = calculateBMR(weight, height, age, gender);
  return calculateDailyCalories(bmr, activityLevel);
}
