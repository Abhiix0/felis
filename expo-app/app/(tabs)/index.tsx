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
import { CatIllustration } from '../../src/components/CatIllustration';
import { SignalRail } from '../../src/components/SignalRail';

export default function HomeScreen() {
  const router = useRouter();
  const { recommendation, tasks, toggleTask, startFocus } = useApp();

  const todayTasks = tasks.slice(0, 4);
  const completedCount = todayTasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header date */}
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>THURSDAY, 17 SEPTEMBER</Text>
        </View>

        {/* Greeting & Cat */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greetingLight}>Good morning,</Text>
            <Text style={styles.greetingBold}>Abhi</Text>
            <Text style={styles.greetingSub}>
              You have {todayTasks.length} things to work on today.
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
        <View style={styles.cardContainer}>
          <SignalRail color="#F06A3A" width={4} />

          <View style={styles.cardContent}>
            <Text style={styles.doThisNowLabel}>DO THIS NOW</Text>
            <Text style={styles.cardTitle}>{recommendation.title}</Text>
            <Text style={styles.cardProject}>{recommendation.projectName}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Clock size={12} color="#A09E97" />
                <Text style={styles.metaText}>~{recommendation.estimatedMinutes} min</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={12} color="#A09E97" />
                <Text style={styles.metaText}>{recommendation.dueDateLabel}</Text>
                <Text style={styles.metaText}>·</Text>
                <Text style={[styles.metaText, { color: '#F06A3A' }]}>High priority</Text>
              </View>
            </View>

            <View style={styles.cardActionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.startButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => {
                  startFocus(recommendation.taskId);
                  router.push(`/focus/${recommendation.taskId}`);
                }}
              >
                <Text style={styles.startButtonText}>Start</Text>
                <ArrowRight size={14} color="#0D0D0C" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Today Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>TODAY</Text>
          <Text style={styles.sectionCounter}>
            {completedCount} / {todayTasks.length}
          </Text>
        </View>

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
                {task.completed && <Check size={12} color="#0D0D0C" strokeWidth={3} />}
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
            pressed && { backgroundColor: '#181817' },
          ]}
          onPress={() => router.push('/add-task')}
        >
          <Plus size={14} color="#A09E97" />
          <Text style={styles.addTaskText}>Add task</Text>
        </Pressable>

        {/* Bottom AI Assistant bar */}
        <Pressable
          style={({ pressed }) => [
            styles.catChatTrigger,
            pressed && { backgroundColor: '#181817' },
          ]}
          onPress={() => router.push('/modal/recommendation')}
        >
          <View style={styles.catTriggerLeft}>
            <Sparkles size={14} color="#F06A3A" />
            <Text style={styles.catTriggerText}>What should I work on?</Text>
          </View>
          <ChevronRight size={14} color="#6F6D67" />
        </Pressable>
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
  dateRow: {
    paddingVertical: 4,
  },
  dateText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#A09E97',
    letterSpacing: 1.5,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 20,
  },
  greetingTextContainer: {
    flex: 1,
  },
  greetingLight: {
    fontSize: 26,
    fontWeight: '300',
    color: '#F1EFE8',
  },
  greetingBold: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F06A3A',
    marginTop: 2,
  },
  greetingSub: {
    fontSize: 12,
    color: '#A09E97',
    marginTop: 6,
  },
  catWrapper: {
    alignItems: 'flex-end',
    position: 'relative',
  },
  speechBubble: {
    position: 'absolute',
    top: -12,
    right: 0,
    fontSize: 11,
    color: '#F06A3A',
    fontWeight: '600',
  },
  cardContainer: {
    backgroundColor: '#181817',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 24,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  doThisNowLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    color: '#F06A3A',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1EFE8',
    lineHeight: 22,
  },
  cardProject: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#A09E97',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
  cardActionRow: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  startButton: {
    backgroundColor: '#F06A3A',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  startButtonText: {
    color: '#0D0D0C',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  sectionCounter: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
  tasksList: {
    borderTopWidth: 1,
    borderTopColor: '#1D1D1A',
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
  taskTitleArea: {
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
  taskProjectTag: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#292925',
    borderRadius: 8,
    marginTop: 12,
  },
  addTaskText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#A09E97',
  },
  catChatTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141413',
    borderWidth: 1,
    borderColor: '#292925',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 24,
  },
  catTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catTriggerText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#F1EFE8',
  },
});
