import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Shield, Bell, Moon, ChevronRight } from 'lucide-react-native';
import { CatIllustration } from '../../src/components/CatIllustration';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <User size={24} color="#F06A3A" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Abhi</Text>
            <Text style={styles.userSub}>Developer · Spawn OS</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Moon size={16} color="#A09E97" />
              <Text style={styles.menuItemText}>Dark Notebook Mode</Text>
            </View>
            <Text style={styles.activeText}>ACTIVE</Text>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Bell size={16} color="#A09E97" />
              <Text style={styles.menuItemText}>Haptic & Audio Signals</Text>
            </View>
            <Text style={styles.activeText}>ON</Text>
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Shield size={16} color="#A09E97" />
              <Text style={styles.menuItemText}>Local-First Security</Text>
            </View>
            <Text style={styles.activeText}>OFFLINE</Text>
          </View>
        </View>

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
    backgroundColor: '#0D0D0C',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F1EFE8',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 14,
    marginTop: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1D1D1A',
    borderColor: '#292925',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F1EFE8',
  },
  userSub: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1D1D1A',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 13,
    color: '#F1EFE8',
  },
  activeText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#F06A3A',
    fontWeight: '700',
  },
  catFooter: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: 8,
    paddingTop: 20,
  },
  footerNote: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
});
