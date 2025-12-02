import { Router, Request, Response, NextFunction } from "express";
import { SuppliersController } from "../controllers/suppliersController";
import { createSupplierSchema, updateSupplierSchema } from "../validators/suppliersValidator";
import { z } from "zod";

function validateBody(schema: z.ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation error", details: result.error.issues });
    }
    req.body = result.data;
    next();
  };
}

const router = Router();


// Rotte extra prima di /:id
router.get("/active", SuppliersController.getActiveSuppliers);
router.get("/payment-terms", SuppliersController.getPaymentTerms);
router.get("/stats", SuppliersController.getSuppliersStats);
router.get("/:id/products", SuppliersController.getSupplierProducts);

// CRUD classico
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';
// ...existing code...
router.post(
  '/',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateBody(createSupplierSchema),
  SuppliersController.createSupplier
);
router.get("/", SuppliersController.getAllSuppliers);
router.get("/:id", SuppliersController.getSupplierById);
router.put(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateBody(updateSupplierSchema),
  SuppliersController.updateSupplier
);
router.delete(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  SuppliersController.deleteSupplier
);

export default router;
