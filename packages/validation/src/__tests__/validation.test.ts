import { describe, it, expect } from 'vitest';
import { CreateTaskSchema, UpdateTaskSchema } from '../task';
import { CreateProjectSchema } from '../project';

describe('Validation Schemas', () => {
  it('validates task creation input', () => {
    const valid = CreateTaskSchema.safeParse({
      title: 'Valid task title',
      priority: 'high',
      estimateMinutes: 30,
    });
    expect(valid.success).toBe(true);

    const invalid = CreateTaskSchema.safeParse({
      title: '', // empty title
    });
    expect(invalid.success).toBe(false);
  });

  it('validates project creation input', () => {
    const valid = CreateProjectSchema.safeParse({
      name: 'My Project',
      techStack: ['TypeScript', 'FastAPI'],
    });
    expect(valid.success).toBe(true);

    const invalid = CreateProjectSchema.safeParse({
      name: '',
    });
    expect(invalid.success).toBe(false);
  });
});
