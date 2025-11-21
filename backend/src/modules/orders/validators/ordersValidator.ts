import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const createOrderSchema = z.object({
  tableNumber: z.number().int().positive().optional(),
  customer: z.string().min(1).optional(),
  items: z.array(orderItemSchema).min(1),
});

export const updateOrderSchema = z.object({
  tableNumber: z.number().int().positive().optional(),
  customer: z.string().min(1).optional(),
  items: z.array(orderItemSchema).min(1).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});
