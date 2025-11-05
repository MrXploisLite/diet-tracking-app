import { Achievement, AchievementType, Meal, WaterIntake, WeightEntry } from '../types';

export const checkAchievements = (
  meals: Meal[],
  waterIntakes: WaterIntake[],
  weightEntries: WeightEntry[],
  currentStreak: number,
  targetWater: number,
  targetCalories: number,
  currentAchievements: Achievement[]
): Achievement[] => {
  const updatedAchievements = [...currentAchievements];
  const now = Date.now();

  // Helper to unlock achievement
  const unlock = (id: AchievementType) => {
    const achievement = updatedAchievements.find(a => a.id === id);
    if (achievement && !achievement.isUnlocked) {
      achievement.isUnlocked = true;
      achievement.unlockedAt = now;
    }
  };

  // First meal
  if (meals.length >= 1) {
    unlock('first_meal');
  }

  // Meal count achievements
  if (meals.length >= 10) unlock('meals_10');
  if (meals.length >= 50) unlock('meals_50');
  if (meals.length >= 100) unlock('meals_100');

  // Streak achievements
  if (currentStreak >= 3) unlock('streak_3');
  if (currentStreak >= 7) unlock('streak_7');
  if (currentStreak >= 30) unlock('streak_30');

  // Water goal achievement (check today's water)
  const today = new Date().toISOString().split('T')[0];
  const todayWater = waterIntakes
    .filter(w => w.date === today)
    .reduce((sum, w) => sum + w.amount, 0);
  if (todayWater >= targetWater) {
    unlock('water_goal');
  }

  // Calorie goal achievement (check today's calories)
  const todayCalories = meals
    .filter(m => m.date === today)
    .reduce((sum, m) => sum + m.calories, 0);
  if (targetCalories && Math.abs(todayCalories - targetCalories) <= 100) {
    unlock('calorie_goal');
  }

  // Weight logged
  if (weightEntries.length >= 1) {
    unlock('weight_logged');
  }

  return updatedAchievements;
};

export const getNewlyUnlockedAchievements = (
  oldAchievements: Achievement[],
  newAchievements: Achievement[]
): Achievement[] => {
  return newAchievements.filter(newAch => {
    const oldAch = oldAchievements.find(a => a.id === newAch.id);
    return newAch.isUnlocked && (!oldAch || !oldAch.isUnlocked);
  });
};
