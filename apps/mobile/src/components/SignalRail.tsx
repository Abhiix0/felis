import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

interface SignalRailProps {
  color?: string;
  width?: number;
}

export const SignalRail: React.FC<SignalRailProps> = ({
  color = colors.accent,
  width = spacing[4],
}) => {
  return (
    <View
      style={[
        styles.rail,
        {
          backgroundColor: color,
          width,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  rail: {
    borderTopLeftRadius: radius.card,
    borderBottomLeftRadius: radius.card,
    alignSelf: 'stretch',
  },
});
