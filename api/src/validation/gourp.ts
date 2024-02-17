import { z } from 'zod';

export const goupSchema = z.object({
  name: z.string(),
});
export type GroupSchema = z.infer<typeof goupSchema>;

export const addToGroupSchema = z.object({
  ids: z.array(z.number()),
});
export type AddToGroupSchema = z.infer<typeof addToGroupSchema>;
