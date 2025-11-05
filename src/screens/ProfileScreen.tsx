import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const { theme, profile, toggleTheme } = useApp();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }, theme.typography.h1]}>
          Profile
        </Text>

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
            User Information
          </Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Name</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>{profile.name}</Text>
          </View>

          {profile.age && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Age</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{profile.age}</Text>
            </View>
          )}

          {profile.weight && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Weight</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{profile.weight} kg</Text>
            </View>
          )}

          {profile.height && (
            <View style={styles.infoRow}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Height</Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{profile.height} cm</Text>
            </View>
          )}
        </View>

        {(profile.targetCalories || profile.targetProtein || profile.targetCarbs || profile.targetFats) && (
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
              Daily Goals
            </Text>
            
            {profile.targetCalories && (
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Calories</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{profile.targetCalories}</Text>
              </View>
            )}

            {profile.targetProtein && (
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Protein</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{profile.targetProtein}g</Text>
              </View>
            )}

            {profile.targetCarbs && (
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Carbs</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{profile.targetCarbs}g</Text>
              </View>
            )}

            {profile.targetFats && (
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Fats</Text>
                <Text style={[styles.value, { color: theme.colors.text }]}>{profile.targetFats}g</Text>
              </View>
            )}
          </View>
        )}

        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }, theme.typography.h3]}>
            Settings
          </Text>
          
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={toggleTheme}
          >
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Theme</Text>
            <Text style={[styles.value, { color: theme.colors.primary }]}>
              {theme.mode === 'light' ? '☀️ Light' : '🌙 Dark'}
            </Text>
          </TouchableOpacity>
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingRow: {
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
