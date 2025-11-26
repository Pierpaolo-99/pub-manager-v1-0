import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(6).optional(),
  role: z.enum(["ADMIN", "WAITER", "KITCHEN", "CASHIER", "MANAGER", "CHEF", "USER"]).optional(),
  active: z.boolean().optional()
});
