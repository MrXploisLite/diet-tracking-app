import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { Meal } from '../types';

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onEdit }) => {
  const { theme, deleteMeal } = useApp();
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
    <>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.nameRow}>
              <Text style={styles.emoji}>{getMealTypeEmoji(meal.mealType)}</Text>
              <View style={styles.nameContainer}>
                <Text style={[styles.name, { color: theme.colors.text }, theme.typography.h4]}>
                  {meal.name}
                </Text>
                <Text style={[styles.mealType, { color: theme.colors.textSecondary }, theme.typography.caption]}>
                  {capitalizeFirst(meal.mealType)}
                </Text>
              </View>
            </View>
            
            {/* Photo Thumbnail */}
            {meal.photoUri && (
              <TouchableOpacity
                style={styles.thumbnailContainer}
                onPress={() => setShowFullScreen(true)}
                activeOpacity={0.8}
              >
                {imageLoading && (
                  <View style={[styles.thumbnailLoading, { backgroundColor: theme.colors.background }]}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  </View>
                )}
                {imageError ? (
                  <View style={[styles.thumbnailError, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                    <Text style={styles.errorEmoji}>📷</Text>
                  </View>
                ) : (
                  <Image
                    source={{ uri: meal.photoUri }}
                    style={styles.thumbnail}
                    onLoad={() => {
                      setImageLoading(false);
                      setImageError(false);
                    }}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
            )}
            
            <View style={styles.caloriesContainer}>
              <Text style={[styles.calories, { color: theme.colors.primary }, theme.typography.h3]}>
                {meal.calories}
              </Text>
              <Text style={[styles.caloriesLabel, { color: theme.colors.textSecondary }, theme.typography.caption]}>
                calories
              </Text>
            </View>
          </View>
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

      {/* Full Screen Photo Modal */}
      {meal.photoUri && (
        <Modal
          visible={showFullScreen}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFullScreen(false)}
        >
          <TouchableOpacity
            style={styles.fullScreenOverlay}
            activeOpacity={1}
            onPress={() => setShowFullScreen(false)}
          >
            <Image
              source={{ uri: meal.photoUri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => setShowFullScreen(false)}
            >
              <Text style={[styles.closeButtonText, { color: theme.colors.text }]}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </>
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
    alignItems: 'center',
    gap: 12,
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
  nameContainer: {
    flex: 1,
  },
  name: {
    marginBottom: 2,
  },
  mealType: {
    fontSize: 12,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  thumbnailLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  thumbnailError: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  errorEmoji: {
    fontSize: 24,
  },
  caloriesContainer: {
    alignItems: 'flex-end',
  },
  calories: {
    marginBottom: 2,
  },
  caloriesLabel: {
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
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
