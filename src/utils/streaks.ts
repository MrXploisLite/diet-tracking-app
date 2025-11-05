import { Meal } from '../types';

export const calculateStreak = (meals: Meal[]): { currentStreak: number; longestStreak: number } => {
  if (meals.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get unique dates from meals, sorted descending
  const uniqueDates = Array.from(new Set(meals.map(m => m.date))).sort().reverse();
  
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check if streak is still active (logged today or yesterday)
  const isStreakActive = uniqueDates[0] === todayStr || uniqueDates[0] === yesterdayStr;

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  if (isStreakActive) {
    // Calculate current streak
    let expectedDate = new Date(uniqueDates[0]);
    expectedDate.setHours(0, 0, 0, 0);

    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);
      currentDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 0; i < uniqueDates.length; i++) {
    tempStreak = 1;
    
    for (let j = i + 1; j < uniqueDates.length; j++) {
      const currentDate = new Date(uniqueDates[j]);
      const prevDate = new Date(uniqueDates[j - 1]);
      
      const diffTime = prevDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        break;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return { currentStreak, longestStreak };
};

export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return 'Start your streak today!';
  if (streak === 1) return 'Great start! Keep it going!';
  if (streak < 7) return `${streak} days strong! 🔥`;
  if (streak < 30) return `Amazing ${streak} day streak! ⚡`;
  return `Incredible ${streak} day streak! 👑`;
};
