import { Meal } from '../types';

export interface DailyStats {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealCount: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealCount: number;
  averageDaily: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealCount: number;
  averageDaily: number;
}

export interface SummaryStats {
  total: number;
  average: number;
  best: { date: string; value: number } | null;
  worst: { date: string; value: number } | null;
}

export const getDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
};

export const getMonthKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const groupMealsByDay = (meals: Meal[], days: number = 30): DailyStats[] => {
  const today = new Date();
  const dateMap = new Map<string, DailyStats>();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = getDateString(date);
    dateMap.set(dateStr, {
      date: dateStr,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealCount: 0,
    });
  }

  meals.forEach(meal => {
    if (dateMap.has(meal.date)) {
      const stats = dateMap.get(meal.date)!;
      stats.calories += meal.calories;
      stats.protein += meal.protein;
      stats.carbs += meal.carbs;
      stats.fats += meal.fats;
      stats.mealCount += 1;
    }
  });

  return Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
};

export const groupMealsByWeek = (meals: Meal[], weeks: number = 12): WeeklyStats[] => {
  const today = new Date();
  const weekMap = new Map<string, WeeklyStats>();

  for (let i = weeks - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - (i * 7));
    const weekStart = getWeekStart(date);
    const weekEnd = getWeekEnd(weekStart);
    const weekStartStr = getDateString(weekStart);
    const weekEndStr = getDateString(weekEnd);
    
    weekMap.set(weekStartStr, {
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealCount: 0,
      averageDaily: 0,
    });
  }

  meals.forEach(meal => {
    const mealDate = new Date(meal.date + 'T00:00:00');
    const weekStart = getWeekStart(mealDate);
    const weekStartStr = getDateString(weekStart);
    
    if (weekMap.has(weekStartStr)) {
      const stats = weekMap.get(weekStartStr)!;
      stats.calories += meal.calories;
      stats.protein += meal.protein;
      stats.carbs += meal.carbs;
      stats.fats += meal.fats;
      stats.mealCount += 1;
    }
  });

  const result = Array.from(weekMap.values()).sort((a, b) => 
    a.weekStart.localeCompare(b.weekStart)
  );

  result.forEach(week => {
    week.averageDaily = Math.round(week.calories / 7);
  });

  return result;
};

export const groupMealsByMonth = (meals: Meal[], months: number = 12): MonthlyStats[] => {
  const today = new Date();
  const monthMap = new Map<string, MonthlyStats>();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthKey = getMonthKey(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    monthMap.set(monthKey, {
      month: monthKey,
      year,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      mealCount: 0,
      averageDaily: 0,
    });
  }

  meals.forEach(meal => {
    const mealDate = new Date(meal.date + 'T00:00:00');
    const monthKey = getMonthKey(mealDate);
    
    if (monthMap.has(monthKey)) {
      const stats = monthMap.get(monthKey)!;
      stats.calories += meal.calories;
      stats.protein += meal.protein;
      stats.carbs += meal.carbs;
      stats.fats += meal.fats;
      stats.mealCount += 1;
    }
  });

  const result = Array.from(monthMap.values()).sort((a, b) => 
    a.month.localeCompare(b.month)
  );

  result.forEach(monthStats => {
    const [year, month] = monthStats.month.split('-').map(Number);
    const daysInMonth = getDaysInMonth(year, month);
    monthStats.averageDaily = Math.round(monthStats.calories / daysInMonth);
  });

  return result;
};

export const calculateSummaryStats = (
  data: Array<{ date?: string; calories: number; weekStart?: string; month?: string }>
): SummaryStats => {
  if (data.length === 0) {
    return {
      total: 0,
      average: 0,
      best: null,
      worst: null,
    };
  }

  const total = data.reduce((sum, item) => sum + item.calories, 0);
  const average = Math.round(total / data.length);

  const dataWithDates = data.filter(item => item.calories > 0);
  
  if (dataWithDates.length === 0) {
    return {
      total,
      average,
      best: null,
      worst: null,
    };
  }

  const best = dataWithDates.reduce((max, item) => 
    item.calories > max.calories ? item : max
  );

  const worst = dataWithDates.reduce((min, item) => 
    item.calories < min.calories ? item : min
  );

  const getDateLabel = (item: typeof dataWithDates[0]): string => {
    if (item.date) return item.date;
    if (item.weekStart) return item.weekStart;
    if (item.month) return item.month;
    return '';
  };

  return {
    total,
    average,
    best: { date: getDateLabel(best), value: best.calories },
    worst: { date: getDateLabel(worst), value: worst.calories },
  };
};
