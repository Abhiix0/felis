import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export interface MetaRowProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number;
}

export function MetaRow({ children, style, gap = spacing[12] }: MetaRowProps) {
  return <View style={[styles.metaRow, { gap }, style]}>{children}</View>;
}

export interface MetaItemProps {
  icon?: React.ReactNode;
  text: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function MetaItem({ icon, text, color, style, textStyle }: MetaItemProps) {
  return (
    <View style={[styles.metaItem, style]}>
      {icon}
      <Text style={[styles.metaText, color ? { color } : undefined, textStyle]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing[12],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
  },
  metaText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});
