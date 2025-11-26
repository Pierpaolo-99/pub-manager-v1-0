
import { z } from 'zod';

export const recipeIngredientSchema = z.object({
  ingredientId: z.number().int().positive(),
  quantity: z.number().min(0),
  unit: z.string().max(20),
  notes: z.string().max(255).optional(),
  isOptional: z.boolean().optional(),
  preparationStep: z.number().int().min(1).optional(),
  costPerUnit: z.number().min(0).optional(),
  totalCost: z.number().min(0).optional()
});

export const recipeSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  portionSize: z.number().min(0.01).max(1000).optional(),
  preparationTime: z.number().int().min(0).max(1440).optional(),
  cookingTime: z.number().int().min(0).max(1440).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  instructions: z.string().max(5000).optional(),
  chefNotes: z.string().max(1000).optional(),
  totalCost: z.number().min(0).optional(),
  active: z.boolean().optional(),
  version: z.number().int().min(1).optional(),
  createdBy: z.number().int().positive().optional(),
  note: z.string().max(1000).optional(),
  ingredients: z.array(recipeIngredientSchema).optional()
});
