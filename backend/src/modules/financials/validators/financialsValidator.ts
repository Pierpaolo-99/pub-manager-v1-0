import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const createCashMovementSchema = z.object({
  type: z.enum(['OPEN', 'CLOSE', 'IN', 'OUT', 'RECONCILIATION', 'ADJUSTMENT']),
  amount: z.number().min(0.01),
  description: z.string().max(500).optional(),
  userId: z.number().int().min(1).optional(),
  shiftId: z.number().int().min(1).optional(),
});

export const updateCashMovementSchema = createCashMovementSchema.partial();

export const createCashShiftSchema = z.object({
  openedById: z.number().int().min(1),
  openingAmount: z.number().min(0),
  notes: z.string().max(500).optional(),
});

export const updateCashShiftSchema = createCashShiftSchema.partial();

export const closeCashShiftSchema = z.object({
  closedById: z.number().int().min(1),
  closingAmount: z.number().min(0),
  notes: z.string().max(500).optional(),
});

export const createFinancialReportSchema = z.object({
  type: z.enum(['X', 'Z', 'SUMMARY', 'DETAILED', 'EXPORT']),
  period: z.string().min(2),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  data: z.any(),
});

export const updateFinancialReportSchema = createFinancialReportSchema.partial();

export function zodValidate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    next();
  };
}
