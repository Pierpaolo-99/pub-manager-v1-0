import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const salesReportSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  groupBy: z.enum(['day', 'hour', 'month', 'year']).optional(),
});

export const topProductsSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  categoryId: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const inventoryReportSchema = z.object({
  status: z.string().optional(),
  supplier: z.string().optional(),
  expiringDays: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export const costsAnalysisSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const quickStatsSchema = z.object({});

export function zodValidate(schema: z.ZodTypeAny, source: 'query' | 'body' = 'query') {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === 'body' ? req.body : req.query;
    const result = schema.safeParse(data);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error.issues });
    }
    next();
  };
}
