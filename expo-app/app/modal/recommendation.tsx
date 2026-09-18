import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { X, ArrowRight, Clock, Sparkles } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { CatIllustration } from '../../src/components/CatIllustration';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';

export default function RecommendationModal() {
  const router = useRouter();
  const { recommendation, startFocus } = useApp();

  if (!recommendation) {
    return (
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => router.back()} />

        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Sparkles size={16} color={colors.accentGreen} />
              <Text style={styles.headerTitle}>All Caught Up</Text>
            </View>
            <Pressable onPress={() => router.back()}>
              <X size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Cat */}
          <View style={styles.catArea}>
            <CatIllustration pose="completed" size={72} />
            <Text style={styles.catDialogue}>
              "You have completed all pending tasks! Take a well-deserved break or add a new task when you're ready."
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              style={[styles.primaryBtn, { flex: 1, backgroundColor: colors.surfaceHighlight, borderColor: colors.border }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.primaryBtnText, { color: colors.text }]}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerLeft}>
            <Sparkles size={16} color={colors.accent} />
            <Text style={styles.headerTitle}>What should I work on?</Text>
          </View>
          <Pressable onPress={() => router.back()}>
            <X size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* Cat */}
        <View style={styles.catArea}>
          <CatIllustration pose="recommendation" size={72} />
          <Text style={styles.catDialogue}>
            "Based on your deadlines and focus history, here is the best place to jump in:"
          </Text>
        </View>

        {/* Recommendation Card */}
        <View style={styles.recCard}>
          <Text style={styles.recProject}>{recommendation.projectName}</Text>
          <Text style={styles.recTitle}>{recommendation.title}</Text>

          <View style={styles.bulletsList}>
            {recommendation.reasonBullets.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.metaRow}>
            <Clock size={12} color={colors.textSecondary} />
            <Text style={styles.metaText}>~{recommendation.estimatedMinutes} minutes</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
            <Text style={styles.secondaryBtnText}>Later</Text>
          </Pressable>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              startFocus(recommendation.taskId);
              router.back();
              router.push(`/focus/${recommendation.taskId}`);
            }}
          >
            <Text style={styles.primaryBtnText}>Start Now</Text>
            <ArrowRight size={14} color={colors.bg} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.pill,
    borderTopRightRadius: radius.pill,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing[20],
    paddingBottom: spacing[36],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[16],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  headerTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 1,
  },
  catArea: {
    alignItems: 'center',
    gap: spacing[8],
    marginVertical: spacing[12],
  },
  catDialogue: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: typography.lineHeight.sm,
  },
  recCard: {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing[16],
    marginVertical: spacing[16],
  },
  recProject: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: '600',
  },
  recTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing[4],
  },
  bulletsList: {
    marginTop: spacing[10],
    gap: spacing[4],
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  bulletDot: {
    color: colors.accent,
    fontWeight: '700',
  },
  bulletText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
    marginTop: spacing[12],
  },
  metaText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing[12],
    marginTop: spacing[8],
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: spacing[12],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: colors.accent,
    paddingVertical: spacing[12],
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
  },
  primaryBtnText: {
    color: colors.bg,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
  },
});
