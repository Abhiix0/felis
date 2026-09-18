import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Tabs, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, FolderClosed, Radio, User, Menu } from 'lucide-react-native';
import { Drawer } from 'react-native-drawer-layout';
import { CustomDrawerContent } from '../../src/components/navigation/CustomDrawerContent';
import { DrawerContext } from '../../src/context/DrawerContext';
import { colors, spacing, radius, typography } from '../../src/theme/tokens';

export default function TabLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const isHome = pathname === '/' || pathname === '/(tabs)' || pathname === '';
  const isProfile = pathname.includes('profile');
  const showHamburger = isHome || isProfile;

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer, isOpen: drawerOpen }}>
      <Drawer
        open={drawerOpen}
        onOpen={openDrawer}
        onClose={closeDrawer}
        drawerType="front"
        drawerPosition="left"
        swipeEdgeWidth={48}
        drawerStyle={styles.drawerStyle}
        overlayStyle={styles.overlayStyle}
        renderDrawerContent={() => <CustomDrawerContent />}
      >
        <View style={styles.container}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: colors.bg,
                borderTopColor: colors.borderDivider,
                borderTopWidth: 1,
                height: 60,
                paddingBottom: spacing[8],
                paddingTop: spacing[8],
              },
              tabBarActiveTintColor: colors.accent,
              tabBarInactiveTintColor: colors.textMuted,
              tabBarLabelStyle: {
                fontFamily: typography.fontFamily.mono,
                fontSize: typography.fontSize.xs,
                fontWeight: '600',
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color }) => <Home color={color} size={20} />,
              }}
            />
            <Tabs.Screen
              name="projects"
              options={{
                title: 'Projects',
                tabBarIcon: ({ color }) => <FolderClosed color={color} size={20} />,
              }}
            />
            <Tabs.Screen
              name="radar"
              options={{
                title: 'Radar',
                tabBarIcon: ({ color }) => <Radio color={color} size={20} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                tabBarIcon: ({ color }) => <User color={color} size={20} />,
              }}
            />
          </Tabs>

          {/* Hamburger affordance on relevant screens in the navigation chrome */}
          {showHamburger && (
            <Pressable
              onPress={openDrawer}
              style={({ pressed }) => [
                styles.hamburgerButton,
                { top: insets.top + (isHome ? 10 : 8) },
                pressed && styles.hamburgerPressed,
              ]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityLabel="Open navigation menu"
            >
              <Menu size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </Drawer>
    </DrawerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  drawerStyle: {
    backgroundColor: colors.bg,
    width: 310,
  },
  overlayStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  hamburgerButton: {
    position: 'absolute',
    right: spacing[20],
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 4,
  },
  hamburgerPressed: {
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.borderSubtle,
  },
});
