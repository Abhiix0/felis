import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Radio } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';
import { Card, EmptyState } from '../../src/components/ui';

export default function RadarScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Radar</Text>
          <Radio size={18} color={colors.textMuted} />
        </View>

        <View style={styles.centerContent}>
          <EmptyState
            type="radar"
            title="Coming soon"
            description="Technology radar updates and intelligence will be available in Phase 10."
          />
        </View>

        <Card style={styles.signalStatus}>
          <Text style={styles.statusText}>Signal Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>Standby</Text>
          </View>
        </Card>
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
    paddingBottom: spacing[20],
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[12],
  },
  title: {
    fontSize: typography.fontSize.title,
    fontWeight: '700',
    color: colors.text,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signalStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[14],
  },
  statusText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[6],
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: radius.xs,
    backgroundColor: colors.accent,
  },
  statusBadgeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.base,
    color: colors.accent,
  },
});
