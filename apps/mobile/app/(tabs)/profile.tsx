import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Shield, Bell, Moon, LogOut, RefreshCw, Database } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useApp } from '../../src/context/AppContext';
import { CatIllustration } from '../../src/components/CatIllustration';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';
import { Card, PrimaryButton } from '../../src/components/ui';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { syncStatus, resetDemoData } = useApp();

  const isDevMode = process.env.EXPO_PUBLIC_DEV_MODE === 'true' || __DEV__;

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          signOut();
        },
      },
    ]);
  };

  const handleResetDemoData = () => {
    Alert.alert('Reset Demo Data', 'This will reset all local tasks and projects to demo defaults.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          resetDemoData();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatar}>
            <User size={24} color={colors.accent} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.displayName || 'Developer'}</Text>
            <Text style={styles.userSub}>{user?.email || 'developer@felis.local'}</Text>
          </View>
        </Card>

        {/* Status & Settings Section */}
        <Card style={styles.menuSection}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <RefreshCw size={16} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Sync Status</Text>
            </View>
            <Text
              style={[
                styles.activeText,
                {
                  color:
                    syncStatus === 'synced'
                      ? colors.accentGreen
                      : syncStatus === 'failed'
                      ? colors.accent
                      : '#E5A93C',
                },
              ]}
            >
              {syncStatus.toUpperCase()}
            </Text>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Moon size={16} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Theme</Text>
            </View>
            <Text style={styles.activeText}>DARK NOTEBOOK</Text>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Bell size={16} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Haptic & Signals</Text>
            </View>
            <Text style={styles.activeText}>ENABLED</Text>
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <Shield size={16} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Storage</Text>
            </View>
            <Text style={styles.activeText}>LOCAL-FIRST SQLITE</Text>
          </View>
        </Card>

        {/* Dev Mode Actions */}
        {isDevMode && (
          <Pressable style={styles.resetButton} onPress={handleResetDemoData}>
            <Database size={16} color={colors.textMuted} />
            <Text style={styles.resetButtonText}>Reset to demo data</Text>
          </Pressable>
        )}

        {/* Sign Out Button */}
        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={16} color={colors.accent} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        {/* Footer */}
        <View style={styles.catFooter}>
          <CatIllustration pose="completed" size={56} />
          <Text style={styles.footerNote}>FELIS Mobile · v1.0.0 (Expo SDK 57)</Text>
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
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[8],
    marginTop: spacing[16],
    paddingVertical: spacing[12],
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  signOutText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.accent,
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[8],
    marginTop: spacing[16],
    paddingVertical: spacing[10],
  },
  resetButtonText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  catFooter: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: spacing[8],
    paddingTop: spacing[16],
  },
  footerNote: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
