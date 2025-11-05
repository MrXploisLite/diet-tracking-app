import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useApp } from '../context/AppContext';
import { 
  DailySummaryCard, 
  EmptyState, 
  Heading1, 
  Heading4, 
  BodyText,
  Caption,
  ThemedText,
} from '../components';
import { getTodaysCalorieData, getTodaysMeals, formatDate, getToday } from '../utils';

export const HomeScreen: React.FC = () => {
  const { theme, profile, meals } = useApp();

  const calorieData = getTodaysCalorieData(profile, meals);
  const todaysMeals = getTodaysMeals(meals);
  const today = getToday();
  
  const totalProtein = todaysMeals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFats = todaysMeals.reduce((sum, meal) => sum + meal.fats, 0);

  const hasMeals = todaysMeals.length > 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Heading1 style={styles.title}>
          Welcome, {profile.name}!
        </Heading1>

        <Caption 
          color={theme.colors.textSecondary} 
          style={styles.dateLabel}
        >
          {formatDate(today)}
        </Caption>
        
        <DailySummaryCard
          goal={calorieData.goal}
          consumed={calorieData.consumed}
          remaining={calorieData.remaining}
          progress={calorieData.progress}
          style={styles.summaryCard}
        />

        {!hasMeals ? (
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <EmptyState
              icon="🍽️"
              title="No meals logged yet"
              message="Start tracking your nutrition by adding your first meal of the day!"
            />
          </View>
        ) : (
          <>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Heading4 style={styles.cardTitle}>Macronutrients</Heading4>
              
              <View style={styles.macroRow}>
                <BodyText color={theme.colors.textSecondary}>
                  Protein
                </BodyText>
                <ThemedText 
                  variant="bodyBold"
                  color={theme.colors.text}
                >
                  {Math.round(totalProtein)}g
                </ThemedText>
              </View>
              
              <View style={[styles.macroRow, styles.macroDivider, { borderTopColor: theme.colors.border }]}>
                <BodyText color={theme.colors.textSecondary}>
                  Carbs
                </BodyText>
                <ThemedText 
                  variant="bodyBold"
                  color={theme.colors.text}
                >
                  {Math.round(totalCarbs)}g
                </ThemedText>
              </View>
              
              <View style={[styles.macroRow, styles.macroDivider, { borderTopColor: theme.colors.border }]}>
                <BodyText color={theme.colors.textSecondary}>
                  Fats
                </BodyText>
                <ThemedText 
                  variant="bodyBold"
                  color={theme.colors.text}
                >
                  {Math.round(totalFats)}g
                </ThemedText>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Heading4 style={styles.cardTitle}>Today's Stats</Heading4>
              
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <ThemedText 
                    variant="h3" 
                    color={theme.colors.primary}
                  >
                    {todaysMeals.length}
                  </ThemedText>
                  <Caption color={theme.colors.textSecondary}>
                    Meals logged
                  </Caption>
                </View>
                
                <View style={styles.statBox}>
                  <ThemedText 
                    variant="h3" 
                    color={theme.colors.success}
                  >
                    {Math.round(totalProtein + totalCarbs + totalFats)}g
                  </ThemedText>
                  <Caption color={theme.colors.textSecondary}>
                    Total macros
                  </Caption>
                </View>
              </View>
            </View>
          </>
        )}
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
    paddingBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  dateLabel: {
    marginBottom: 20,
  },
  summaryCard: {
    marginBottom: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 16,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  macroDivider: {
    borderTopWidth: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
});
