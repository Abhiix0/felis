import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Plus } from 'lucide-react-native';
import { CatIllustration } from '../CatIllustration';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing, typography } from '../../theme/tokens';

export interface EmptyStateProps {
  type?: 'projects' | 'tasks' | 'all_completed' | 'radar';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'projects',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'projects':
        return {
          title: 'No projects yet',
          description: 'Create your first project to start organizing your work.',
          actionLabel: 'New Project',
          pose: 'empty' as const,
          size: 130,
        };
      case 'tasks':
        return {
          title: 'Nothing here.',
          description: 'Add something to work on.',
          actionLabel: 'Add task',
          pose: 'empty' as const,
          size: 130,
        };
      case 'all_completed':
        return {
          title: 'All clear.',
          description: 'Nothing left for now. Time to rest or plan ahead.',
          actionLabel: undefined,
          pose: 'focus' as const,
          size: 88,
        };
      case 'radar':
        return {
          title: 'Coming soon',
          description: 'Technology radar updates and intelligence will be available in Phase 10.',
          actionLabel: undefined,
          pose: 'idle' as const,
          size: 100,
        };
    }
  };

  const defaults = getDefaultContent();
  const displayTitle = title ?? defaults.title;
  const displayDescription = description ?? defaults.description;
  const displayActionLabel = actionLabel ?? defaults.actionLabel;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.illustrationWrapper}>
        <CatIllustration
          pose={defaults.pose}
          size={defaults.size}
          interactive={false}
        />
      </View>

      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.description}>{displayDescription}</Text>

      {displayActionLabel && onAction && (
        <View style={styles.actionWrapper}>
          <PrimaryButton
            label={displayActionLabel}
            icon={<Plus size={15} color={colors.bg} />}
            onPress={onAction}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[32],
    paddingHorizontal: spacing[24],
    textAlign: 'center',
  },
  illustrationWrapper: {
    marginBottom: spacing[16],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[6],
    maxWidth: 260,
    lineHeight: 18,
  },
  actionWrapper: {
    marginTop: spacing[20],
  },
});
