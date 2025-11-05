import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { Achievement } from '../types';
import { ThemedText, Caption } from './Typography';

interface AchievementBadgeProps {
  achievement: Achievement;
  onPress?: () => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, onPress }) => {
  const { theme } = useApp();
  const { icon, title, isUnlocked } = achievement;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isUnlocked ? theme.colors.surface : theme.colors.background,
          borderColor: isUnlocked ? theme.colors.primary : theme.colors.border,
          opacity: isUnlocked ? 1 : 0.5,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <ThemedText variant="h2" style={styles.icon}>
          {icon}
        </ThemedText>
        {isUnlocked && (
          <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
            <ThemedText variant="caption" color="#FFFFFF">
              ✓
            </ThemedText>
          </View>
        )}
      </View>
      <Caption
        color={isUnlocked ? theme.colors.text : theme.colors.textSecondary}
        style={styles.title}
        numberOfLines={2}
      >
        {title}
      </Caption>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  icon: {
    fontSize: 40,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
