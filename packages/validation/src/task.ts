import { z } from 'zod';

export const CreateTaskSchema = z.object({
  projectId: z.string().uuid().optional(),
  title: z.string().min(1).max(500),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD
  dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),       // HH:MM
  estimateMinutes: z.number().int().min(1).max(480).optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const CompleteTaskSchema = z.object({
  completedAt: z.string().datetime().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CompleteTaskInput = z.infer<typeof CompleteTaskSchema>;
