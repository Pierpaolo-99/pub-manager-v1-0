import { Request, Response, NextFunction } from 'express';

export function zodValidate(schema: ReturnType<typeof z.object>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parse = schema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ success: false, error: parse.error.issues.map((e: { message: string }) => e.message).join(', ') });
    }
    req.body = parse.data;
    next();
  };
}
import { z } from 'zod';

export const allergenCreateSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(100, "Il nome non può superare i 100 caratteri"),
  description: z.string().max(255, "La descrizione non può superare i 255 caratteri").optional().transform(val => val ?? ''),
  active: z.boolean().optional()
});

export const allergenUpdateSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio").max(100, "Il nome non può superare i 100 caratteri").optional(),
  description: z.string().max(255, "La descrizione non può superare i 255 caratteri").optional().transform(val => val ?? ''),
  active: z.boolean().optional()
});

export const allergenProductAssignSchema = z.object({
  productId: z.number().refine(val => typeof val === 'number' && !isNaN(val), { message: 'Product ID obbligatorio' }),
  allergenId: z.number().refine(val => typeof val === 'number' && !isNaN(val), { message: 'Allergen ID obbligatorio' })
});
