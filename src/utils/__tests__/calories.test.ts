import {
  DEFAULT_CALORIE_GOAL,
  getCalorieGoal,
  calculateConsumedCalories,
  calculateRemainingCalories,
  calculateCalorieProgress,
  getTodaysCalorieData,
} from '../calories';
import { UserProfile, Meal } from '../../types';

describe('Calorie Utilities', () => {
  describe('getCalorieGoal', () => {
    it('should return targetCalories from profile when set', () => {
      const profile: UserProfile = {
        name: 'Test User',
        targetCalories: 2500,
      };
      expect(getCalorieGoal(profile)).toBe(2500);
    });

    it('should return default calorie goal when targetCalories is not set', () => {
      const profile: UserProfile = {
        name: 'Test User',
      };
      expect(getCalorieGoal(profile)).toBe(DEFAULT_CALORIE_GOAL);
    });
  });

  describe('calculateConsumedCalories', () => {
    it('should return 0 for empty meals array', () => {
      expect(calculateConsumedCalories([])).toBe(0);
    });

    it('should sum up calories from all meals', () => {
      const meals: Meal[] = [
        {
          id: '1',
          name: 'Breakfast',
          calories: 350,
          protein: 15,
          carbs: 40,
          fats: 10,
          mealType: 'breakfast',
          date: '2024-01-01',
          timestamp: Date.now(),
        },
        {
          id: '2',
          name: 'Lunch',
          calories: 650,
          protein: 30,
          carbs: 60,
          fats: 20,
          mealType: 'lunch',
          date: '2024-01-01',
          timestamp: Date.now(),
        },
      ];
      expect(calculateConsumedCalories(meals)).toBe(1000);
    });
  });

  describe('calculateRemainingCalories', () => {
    it('should return remaining calories when under goal', () => {
      expect(calculateRemainingCalories(2000, 1500)).toBe(500);
    });

    it('should return 0 when at goal', () => {
      expect(calculateRemainingCalories(2000, 2000)).toBe(0);
    });

    it('should return 0 when over goal', () => {
      expect(calculateRemainingCalories(2000, 2500)).toBe(0);
    });
  });

  describe('calculateCalorieProgress', () => {
    it('should return 0 when goal is 0', () => {
      expect(calculateCalorieProgress(0, 500)).toBe(0);
    });

    it('should calculate progress percentage correctly', () => {
      expect(calculateCalorieProgress(2000, 1000)).toBe(50);
    });

    it('should return 100 when at goal', () => {
      expect(calculateCalorieProgress(2000, 2000)).toBe(100);
    });

    it('should cap at 100 when over goal', () => {
      expect(calculateCalorieProgress(2000, 2500)).toBe(100);
    });

    it('should handle fractional percentages', () => {
      expect(calculateCalorieProgress(2000, 1500)).toBe(75);
    });
  });

  describe('getTodaysCalorieData', () => {
    const mockDate = '2024-01-15';
    
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(`${mockDate}T12:00:00`));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return complete calorie data for today', () => {
      const profile: UserProfile = {
        name: 'Test User',
        targetCalories: 2000,
      };

      const meals: Meal[] = [
        {
          id: '1',
          name: 'Breakfast',
          calories: 500,
          protein: 20,
          carbs: 50,
          fats: 15,
          mealType: 'breakfast',
          date: mockDate,
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
          date: mockDate,
          timestamp: Date.now(),
        },
      ];

      const result = getTodaysCalorieData(profile, meals);

      expect(result.goal).toBe(2000);
      expect(result.consumed).toBe(1200);
      expect(result.remaining).toBe(800);
      expect(result.progress).toBe(60);
      expect(result.mealsCount).toBe(2);
    });

    it('should only count today\'s meals', () => {
      const profile: UserProfile = {
        name: 'Test User',
        targetCalories: 2000,
      };

      const meals: Meal[] = [
        {
          id: '1',
          name: 'Today Breakfast',
          calories: 500,
          protein: 20,
          carbs: 50,
          fats: 15,
          mealType: 'breakfast',
          date: mockDate,
          timestamp: Date.now(),
        },
        {
          id: '2',
          name: 'Yesterday Lunch',
          calories: 700,
          protein: 30,
          carbs: 70,
          fats: 20,
          mealType: 'lunch',
          date: '2024-01-14',
          timestamp: Date.now(),
        },
      ];

      const result = getTodaysCalorieData(profile, meals);

      expect(result.consumed).toBe(500);
      expect(result.mealsCount).toBe(1);
    });

    it('should handle no meals for today', () => {
      const profile: UserProfile = {
        name: 'Test User',
        targetCalories: 2000,
      };

      const result = getTodaysCalorieData(profile, []);

      expect(result.goal).toBe(2000);
      expect(result.consumed).toBe(0);
      expect(result.remaining).toBe(2000);
      expect(result.progress).toBe(0);
      expect(result.mealsCount).toBe(0);
    });
  });
});
