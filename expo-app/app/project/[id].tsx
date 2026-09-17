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
import { ProgressBar } from '../../src/components/ProgressBar';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { projects, tasks, toggleTask, startFocus } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'notes' | 'deploy'>('tasks');

  const project = projects.find((p) => p.id === id) || projects[0];
  const projectTasks = tasks.filter((t) => t.projectId === project?.id);

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
            <ArrowLeft size={18} color="#F1EFE8" />
            <Text style={styles.backText}>Projects</Text>
          </Pressable>
          <MoreVertical size={18} color="#6F6D67" />
        </View>

        {/* Title & Desc */}
        <View style={styles.header}>
          <Text style={styles.projectTitle}>{project.name}</Text>
          <Text style={styles.projectDesc}>{project.description}</Text>

          {/* Tech tags */}
          <View style={styles.tagRow}>
            {project.stack.map((item, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>PROGRESS</Text>
            <Text style={styles.progressValue}>{project.progressPercent}%</Text>
          </View>
          <ProgressBar percent={project.progressPercent} height={6} />
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>{project.totalTasks} total</Text>
            <Text style={styles.statsText}>·</Text>
            <Text style={styles.statsText}>{project.activeTasks} active</Text>
          </View>
        </View>

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
              <Plus size={14} color="#A09E97" />
              <Text style={styles.addTaskBtnText}>Add task</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.tabPlaceholder}>
            <Text style={styles.tabPlaceholderText}>
              {activeTab === 'notes' ? 'No notes yet. Add thoughts or commands.' : 'Production: healthy · Last check 12m ago'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0D0C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  errorText: {
    color: '#F1EFE8',
    textAlign: 'center',
    marginTop: 40,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 13,
    color: '#F1EFE8',
    fontWeight: '500',
  },
  header: {
    marginTop: 8,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F1EFE8',
  },
  projectDesc: {
    fontSize: 13,
    color: '#A09E97',
    marginTop: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#6F6D67',
  },
  progressCard: {
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#6F6D67',
    letterSpacing: 1.5,
  },
  progressValue: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#F06A3A',
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  statsText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1D1D1A',
    marginTop: 24,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#F06A3A',
  },
  tabText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#6F6D67',
  },
  tabTextActive: {
    color: '#F06A3A',
    fontWeight: '700',
  },
  tasksSection: {
    marginTop: 12,
  },
  taskRow: {
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
  taskDue: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#6F6D67',
    marginTop: 2,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#292925',
    borderRadius: 8,
    marginTop: 16,
  },
  addTaskBtnText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#A09E97',
  },
  tabPlaceholder: {
    padding: 24,
    alignItems: 'center',
  },
  tabPlaceholderText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#6F6D67',
    textAlign: 'center',
  },
});
