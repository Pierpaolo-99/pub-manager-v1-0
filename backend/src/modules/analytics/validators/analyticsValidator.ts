import { z } from 'zod';

export const getSalesAnalyticsSchema = z.object({
  period: z.string().regex(/^\d+$/).optional().transform(Number),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const getTopProductsSchema = z.object({
  limit: z.string().regex(/^\d+$/).optional().transform(Number),
  period: z.string().regex(/^\d+$/).optional().transform(Number),
});


export const getOverviewAnalyticsSchema = z.object({});
export const getPerformanceMetricsSchema = z.object({});

export function validateQuery(schema: z.ZodSchema<any>) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Parametri query non validi',
        details: result.error.issues,
      });
    }
    req.validatedQuery = result.data;
    next();
  };
}
