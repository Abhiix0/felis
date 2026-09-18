import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Check, MoreVertical } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { getProjectStats } from '../../src/domain/projectSelectors';
import { ProgressBar } from '../../src/components/ProgressBar';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';
import { Card } from '../../src/components/ui';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { projects, tasks, toggleTask, startFocus } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'notes' | 'deploy'>('tasks');

  const project = projects.find((p) => p.id === id) || projects[0];
  const projectTasks = tasks.filter((t) => t.projectId === project?.id);
  const stats = project ? getProjectStats(project.id, tasks) : { totalTasks: 0, activeTasks: 0, completedTasks: 0, progressPercent: 0 };

  if (!project) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Project not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation bar */}
        <View style={styles.navBar}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.text} />
            <Text style={styles.backText}>Projects</Text>
          </Pressable>
          <MoreVertical size={18} color={colors.textMuted} />
        </View>

        {/* Title & Desc */}
        <View style={styles.header}>
          <Text style={styles.projectTitle}>{project.name}</Text>
          <Text style={styles.projectDesc}>{project.description}</Text>

          {/* Tech tags */}
          <View style={styles.tagRow}>
            {(project.stack || []).map((item, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>PROGRESS</Text>
            <Text style={styles.progressValue}>{stats.progressPercent}%</Text>
          </View>
          <ProgressBar percent={stats.progressPercent} height={spacing[6]} />
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>{stats.totalTasks} total</Text>
            <Text style={styles.statsText}>·</Text>
            <Text style={styles.statsText}>{stats.activeTasks} active</Text>
          </View>
        </Card>

        {/* Tabs */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabButton, activeTab === 'tasks' && styles.tabButtonActive]}
            onPress={() => setActiveTab('tasks')}
          >
            <Text style={[styles.tabText, activeTab === 'tasks' && styles.tabTextActive]}>
              Tasks
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'notes' && styles.tabButtonActive]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.tabTextActive]}>
              Notes
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'deploy' && styles.tabButtonActive]}
            onPress={() => setActiveTab('deploy')}
          >
            <Text style={[styles.tabText, activeTab === 'deploy' && styles.tabTextActive]}>
              Deploy
            </Text>
          </Pressable>
        </View>

        {/* Tasks View */}
        {activeTab === 'tasks' ? (
          <View style={styles.tasksSection}>
            {projectTasks.map((task) => (
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
                  style={styles.taskContent}
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
                  {task.dueDate ? (
                    <Text style={styles.taskDue}>{task.dueDate}</Text>
                  ) : null}
                </Pressable>
              </View>
            ))}

            <Pressable
              style={styles.addTaskBtn}
              onPress={() => router.push('/add-task')}
            >
              <Plus size={14} color={colors.textSecondary} />
              <Text style={styles.addTaskBtnText}>Add task</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Notes View */}
        {activeTab === 'notes' ? (
          <View style={styles.tabPlaceholder}>
            <Text style={styles.tabPlaceholderText}>
              Project documentation, architecture notes, and snippets live here.
            </Text>
          </View>
        ) : null}

        {/* Deploy View */}
        {activeTab === 'deploy' ? (
          <View style={styles.tabPlaceholder}>
            <Text style={styles.tabPlaceholderText}>
              CI/CD status and deployment triggers will show here.
            </Text>
          </View>
        ) : null}
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
  },
  errorText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing[40],
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[12],
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  backText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  header: {
    marginTop: spacing[8],
  },
  projectTitle: {
    fontSize: typography.fontSize.hero,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  projectDesc: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing[8],
    lineHeight: typography.lineHeight.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[6],
    marginTop: spacing[12],
  },
  tag: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[3],
  },
  tagText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  progressCard: {
    padding: spacing[16],
    marginTop: spacing[20],
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  progressLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 1.5,
  },
  progressValue: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
    marginTop: spacing[10],
  },
  statsText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDivider,
    marginTop: spacing[24],
  },
  tabButton: {
    paddingVertical: spacing[10],
    paddingHorizontal: spacing[16],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: colors.accent,
  },
  tabText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.accent,
    fontWeight: '700',
  },
  tasksSection: {
    marginTop: spacing[12],
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[12],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDivider,
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
  taskContent: {
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
  taskDue: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing[2],
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    paddingVertical: spacing[10],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginTop: spacing[16],
  },
  addTaskBtnText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  tabPlaceholder: {
    padding: spacing[24],
    alignItems: 'center',
  },
  tabPlaceholderText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
