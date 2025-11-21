import { z } from "zod";

export const createPurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive(),
  orderDate: z.string().datetime().optional(),
  status: z.enum(["PENDING", "RECEIVED", "CANCELLED"]).optional(),
  total: z.number().nonnegative().optional(),
  note: z.string().max(255).optional(),
});

export const updatePurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive().optional(),
  orderDate: z.string().datetime().optional(),
  status: z.enum(["PENDING", "RECEIVED", "CANCELLED"]).optional(),
  total: z.number().nonnegative().optional(),
  note: z.string().max(255).optional(),
});
