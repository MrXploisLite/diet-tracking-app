import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Meal, MealType } from '../types';
import { Button } from './Button';

interface MealFormProps {
  meal?: Meal;
  date: Date;
  onClose: () => void;
}

export const MealForm: React.FC<MealFormProps> = ({ meal, date, onClose }) => {
  const { theme, addMeal, updateMeal } = useApp();
  const isEditing = !!meal;

  const [name, setName] = useState(meal?.name || '');
  const [calories, setCalories] = useState(meal?.calories.toString() || '');
  const [mealType, setMealType] = useState<MealType>(meal?.mealType || 'breakfast');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  const getMealTypeLabel = (type: MealType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getMealTypeEmoji = (type: MealType) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      case 'snack':
        return '🍎';
    }
  };

  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a meal name');
      return false;
    }

    const caloriesNum = parseInt(calories, 10);
    if (!calories.trim() || isNaN(caloriesNum) || caloriesNum < 0) {
      Alert.alert('Validation Error', 'Please enter a valid calorie amount (must be 0 or greater)');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const caloriesNum = parseInt(calories, 10);
      const timestamp = meal?.timestamp || date.getTime();
      const dateStr = new Date(timestamp).toISOString().split('T')[0];

      const mealData: Meal = {
        id: meal?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        calories: caloriesNum,
        protein: meal?.protein || 0,
        carbs: meal?.carbs || 0,
        fats: meal?.fats || 0,
        mealType,
        date: dateStr,
        timestamp,
      };

      if (isEditing) {
        await updateMeal(mealData.id, mealData);
      } else {
        await addMeal(mealData);
      }

      onClose();
    } catch (error) {
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'add'} meal. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }, theme.typography.h2]}>
            {isEditing ? 'Edit Meal' : 'Add Meal'}
          </Text>
          <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
            <Text style={[styles.closeButton, { color: theme.colors.primary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Meal Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Chicken salad"
              placeholderTextColor={theme.colors.textSecondary}
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Calories</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              value={calories}
              onChangeText={setCalories}
              placeholder="e.g., 450"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
              editable={!isSubmitting}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Meal Type</Text>
            <View style={styles.mealTypeGrid}>
              {mealTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.mealTypeButton,
                    {
                      backgroundColor: mealType === type ? theme.colors.primary : theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => setMealType(type)}
                  disabled={isSubmitting}
                >
                  <Text style={styles.mealTypeEmoji}>{getMealTypeEmoji(type)}</Text>
                  <Text
                    style={[
                      styles.mealTypeLabel,
                      { color: mealType === type ? '#FFFFFF' : theme.colors.text },
                    ]}
                  >
                    {getMealTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="outline"
            disabled={isSubmitting}
            style={styles.actionButton}
          />
          <Button
            title={isEditing ? 'Update' : 'Add'}
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
    paddingLeft: 16,
  },
  form: {
    marginBottom: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealTypeButton: {
    width: '48%',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealTypeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  mealTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
