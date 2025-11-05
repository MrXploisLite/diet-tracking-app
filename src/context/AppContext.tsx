import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { UserProfile, Meal, WaterIntake, WeightEntry, Achievement, AppState, defaultAppState } from '../types';
import { Theme, ThemeMode, createTheme } from '../theme';
import { StorageService } from '../utils/storage';
import { calculateStreak, checkAchievements, getNewlyUnlockedAchievements } from '../utils';

interface AppContextType {
  profile: UserProfile;
  meals: Meal[];
  waterIntakes: WaterIntake[];
  weightEntries: WeightEntry[];
  achievements: Achievement[];
  theme: Theme;
  isLoading: boolean;
  setProfile: (profile: UserProfile) => Promise<void>;
  setMeals: (meals: Meal[]) => Promise<void>;
  addMeal: (meal: Meal) => Promise<void>;
  updateMeal: (id: string, meal: Meal) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  addWaterIntake: (amount: number) => Promise<void>;
  addWeightEntry: (weight: number) => Promise<void>;
  toggleTheme: () => Promise<void>;
  resetProfile: (clearMeals?: boolean) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile>(defaultAppState.profile);
  const [meals, setMealsState] = useState<Meal[]>([]);
  const [waterIntakes, setWaterIntakesState] = useState<WaterIntake[]>([]);
  const [weightEntries, setWeightEntriesState] = useState<WeightEntry[]>([]);
  const [achievements, setAchievementsState] = useState<Achievement[]>(defaultAppState.achievements);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const state = await StorageService.getAppState();
      setProfileState(state.profile);
      setMealsState(state.meals);
      setWaterIntakesState(state.waterIntakes || []);
      setWeightEntriesState(state.weightEntries || []);
      setAchievementsState(state.achievements || defaultAppState.achievements);
      setThemeMode(state.theme);
    } catch (error) {
      console.error('Error loading app state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAppState = async (updates: Partial<AppState>) => {
    const state: AppState = {
      profile: updates.profile ?? profile,
      meals: updates.meals ?? meals,
      waterIntakes: updates.waterIntakes ?? waterIntakes,
      weightEntries: updates.weightEntries ?? weightEntries,
      achievements: updates.achievements ?? achievements,
      theme: updates.theme ?? themeMode,
    };
    await StorageService.setAppState(state);
  };

  const updateStreakAndAchievements = async (newMeals: Meal[]) => {
    // Calculate streak
    const { currentStreak, longestStreak } = calculateStreak(newMeals);
    
    // Check achievements
    const newAchievements = checkAchievements(
      newMeals,
      waterIntakes,
      weightEntries,
      currentStreak,
      profile.targetWater || 2000,
      profile.targetCalories || 2000,
      achievements
    );

    // Check for newly unlocked achievements
    const unlockedAchievements = getNewlyUnlockedAchievements(achievements, newAchievements);
    
    // Show alert for new achievements
    if (unlockedAchievements.length > 0) {
      const achievement = unlockedAchievements[0];
      Alert.alert(
        '🎉 Achievement Unlocked!',
        `${achievement.icon} ${achievement.title}\n${achievement.description}`,
        [{ text: 'Awesome!', style: 'default' }]
      );
    }

    // Update profile with new streak
    const updatedProfile = {
      ...profile,
      currentStreak,
      longestStreak: Math.max(longestStreak, profile.longestStreak || 0),
    };

    setProfileState(updatedProfile);
    setAchievementsState(newAchievements);

    return { updatedProfile, newAchievements };
  };

  const setProfile = async (newProfile: UserProfile) => {
    setProfileState(newProfile);
    await saveAppState({ profile: newProfile });
  };

  const setMeals = async (newMeals: Meal[]) => {
    setMealsState(newMeals);
    await saveAppState({ meals: newMeals });
  };

  const addMeal = async (meal: Meal) => {
    const previousMeals = meals;
    const newMeals = [...meals, meal];
    setMealsState(newMeals);
    try {
      const { updatedProfile, newAchievements } = await updateStreakAndAchievements(newMeals);
      await saveAppState({ meals: newMeals, profile: updatedProfile, achievements: newAchievements });
    } catch (error) {
      console.error('Error adding meal:', error);
      setMealsState(previousMeals);
      throw error;
    }
  };

  const updateMeal = async (id: string, updatedMeal: Meal) => {
    const previousMeals = meals;
    const newMeals = meals.map(m => (m.id === id ? updatedMeal : m));
    setMealsState(newMeals);
    try {
      const { updatedProfile, newAchievements } = await updateStreakAndAchievements(newMeals);
      await saveAppState({ meals: newMeals, profile: updatedProfile, achievements: newAchievements });
    } catch (error) {
      console.error('Error updating meal:', error);
      setMealsState(previousMeals);
      throw error;
    }
  };

  const deleteMeal = async (id: string) => {
    const previousMeals = meals;
    const newMeals = meals.filter(m => m.id !== id);
    setMealsState(newMeals);
    try {
      const { updatedProfile, newAchievements } = await updateStreakAndAchievements(newMeals);
      await saveAppState({ meals: newMeals, profile: updatedProfile, achievements: newAchievements });
    } catch (error) {
      console.error('Error deleting meal:', error);
      setMealsState(previousMeals);
      throw error;
    }
  };

  const addWaterIntake = async (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newWater: WaterIntake = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount,
      date: today,
      timestamp: Date.now(),
    };

    const newWaterIntakes = [...waterIntakes, newWater];
    setWaterIntakesState(newWaterIntakes);

    try {
      // Check achievements
      const newAchievements = checkAchievements(
        meals,
        newWaterIntakes,
        weightEntries,
        profile.currentStreak || 0,
        profile.targetWater || 2000,
        profile.targetCalories || 2000,
        achievements
      );

      const unlockedAchievements = getNewlyUnlockedAchievements(achievements, newAchievements);
      if (unlockedAchievements.length > 0) {
        const achievement = unlockedAchievements[0];
        Alert.alert(
          '🎉 Achievement Unlocked!',
          `${achievement.icon} ${achievement.title}\n${achievement.description}`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }

      setAchievementsState(newAchievements);
      await saveAppState({ waterIntakes: newWaterIntakes, achievements: newAchievements });
    } catch (error) {
      console.error('Error adding water intake:', error);
      throw error;
    }
  };

  const addWeightEntry = async (weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: WeightEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      weight,
      date: today,
      timestamp: Date.now(),
    };

    const newWeightEntries = [...weightEntries, newEntry];
    setWeightEntriesState(newWeightEntries);

    try {
      // Check achievements
      const newAchievements = checkAchievements(
        meals,
        waterIntakes,
        newWeightEntries,
        profile.currentStreak || 0,
        profile.targetWater || 2000,
        profile.targetCalories || 2000,
        achievements
      );

      const unlockedAchievements = getNewlyUnlockedAchievements(achievements, newAchievements);
      if (unlockedAchievements.length > 0) {
        const achievement = unlockedAchievements[0];
        Alert.alert(
          '🎉 Achievement Unlocked!',
          `${achievement.icon} ${achievement.title}\n${achievement.description}`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }

      setAchievementsState(newAchievements);
      await saveAppState({ weightEntries: newWeightEntries, achievements: newAchievements });
    } catch (error) {
      console.error('Error adding weight entry:', error);
      throw error;
    }
  };

  const toggleTheme = async () => {
    const newTheme: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    await saveAppState({ theme: newTheme });
  };

  const resetProfile = async (clearMeals: boolean = false) => {
    const newProfile = defaultAppState.profile;
    const newMeals = clearMeals ? [] : meals;
    setProfileState(newProfile);
    if (clearMeals) {
      setMealsState(newMeals);
    }
    await saveAppState({ 
      profile: newProfile, 
      meals: newMeals 
    });
  };

  const theme = createTheme(themeMode);

  const value: AppContextType = {
    profile,
    meals,
    waterIntakes,
    weightEntries,
    achievements,
    theme,
    isLoading,
    setProfile,
    setMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    addWaterIntake,
    addWeightEntry,
    toggleTheme,
    resetProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
