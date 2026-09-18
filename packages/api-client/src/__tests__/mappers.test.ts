import { describe, it, expect } from 'vitest';
import { toCamelCase, toSnakeCase, mapTaskFromBackend, mapTaskToBackend } from '../mappers';

describe('API Client Mappers', () => {
  it('converts snake_case object to camelCase', () => {
    const raw = {
      task_id: '123',
      due_date: '2026-10-01',
      estimate_minutes: 45,
      sub_items: [{ item_name: 'Sub 1' }],
    };
    const converted = toCamelCase(raw);
    expect(converted).toEqual({
      taskId: '123',
      dueDate: '2026-10-01',
      estimateMinutes: 45,
      subItems: [{ itemName: 'Sub 1' }],
    });
  });

  it('converts camelCase object to snake_case', () => {
    const raw = {
      taskId: '123',
      dueDate: '2026-10-01',
      estimateMinutes: 45,
    };
    const converted = toSnakeCase(raw);
    expect(converted).toEqual({
      task_id: '123',
      due_date: '2026-10-01',
      estimate_minutes: 45,
    });
  });

  it('maps task to and from backend accurately', () => {
    const backendData = {
      id: 'abc-123',
      user_id: 'u-1',
      title: 'Backend task',
      estimate_minutes: 25,
      due_date: '2026-09-20',
      status: 'pending',
    };
    const mapped = mapTaskFromBackend(backendData);
    expect(mapped.id).toBe('abc-123');
    expect(mapped.estimateMinutes).toBe(25);
    expect(mapped.dueDate).toBe('2026-09-20');
  });
});
