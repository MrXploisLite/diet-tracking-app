import { calculateBMR, calculateDailyCalories, calculateDailyGoal, activityMultipliers } from '../bmr';

describe('BMR Calculations', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR for male correctly', () => {
      const bmr = calculateBMR(80, 180, 30, 'male');
      expect(bmr).toBe(1825);
    });

    it('should calculate BMR for female correctly', () => {
      const bmr = calculateBMR(65, 165, 28, 'female');
      expect(bmr).toBe(1428.25);
    });

    it('should calculate different values for different genders with same stats', () => {
      const maleBMR = calculateBMR(70, 170, 25, 'male');
      const femaleBMR = calculateBMR(70, 170, 25, 'female');
      expect(maleBMR).toBeGreaterThan(femaleBMR);
      expect(maleBMR - femaleBMR).toBe(166);
    });
  });

  describe('calculateDailyCalories', () => {
    it('should calculate daily calories for sedentary activity', () => {
      const bmr = 1500;
      const calories = calculateDailyCalories(bmr, 'sedentary');
      expect(calories).toBe(1800);
    });

    it('should calculate daily calories for very active', () => {
      const bmr = 1500;
      const calories = calculateDailyCalories(bmr, 'very_active');
      expect(calories).toBe(2588);
    });

    it('should round to nearest integer', () => {
      const bmr = 1428.25;
      const calories = calculateDailyCalories(bmr, 'lightly_active');
      expect(calories).toBe(1964);
      expect(Number.isInteger(calories)).toBe(true);
    });
  });

  describe('calculateDailyGoal', () => {
    it('should calculate complete daily goal from individual parameters', () => {
      const goal = calculateDailyGoal(80, 180, 30, 'male', 'moderately_active');
      expect(goal).toBe(2829);
    });

    it('should handle female with sedentary activity', () => {
      const goal = calculateDailyGoal(60, 160, 25, 'female', 'sedentary');
      expect(goal).toBe(1671);
    });
  });

  describe('activityMultipliers', () => {
    it('should have correct multiplier values', () => {
      expect(activityMultipliers.sedentary).toBe(1.2);
      expect(activityMultipliers.lightly_active).toBe(1.375);
      expect(activityMultipliers.moderately_active).toBe(1.55);
      expect(activityMultipliers.very_active).toBe(1.725);
      expect(activityMultipliers.extra_active).toBe(1.9);
    });
  });
});
