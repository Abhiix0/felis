import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Plus, Terminal, Database, Cloud, FileCode, MoreVertical, X } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { getProjectStats } from '../../src/domain/projectSelectors';
import { ProgressBar } from '../../src/components/ProgressBar';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';
import { Card, EmptyState } from '../../src/components/ui';

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects, tasks } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchText.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'terminal':
        return <Terminal size={18} color={colors.accent} />;
      case 'database':
        return <Database size={18} color={colors.text} />;
      case 'cloud':
        return <Cloud size={18} color={colors.text} />;
      default:
        return <FileCode size={18} color={colors.text} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, projects.length === 0 && { flexGrow: 1 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Projects</Text>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.iconButton}
              onPress={() => setSearchOpen(!searchOpen)}
            >
              <Search size={18} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Search input if open */}
        {searchOpen && (
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search projects..."
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              autoFocus
            />
            {searchText ? (
              <Pressable onPress={() => setSearchText('')}>
                <X size={16} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>
        )}

        {/* Project Cards or Empty State */}
        {projects.length === 0 ? (
          <EmptyState
            type="projects"
            onAction={() => router.push('/add-task')}
          />
        ) : (
          <View style={styles.projectsList}>
            {filtered.map((project) => {
              const stats = getProjectStats(project.id, tasks);
              return (
                <Card
                  key={project.id}
                  style={styles.projectCard}
                  onPress={() => router.push(`/project/${project.id}`)}
                  pressedStyle={{ borderColor: colors.borderSubtle, backgroundColor: colors.surfaceRaised }}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={styles.iconWrapper}>
                        {getIcon(project.iconType)}
                      </View>
                      <Text style={styles.projectName}>{project.name}</Text>
                    </View>
                    <MoreVertical size={16} color={colors.textMuted} />
                  </View>

                  <Text style={styles.projectDesc}>{project.description}</Text>

                  <View style={styles.statsRow}>
                    <Text style={styles.statsText}>{stats.totalTasks} tasks</Text>
                    <Text style={styles.statsDivider}>|</Text>
                    <Text style={styles.statsActive}>{stats.activeTasks} active</Text>
                  </View>

                  <View style={styles.progressRow}>
                    <View style={styles.progressBarWrapper}>
                      <ProgressBar percent={stats.progressPercent} height={spacing[6]} />
                    </View>
                    <Text style={styles.progressPercentText}>{stats.progressPercent}%</Text>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[12],
  },
  headerTitle: {
    fontSize: typography.fontSize.title,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
  },
  iconButton: {
    padding: spacing[6],
    borderRadius: radius.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[12],
    marginVertical: spacing[8],
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.fontSize.md,
    paddingVertical: spacing[8],
  },
  projectsList: {
    gap: spacing[14],
    marginTop: spacing[12],
  },
  projectCard: {
    padding: spacing[16],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectName: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
  },
  projectDesc: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginTop: spacing[10],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[8],
    marginTop: spacing[12],
  },
  statsText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  statsDivider: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.borderSubtle,
  },
  statsActive: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    marginTop: spacing[12],
  },
  progressBarWrapper: {
    flex: 1,
  },
  progressPercentText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
