import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(2).max(200),
  companyName: z.string().max(200).optional(),
  vatNumber: z.string().min(11).max(20).optional(),
  taxCode: z.string().max(20).optional(),
  contactPerson: z.string().max(100).optional(),
  email: z.string().email().max(100).optional(),
  phone: z.string().max(20).optional(),
  mobile: z.string().max(20).optional(),
  website: z.string().max(200).optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(10).optional(),
  country: z.string().max(50).optional(),
  paymentTerms: z.string().max(100).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  deliveryDays: z.string().max(50).optional(),
  minOrderAmount: z.number().min(0).optional(),
  notes: z.string().max(255).optional(),
  active: z.boolean().optional(),
});

export const updateSupplierSchema = createSupplierSchema.partial();
