import React from 'react';
import { Tabs } from 'expo-router';
import { Home, FolderClosed, Radio, User } from 'lucide-react-native';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function TabLayout() {
  return (
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
          tabBarIcon: ({ color, size }) => <Home color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color, size }) => <FolderClosed color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="radar"
        options={{
          title: 'Radar',
          tabBarIcon: ({ color, size }) => <Radio color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={20} />,
        }}
      />
    </Tabs>
  );
}
