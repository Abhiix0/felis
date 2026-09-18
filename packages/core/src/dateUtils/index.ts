export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export function isOverdue(dueDateISO: string, nowMs = Date.now()): boolean {
  return new Date(dueDateISO).getTime() < nowMs;
}

export function isDueToday(dueDateISO: string, _nowMs = Date.now()): boolean {
  return dueDateISO === getTodayISO();
}

export function getDueDateLabel(dueDateISO: string, nowMs = Date.now()): string {
  const today = getTodayISO();
  const tomorrow = getTomorrowISO();
  if (dueDateISO < today) return 'Overdue';
  if (dueDateISO === today) return 'Today';
  if (dueDateISO === tomorrow) return 'Tomorrow';
  const d = new Date(dueDateISO);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const diffDays = Math.ceil((d.getTime() - nowMs) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) return days[d.getDay()];
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getTodayLabel(): string {
  const now = new Date();
  const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  const months = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}
