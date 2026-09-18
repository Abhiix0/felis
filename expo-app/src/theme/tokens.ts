export const colors = {
  // Backgrounds
  bg: '#0D0D0C',
  surface: '#141413',
  surfaceRaised: '#181817',
  surfaceHighlight: '#1D1D1A',
  surfaceTrack: '#1F1F1C',

  // Borders
  border: '#292925',
  borderSubtle: '#383832',
  borderDivider: '#1D1D1A',

  // Typography
  text: '#F1EFE8',
  textSecondary: '#A09E97',
  textMuted: '#6F6D67',

  // Accents
  accent: '#F06A3A',
  accentGreen: '#B7D96B',

  // Overlays
  overlay: 'rgba(0,0,0,0.75)',
} as const;

export const spacing = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  32: 32,
  36: 36,
  40: 40,
} as const;

export const radius = {
  xs: 3,
  sm: 5,
  md: 6,
  lg: 8,
  xl: 10,
  card: 12,
  pill: 20,
  pillLg: 22,
  fab: 24,
  circle: 999,
} as const;

export const typography = {
  fontFamily: {
    mono: 'monospace',
    sans: undefined,
  },
  fontSize: {
    xs: 10,
    sm: 11,
    base: 12,
    md: 13,
    lg: 14,
    xl: 16,
    xxl: 18,
    title: 22,
    hero: 24,
    displaySm: 26,
    display: 42,
  },
  lineHeight: {
    sm: 18,
    base: 22,
  },
} as const;
