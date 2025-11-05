import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useApp } from '../context/AppContext';
import { ThemedText, Heading3, Caption } from './Typography';
import { ProgressBar } from './ProgressBar';

interface DailySummaryCardProps {
  goal: number;
  consumed: number;
  remaining: number;
  progress: number;
  style?: ViewStyle;
}

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({
  goal,
  consumed,
  remaining,
  progress,
  style,
}) => {
  const { theme } = useApp();

  const isOverGoal = consumed > goal;

  return (
    <View 
      style={[
        styles.card, 
        { 
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
        },
        style,
      ]}
    >
      <Heading3 style={styles.title}>Today's Calories</Heading3>
      
      <View style={styles.mainStats}>
        <View style={styles.statItem}>
          <ThemedText 
            variant="h1" 
            color={theme.colors.primary}
            style={styles.mainNumber}
          >
            {consumed}
          </ThemedText>
          <Caption color={theme.colors.textSecondary}>consumed</Caption>
        </View>
        
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        
        <View style={styles.statItem}>
          <ThemedText 
            variant="h1" 
            color={isOverGoal ? theme.colors.warning : theme.colors.success}
            style={styles.mainNumber}
          >
            {remaining}
          </ThemedText>
          <Caption color={theme.colors.textSecondary}>
            {isOverGoal ? 'over goal' : 'remaining'}
          </Caption>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Caption color={theme.colors.textSecondary}>Progress</Caption>
          <Caption color={theme.colors.textSecondary}>
            {Math.round(progress)}%
          </Caption>
        </View>
        <ProgressBar progress={progress} height={16} />
      </View>

      <View style={styles.goalSection}>
        <Caption color={theme.colors.textSecondary}>
          Daily Goal: {goal} calories
        </Caption>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    marginBottom: 20,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  mainNumber: {
    marginBottom: 4,
  },
  divider: {
    width: 1,
    height: 60,
    marginHorizontal: 16,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalSection: {
    alignItems: 'center',
  },
});
