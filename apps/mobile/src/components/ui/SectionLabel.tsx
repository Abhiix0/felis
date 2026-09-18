import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export interface SectionLabelProps {
  label: string;
  rightText?: string;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  rightTextStyle?: StyleProp<TextStyle>;
}

export function SectionLabel({
  label,
  rightText,
  style,
  labelStyle,
  rightTextStyle,
}: SectionLabelProps) {
  if (!rightText) {
    return (
      <Text style={[styles.sectionLabel, labelStyle, style as StyleProp<TextStyle>]}>
        {label}
      </Text>
    );
  }

  return (
    <View style={[styles.sectionHeader, style]}>
      <Text style={[styles.sectionLabel, labelStyle]}>{label}</Text>
      <Text style={[styles.sectionCounter, rightTextStyle]}>{rightText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  sectionLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  sectionCounter: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});
