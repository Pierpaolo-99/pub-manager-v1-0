import { z } from "zod";

const ingredientCategories = [
  "beverage", "meat", "fish", "vegetable", "dairy", "grain", "spice", "sauce", "other"
];
const storageTypes = ["ambient", "refrigerated", "frozen"];

export const createIngredientSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  description: z.string().optional().nullable(),
  category: z.enum([...(ingredientCategories as [string, ...string[]])]).optional(),
  unit: z.string().min(1, "Unità di misura obbligatoria").default("g"),
  density: z.number().min(0).optional().nullable(),
  costPerUnit: z.number().min(0).optional().nullable(),
  supplier: z.string().optional().nullable(),
  supplierCode: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  shelfLifeDays: z.number().min(0).optional().nullable(),
  storageType: z.enum([...(storageTypes as [string, ...string[]])]).optional(),
  allergenInfo: z.any().optional().nullable(),
  nutritionalInfo: z.any().optional().nullable(),
  active: z.boolean().optional(),
  quantity: z.number().nonnegative("La quantità deve essere >= 0").default(0),
});

export const updateIngredientSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  category: z.enum([...(ingredientCategories as [string, ...string[]])]).optional(),
  unit: z.string().min(1).optional(),
  density: z.number().min(0).optional().nullable(),
  costPerUnit: z.number().min(0).optional().nullable(),
  supplier: z.string().optional().nullable(),
  supplierCode: z.string().optional().nullable(),
  barcode: z.string().optional().nullable(),
  shelfLifeDays: z.number().min(0).optional().nullable(),
  storageType: z.enum([...(storageTypes as [string, ...string[]])]).optional(),
  allergenInfo: z.any().optional().nullable(),
  nutritionalInfo: z.any().optional().nullable(),
  active: z.boolean().optional(),
  quantity: z.number().nonnegative().optional(),
});
