import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X, Sparkles, FolderClosed, Clock, Flag, Calendar } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';
import { parseQuickAddInput } from '../src/domain/taskParsing';
import { colors, spacing, radius, typography } from '../src/theme/tokens';
import { Chip } from '../src/components/ui';

export default function AddTaskScreen() {
  const router = useRouter();
  const { createTask, projects } = useApp();

  const [input, setInput] = useState('');
  const [manualProject, setManualProject] = useState<string | null>(null);
  const [manualPriority, setManualPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [manualEstMinutes, setManualEstMinutes] = useState<number | null>(null);

  const parsed = useMemo(() => parseQuickAddInput(input, projects), [input, projects]);

  const effectiveProject = manualProject || parsed.projectName || projects[0]?.name || 'Spawn';
  const effectivePriority = manualPriority || parsed.priority || 'medium';
  const effectiveEstMinutes = manualEstMinutes || parsed.estimatedMinutes || 30;
  const effectiveDueLabel = parsed.dueLabel || 'Due soon';

  const hasDetectedTags = Boolean(
    parsed.projectName || parsed.dueLabel || parsed.estimatedMinutes || parsed.priority
  );

  const handleInputChange = (text: string) => {
    setInput(text);
    const nextParsed = parseQuickAddInput(text, projects);
    if (nextParsed.projectName) setManualProject(null);
    if (nextParsed.priority) setManualPriority(null);
    if (nextParsed.estimatedMinutes) setManualEstMinutes(null);
  };

  const handleSave = () => {
    if (!input.trim()) return;
    const taskTitle = parsed.title || input.trim();
    createTask(
      taskTitle,
      effectiveProject,
      effectivePriority,
      effectiveDueLabel,
      effectiveEstMinutes
    );
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <X size={20} color={colors.textMuted} />
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
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={handleInputChange}
          style={styles.textInput}
          multiline
          autoFocus
        />

        {/* AI Natural language tips / Parsed preview */}
        {input.trim().length === 0 ? (
          <View style={styles.aiTip}>
            <Sparkles size={14} color={colors.accent} />
            <Text style={styles.aiTipText}>
              Tip: Type project, estimate, or urgency directly in the box.
            </Text>
          </View>
        ) : (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Sparkles size={13} color={colors.accent} />
              <Text style={styles.previewHeaderText}>AI understands it.</Text>
            </View>

            {hasDetectedTags ? (
              <View style={styles.previewTags}>
                {parsed.projectName && (
                  <View style={styles.previewRow}>
                    <FolderClosed size={13} color={colors.textMuted} />
                    <Text style={styles.previewText}>{parsed.projectName}</Text>
                  </View>
                )}

                {parsed.dueLabel && (
                  <View style={styles.previewRow}>
                    <Calendar size={13} color={colors.textMuted} />
                    <Text style={styles.previewText}>{parsed.dueLabel}</Text>
                  </View>
                )}

                {parsed.estimatedMinutes && (
                  <View style={styles.previewRow}>
                    <Clock size={13} color={colors.textMuted} />
                    <Text style={styles.previewText}>~{parsed.estimatedMinutes} min</Text>
                  </View>
                )}

                {parsed.priority && (
                  <View style={styles.previewRow}>
                    <Flag size={13} color={colors.accent} />
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityBadgeText}>
                        {parsed.priority} priority
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.noTagsText}>
                No tags detected yet. Type a project name, due date, estimate, or priority.
              </Text>
            )}
          </View>
        )}

        {/* Options */}
        <View style={styles.optionsList}>
          {/* Project select */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <FolderClosed size={16} color={colors.textSecondary} />
              <Text style={styles.optionText}>Project</Text>
            </View>
            <View style={styles.pillsRow}>
              {projects.map((p) => (
                <Chip
                  key={p.id}
                  label={p.name}
                  active={effectiveProject === p.name}
                  style={styles.pill}
                  textStyle={styles.pillText}
                  onPress={() => setManualProject(p.name)}
                />
              ))}
            </View>
          </View>

          {/* Priority */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Flag size={16} color={colors.textSecondary} />
              <Text style={styles.optionText}>Priority</Text>
            </View>
            <View style={styles.pillsRow}>
              {(['low', 'medium', 'high'] as const).map((pr) => (
                <Chip
                  key={pr}
                  label={pr}
                  active={effectivePriority === pr}
                  style={styles.pill}
                  textStyle={styles.pillText}
                  onPress={() => setManualPriority(pr)}
                />
              ))}
            </View>
          </View>

          {/* Duration */}
          <View style={styles.optionRow}>
            <View style={styles.optionLabel}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.optionText}>Estimate</Text>
            </View>
            <View style={styles.pillsRow}>
              {[15, 30, 45, 60].map((m) => (
                <Chip
                  key={m}
                  label={`${m}m`}
                  active={effectiveEstMinutes === m}
                  style={styles.pill}
                  textStyle={styles.pillText}
                  onPress={() => setManualEstMinutes(m)}
                />
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
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing[20],
    paddingTop: spacing[8],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[12],
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing[14],
    paddingVertical: spacing[6],
    borderRadius: radius.md,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    color: colors.bg,
    fontSize: typography.fontSize.base,
    fontWeight: '700',
  },
  textInput: {
    color: colors.text,
    fontSize: typography.fontSize.xxl,
    minHeight: 80,
    marginTop: spacing[16],
    textAlignVertical: 'top',
  },
  aiTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing[10],
    marginTop: spacing[12],
  },
  aiTipText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    flex: 1,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: spacing[14],
    marginTop: spacing[12],
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    marginBottom: spacing[10],
  },
  previewHeaderText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  previewTags: {
    gap: spacing[8],
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[10],
  },
  previewText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text,
  },
  priorityBadge: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[2],
    borderRadius: radius.xs,
    backgroundColor: 'rgba(240, 106, 58, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(240, 106, 58, 0.3)',
  },
  priorityBadgeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  noTagsText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
  optionsList: {
    marginTop: spacing[24],
    gap: spacing[16],
  },
  optionRow: {
    gap: spacing[8],
  },
  optionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  optionText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[8],
  },
  pill: {
    paddingHorizontal: spacing[10],
    paddingVertical: spacing[5],
    borderRadius: radius.md,
  },
  pillText: {
    color: colors.textMuted,
  },
});
