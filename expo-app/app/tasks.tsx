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
            <ArrowLeft size={18} color="#F1EFE8" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.title}>All Tasks</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterPill, filter === 'all' && styles.filterPillActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All ({tasks.length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterPill, filter === 'active' && styles.filterPillActive]}
            onPress={() => setFilter('active')}
          >
            <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
              Active ({tasks.filter((t) => !t.completed).length})
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterPill, filter === 'completed' && styles.filterPillActive]}
            onPress={() => setFilter('completed')}
          >
            <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>
              Done ({tasks.filter((t) => t.completed).length})
            </Text>
          </Pressable>
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
                {task.completed && <Check size={12} color="#0D0D0C" strokeWidth={3} />}
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
          <Plus size={20} color="#0D0D0C" strokeWidth={2.5} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0D0C',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 13,
    color: '#F1EFE8',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1EFE8',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
  },
  filterPillActive: {
    backgroundColor: '#F06A3A',
    borderColor: '#F06A3A',
  },
  filterText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
  filterTextActive: {
    color: '#0D0D0C',
    fontWeight: '700',
  },
  list: {
    flex: 1,
    marginTop: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1D1D1A',
    gap: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#383832',
    backgroundColor: '#141413',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#B7D96B',
    borderColor: '#B7D96B',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    color: '#F1EFE8',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6F6D67',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  metaProject: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#A09E97',
  },
  metaDot: {
    fontSize: 10,
    color: '#383832',
  },
  metaDue: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#6F6D67',
  },
  metaTime: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#6F6D67',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F06A3A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
