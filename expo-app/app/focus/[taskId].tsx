import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Play, Pause, CheckCircle2, RotateCcw } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { FocusTimer } from '../../src/components/FocusTimer';
import { CatIllustration } from '../../src/components/CatIllustration';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';
import { Card, CompletedState } from '../../src/components/ui';

export default function FocusSessionScreen() {
  const router = useRouter();
  const {
    focusSession,
    pauseFocus,
    resumeFocus,
    finishFocus,
    resetFocus,
    toggleSubtask,
  } = useApp();

  if (!focusSession) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>No focus session active</Text>
      </SafeAreaView>
    );
  }

  if (focusSession.isFinished) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <CompletedState
          title="Nice. Done."
          subtitle={focusSession.taskTitle}
          actionLabel="View details"
          onAction={() => {
            resetFocus();
            router.push('/tasks');
          }}
          secondaryActionLabel="Back to Home"
          onSecondaryAction={() => {
            resetFocus();
            router.replace('/(tabs)');
          }}
          fullScreen
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Nav header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.text} />
            <Text style={styles.backText}>Home</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Focus Mode</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Task Info */}
        <View style={styles.taskInfo}>
          <Text style={styles.projectTag}>{focusSession.projectName}</Text>
          <Text style={styles.taskTitle}>{focusSession.taskTitle}</Text>
        </View>

        {/* Circular SVG Timer */}
        <View style={styles.timerWrapper}>
          <FocusTimer
            remainingSeconds={focusSession.remainingSeconds}
            totalSeconds={focusSession.totalSeconds}
            isRunning={focusSession.isRunning}
            size={220}
          />
        </View>

        {/* Controls */}
        <View style={styles.controlsRow}>
          <Pressable style={styles.iconBtn} onPress={resetFocus}>
            <RotateCcw size={18} color={colors.textSecondary} />
          </Pressable>

          {focusSession.isRunning ? (
            <Pressable style={styles.primaryBtn} onPress={pauseFocus}>
              <Pause size={20} color={colors.bg} />
              <Text style={styles.primaryBtnText}>Pause</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryBtn} onPress={resumeFocus}>
              <Play size={20} color={colors.bg} />
              <Text style={styles.primaryBtnText}>Resume</Text>
            </Pressable>
          )}

          <Pressable style={styles.iconBtn} onPress={finishFocus}>
            <CheckCircle2 size={18} color={colors.accentGreen} />
          </Pressable>
        </View>

        {/* Subtasks */}
        <Card style={styles.subtasksCard}>
          <Text style={styles.subtasksHeader}>CHECKLIST</Text>
          {focusSession.subtasks.map((st) => (
            <Pressable
              key={st.id}
              style={styles.subtaskRow}
              onPress={() => toggleSubtask(st.id)}
            >
              <View
                style={[
                  styles.subtaskBox,
                  st.completed && styles.subtaskBoxCompleted,
                ]}
              >
                {st.completed && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text
                style={[
                  styles.subtaskText,
                  st.completed && styles.subtaskTextCompleted,
                ]}
              >
                {st.title}
              </Text>
            </Pressable>
          ))}
        </Card>

        {/* Cat companion */}
        <View style={styles.catCompanion}>
          <CatIllustration
            pose={focusSession.isRunning ? 'focus' : 'idle'}
            size={68}
          />
          <Text style={styles.catEncouragement}>
            {focusSession.isRunning
              ? 'Stay in the flow, Abhi...'
              : 'Take a breath. Ready when you are.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: spacing[20],
    paddingTop: spacing[8],
    paddingBottom: spacing[32],
    alignItems: 'center',
  },
  errorText: {
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing[40],
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[12],
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  backText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  taskInfo: {
    alignItems: 'center',
    marginTop: spacing[12],
    marginBottom: spacing[8],
  },
  projectTag: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    letterSpacing: 1,
  },
  taskTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing[4],
    maxWidth: 280,
  },
  timerWrapper: {
    marginVertical: spacing[12],
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[20],
    marginVertical: spacing[16],
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pillLg,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[24],
    paddingVertical: spacing[12],
    borderRadius: radius.xl,
  },
  primaryBtnText: {
    color: colors.bg,
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
  },
  subtasksCard: {
    width: '100%',
    padding: spacing[16],
    marginTop: spacing[16],
  },
  subtasksHeader: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: spacing[10],
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    paddingVertical: spacing[8],
  },
  subtaskBox: {
    width: 16,
    height: 16,
    borderRadius: radius.xs,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskBoxCompleted: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  checkMark: {
    fontSize: typography.fontSize.xs,
    color: colors.bg,
    fontWeight: '700',
  },
  subtaskText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  subtaskTextCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  catCompanion: {
    alignItems: 'center',
    marginTop: spacing[24],
    gap: spacing[6],
  },
  catEncouragement: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
