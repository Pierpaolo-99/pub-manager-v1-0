import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});
