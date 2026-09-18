// Semantic color mappings by state
export const semanticColors = {
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
  // Priority
  priorityHigh: '#F06A3A',        // accent
  priorityMedium: '#F59E0B',
  priorityLow: '#6F6D67',         // textMuted
  // Status
  syncPending: '#F59E0B',
  syncFailed: '#EF4444',
  syncConflict: '#8B5CF6',
  syncSynced: '#B7D96B',          // accentGreen
} as const;
