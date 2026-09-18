import { z } from 'zod';

export const SyncMutationSchema = z.object({
  clientMutationId: z.string().uuid(),
  type: z.enum([
    'CREATE_TASK', 'UPDATE_TASK', 'COMPLETE_TASK', 'DELETE_TASK',
    'CREATE_PROJECT', 'UPDATE_PROJECT', 'ARCHIVE_PROJECT',
    'START_FOCUS', 'END_FOCUS',
  ]),
  payload: z.unknown(),
  createdAt: z.string().datetime(),
});

export type SyncMutationInput = z.infer<typeof SyncMutationSchema>;
