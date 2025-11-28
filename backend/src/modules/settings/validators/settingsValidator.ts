import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.any(),
  category: z.string().optional(),
  description: z.string().optional(),
  scope: z.enum(['GLOBAL', 'USER', 'ROLE']).optional(),
  userId: z.number().optional(),
  role: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const updateSettingsBatchSchema = z.object({
  settings: z.array(updateSettingSchema).min(1),
});

export const updatePubProfileSchema = z.object({
  profile: z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    logoUrl: z.string().optional(),
    description: z.string().optional(),
    openingHours: z.any().optional(),
    socialMedia: z.any().optional(),
    taxInfo: z.any().optional(),
  })
});

export const updateNotificationSettingsSchema = z.object({
  notification_settings: z.array(z.object({
    notificationType: z.string().min(1),
    isEnabled: z.boolean(),
    deliveryMethod: z.string().optional(),
    settings: z.any().optional(),
  })).min(1),
});

// Middleware Express per validazione body
export function validateBody(schema: z.ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ success: false, error: 'Validazione fallita', details: result.error.issues });
    }
    next();
  };
}
