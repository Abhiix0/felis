import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Sparkles, FolderClosed, Clock, Flag } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';

export default function AddTaskScreen() {
  const router = useRouter();
  const { createTask, projects } = useApp();

  const [input, setInput] = useState('');
  const [selectedProject, setSelectedProject] = useState(projects[0]?.name || 'Spawn');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [estMinutes, setEstMinutes] = useState(30);

  const handleSave = () => {
    if (!input.trim()) return;
    createTask(input.trim(), selectedProject, priority, 'Due soon', estMinutes);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <X size={20} color="#6F6D67" />
          </Pressable>
          <Text style={styles.title}>New Task</Text>
          <Pressable
            style={[styles.saveBtn, !input.trim() && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!input.trim()}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
        </View>

        {/* Input */}
        <TextInput
          placeholder="What needs to get done? (e.g., Refactor API #spawn ~45m !high)"
          placeholderTextColor="#6F6D67"
          value={input}
          onChangeText={setInput}
          style={styles.textInput}
          multiline
          autoFocus
        />

        {/* AI Natural language tips */}
        <View style={styles.aiTip}>
          <Sparkles size={14} color="#F06A3A" />
          <Text style={styles.aiTipText}>
            Tip: Type project, estimate, or urgency directly in the box.
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {/* Project select */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <FolderClosed size={16} color="#A09E97" />
              <Text style={styles.optionText}>Project</Text>
            </View>
            <View style={styles.pillsRow}>
              {projects.map((p) => (
                <Pressable
                  key={p.id}
                  style={[
                    styles.pill,
                    selectedProject === p.name && styles.pillActive,
                  ]}
                  onPress={() => setSelectedProject(p.name)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      selectedProject === p.name && styles.pillTextActive,
                    ]}
                  >
                    {p.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Priority */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Flag size={16} color="#A09E97" />
              <Text style={styles.optionText}>Priority</Text>
            </View>
            <View style={styles.pillsRow}>
              {(['low', 'medium', 'high'] as const).map((pr) => (
                <Pressable
                  key={pr}
                  style={[styles.pill, priority === pr && styles.pillActive]}
                  onPress={() => setPriority(pr)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      priority === pr && styles.pillTextActive,
                    ]}
                  >
                    {pr}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Duration */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Clock size={16} color="#A09E97" />
              <Text style={styles.optionText}>Estimate</Text>
            </View>
            <View style={styles.pillsRow}>
              {[15, 30, 45, 60].map((m) => (
                <Pressable
                  key={m}
                  style={[styles.pill, estMinutes === m && styles.pillActive]}
                  onPress={() => setEstMinutes(m)}
                >
                  <Text
                    style={[
                      styles.pillText,
                      estMinutes === m && styles.pillTextActive,
                    ]}
                  >
                    {m}m
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
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
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1EFE8',
  },
  saveBtn: {
    backgroundColor: '#F06A3A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: '#0D0D0C',
    fontSize: 12,
    fontWeight: '700',
  },
  textInput: {
    color: '#F1EFE8',
    fontSize: 18,
    minHeight: 80,
    marginTop: 16,
    textAlignVertical: 'top',
  },
  aiTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  aiTipText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
    flex: 1,
  },
  optionsList: {
    marginTop: 24,
    gap: 16,
  },
  optionRow: {
    gap: 8,
  },
  optionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  optionText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#A09E97',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  pillActive: {
    backgroundColor: '#F06A3A',
    borderColor: '#F06A3A',
  },
  pillText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
  pillTextActive: {
    color: '#0D0D0C',
    fontWeight: '700',
  },
});
