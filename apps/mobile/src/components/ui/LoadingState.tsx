import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { CatIllustration } from '../CatIllustration';
import { colors, spacing, radius, typography } from '../../theme/tokens';

export interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading your projects...',
  fullScreen = true,
  style,
}) => {
  if (!fullScreen) {
    return (
      <View style={[styles.cardContainer, style]}>
        <Text style={styles.cardTag}>LOADING</Text>
        <View style={styles.cardContent}>
          <View style={styles.cardMessageGroup}>
            <ActivityIndicator size="small" color={colors.textMuted} style={styles.spinner} />
            <Text style={styles.cardMessage}>{message}</Text>
          </View>
          <CatIllustration pose="loading" size={48} interactive={false} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.fullScreenContainer, style]}>
      <View style={styles.catWrapper}>
        <CatIllustration pose="loading" size={80} interactive={false} />
      </View>
      <View style={styles.fullScreenMessageGroup}>
        <ActivityIndicator size="small" color={colors.accent} />
        <Text style={styles.fullScreenMessage}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[24],
  },
  catWrapper: {
    marginBottom: spacing[20],
  },
  fullScreenMessageGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[10],
  },
  fullScreenMessage: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  cardContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: spacing[16],
  },
  cardTag: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing[12],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[4],
  },
  cardMessageGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[10],
    flex: 1,
  },
  spinner: {
    marginRight: spacing[2],
  },
  cardMessage: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
});
