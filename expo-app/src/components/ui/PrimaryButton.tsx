import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme/tokens';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  iconPosition = 'right',
  style,
  textStyle,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        style,
        pressed && styles.pressed,
      ]}
    >
      {icon && iconPosition === 'left' ? icon : null}
      <Text style={[styles.text, textStyle]}>{label}</Text>
      {icon && iconPosition === 'right' ? icon : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[18],
    paddingVertical: spacing[8],
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.9,
  },
  text: {
    color: colors.bg,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
  },
});
