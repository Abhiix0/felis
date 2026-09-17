import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { X, ArrowRight, Clock, Sparkles } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { CatIllustration } from '../../src/components/CatIllustration';

export default function RecommendationModal() {
  const router = useRouter();
  const { recommendation, startFocus } = useApp();

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerLeft}>
            <Sparkles size={16} color="#F06A3A" />
            <Text style={styles.headerTitle}>What should I work on?</Text>
          </View>
          <Pressable onPress={() => router.back()}>
            <X size={18} color="#6F6D67" />
          </Pressable>
        </View>

        {/* Cat */}
        <View style={styles.catArea}>
          <CatIllustration pose="recommendation" size={72} />
          <Text style={styles.catDialogue}>
            "Based on your deadlines and focus history, here is the best place to jump in:"
          </Text>
        </View>

        {/* Recommendation Card */}
        <View style={styles.recCard}>
          <Text style={styles.recProject}>{recommendation.projectName}</Text>
          <Text style={styles.recTitle}>{recommendation.title}</Text>

          <View style={styles.bulletsList}>
            {recommendation.reasonBullets.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>·</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>

          <View style={styles.metaRow}>
            <Clock size={12} color="#A09E97" />
            <Text style={styles.metaText}>~{recommendation.estimatedMinutes} minutes</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
            <Text style={styles.secondaryBtnText}>Later</Text>
          </Pressable>
          <Pressable
            style={styles.primaryBtn}
            onPress={() => {
              startFocus(recommendation.taskId);
              router.back();
              router.push(`/focus/${recommendation.taskId}`);
            }}
          >
            <Text style={styles.primaryBtnText}>Start Now</Text>
            <ArrowRight size={14} color="#0D0D0C" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#141413',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: '#292925',
    borderWidth: 1,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#F06A3A',
    fontWeight: '700',
    letterSpacing: 1,
  },
  catArea: {
    alignItems: 'center',
    gap: 8,
    marginVertical: 12,
  },
  catDialogue: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#A09E97',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  recCard: {
    backgroundColor: '#0D0D0C',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  recProject: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#F06A3A',
    fontWeight: '600',
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1EFE8',
    marginTop: 4,
  },
  bulletsList: {
    marginTop: 10,
    gap: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bulletDot: {
    color: '#F06A3A',
    fontWeight: '700',
  },
  bulletText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#6F6D67',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  metaText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#A09E97',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  secondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#292925',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#A09E97',
  },
  primaryBtn: {
    flex: 2,
    backgroundColor: '#F06A3A',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primaryBtnText: {
    color: '#0D0D0C',
    fontSize: 12,
    fontWeight: '700',
  },
});
