import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

interface ProgressBarProps {
  percent: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent,
  height = spacing[6],
  color = colors.accent,
  backgroundColor = colors.surfaceTrack,
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
    borderRadius: radius.circle,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: radius.circle,
  },
});
