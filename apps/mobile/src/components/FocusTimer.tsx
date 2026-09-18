import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, spacing, typography } from '../theme/tokens';

interface FocusTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  size?: number;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  remainingSeconds,
  totalSeconds,
  isRunning,
  size = 220,
}) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Active progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.accent}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      <View style={styles.textContainer}>
        <Text style={styles.timeText}>{formattedTime}</Text>
        <Text style={styles.statusText}>
          {isRunning ? 'FOCUSING' : remainingSeconds === 0 ? 'COMPLETED' : 'PAUSED'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: spacing[16],
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.display,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1,
  },
  statusText: {
    fontFamily: typography.fontFamily.mono,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing[4],
    letterSpacing: 2,
  },
});
