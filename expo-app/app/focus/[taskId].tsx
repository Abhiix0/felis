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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Nav header */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color="#F1EFE8" />
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
            <RotateCcw size={18} color="#A09E97" />
          </Pressable>

          {focusSession.isRunning ? (
            <Pressable style={styles.primaryBtn} onPress={pauseFocus}>
              <Pause size={20} color="#0D0D0C" />
              <Text style={styles.primaryBtnText}>Pause</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primaryBtn} onPress={resumeFocus}>
              <Play size={20} color="#0D0D0C" />
              <Text style={styles.primaryBtnText}>Resume</Text>
            </Pressable>
          )}

          <Pressable style={styles.iconBtn} onPress={finishFocus}>
            <CheckCircle2 size={18} color="#B7D96B" />
          </Pressable>
        </View>

        {/* Subtasks */}
        <View style={styles.subtasksCard}>
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
        </View>

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
    backgroundColor: '#0D0D0C',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    alignItems: 'center',
  },
  errorText: {
    color: '#F1EFE8',
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 13,
    color: '#F1EFE8',
  },
  headerTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#6F6D67',
    letterSpacing: 1.5,
  },
  taskInfo: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  projectTag: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#F06A3A',
    letterSpacing: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1EFE8',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  timerWrapper: {
    marginVertical: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginVertical: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F06A3A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#0D0D0C',
    fontSize: 14,
    fontWeight: '700',
  },
  subtasksCard: {
    width: '100%',
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  subtasksHeader: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#6F6D67',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  subtaskBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#383832',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskBoxCompleted: {
    backgroundColor: '#B7D96B',
    borderColor: '#B7D96B',
  },
  checkMark: {
    fontSize: 10,
    color: '#0D0D0C',
    fontWeight: '700',
  },
  subtaskText: {
    fontSize: 13,
    color: '#F1EFE8',
  },
  subtaskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#6F6D67',
  },
  catCompanion: {
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  catEncouragement: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#A09E97',
  },
});
