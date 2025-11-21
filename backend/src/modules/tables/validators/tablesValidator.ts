import { z } from "zod";

export const createTableSchema = z.object({
  number: z.number().int().positive(),
  seats: z.number().int().positive(),
  status: z.enum(["FREE", "OCCUPIED", "RESERVED", "CLOSED"]).optional(),
  note: z.string().max(255).optional(),
});

export const updateTableSchema = z.object({
  number: z.number().int().positive().optional(),
  seats: z.number().int().positive().optional(),
  status: z.enum(["FREE", "OCCUPIED", "RESERVED", "CLOSED"]).optional(),
  note: z.string().max(255).optional(),
});
