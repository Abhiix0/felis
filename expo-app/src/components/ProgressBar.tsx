import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  percent: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  height = 6,
  color = '#F06A3A',
  backgroundColor = '#1F1F1C',
}) => {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <View style={[styles.container, { height, backgroundColor }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
});
