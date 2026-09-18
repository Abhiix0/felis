import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { CatIllustration } from './CatIllustration';
import { PrimaryButton } from './ui/PrimaryButton';
import { colors, spacing, radius, typography } from '../theme/tokens';

export function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // DEV MODE: auto-sign-in as "Developer" if EXPO_PUBLIC_DEV_MODE=true
  useEffect(() => {
    if (process.env.EXPO_PUBLIC_DEV_MODE === 'true') {
      signIn('developer@felis.local', 'Developer');
    }
  }, [signIn]);

  const handleSignIn = async () => {
    const name = displayName.trim() || 'Developer';
    const userEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@felis.local`;
    setSubmitting(true);
    try {
      await signIn(userEmail, name);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <CatIllustration pose="idle" size={96} />

          <Text style={styles.title}>FELIS</Text>
          <Text style={styles.subtitle}>Opinionated Personal OS for Developers</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DISPLAY NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Developer"
                placeholderTextColor={colors.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL (OPTIONAL)</Text>
              <TextInput
                style={styles.input}
                placeholder="developer@felis.local"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <PrimaryButton
              label={submitting ? 'Signing in...' : 'Sign In'}
              onPress={handleSignIn}
              style={styles.button}
            />
          </View>
        </View>

        <Text style={styles.footer}>Local-First · Offline Capable · Self-Hosted</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing[24],
    justifyContent: 'space-between',
    paddingVertical: spacing[32],
  },
  content: {
    alignItems: 'center',
    marginTop: spacing[40],
  },
  title: {
    fontSize: typography.fontSize.display,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 2,
    marginTop: spacing[16],
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing[6],
    marginBottom: spacing[32],
  },
  form: {
    width: '100%',
    maxWidth: 320,
    gap: spacing[16],
  },
  inputGroup: {
    gap: spacing[6],
  },
  label: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing[14],
    paddingVertical: spacing[12],
    color: colors.text,
    fontSize: typography.fontSize.base,
  },
  button: {
    marginTop: spacing[12],
    width: '100%',
  },
  footer: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
