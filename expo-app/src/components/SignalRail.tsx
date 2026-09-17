import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SignalRailProps {
  color?: string;
  width?: number;
}

export const SignalRail: React.FC<SignalRailProps> = ({
  color = '#F06A3A',
  width = 4,
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
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    alignSelf: 'stretch',
  },
});
