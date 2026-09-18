import { colors, spacing } from '@felis/design-tokens';

export function injectCssVariables() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  Object.entries(spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, `${value}px`);
  });
}
