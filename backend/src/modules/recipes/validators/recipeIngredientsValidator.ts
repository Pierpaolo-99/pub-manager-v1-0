import { z } from 'zod';

export const recipeIngredientSchema = z.object({
  recipeId: z.number().int(),
  ingredientId: z.number().int(),
  quantity: z.number().positive(),
  unit: z.string().min(1),
});
