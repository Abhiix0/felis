export const colors = {
  background: "#0D0D0C",
  surface: "#141413",
  surfaceElevated: "#181817",
  surfaceSubtle: "#111110",

  textPrimary: "#F1EFE8",
  textSecondary: "#A09E97",
  textMuted: "#6F6D67",

  border: "#292925",
  borderSubtle: "#1D1D1A",

  notebookLine: "#171715",

  accent: "#F06A3A",
  accentPressed: "#D9572D",

  success: "#B7D96B",
  successSubtle: "rgba(183, 217, 107, 0.15)",
  accentSubtle: "rgba(240, 106, 58, 0.12)",
  accentRail: "#F06A3A",
} as const;

export const spacing = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
} as const;

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
