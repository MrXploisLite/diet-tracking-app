import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Meal, AppState, defaultAppState } from '../types';
import { Theme, ThemeMode, createTheme } from '../theme';
import { StorageService } from '../utils/storage';

interface AppContextType {
  profile: UserProfile;
  meals: Meal[];
  theme: Theme;
  isLoading: boolean;
  setProfile: (profile: UserProfile) => Promise<void>;
  setMeals: (meals: Meal[]) => Promise<void>;
  addMeal: (meal: Meal) => Promise<void>;
  updateMeal: (id: string, meal: Meal) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
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
      theme: updates.theme ?? themeMode,
    };
    await StorageService.setAppState(state);
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
      await saveAppState({ meals: newMeals });
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
      await saveAppState({ meals: newMeals });
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
      await saveAppState({ meals: newMeals });
    } catch (error) {
      console.error('Error deleting meal:', error);
      setMealsState(previousMeals);
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
    theme,
    isLoading,
    setProfile,
    setMeals,
    addMeal,
    updateMeal,
    deleteMeal,
    toggleTheme,
    resetProfile,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
