import { z } from 'zod';

export const recipeSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  note: z.string().optional(),
});
