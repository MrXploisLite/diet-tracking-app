import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { Heading3, BodyText } from './Typography';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🍽️',
  title,
  message,
}) => {
  const { theme } = useApp();

  return (
    <View style={styles.container}>
      <BodyText style={styles.icon}>{icon}</BodyText>
      <Heading3 style={styles.title}>{title}</Heading3>
      <BodyText 
        color={theme.colors.textSecondary}
        style={styles.message}
      >
        {message}
      </BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
});
