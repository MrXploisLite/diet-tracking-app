import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { ThemedText, Heading3, BodyText, Caption } from './Typography';
import { getStreakMessage } from '../utils';

export const StreakCard: React.FC = () => {
  const { theme, profile } = useApp();
  const currentStreak = profile.currentStreak || 0;
  const longestStreak = profile.longestStreak || 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <ThemedText variant="h4" color={theme.colors.text}>
          🔥 Streak
        </ThemedText>
      </View>

      <View style={styles.content}>
        <View style={styles.streakBox}>
          <Heading3 color={theme.colors.primary}>
            {currentStreak}
          </Heading3>
          <Caption color={theme.colors.textSecondary}>
            Current
          </Caption>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.streakBox}>
          <Heading3 color={theme.colors.secondary}>
            {longestStreak}
          </Heading3>
          <Caption color={theme.colors.textSecondary}>
            Best
          </Caption>
        </View>
      </View>

      <BodyText 
        color={theme.colors.textSecondary} 
        style={styles.message}
      >
        {getStreakMessage(currentStreak)}
      </BodyText>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  streakBox: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  message: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
