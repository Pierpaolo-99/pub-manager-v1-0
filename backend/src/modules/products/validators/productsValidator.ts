import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  basePrice: z.number().nonnegative(),
  categoryId: z.number().int(),
  description: z.string().optional(),
  imageUrl: z.string().max(500).optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  preparationTime: z.number().int().optional(),
  calories: z.number().int().optional(),
  ingredients: z.array(
    z.object({
      ingredientId: z.number().int(),
      quantity: z.number().positive(),
    })
  ).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  basePrice: z.number().nonnegative().optional(),
  categoryId: z.number().int().optional(),
  description: z.string().optional(),
  imageUrl: z.string().max(500).optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  preparationTime: z.number().int().optional(),
  calories: z.number().int().optional(),
  ingredients: z.array(
    z.object({
      ingredientId: z.number().int(),
      quantity: z.number().positive(),
    })
  ).optional(),
});
