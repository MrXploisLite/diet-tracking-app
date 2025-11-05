import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onEdit }) => {
  const { theme, deleteMeal } = useApp();

  const handleDelete = () => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeal(meal.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete meal. Please try again.');
            }
          },
        },
      ],
    );
  };

  const getMealTypeEmoji = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.emoji}>{getMealTypeEmoji(meal.mealType)}</Text>
            <View>
              <Text style={[styles.name, { color: theme.colors.text }, theme.typography.h4]}>
                {meal.name}
              </Text>
              <Text style={[styles.mealType, { color: theme.colors.textSecondary }, theme.typography.caption]}>
                {capitalizeFirst(meal.mealType)}
              </Text>
            </View>
          </View>
          <Text style={[styles.calories, { color: theme.colors.primary }, theme.typography.h3]}>
            {meal.calories}
          </Text>
        </View>
        <Text style={[styles.caloriesLabel, { color: theme.colors.textSecondary }, theme.typography.caption]}>
          calories
        </Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.colors.border }]}
          onPress={() => onEdit(meal)}
        >
          <Text style={[styles.actionText, { color: theme.colors.primary }]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.colors.border }]}
          onPress={handleDelete}
        >
          <Text style={[styles.actionText, { color: theme.colors.error }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  name: {
    marginBottom: 2,
  },
  mealType: {
    fontSize: 12,
  },
  calories: {
    marginLeft: 16,
  },
  caloriesLabel: {
    textAlign: 'right',
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
