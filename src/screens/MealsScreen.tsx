import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useApp } from '../context/AppContext';

export const MealsScreen: React.FC = () => {
  const { theme, meals } = useApp();

  const sortedMeals = [...meals].sort((a, b) => b.timestamp - a.timestamp);

  const renderMeal = ({ item }: { item: any }) => (
    <View style={[styles.mealCard, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.mealName, { color: theme.colors.text }, theme.typography.h4]}>
        {item.name}
      </Text>
      <Text style={[styles.mealDate, { color: theme.colors.textSecondary }, theme.typography.caption]}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
      <View style={styles.macrosRow}>
        <Text style={[styles.macroText, { color: theme.colors.text }]}>
          {item.calories} cal
        </Text>
        <Text style={[styles.macroText, { color: theme.colors.text }]}>
          P: {item.protein}g
        </Text>
        <Text style={[styles.macroText, { color: theme.colors.text }]}>
          C: {item.carbs}g
        </Text>
        <Text style={[styles.macroText, { color: theme.colors.text }]}>
          F: {item.fats}g
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }, theme.typography.body]}>
            No meals logged yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedMeals}
          renderItem={renderMeal}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  mealCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealName: {
    marginBottom: 4,
  },
  mealDate: {
    marginBottom: 12,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
