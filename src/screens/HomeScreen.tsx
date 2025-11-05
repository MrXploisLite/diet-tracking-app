import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';

export const HomeScreen: React.FC = () => {
  const { theme, profile, meals } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todaysMeals = meals.filter(meal => meal.date === today);
  
  const totalCalories = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = todaysMeals.reduce((sum, meal) => sum + meal.fats, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }, theme.typography.h1]}>
          Welcome, {profile.name}!
        </Text>
        
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
            Today's Summary
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.colors.primary }, theme.typography.h2]}>
                {totalCalories}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }, theme.typography.caption]}>
                Calories
              </Text>
            </View>
            
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.colors.primary }, theme.typography.h2]}>
                {todaysMeals.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }, theme.typography.caption]}>
                Meals
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h4]}>
            Macros
          </Text>
          
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.textSecondary }]}>Protein</Text>
            <Text style={[styles.macroValue, { color: theme.colors.text }]}>{totalProtein}g</Text>
          </View>
          
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.textSecondary }]}>Carbs</Text>
            <Text style={[styles.macroValue, { color: theme.colors.text }]}>{totalCarbs}g</Text>
          </View>
          
          <View style={styles.macroRow}>
            <Text style={[styles.macroLabel, { color: theme.colors.textSecondary }]}>Fats</Text>
            <Text style={[styles.macroValue, { color: theme.colors.text }]}>{totalFats}g</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    marginBottom: 4,
  },
  statLabel: {},
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  macroLabel: {
    fontSize: 16,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
