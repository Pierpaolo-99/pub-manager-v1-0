import { z } from "zod";

export const purchaseOrderItemSchema = z.object({
  ingredientId: z.number().int().positive(),
  quantity: z.number().nonnegative(),
  unit: z.string().max(20),
  unitPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative().optional(),
  receivedQuantity: z.number().nonnegative().optional(),
  notes: z.string().max(255).optional(),
});

export const createPurchaseOrderSchema = z.object({
  supplierId: z.number().int().positive(),
  orderNumber: z.string().max(50).optional(),
  orderDate: z.string().datetime().optional(),
  expectedDeliveryDate: z.string().datetime().optional(),
  actualDeliveryDate: z.string().datetime().optional(),
  subtotal: z.number().nonnegative().optional(),
  taxAmount: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional(),
  shippingCost: z.number().nonnegative().optional(),
  total: z.number().nonnegative().optional(),
  paymentMethod: z.string().max(50).optional(),
  paymentTerms: z.string().max(100).optional(),
  invoiceNumber: z.string().max(100).optional(),
  deliveryAddress: z.string().max(255).optional(),
  notes: z.string().max(255).optional(),
  createdBy: z.number().int().positive().optional(),
  status: z.enum(["PENDING", "RECEIVED", "CANCELLED"]).optional(),
  items: z.array(purchaseOrderItemSchema).optional(),
});

export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial();
