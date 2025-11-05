import {
  getDateString,
  getWeekStart,
  getWeekEnd,
  getMonthKey,
  getDaysInMonth,
  groupMealsByDay,
  groupMealsByWeek,
  groupMealsByMonth,
  calculateSummaryStats,
} from '../statistics';
import { Meal } from '../../types';

describe('Statistics Utilities', () => {
  describe('Date utilities', () => {
    it('should format date string correctly', () => {
      const date = new Date('2024-03-15T12:00:00');
      expect(getDateString(date)).toBe('2024-03-15');
    });

    it('should get week start (Sunday)', () => {
      const date = new Date('2024-03-15T12:00:00'); // Friday
      const weekStart = getWeekStart(date);
      expect(weekStart.getDay()).toBe(0); // Sunday
      expect(getDateString(weekStart)).toBe('2024-03-10');
    });

    it('should get week end (Saturday)', () => {
      const date = new Date('2024-03-15T12:00:00'); // Friday
      const weekEnd = getWeekEnd(date);
      expect(weekEnd.getDay()).toBe(6); // Saturday
      expect(getDateString(weekEnd)).toBe('2024-03-16');
    });

    it('should get month key', () => {
      const date = new Date('2024-03-15T12:00:00');
      expect(getMonthKey(date)).toBe('2024-03');
    });

    it('should get days in month', () => {
      expect(getDaysInMonth(2024, 2)).toBe(29); // Feb 2024 (leap year)
      expect(getDaysInMonth(2023, 2)).toBe(28); // Feb 2023
      expect(getDaysInMonth(2024, 1)).toBe(31); // Jan
      expect(getDaysInMonth(2024, 4)).toBe(30); // Apr
    });
  });

  describe('groupMealsByDay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should group meals by day', () => {
      const meals: Meal[] = [
        {
          id: '1',
          name: 'Breakfast',
          calories: 500,
          protein: 20,
          carbs: 50,
          fats: 15,
          mealType: 'breakfast',
          date: '2024-03-15',
          timestamp: Date.now(),
        },
        {
          id: '2',
          name: 'Lunch',
          calories: 700,
          protein: 30,
          carbs: 70,
          fats: 20,
          mealType: 'lunch',
          date: '2024-03-15',
          timestamp: Date.now(),
        },
        {
          id: '3',
          name: 'Dinner',
          calories: 600,
          protein: 25,
          carbs: 60,
          fats: 18,
          mealType: 'dinner',
          date: '2024-03-14',
          timestamp: Date.now(),
        },
      ];

      const result = groupMealsByDay(meals, 7);
      
      expect(result).toHaveLength(7);
      
      const today = result.find(d => d.date === '2024-03-15');
      expect(today).toBeDefined();
      expect(today!.calories).toBe(1200);
      expect(today!.protein).toBe(50);
      expect(today!.mealCount).toBe(2);
      
      const yesterday = result.find(d => d.date === '2024-03-14');
      expect(yesterday).toBeDefined();
      expect(yesterday!.calories).toBe(600);
      expect(yesterday!.mealCount).toBe(1);
    });

    it('should include days with no meals', () => {
      const meals: Meal[] = [
        {
          id: '1',
          name: 'Breakfast',
          calories: 500,
          protein: 20,
          carbs: 50,
          fats: 15,
          mealType: 'breakfast',
          date: '2024-03-15',
          timestamp: Date.now(),
        },
      ];

      const result = groupMealsByDay(meals, 7);
      
      expect(result).toHaveLength(7);
      
      const emptyDay = result.find(d => d.date === '2024-03-13');
      expect(emptyDay).toBeDefined();
      expect(emptyDay!.calories).toBe(0);
      expect(emptyDay!.mealCount).toBe(0);
    });

    it('should sort days chronologically', () => {
      const result = groupMealsByDay([], 7);
      
      for (let i = 1; i < result.length; i++) {
        expect(result[i].date > result[i - 1].date).toBe(true);
      }
    });
  });

  describe('groupMealsByWeek', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-15T12:00:00')); // Friday
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should group meals by week', () => {
      const meals: Meal[] = [
        {
          id: '1',
          name: 'Meal 1',
          calories: 500,
          protein: 20,
          carbs: 50,
          fats: 15,
          mealType: 'breakfast',
          date: '2024-03-15', // Friday, week starting 2024-03-10
          timestamp: Date.now(),
        },
        {
          id: '2',
          name: 'Meal 2',
          calories: 700,
          protein: 30,
          carbs: 70,
          fats: 20,
          mealType: 'lunch',
          date: '2024-03-11', // Monday, same week
          timestamp: Date.now(),
        },
        {
          id: '3',
          name: 'Meal 3',
          calories: 600,
          protein: 25,
          carbs: 60,
          fats: 18,
          mealType: 'dinner',
          date: '2024-03-08', // Friday, previous week
          timestamp: Date.now(),
        },
      ];

      const result = groupMealsByWeek(meals, 4);
      
      expect(result).toHaveLength(4);
      
      const currentWeek = result.find(w => w.weekStart === '2024-03-10');
      expect(currentWeek).toBeDefined();
      expect(currentWeek!.calories).toBe(1200);
      expect(currentWeek!.mealCount).toBe(2);
      expect(currentWeek!.averageDaily).toBe(Math.round(1200 / 7));
      
      const previousWeek = result.find(w => w.weekStart === '2024-03-03');
      expect(previousWeek).toBeDefined();
      expect(previousWeek!.calories).toBe(600);
      expect(previousWeek!.mealCount).toBe(1);
    });

    it('should calculate average daily calories', () => {
      const meals: Meal[] = [
        {
          id: '1',
          name: 'Meal',
          calories: 1400,
          protein: 50,
          carbs: 150,
          fats: 50,
          mealType: 'breakfast',
          date: '2024-03-15',
          timestamp: Date.now(),
        },
      ];

      const result = groupMealsByWeek(meals, 1);
      
      expect(result[0].averageDaily).toBe(Math.round(1400 / 7));
    });
  });

  describe('groupMealsByMonth', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-15T12:00:00'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should group meals by month', () => {
      const meals: Meal[] = [
        {
          id: '1',
          name: 'Meal 1',
          calories: 500,
          protein: 20,
          carbs: 50,
          fats: 15,
          mealType: 'breakfast',
          date: '2024-03-15',
          timestamp: Date.now(),
        },
        {
          id: '2',
          name: 'Meal 2',
          calories: 700,
          protein: 30,
          carbs: 70,
          fats: 20,
          mealType: 'lunch',
          date: '2024-03-10',
          timestamp: Date.now(),
        },
        {
          id: '3',
          name: 'Meal 3',
          calories: 600,
          protein: 25,
          carbs: 60,
          fats: 18,
          mealType: 'dinner',
          date: '2024-02-15',
          timestamp: Date.now(),
        },
      ];

      const result = groupMealsByMonth(meals, 3);
      
      expect(result).toHaveLength(3);
      
      const march = result.find(m => m.month === '2024-03');
      expect(march).toBeDefined();
      expect(march!.calories).toBe(1200);
      expect(march!.mealCount).toBe(2);
      expect(march!.averageDaily).toBe(Math.round(1200 / 31));
      
      const feb = result.find(m => m.month === '2024-02');
      expect(feb).toBeDefined();
      expect(feb!.calories).toBe(600);
      expect(feb!.mealCount).toBe(1);
      expect(feb!.averageDaily).toBe(Math.round(600 / 29)); // 2024 is leap year
    });

    it('should calculate average daily calories correctly', () => {
      const meals: Meal[] = [
        {
          id: '1',
          name: 'Meal',
          calories: 3100,
          protein: 100,
          carbs: 300,
          fats: 100,
          mealType: 'breakfast',
          date: '2024-03-15',
          timestamp: Date.now(),
        },
      ];

      const result = groupMealsByMonth(meals, 1);
      
      expect(result[0].averageDaily).toBe(Math.round(3100 / 31));
    });
  });

  describe('calculateSummaryStats', () => {
    it('should calculate summary stats for daily data', () => {
      const data = [
        { date: '2024-03-10', calories: 1500 },
        { date: '2024-03-11', calories: 2000 },
        { date: '2024-03-12', calories: 1800 },
        { date: '2024-03-13', calories: 2200 },
        { date: '2024-03-14', calories: 1700 },
      ];

      const result = calculateSummaryStats(data);
      
      expect(result.total).toBe(9200);
      expect(result.average).toBe(1840);
      expect(result.best).toEqual({ date: '2024-03-13', value: 2200 });
      expect(result.worst).toEqual({ date: '2024-03-10', value: 1500 });
    });

    it('should handle empty data', () => {
      const result = calculateSummaryStats([]);
      
      expect(result.total).toBe(0);
      expect(result.average).toBe(0);
      expect(result.best).toBeNull();
      expect(result.worst).toBeNull();
    });

    it('should handle data with all zeros', () => {
      const data = [
        { date: '2024-03-10', calories: 0 },
        { date: '2024-03-11', calories: 0 },
        { date: '2024-03-12', calories: 0 },
      ];

      const result = calculateSummaryStats(data);
      
      expect(result.total).toBe(0);
      expect(result.average).toBe(0);
      expect(result.best).toBeNull();
      expect(result.worst).toBeNull();
    });

    it('should ignore zero values when finding best/worst', () => {
      const data = [
        { date: '2024-03-10', calories: 0 },
        { date: '2024-03-11', calories: 2000 },
        { date: '2024-03-12', calories: 0 },
        { date: '2024-03-13', calories: 1500 },
        { date: '2024-03-14', calories: 0 },
      ];

      const result = calculateSummaryStats(data);
      
      expect(result.best).toEqual({ date: '2024-03-11', value: 2000 });
      expect(result.worst).toEqual({ date: '2024-03-13', value: 1500 });
    });

    it('should work with weekly data', () => {
      const data = [
        { weekStart: '2024-03-03', calories: 10000 },
        { weekStart: '2024-03-10', calories: 12000 },
      ];

      const result = calculateSummaryStats(data);
      
      expect(result.total).toBe(22000);
      expect(result.best).toEqual({ date: '2024-03-10', value: 12000 });
    });

    it('should work with monthly data', () => {
      const data = [
        { month: '2024-01', calories: 50000 },
        { month: '2024-02', calories: 45000 },
      ];

      const result = calculateSummaryStats(data);
      
      expect(result.total).toBe(95000);
      expect(result.best).toEqual({ date: '2024-01', value: 50000 });
    });
  });
});
