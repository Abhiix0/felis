import { z } from 'zod';

export const StartFocusSessionSchema = z.object({
  taskId: z.string().uuid(),
  plannedMinutes: z.number().int().min(1).max(480),
});

export const EndFocusSessionSchema = z.object({
  endedAt: z.string().datetime(),
  actualMinutes: z.number().int().min(1),
  status: z.enum(['finished', 'abandoned']),
});

export type StartFocusSessionInput = z.infer<typeof StartFocusSessionSchema>;
export type EndFocusSessionInput = z.infer<typeof EndFocusSessionSchema>;
