import { z } from 'zod';

export const goupSchema = z.object({
  name: z.string(),
});

export type GroupSchema = z.infer<typeof goupSchema>;
