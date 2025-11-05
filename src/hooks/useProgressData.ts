import { useMemo } from 'react';
import { Meal } from '../types';
import {
  groupMealsByDay,
  groupMealsByWeek,
  groupMealsByMonth,
  calculateSummaryStats,
  DailyStats,
  WeeklyStats,
  MonthlyStats,
  SummaryStats,
} from '../utils/statistics';

export type TimeRange = 'daily' | 'weekly' | 'monthly';

export interface ProgressData {
  daily: DailyStats[];
  weekly: WeeklyStats[];
  monthly: MonthlyStats[];
  summary: SummaryStats;
}

export const useProgressData = (meals: Meal[], timeRange: TimeRange): ProgressData => {
  const dailyData = useMemo(() => {
    return groupMealsByDay(meals, timeRange === 'daily' ? 30 : 90);
  }, [meals, timeRange]);

  const weeklyData = useMemo(() => {
    return groupMealsByWeek(meals, 12);
  }, [meals]);

  const monthlyData = useMemo(() => {
    return groupMealsByMonth(meals, 12);
  }, [meals]);

  const summary = useMemo(() => {
    switch (timeRange) {
      case 'daily':
        return calculateSummaryStats(dailyData.slice(-30));
      case 'weekly':
        return calculateSummaryStats(weeklyData);
      case 'monthly':
        return calculateSummaryStats(monthlyData);
      default:
        return calculateSummaryStats(dailyData.slice(-30));
    }
  }, [timeRange, dailyData, weeklyData, monthlyData]);

  return {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
    summary,
  };
};
