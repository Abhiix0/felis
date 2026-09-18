import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';
import { CatIllustration } from '../CatIllustration';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing, radius, typography } from '../../theme/tokens';

export interface CompletedStateProps {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const CompletedState: React.FC<CompletedStateProps> = ({
  title = 'Nice. Done.',
  subtitle = 'Authentication tests',
  actionLabel = 'View details',
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  fullScreen = true,
  style,
}) => {
  if (!fullScreen) {
    return (
      <View style={[styles.cardContainer, style]}>
        <Text style={styles.cardTag}>COMPLETED</Text>

        <View style={styles.cardRow}>
          <View style={styles.cardLeft}>
            <View style={styles.checkBadge}>
              <Check size={14} color={colors.accentGreen} strokeWidth={3} />
            </View>

            <Text style={styles.cardTitle}>{title}</Text>
            {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}

            {onAction && (
              <Pressable
                style={({ pressed }) => [
                  styles.cardActionBtn,
                  pressed && styles.cardActionBtnPressed,
                ]}
                onPress={onAction}
              >
                <Text style={styles.cardActionBtnText}>{actionLabel}</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.catWrapperRelative}>
            <Text style={styles.doodleText}>Great!</Text>
            <CatIllustration pose="completed" size={58} interactive={false} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.fullScreenContainer, style]}>
      <View style={styles.catWrapperRelative}>
        <Text style={styles.doodleTextFullScreen}>Great!</Text>
        <CatIllustration pose="completed" size={100} interactive={false} />
      </View>

      <View style={styles.checkBadgeLarge}>
        <Check size={20} color={colors.accentGreen} strokeWidth={3} />
      </View>

      <Text style={styles.fullScreenTitle}>{title}</Text>
      {subtitle ? <Text style={styles.fullScreenSubtitle}>{subtitle}</Text> : null}

      <View style={styles.buttonGroup}>
        {onAction && (
          <PrimaryButton
            label={actionLabel}
            onPress={onAction}
            style={styles.fullScreenPrimaryBtn}
          />
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.secondaryBtnPressed,
            ]}
            onPress={onSecondaryAction}
          >
            <Text style={styles.secondaryBtnText}>{secondaryActionLabel}</Text>
          </Pressable>
        )}
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
  catWrapperRelative: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: spacing[16],
  },
  doodleText: {
    position: 'absolute',
    top: -14,
    right: 4,
    fontFamily: typography.fontFamily.sans,
    fontStyle: 'italic',
    fontSize: 12,
    color: colors.accent,
    fontWeight: '700',
  },
  doodleTextFullScreen: {
    position: 'absolute',
    top: -16,
    right: -10,
    fontFamily: typography.fontFamily.sans,
    fontStyle: 'italic',
    fontSize: 14,
    color: colors.accent,
    fontWeight: '700',
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(183, 217, 107, 0.15)',
    borderColor: 'rgba(183, 217, 107, 0.3)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[8],
  },
  checkBadgeLarge: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(183, 217, 107, 0.15)',
    borderColor: 'rgba(183, 217, 107, 0.3)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing[12],
  },
  fullScreenTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  fullScreenSubtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing[4],
    marginBottom: spacing[24],
    textAlign: 'center',
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 260,
    gap: spacing[10],
  },
  fullScreenPrimaryBtn: {
    width: '100%',
  },
  secondaryBtn: {
    paddingVertical: spacing[12],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.border,
    borderWidth: 1,
  },
  secondaryBtnPressed: {
    opacity: 0.8,
  },
  secondaryBtnText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
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
    color: colors.accentGreen,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing[10],
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    paddingRight: spacing[12],
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  cardSubtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing[2],
    marginBottom: spacing[12],
  },
  cardActionBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[6],
    borderRadius: radius.md,
  },
  cardActionBtnPressed: {
    opacity: 0.8,
  },
  cardActionBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    color: colors.text,
  },
});
