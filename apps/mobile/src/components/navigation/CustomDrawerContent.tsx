import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import {
  Terminal,
  X,
  Home,
  FolderClosed,
  Radio,
  User,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import { CatIllustration } from '../CatIllustration';
import { colors, spacing, radius, typography } from '../../theme/tokens';
import { useDrawer } from '../../context/DrawerContext';

export const CustomDrawerContent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { closeDrawer } = useDrawer();

  const isHomeActive = pathname === '/' || pathname === '/(tabs)' || pathname === '';
  const isProjectsActive = pathname.includes('projects');
  const isRadarActive = pathname.includes('radar');
  const isProfileActive = pathname.includes('profile');

  const handleNav = (route: '/' | '/projects' | '/radar' | '/profile') => {
    closeDrawer();
    router.navigate(route);
  };

  const handleRecommendation = () => {
    closeDrawer();
    router.push('/modal/recommendation');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left']}>
      {/* Top section */}
      <View style={styles.topSection}>
        {/* User profile header */}
        <View style={styles.userHeader}>
          <View style={styles.userProfile}>
            <View style={styles.avatarBox}>
              <Terminal size={20} color={colors.accent} />
            </View>
            <View style={styles.userTexts}>
              <Text style={styles.userName}>Abhi</Text>
              <Text style={styles.userSubtitle}>Personal OS</Text>
            </View>
          </View>

          <Pressable
            onPress={closeDrawer}
            style={({ pressed }) => [
              styles.closeButton,
              pressed && styles.buttonPressed,
            ]}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityLabel="Close navigation"
          >
            <X size={20} color={colors.textMuted} />
          </Pressable>
        </View>

        {/* Navigation list */}
        <View style={styles.navList}>
          <Pressable
            onPress={() => handleNav('/')}
            style={({ pressed }) => [
              styles.navItem,
              isHomeActive && styles.navItemActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <Home
              size={18}
              color={isHomeActive ? colors.accent : colors.textSecondary}
              strokeWidth={isHomeActive ? 2.2 : 2}
            />
            <Text
              style={[
                styles.navText,
                isHomeActive && styles.navTextActive,
              ]}
            >
              Home
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleNav('/projects')}
            style={({ pressed }) => [
              styles.navItem,
              isProjectsActive && styles.navItemActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <FolderClosed
              size={18}
              color={isProjectsActive ? colors.accent : colors.textSecondary}
              strokeWidth={isProjectsActive ? 2.2 : 2}
            />
            <Text
              style={[
                styles.navText,
                isProjectsActive && styles.navTextActive,
              ]}
            >
              Projects
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleNav('/radar')}
            style={({ pressed }) => [
              styles.navItem,
              isRadarActive && styles.navItemActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <Radio
              size={18}
              color={isRadarActive ? colors.accent : colors.textSecondary}
              strokeWidth={isRadarActive ? 2.2 : 2}
            />
            <Text
              style={[
                styles.navText,
                isRadarActive && styles.navTextActive,
              ]}
            >
              Radar
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleNav('/profile')}
            style={({ pressed }) => [
              styles.navItem,
              isProfileActive && styles.navItemActive,
              pressed && styles.buttonPressed,
            ]}
          >
            <User
              size={18}
              color={isProfileActive ? colors.accent : colors.textSecondary}
              strokeWidth={isProfileActive ? 2.2 : 2}
            />
            <Text
              style={[
                styles.navText,
                isProfileActive && styles.navTextActive,
              ]}
            >
              Profile
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Middle: Doodle note & sitting cat */}
      <View style={styles.middleSection}>
        <Text style={styles.doodleText}>Small steps.{"\n"}Big things.</Text>
        <View style={styles.catWrapper}>
          <CatIllustration
            pose="idle"
            size={74}
            interactive
            onTap={handleRecommendation}
          />
        </View>
      </View>

      {/* Bottom command entry */}
      <View style={styles.bottomSection}>
        <Pressable
          onPress={handleRecommendation}
          style={({ pressed }) => [
            styles.chatTrigger,
            pressed && styles.chatTriggerPressed,
          ]}
        >
          <View style={styles.chatTriggerLeft}>
            <Sparkles size={14} color={colors.accent} />
            <Text style={styles.chatTriggerText}>What should I work on?</Text>
          </View>
          <View style={styles.dotIndicator} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
    paddingHorizontal: spacing[20],
    paddingVertical: spacing[16],
  },
  topSection: {
    paddingTop: spacing[8],
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing[24],
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTexts: {
    gap: spacing[2],
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  userSubtitle: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  closeButton: {
    padding: spacing[8],
    borderRadius: radius.md,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  navList: {
    gap: spacing[8],
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[12],
    paddingHorizontal: spacing[14],
    paddingVertical: spacing[12],
    borderRadius: radius.lg,
  },
  navItemActive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  navTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  middleSection: {
    marginVertical: 'auto',
    paddingLeft: spacing[8],
    paddingVertical: spacing[20],
  },
  doodleText: {
    fontSize: 24,
    color: colors.text,
    opacity: 0.85,
    lineHeight: 32,
    fontWeight: '300',
    marginBottom: spacing[12],
  },
  catWrapper: {
    paddingLeft: spacing[12],
  },
  bottomSection: {
    paddingBottom: spacing[8],
  },
  chatTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[14],
    paddingVertical: spacing[12],
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  chatTriggerPressed: {
    backgroundColor: colors.surfaceHighlight,
    borderColor: colors.borderSubtle,
  },
  chatTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[10],
  },
  chatTriggerText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.text,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
});
