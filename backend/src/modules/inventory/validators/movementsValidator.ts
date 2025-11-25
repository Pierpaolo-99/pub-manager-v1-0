import { z } from "zod";

const movementTypes = [
  "purchase", "sale", "waste", "adjustment", "transfer", "production"
];
const referenceTypes = [
  "order", "purchase", "production", "manual", "waste"
];

export const movementTypeEnum = z.enum([...(movementTypes as [string, ...string[]])]);
export const referenceTypeEnum = z.enum([...(referenceTypes as [string, ...string[]])]);

export const createMovementSchema = z.object({
  ingredientId: z.number(),
  batchId: z.number().optional().nullable(),
  type: movementTypeEnum,
  quantity: z.number().positive("La quantità deve essere maggiore di 0"),
  unit: z.string().min(1).optional(),
  costPerUnit: z.number().min(0).optional().nullable(),
  totalCost: z.number().min(0).optional().nullable(),
  reason: z.string().optional().nullable(),
  referenceType: referenceTypeEnum.optional(),
  referenceId: z.number().optional().nullable(),
  locationFrom: z.string().optional().nullable(),
  locationTo: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  batchCode: z.string().optional().nullable(),
  supplier: z.string().optional().nullable(),
  invoiceNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  userId: z.number().optional().nullable(),
});

export const updateMovementSchema = z.object({
  batchId: z.number().optional().nullable(),
  type: movementTypeEnum.optional(),
  quantity: z.number().positive().optional(),
  unit: z.string().min(1).optional(),
  costPerUnit: z.number().min(0).optional().nullable(),
  totalCost: z.number().min(0).optional().nullable(),
  reason: z.string().optional().nullable(),
  referenceType: referenceTypeEnum.optional(),
  referenceId: z.number().optional().nullable(),
  locationFrom: z.string().optional().nullable(),
  locationTo: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  batchCode: z.string().optional().nullable(),
  supplier: z.string().optional().nullable(),
  invoiceNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  userId: z.number().optional().nullable(),
});
