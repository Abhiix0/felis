import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Shield, Bell, Moon } from 'lucide-react-native';
import { CatIllustration } from '../../src/components/CatIllustration';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';
import { Card } from '../../src/components/ui';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <Card style={styles.userCard}>
          <View style={styles.avatar}>
            <User size={24} color={colors.accent} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Abhi</Text>
            <Text style={styles.userSub}>Developer · Spawn OS</Text>
          </View>
        </Card>

        <Card style={styles.menuSection}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Moon size={16} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Dark Notebook Mode</Text>
            </View>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Bell size={16} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Haptic & Audio Signals</Text>
            </View>
            <Text style={styles.activeText}>ON</Text>
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <Shield size={16} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Local-First Security</Text>
            </View>
            <Text style={styles.activeText}>OFFLINE</Text>
          </View>
        </Card>

        <View style={styles.catFooter}>
          <CatIllustration pose="completed" size={60} />
          <Text style={styles.footerNote}>Spawn Mobile · v1.0.0 (Expo SDK 52)</Text>
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
    paddingBottom: spacing[20],
  },
  header: {
    paddingVertical: spacing[12],
  },
  title: {
    fontSize: typography.fontSize.title,
    fontWeight: '700',
    color: colors.text,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[16],
    gap: spacing[14],
    marginTop: spacing[12],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.fab,
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.text,
  },
  userSub: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing[2],
  },
  menuSection: {
    marginTop: spacing[20],
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[14],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDivider,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
  },
  menuItemText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  activeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: '700',
  },
  catFooter: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: spacing[8],
    paddingTop: spacing[20],
  },
  footerNote: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
});
