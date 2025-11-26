
import { z } from 'zod';

export const recipeIngredientSchema = z.object({
  recipeId: z.number().int().positive(),
  ingredientId: z.number().int().positive(),
  quantity: z.number().min(0),
  unit: z.string().max(20),
  notes: z.string().max(255).optional(),
  isOptional: z.boolean().optional(),
  preparationStep: z.number().int().min(1).optional(),
  costPerUnit: z.number().min(0).optional(),
  totalCost: z.number().min(0).optional()
});
