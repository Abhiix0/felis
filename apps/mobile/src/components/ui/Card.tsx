import React from 'react';
import { View, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radius } from '../../theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'raised';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  pressedStyle?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  variant = 'default',
  style,
  onPress,
  pressedStyle,
}: CardProps) {
  const baseStyle = [
    styles.card,
    variant === 'raised' && styles.cardRaised,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          baseStyle,
          pressed && (pressedStyle || styles.cardPressed),
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={baseStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRaised: {
    backgroundColor: colors.surfaceRaised,
  },
  cardPressed: {
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surfaceRaised,
  },
});
