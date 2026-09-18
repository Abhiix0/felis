import type { Project } from '../types';

export interface ParsedTaskInput {
  title: string;
  projectName?: string;
  priority?: 'low' | 'medium' | 'high';
  dueLabel?: string;
  estimatedMinutes?: number;
}

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Pure, deterministic rule-based parser for quick-add task input.
 * Extracts title, project, priority, due date, and estimated duration.
 */
export function parseQuickAddInput(
  text: string,
  projects: Project[] = []
): ParsedTaskInput {
  const trimmed = text.trim();
  if (!trimmed) {
    return { title: '' };
  }

  let projectName: string | undefined;
  let priority: 'low' | 'medium' | 'high' | undefined;
  let dueLabel: string | undefined;
  let estimatedMinutes: number | undefined;

  const lower = trimmed.toLowerCase();

  // 1. Project matching: match against existing project names (case-insensitive)
  // Give precedence to exact project name or hashtag #project
  for (const project of projects) {
    const projLower = project.name.toLowerCase();
    const hashRegex = new RegExp(`#${projLower}\\b`, 'i');
    const wordRegex = new RegExp(`\\b${projLower}\\b`, 'i');
    if (hashRegex.test(trimmed) || wordRegex.test(trimmed)) {
      projectName = project.name;
      break;
    }
  }
  // Substring match fallback for project names >= 3 chars
  if (!projectName) {
    for (const project of projects) {
      if (project.name.length >= 3 && lower.includes(project.name.toLowerCase())) {
        projectName = project.name;
        break;
      }
    }
  }

  // 2. Priority matching:
  // "high priority", "urgent", "!high", "priority: high"
  // "low priority", "!low", "priority: low"
  // "medium priority", "!medium", "priority: medium"
  if (
    /\bhigh priority\b/i.test(trimmed) ||
    /\burgent\b/i.test(trimmed) ||
    /!high\b/i.test(trimmed) ||
    /\bpriority\s*:\s*high\b/i.test(trimmed)
  ) {
    priority = 'high';
  } else if (
    /\blow priority\b/i.test(trimmed) ||
    /!low\b/i.test(trimmed) ||
    /\bpriority\s*:\s*low\b/i.test(trimmed)
  ) {
    priority = 'low';
  } else if (
    /\bmedium priority\b/i.test(trimmed) ||
    /!medium\b/i.test(trimmed) ||
    /\bpriority\s*:\s*medium\b/i.test(trimmed)
  ) {
    priority = 'medium';
  }

  // 3. Duration matching:
  // Patterns like "30 min", "30 mins", "45m", "1h", "2 hours", "~30m"
  const hoursMatch = trimmed.match(/~?\b(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hours?)\b/i);
  const minsMatch = trimmed.match(/~?\b(\d+)\s*(?:m|min|mins|minutes?)\b/i);

  if (hoursMatch) {
    const hrs = parseFloat(hoursMatch[1]);
    let mins = Math.round(hrs * 60);
    if (minsMatch) {
      mins += parseInt(minsMatch[1], 10);
    }
    estimatedMinutes = mins;
  } else if (minsMatch) {
    estimatedMinutes = parseInt(minsMatch[1], 10);
  }

  // 4. Due date matching:
  // "today", "tomorrow", weekday names ("Monday", "Tuesday", etc.)
  if (/\btoday\b/i.test(trimmed)) {
    dueLabel = 'Today';
  } else if (/\btomorrow\b/i.test(trimmed)) {
    dueLabel = 'Tomorrow';
  } else {
    for (const day of WEEKDAYS) {
      const dayRegex = new RegExp(`\\b${day}\\b`, 'i');
      if (dayRegex.test(trimmed)) {
        dueLabel = day;
        break;
      }
    }
  }

  // Clean title by removing extracted metadata tokens
  let cleanTitle = trimmed;
  cleanTitle = cleanTitle
    .replace(/,?\s*\b(high|medium|low)\s+priority\b/gi, '')
    .replace(/,?\s*\burgent\b/gi, '')
    .replace(/,?\s*!(high|medium|low)\b/gi, '')
    .replace(/,?\s*~?\d+(?:\.\d+)?\s*(?:h|hr|hrs|hours?|m|min|mins|minutes?)\b/gi, '')
    .replace(/,?\s*(?:by|due)\s+(?:today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
    .replace(/#\w+\b/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/^,\s*|,\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return {
    title: cleanTitle || trimmed,
    projectName,
    priority,
    dueLabel,
    estimatedMinutes,
  };
}
