import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(2).max(100),
  vatNumber: z.string().min(11).max(20),
  address: z.string().max(255).optional(),
  contact: z.string().max(100).optional(),
  note: z.string().max(255).optional(),
});

export const updateSupplierSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  vatNumber: z.string().min(11).max(20).optional(),
  address: z.string().max(255).optional(),
  contact: z.string().max(100).optional(),
  note: z.string().max(255).optional(),
});
