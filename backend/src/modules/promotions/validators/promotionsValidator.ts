import { z } from 'zod';

export const createPromotionSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y']),
  value: z.number().min(0),
  minAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(), // 0=dom, 6=sab
  maxUses: z.number().int().min(0).optional(),
  currentUses: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export const updatePromotionSchema = createPromotionSchema.partial();

export const promotionIdSchema = z.object({
  id: z.number().int().min(1),
});

export const promotionProductSchema = z.object({
  promotionId: z.number().int().min(1),
  productId: z.number().int().min(1),
});

export const promotionCategorySchema = z.object({
  promotionId: z.number().int().min(1),
  categoryId: z.number().int().min(1),
});

export const filterPromotionsSchema = z.object({
  active: z.string().optional(),
  type: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
});

import { Request, Response, NextFunction } from 'express';

export function zodValidate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    next();
  };
}
