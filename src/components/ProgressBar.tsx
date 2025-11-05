import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useApp } from '../context/AppContext';

interface ProgressBarProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 12,
  backgroundColor,
  progressColor,
  style,
}) => {
  const { theme } = useApp();
  
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  const bgColor = backgroundColor ?? theme.colors.surface;
  const fgColor = progressColor ?? theme.colors.primary;
  
  const isOverGoal = normalizedProgress >= 100;
  const displayProgress = isOverGoal ? 100 : normalizedProgress;
  const barColor = isOverGoal ? theme.colors.warning : fgColor;

  return (
    <View 
      style={[
        styles.container, 
        { 
          height, 
          backgroundColor: bgColor,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <View 
        style={[
          styles.progressFill,
          {
            width: `${displayProgress}%`,
            backgroundColor: barColor,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
