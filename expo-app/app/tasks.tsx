import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Check } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';
import { colors, spacing, radius, typography } from '../src/theme/tokens';
import { Chip } from '../src/components/ui';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, toggleTask, startFocus } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.text} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.title}>All Tasks</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <Chip
            label={`All (${tasks.length})`}
            active={filter === 'all'}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
            onPress={() => setFilter('all')}
          />
          <Chip
            label={`Active (${tasks.filter((t) => !t.completed).length})`}
            active={filter === 'active'}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
            onPress={() => setFilter('active')}
          />
          <Chip
            label={`Done (${tasks.filter((t) => t.completed).length})`}
            active={filter === 'completed'}
            style={styles.filterChip}
            textStyle={styles.filterChipText}
            onPress={() => setFilter('completed')}
          />
        </View>

        {/* Task list */}
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {filteredTasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
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
                <View style={styles.taskMeta}>
                  <Text style={styles.metaProject}>{task.projectName}</Text>
                  {task.dueDate && (
                    <>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.metaDue}>{task.dueDate}</Text>
                    </>
                  )}
                  {task.estimatedMinutes && (
                    <>
                      <Text style={styles.metaDot}>·</Text>
                      <Text style={styles.metaTime}>{task.estimatedMinutes}m</Text>
                    </>
                  )}
                </View>
              </Pressable>
            </View>
          ))}
        </ScrollView>

        {/* FAB */}
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/add-task')}
        >
          <Plus size={20} color={colors.bg} strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[20],
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing[8],
    marginVertical: spacing[12],
  },
  filterChip: {
    borderRadius: radius.md,
  },
  filterChipText: {
    color: colors.textMuted,
  },
  list: {
    flex: 1,
    marginTop: spacing[8],
  },
  taskItem: {
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
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginTop: spacing[3],
  },
  metaProject: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  metaDot: {
    fontSize: typography.fontSize.xs,
    color: colors.borderSubtle,
  },
  metaDue: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  metaTime: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: spacing[24],
    right: spacing[20],
    width: 48,
    height: 48,
    borderRadius: radius.fab,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
