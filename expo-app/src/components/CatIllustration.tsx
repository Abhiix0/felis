import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Ellipse, Circle, Line } from 'react-native-svg';
import { colors, spacing } from '../theme/tokens';

export type CatPose =
  | 'idle'
  | 'recommendation'
  | 'empty'
  | 'loading'
  | 'focus'
  | 'completed'
  | 'error'
  | 'peek'
  | 'purr';

interface CatIllustrationProps {
  pose?: CatPose;
  size?: number;
  interactive?: boolean;
  onTap?: () => void;
  color?: string;
  showCaption?: boolean;
  captionText?: string;
}

export const CatIllustration: React.FC<CatIllustrationProps> = ({
  pose = 'idle',
  size = 64,
  interactive = false,
  onTap,
  color = colors.accent,
  showCaption = false,
  captionText,
}) => {
  const renderSvg = () => {
    switch (pose) {
      case 'recommendation':
        return (
          <Svg width={size} height={size * 0.9} viewBox="0 0 80 72" fill="none">
            {/* Body */}
            <Path
              d="M 28 62 C 24 50 25 32 38 24 C 48 18 60 22 64 36 C 68 50 64 62 50 64 Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Head */}
            <Circle cx="36" cy="24" r="14" stroke={color} strokeWidth="2" />
            {/* Left ear */}
            <Path d="M 26 17 L 22 5 L 33 12" stroke={color} strokeWidth="2" strokeLinejoin="round" />
            {/* Right ear */}
            <Path d="M 39 12 L 48 6 L 46 18" stroke={color} strokeWidth="2" strokeLinejoin="round" />
            {/* Closed happy eyes */}
            <Path d="M 30 23 Q 33 26 36 23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M 39 23 Q 42 26 45 23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            {/* Whiskers */}
            <Line x1="18" y1="23" x2="27" y2="24" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
            <Line x1="19" y1="27" x2="28" y2="26" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
            <Line x1="44" y1="24" x2="53" y2="23" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
            {/* Raised Paw pointing */}
            <Path d="M 52 40 C 58 35 64 30 68 31 C 71 32 69 38 63 43" stroke={color} strokeWidth="2" strokeLinecap="round" />
            {/* Tail */}
            <Path d="M 28 62 C 18 63 12 55 14 46 C 15 42 19 43 18 47" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case 'focus':
        return (
          <Svg width={size} height={size * 0.9} viewBox="0 0 80 72" fill="none">
            <Ellipse cx="40" cy="46" rx="22" ry="16" stroke={color} strokeWidth="2" />
            <Circle cx="30" cy="30" r="13" stroke={color} strokeWidth="2" />
            <Path d="M 20 24 L 17 12 L 27 19" stroke={color} strokeWidth="2" />
            <Path d="M 33 19 L 42 13 L 39 24" stroke={color} strokeWidth="2" />
            {/* Glasses / Focus Goggles */}
            <Circle cx="26" cy="30" r="4.5" stroke={color} strokeWidth="1.5" />
            <Circle cx="35" cy="30" r="4.5" stroke={color} strokeWidth="1.5" />
            <Line x1="30.5" y1="30" x2="31.5" y2="30" stroke={color} strokeWidth="1.5" />
            {/* Whiskers */}
            <Line x1="15" y1="32" x2="22" y2="32" stroke={color} strokeWidth="1.2" />
            <Line x1="39" y1="32" x2="46" y2="32" stroke={color} strokeWidth="1.2" />
            {/* Laptop Screen outline */}
            <Path d="M 45 42 L 58 34 L 58 48 L 45 52 Z" stroke={color} strokeWidth="1.8" />
            <Line x1="42" y1="53" x2="58" y2="49" stroke={color} strokeWidth="2" />
          </Svg>
        );

      case 'empty':
        return (
          <Svg width={size} height={size * 0.75} viewBox="0 0 120 90" fill="none">
            {/* Closed notebook underneath */}
            <Path d="M 15 65 L 100 65 L 94 82 L 10 82 Z" stroke={colors.borderSubtle} strokeWidth="2" fill={colors.surface} />
            <Line x1="18" y1="71" x2="96" y2="71" stroke={colors.border} strokeWidth="1.5" />
            <Line x1="16" y1="76" x2="94" y2="76" stroke={colors.border} strokeWidth="1.5" />
            {/* Sleeping curled cat */}
            <Path
              d="M 30 65 C 28 44 45 35 62 35 C 78 35 88 46 86 65 C 84 68 32 68 30 65 Z"
              stroke={color}
              strokeWidth="2"
              fill={colors.bg}
            />
            {/* Ears tucked down */}
            <Path d="M 35 44 L 32 35 L 42 40" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
            <Path d="M 45 39 L 52 34 L 53 43" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
            {/* Sleeping closed eye line */}
            <Path d="M 38 49 Q 42 53 46 49" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            {/* Wrapped tail */}
            <Path d="M 85 64 C 88 56 82 50 75 52" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );

      case 'completed':
        return (
          <Svg width={size} height={size * 0.9} viewBox="0 0 80 72" fill="none">
            <Path
              d="M 28 62 C 24 50 25 32 38 24 C 48 18 60 22 64 36 C 68 50 64 62 50 64 Z"
              stroke={color}
              strokeWidth="2"
            />
            <Circle cx="36" cy="24" r="14" stroke={color} strokeWidth="2" />
            <Path d="M 26 17 L 22 5 L 33 12" stroke={color} strokeWidth="2" />
            <Path d="M 39 12 L 48 6 L 46 18" stroke={color} strokeWidth="2" />
            {/* Proud smile */}
            <Path d="M 32 23 Q 36 26 40 23" stroke={color} strokeWidth="1.8" />
            <Path d="M 34 29 Q 36 33 38 29" stroke={color} strokeWidth="1.8" />
            {/* Little heart */}
            <Path d="M 54 18 C 54 14 59 13 61 16 C 63 13 68 14 68 18 C 68 23 61 27 61 27 C 61 27 54 23 54 18 Z" stroke={colors.accent} fill={colors.accent} />
          </Svg>
        );

      default:
        // Idle
        return (
          <Svg width={size} height={size * 0.9} viewBox="0 0 80 72" fill="none">
            <Path
              d="M 28 64 C 24 52 26 34 38 26 C 48 20 60 24 64 38 C 68 52 64 64 50 66 Z"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Circle cx="38" cy="26" r="13" stroke={color} strokeWidth="2" />
            <Path d="M 29 19 L 26 8 L 36 14" stroke={color} strokeWidth="2" />
            <Path d="M 42 14 L 51 9 L 48 20" stroke={color} strokeWidth="2" />
            <Circle cx="34" cy="26" r="1.5" fill={color} />
            <Circle cx="43" cy="26" r="1.5" fill={color} />
            <Path d="M 36 31 Q 38 33 40 31" stroke={color} strokeWidth="1.5" />
            <Path d="M 64 56 C 72 58 74 46 68 44" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );
    }
  };

  const Content = (
    <View style={styles.container}>
      {showCaption && captionText && (
        <Text style={[styles.caption, { color }]}>{captionText}</Text>
      )}
      {renderSvg()}
    </View>
  );

  if (interactive && onTap) {
    return (
      <Pressable onPress={onTap} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
        {Content}
      </Pressable>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing[4],
    letterSpacing: 0.5,
  },
});
