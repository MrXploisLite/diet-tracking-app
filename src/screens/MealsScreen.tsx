import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { MealCard } from '../components/MealCard';
import { MealForm } from '../components/MealForm';
import { Meal } from '../types';

export const MealsScreen: React.FC = () => {
  const { theme, meals } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>(undefined);

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = date.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) {
      return 'Today';
    } else if (dateStr === yesterdayStr) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const selected = selectedDate.toISOString().split('T')[0];
    return today === selected;
  };

  const filteredMeals = useMemo(() => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return meals
      .filter(meal => meal.date === selectedDateStr)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [meals, selectedDate]);

  const totalCalories = useMemo(() => {
    return filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);
  }, [filteredMeals]);

  const mealsByType = useMemo(() => {
    const breakdown: Record<string, number> = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    };
    
    filteredMeals.forEach(meal => {
      breakdown[meal.mealType] += meal.calories;
    });
    
    return breakdown;
  }, [filteredMeals]);

  const handleAddMeal = () => {
    setEditingMeal(undefined);
    setIsFormVisible(true);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingMeal(undefined);
  };

  const renderMealCard = ({ item }: { item: Meal }) => (
    <MealCard meal={item} onEdit={handleEditMeal} />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.dateNavigator, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={goToPreviousDay}
        >
          <Text style={[styles.navButtonText, { color: theme.colors.primary }]}>
            ← Previous
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.dateText, { color: theme.colors.text }, theme.typography.h3]}>
          {formatDate(selectedDate)}
        </Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={goToNextDay}
          disabled={isToday()}
        >
          <Text
            style={[
              styles.navButtonText,
              { color: isToday() ? theme.colors.textSecondary : theme.colors.primary },
            ]}
          >
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.summary, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.totalCalories}>
          <Text style={[styles.totalLabel, { color: theme.colors.textSecondary }]}>
            Total Calories
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.primary }, theme.typography.h1]}>
            {totalCalories}
          </Text>
        </View>
        
        <View style={styles.breakdown}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownEmoji}>🌅</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>
              {mealsByType.breakfast}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownEmoji}>☀️</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>
              {mealsByType.lunch}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownEmoji}>🌙</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>
              {mealsByType.dinner}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownEmoji}>🍎</Text>
            <Text style={[styles.breakdownValue, { color: theme.colors.text }]}>
              {mealsByType.snack}
            </Text>
          </View>
        </View>
      </View>

      {filteredMeals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }, theme.typography.h4]}>
            No meals logged for this day
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }, theme.typography.body]}>
            Tap the + button to add your first meal
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMeals}
          renderItem={renderMealCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddMeal}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={isFormVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseForm}
      >
        <MealForm
          meal={editingMeal}
          date={selectedDate}
          onClose={handleCloseForm}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 1,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    flex: 1,
    textAlign: 'center',
  },
  summary: {
    padding: 20,
    marginBottom: 1,
  },
  totalCalories: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '300',
  },
});
