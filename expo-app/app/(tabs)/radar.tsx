import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Radio } from 'lucide-react-native';
import { CatIllustration } from '../../src/components/CatIllustration';

export default function RadarScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Radar</Text>
          <Radio size={18} color="#6F6D67" />
        </View>

        <View style={styles.centerContent}>
          <CatIllustration pose="idle" size={84} />
          <Text style={styles.radarLabel}>Radar</Text>
          <Text style={styles.radarSub}>
            Technology updates will appear here.
          </Text>
        </View>

        <View style={styles.signalStatus}>
          <Text style={styles.statusText}>Signal Status</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusBadgeText}>Listening</Text>
          </View>
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
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F1EFE8',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F1EFE8',
    marginTop: 16,
  },
  radarSub: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#A09E97',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 220,
  },
  signalStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#141413',
    borderColor: '#292925',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  statusText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#6F6D67',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#B7D96B',
  },
  statusBadgeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#B7D96B',
  },
});
