import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const createOrderSchema = z.object({
  tableId: z.number().int().positive().optional(),
  customer: z.string().min(1).optional(),
  items: z.array(orderItemSchema).min(1),
  userId: z.number().int().positive().optional(),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  customerEmail: z.string().min(1).optional(),
  subtotal: z.number().optional(),
  taxAmount: z.number().optional(),
  promotionId: z.number().int().positive().optional(),
  notes: z.string().optional(),
  kitchenNotes: z.string().optional(),
  estimatedReadyTime: z.string().nullable().optional(),
  servedAt: z.string().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  heldAt: z.string().nullable().optional(),
  changeGiven: z.number().optional(),
  discountType: z.string().optional(),
  discountAmount: z.number().optional(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.string().optional(),
  status: z.string().optional(),
});

export const updateOrderSchema = z.object({
  tableId: z.number().int().positive().optional(),
  customer: z.string().min(1).optional(),
  items: z.array(orderItemSchema).min(1).optional(),
  userId: z.number().int().positive().optional(),
  customerName: z.string().min(1).optional(),
  customerPhone: z.string().min(1).optional(),
  customerEmail: z.string().min(1).optional(),
  subtotal: z.number().optional(),
  taxAmount: z.number().optional(),
  promotionId: z.number().int().positive().optional(),
  notes: z.string().optional(),
  kitchenNotes: z.string().optional(),
  estimatedReadyTime: z.string().nullable().optional(),
  servedAt: z.string().nullable().optional(),
  paidAt: z.string().nullable().optional(),
  heldAt: z.string().nullable().optional(),
  changeGiven: z.number().optional(),
  discountType: z.string().optional(),
  discountAmount: z.number().optional(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.string().optional(),
  status: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PREPARAZIONE", "PRONTO", "SERVITO", "PAGATO", "ANNULLATO"]),
});

export const checkoutOrderSchema = z.object({
  paymentMethod: z.string().min(1),
  changeGiven: z.number().min(0).optional(),
});

export const applyDiscountSchema = z.object({
  discountType: z.string().min(1),
  discountAmount: z.number().min(0),
});
