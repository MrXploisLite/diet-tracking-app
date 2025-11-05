import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';

export const ProgressScreen: React.FC = () => {
  const { theme, meals } = useApp();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyData = last7Days.map(date => {
    const dayMeals = meals.filter(meal => meal.date === date);
    const calories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
    return { date, calories, count: dayMeals.length };
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }, theme.typography.h1]}>
          Progress
        </Text>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
            Last 7 Days
          </Text>
          
          {dailyData.map((day) => (
            <View key={day.date} style={styles.dayRow}>
              <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
                {new Date(day.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
              <View style={styles.dayStats}>
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  {day.count} meals
                </Text>
                <Text style={[styles.statText, { color: theme.colors.primary }]}>
                  {day.calories} cal
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
            Total Stats
          </Text>
          
          <View style={styles.statRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Total Meals
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {meals.length}
            </Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Total Calories
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {meals.reduce((sum, meal) => sum + meal.calories, 0)}
            </Text>
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
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dayStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 14,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});
