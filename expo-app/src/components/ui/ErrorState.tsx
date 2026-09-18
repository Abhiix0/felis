import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, ActivityIndicator } from 'react-native';
import { AlertCircle, RotateCw } from 'lucide-react-native';
import { CatIllustration } from '../CatIllustration';
import { colors, spacing, radius, typography } from '../../theme/tokens';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void | Promise<void>;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong.',
  message = "Couldn't load your projects. Please try again.",
  onRetry,
  fullScreen = true,
  style,
}) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || retrying) return;
    try {
      setRetrying(true);
      await Promise.resolve(onRetry());
    } finally {
      setRetrying(false);
    }
  };

  if (!fullScreen) {
    return (
      <View style={[styles.cardContainer, style]}>
        <Text style={styles.cardTag}>ERROR</Text>

        <View style={styles.cardRow}>
          <View style={styles.cardLeft}>
            <View style={styles.cardHeaderRow}>
              <AlertCircle size={16} color={colors.accent} />
              <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <Text style={styles.cardMessage}>{message}</Text>

            {onRetry && (
              <Pressable
                style={({ pressed }) => [
                  styles.retryButton,
                  pressed && styles.retryButtonPressed,
                ]}
                onPress={handleRetry}
                disabled={retrying}
              >
                {retrying ? (
                  <ActivityIndicator size="small" color={colors.text} style={styles.retryIcon} />
                ) : (
                  <RotateCw size={13} color={colors.text} style={styles.retryIcon} />
                )}
                <Text style={styles.retryText}>{retrying ? 'Retrying...' : 'Retry'}</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.cardRight}>
            <CatIllustration pose="error" size={54} interactive={false} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.fullScreenContainer, style]}>
      <View style={styles.catWrapper}>
        <CatIllustration pose="error" size={90} interactive={false} />
      </View>

      <View style={styles.headerRow}>
        <AlertCircle size={20} color={colors.accent} />
        <Text style={styles.fullScreenTitle}>{title}</Text>
      </View>

      <Text style={styles.fullScreenMessage}>{message}</Text>

      {onRetry && (
        <Pressable
          style={({ pressed }) => [
            styles.fullScreenRetryButton,
            pressed && styles.retryButtonPressed,
          ]}
          onPress={handleRetry}
          disabled={retrying}
        >
          {retrying ? (
            <ActivityIndicator size="small" color={colors.bg} style={styles.retryIcon} />
          ) : (
            <RotateCw size={15} color={colors.bg} style={styles.retryIcon} />
          )}
          <Text style={styles.fullScreenRetryText}>{retrying ? 'Retrying...' : 'Retry'}</Text>
        </Pressable>
      )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  fullScreenTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
  },
  fullScreenMessage: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[8],
    maxWidth: 280,
    lineHeight: 18,
  },
  fullScreenRetryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[18],
    paddingVertical: spacing[10],
    borderRadius: radius.md,
    marginTop: spacing[20],
  },
  fullScreenRetryText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.bg,
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
    color: colors.accent,
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    marginBottom: spacing[6],
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  cardMessage: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: spacing[12],
  },
  cardRight: {
    marginTop: spacing[4],
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: spacing[12],
    paddingVertical: spacing[6],
    borderRadius: radius.md,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryIcon: {
    marginRight: spacing[6],
  },
  retryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '500',
    color: colors.text,
  },
});
