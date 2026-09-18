import { describe, it, expect } from 'vitest';
import { parseQuickAddInput } from '@felis/core';
import type { Project } from '@felis/types';

describe('Task Quick-Add Parsing (Mobile Integration)', () => {
  const mockProjects: Project[] = [
    {
      id: 'proj-felis',
      name: 'felis',
      iconType: 'terminal',
      status: 'active',
    },
    {
      id: 'proj-spawn',
      name: 'Spawn',
      iconType: 'terminal',
      status: 'active',
    },
  ];

  it('Fix auth bug tomorrow 30m !high → title, dueLabel, priority, estimate', () => {
    const result = parseQuickAddInput('Fix auth bug tomorrow 30m !high', mockProjects);
    expect(result.title).toBe('Fix auth bug');
    expect(result.dueDateLabel?.toLowerCase()).toBe('tomorrow');
    expect(result.priority).toBe('high');
    expect(result.estimateMinutes).toBe(30);
  });

  it('#felis → projectId resolved from projects list', () => {
    const result = parseQuickAddInput('Implement sync engine #felis', mockProjects);
    expect(result.title).toBe('Implement sync engine');
    expect(result.projectId).toBe('proj-felis');
    expect(result.projectName).toBe('felis');
  });

  it('Do something → title="Do something", no other fields set', () => {
    const result = parseQuickAddInput('Do something', mockProjects);
    expect(result.title).toBe('Do something');
    expect(result.priority).toBeUndefined();
    expect(result.dueDateLabel).toBeUndefined();
    expect(result.estimateMinutes).toBeUndefined();
    expect(result.projectId).toBeUndefined();
  });

  it('Empty string → empty title', () => {
    const result = parseQuickAddInput('', mockProjects);
    expect(result.title).toBe('');
  });
});
