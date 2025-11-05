import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { ThemedText, Heading4, BodyText, Caption } from './Typography';
import { ProgressBar } from './ProgressBar';

interface WaterTrackerProps {
  consumed: number;
  goal: number;
  onAddWater: (amount: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ consumed, goal, onAddWater }) => {
  const { theme } = useApp();
  const progress = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);

  const quickAmounts = [250, 500, 750];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Heading4 color={theme.colors.text}>💧 Water Intake</Heading4>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <ThemedText variant="h3" color={theme.colors.primary}>
            {consumed}ml
          </ThemedText>
          <Caption color={theme.colors.textSecondary}>Consumed</Caption>
        </View>

        <View style={styles.statItem}>
          <ThemedText variant="h3" color={theme.colors.textSecondary}>
            {remaining}ml
          </ThemedText>
          <Caption color={theme.colors.textSecondary}>Remaining</Caption>
        </View>
      </View>

      <ProgressBar progress={progress} color={theme.colors.info} style={styles.progress} />

      <BodyText color={theme.colors.textSecondary} style={styles.goalText}>
        Goal: {goal}ml
      </BodyText>

      <View style={styles.buttons}>
        {quickAmounts.map(amount => (
          <TouchableOpacity
            key={amount}
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => onAddWater(amount)}
            activeOpacity={0.7}
          >
            <ThemedText variant="bodyBold" color="#FFFFFF">
              +{amount}ml
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  progress: {
    marginBottom: 8,
  },
  goalText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 12,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});
