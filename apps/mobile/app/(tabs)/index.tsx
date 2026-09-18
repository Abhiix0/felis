import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, Calendar, ArrowRight, Plus, Sparkles, Check, ChevronRight } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import { CatIllustration } from '../../src/components/CatIllustration';
import { SignalRail } from '../../src/components/SignalRail';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';
import { Card, SectionLabel, PrimaryButton, EmptyState } from '../../src/components/ui';
import { getTodayLabel } from '../../src/utils/dateUtils';
import { getTodayTasks, getActiveTodayTasks } from '../../src/domain/taskSelectors';

export default function HomeScreen() {
  const router = useRouter();
  const { recommendation, tasks, toggleTask, startFocus, syncStatus } = useApp();
  const { user } = useAuth();

  const rawTodayTasks = getTodayTasks(tasks);
  const todayTasks = rawTodayTasks.length > 0 ? rawTodayTasks : tasks.filter((t) => !t.completed);
  const activeTodayCount = getActiveTodayTasks(tasks).length;
  const completedCount = todayTasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header date & sync indicator */}
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{getTodayLabel()}</Text>
          {syncStatus !== 'synced' && (
            <View style={styles.syncIndicator}>
              <View
                style={[
                  styles.syncDot,
                  { backgroundColor: syncStatus === 'failed' ? '#E5533D' : '#E5A93C' },
                ]}
              />
              <Text style={styles.syncText}>
                {syncStatus === 'failed' ? 'Sync error' : 'Syncing'}
              </Text>
            </View>
          )}
        </View>

        {/* Greeting & Cat */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingLight}>Good morning,</Text>
            <Text style={styles.greetingBold}>{user?.displayName || 'Developer'}</Text>
            <Text style={styles.greetingSub}>
              You have {activeTodayCount} things to work on today.
            </Text>
          </View>

          <View style={styles.catWrapper}>
            <Text style={styles.speechBubble}>let's do this &lt;3</Text>
            <CatIllustration
              pose="recommendation"
              size={64}
              interactive
              onTap={() => router.push('/modal/recommendation')}
            />
          </View>
        </View>

        {/* Recommendation Card */}
        {recommendation ? (
          <Card variant="raised" style={styles.cardContainer}>
            <SignalRail color={colors.accent} width={spacing[4]} />

            <View style={styles.cardContent}>
              <Text style={styles.doThisNowLabel}>DO THIS NOW</Text>
              <Text style={styles.cardTitle}>{recommendation.title}</Text>
              <Text style={styles.cardProject}>{recommendation.projectName}</Text>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Clock size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>~{recommendation.estimatedMinutes} min</Text>
                </View>
                <View style={styles.metaItem}>
                  <Calendar size={12} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{recommendation.dueDateLabel}</Text>
                  <Text style={styles.metaText}>·</Text>
                  <Text
                    style={[
                      styles.metaText,
                      { color: (recommendation.priority || 'medium') === 'high' ? colors.accent : colors.textSecondary },
                    ]}
                  >
                    {(recommendation.priority || 'medium').charAt(0).toUpperCase() + (recommendation.priority || 'medium').slice(1)} priority
                  </Text>
                </View>
              </View>

              <View style={styles.cardActionRow}>
                <PrimaryButton
                  label="Start"
                  icon={<ArrowRight size={14} color={colors.bg} />}
                  onPress={() => {
                    startFocus(recommendation.taskId);
                    router.push(`/focus/${recommendation.taskId}`);
                  }}
                />
              </View>
            </View>
          </Card>
        ) : (
          <Card variant="raised" style={styles.cardContainer}>
            <SignalRail color={colors.accentGreen} width={spacing[4]} />
            <View style={styles.cardContent}>
              <Text style={[styles.doThisNowLabel, { color: colors.accentGreen }]}>ALL CAUGHT UP</Text>
              <Text style={styles.cardTitle}>No pending tasks</Text>
              <Text style={styles.cardProject}>Great job today!</Text>
            </View>
          </Card>
        )}

        {/* Today Section */}
        <SectionLabel
          label="TODAY"
          rightText={`${completedCount} / ${todayTasks.length}`}
        />

        {tasks.length === 0 ? (
          <EmptyState
            type="tasks"
            onAction={() => router.push('/add-task')}
            style={{ paddingVertical: spacing[20] }}
          />
        ) : (
          <>
            <View style={styles.tasksList}>
              {todayTasks.map((task) => (
                <View key={task.id} style={styles.taskRow}>
                  <Pressable
                    style={[
                      styles.checkbox,
                      task.completed && styles.checkboxCompleted,
                    ]}
                    onPress={() => toggleTask(task.id)}
                  >
                    {task.completed && <Check size={12} color={colors.bg} strokeWidth={3} />}
                  </Pressable>

                  <Pressable
                    style={styles.taskTitleArea}
                    onPress={() => {
                      startFocus(task.id);
                      router.push(`/focus/${task.id}`);
                    }}
                  >
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted,
                      ]}
                    >
                      {task.title}
                    </Text>
                  </Pressable>

                  <Text style={styles.taskProjectTag}>{task.projectName}</Text>
                </View>
              ))}
            </View>

            {/* Add task button */}
            <Pressable
              style={({ pressed }) => [
                styles.addTaskButton,
                pressed && { backgroundColor: colors.surfaceRaised },
              ]}
              onPress={() => router.push('/add-task')}
            >
              <Plus size={14} color={colors.textSecondary} />
              <Text style={styles.addTaskText}>Add task</Text>
            </Pressable>
          </>
        )}

        {/* Bottom AI Assistant bar */}
        <Pressable
          style={({ pressed }) => [
            styles.catChatTrigger,
            pressed && { backgroundColor: colors.surfaceRaised },
          ]}
          onPress={() => router.push('/modal/recommendation')}
        >
          <View style={styles.catTriggerLeft}>
            <Sparkles size={14} color={colors.accent} />
            <Text style={styles.catTriggerText}>What should I work on?</Text>
          </View>
          <ChevronRight size={14} color={colors.textMuted} />
        </Pressable>
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
    paddingBottom: spacing[24],
  },
  dateRow: {
    paddingVertical: spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  syncText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing[8],
    marginBottom: spacing[20],
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingLight: {
    fontSize: typography.fontSize.displaySm,
    fontWeight: '300',
    color: colors.text,
  },
  greetingBold: {
    fontSize: typography.fontSize.displaySm,
    fontWeight: '700',
    color: colors.accent,
    marginTop: spacing[2],
  },
  greetingSub: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing[6],
  },
  catWrapper: {
    alignItems: 'flex-end',
    position: 'relative',
  },
  speechBubble: {
    position: 'absolute',
    top: -12,
    right: 0,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: '600',
  },
  cardContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing[24],
  },
  cardContent: {
    flex: 1,
    padding: spacing[16],
  },
  doThisNowLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1.5,
    marginBottom: spacing[4],
  },
  cardTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    lineHeight: typography.lineHeight.base,
  },
  cardProject: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing[2],
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[12],
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
  cardActionRow: {
    alignItems: 'flex-end',
    marginTop: spacing[16],
  },
  tasksList: {
    borderTopWidth: 1,
    borderTopColor: colors.surfaceHighlight,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHighlight,
    gap: spacing[12],
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.accentGreen,
    borderColor: colors.accentGreen,
  },
  taskTitleArea: {
    flex: 1,
  },
  taskTitle: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  taskProjectTag: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    paddingVertical: spacing[10],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginTop: spacing[12],
  },
  addTaskText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  catChatTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: spacing[14],
    paddingVertical: spacing[12],
    marginTop: spacing[24],
  },
  catTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  catTriggerText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
});
