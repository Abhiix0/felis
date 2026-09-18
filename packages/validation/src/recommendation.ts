import { z } from 'zod';

export const RecordOutcomeSchema = z.object({
  event: z.enum(['shown', 'accepted', 'started', 'dismissed', 'completed', 'corrected']),
  correctedTaskId: z.string().uuid().optional(),
  recordedAt: z.string().datetime(),
});

export type RecordOutcomeInput = z.infer<typeof RecordOutcomeSchema>;
