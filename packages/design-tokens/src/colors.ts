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

export type ColorKey = keyof typeof colors;
