import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  goal: z.string().max(500).optional(),
  description: z.string().max(1000).optional(),
  techStack: z.array(z.string().max(50)).max(20).default([]),
  iconType: z.enum(['terminal', 'database', 'cloud', 'file']).default('terminal'),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
