import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedIndex,
  onIndexChange,
}) => {
  const { theme } = useApp();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {segments.map((segment, index) => {
        const isSelected = index === selectedIndex;
        return (
          <TouchableOpacity
            key={segment}
            style={[
              styles.segment,
              isSelected && {
                backgroundColor: theme.colors.primary,
              },
            ]}
            onPress={() => onIndexChange(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                { color: isSelected ? '#FFFFFF' : theme.colors.text },
              ]}
            >
              {segment}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
