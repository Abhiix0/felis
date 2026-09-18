import type { Priority } from '@felis/types';

export interface ParsedTaskInput {
  title: string;
  projectId?: string;
  projectName?: string;
  priority?: Priority;
  dueDate?: string;
  dueLabel?: string;
  dueDateLabel?: string;
  estimateMinutes?: number;
  estimatedMinutes?: number;
  isUncertain?: boolean;
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

export function parseQuickAddInput(
  text: string,
  projects: { id: string; name: string }[] = []
): ParsedTaskInput {
  const trimmed = text.trim();
  if (!trimmed) {
    return { title: '' };
  }

  let projectId: string | undefined;
  let projectName: string | undefined;
  let priority: Priority | undefined;
  let dueLabel: string | undefined;
  let dueDate: string | undefined;
  let estimatedMinutes: number | undefined;

  const lower = trimmed.toLowerCase();

  // 1. Project matching
  for (const project of projects) {
    const projLower = project.name.toLowerCase();
    const hashRegex = new RegExp(`#${projLower}\\b`, 'i');
    const wordRegex = new RegExp(`\\b${projLower}\\b`, 'i');
    if (hashRegex.test(trimmed) || wordRegex.test(trimmed)) {
      projectId = project.id;
      projectName = project.name;
      break;
    }
  }

  if (!projectId) {
    for (const project of projects) {
      if (project.name.length >= 3 && lower.includes(project.name.toLowerCase())) {
        projectId = project.id;
        projectName = project.name;
        break;
      }
    }
  }

  // 2. Priority matching
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

  // 3. Duration matching
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

  // 4. Due date matching
  const now = new Date();
  if (/\btoday\b/i.test(trimmed)) {
    dueLabel = 'Today';
    dueDate = now.toISOString().split('T')[0];
  } else if (/\btomorrow\b/i.test(trimmed)) {
    dueLabel = 'Tomorrow';
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dueDate = tomorrow.toISOString().split('T')[0];
  } else {
    for (let i = 0; i < WEEKDAYS.length; i++) {
      const day = WEEKDAYS[i];
      const dayRegex = new RegExp(`\\b${day}\\b`, 'i');
      if (dayRegex.test(trimmed)) {
        dueLabel = day;
        const currentDayIndex = (now.getDay() + 6) % 7; // Monday = 0
        const targetDayIndex = i;
        let daysAhead = targetDayIndex - currentDayIndex;
        if (daysAhead <= 0) daysAhead += 7;
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + daysAhead);
        dueDate = targetDate.toISOString().split('T')[0];
        break;
      }
    }
  }

  // Clean title
  let cleanTitle = trimmed;
  cleanTitle = cleanTitle
    .replace(/,?\s*\b(high|medium|low)\s+priority\b/gi, '')
    .replace(/,?\s*\burgent\b/gi, '')
    .replace(/,?\s*!(high|medium|low)\b/gi, '')
    .replace(/,?\s*~?\d+(?:\.\d+)?\s*(?:h|hr|hrs|hours?|m|min|mins|minutes?)\b/gi, '')
    .replace(/,?\s*(?:(?:by|due)\s+)?(?:today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, '')
    .replace(/#\w+\b/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/^,\s*|,\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return {
    title: cleanTitle || trimmed,
    projectId,
    projectName,
    priority,
    dueDate,
    dueLabel,
    dueDateLabel: dueLabel,
    estimateMinutes: estimatedMinutes,
    estimatedMinutes,
  };
}
