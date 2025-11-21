import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1), // per ora stringa
  description: z.string().optional(),
  ingredients: z.array(
    z.object({
      ingredientId: z.number().int(),
      quantity: z.number().positive(),
    })
  ).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  ingredients: z.array(
    z.object({
      ingredientId: z.number().int(),
      quantity: z.number().positive(),
    })
  ).optional(),
});
