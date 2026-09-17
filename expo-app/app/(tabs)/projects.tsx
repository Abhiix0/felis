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
import { ProgressBar } from '../../src/components/ProgressBar';

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'terminal':
        return <Terminal size={18} color="#F06A3A" />;
      case 'database':
        return <Database size={18} color="#F1EFE8" />;
      case 'cloud':
        return <Cloud size={18} color="#F1EFE8" />;
      default:
        return <FileCode size={18} color="#F1EFE8" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Projects</Text>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.iconButton}
              onPress={() => setSearchOpen(!searchOpen)}
            >
              <Search size={18} color="#A09E97" />
            </Pressable>
          </View>
        </View>

        {/* Search input if open */}
        {searchOpen && (
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search projects..."
              placeholderTextColor="#6F6D67"
              value={searchText}
              onChangeText={setSearchText}
              style={styles.searchInput}
              autoFocus
            />
            {searchText ? (
              <Pressable onPress={() => setSearchText('')}>
                <X size={16} color="#6F6D67" />
              </Pressable>
            ) : null}
          </View>
        )}

        {/* Project Cards */}
        <View style={styles.projectsList}>
          {filtered.map((project) => (
            <Pressable
              key={project.id}
              style={({ pressed }) => [
                styles.projectCard,
                pressed && { borderColor: '#383832', backgroundColor: '#181817' },
              ]}
              onPress={() => router.push(`/project/${project.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.iconWrapper}>
                    {getIcon(project.iconType)}
                  </View>
                  <Text style={styles.projectName}>{project.name}</Text>
                </View>
                <MoreVertical size={16} color="#6F6D67" />
              </View>

              <Text style={styles.projectDesc}>{project.description}</Text>

              <View style={styles.statsRow}>
                <Text style={styles.statsText}>{project.totalTasks} tasks</Text>
                <Text style={styles.statsDivider}>|</Text>
                <Text style={styles.statsActive}>{project.activeTasks} active</Text>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressBarWrapper}>
                  <ProgressBar percent={project.progressPercent} height={6} />
                </View>
                <Text style={styles.progressPercentText}>{project.progressPercent}%</Text>
              </View>
            </Pressable>
          ))}
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
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F1EFE8',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F1EFE8',
    fontSize: 13,
    paddingVertical: 8,
  },
  projectsList: {
    gap: 14,
    marginTop: 12,
  },
  projectCard: {
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1D1D1A',
    borderColor: '#292925',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1EFE8',
  },
  projectDesc: {
    fontSize: 12,
    color: '#A09E97',
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  statsText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
  statsDivider: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#383832',
  },
  statsActive: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#A09E97',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  progressBarWrapper: {
    flex: 1,
  },
  progressPercentText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#A09E97',
    fontWeight: '600',
  },
});
