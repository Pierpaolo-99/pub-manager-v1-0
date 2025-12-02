import { Router, Request, Response, NextFunction } from "express";
import { PurchaseOrdersController } from "../controllers/purchaseOrdersController";
import { createPurchaseOrderSchema, updatePurchaseOrderSchema } from "../validators/purchaseOrdersValidator";
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
router.get("/stats", PurchaseOrdersController.getPurchaseOrdersStats);

// CRUD classico
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

router.post(
  '/',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateBody(createPurchaseOrderSchema),
  PurchaseOrdersController.createPurchaseOrder
);
router.get("/", PurchaseOrdersController.getAllPurchaseOrders);
router.get("/:id", PurchaseOrdersController.getPurchaseOrderById);
router.put(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateBody(updatePurchaseOrderSchema),
  PurchaseOrdersController.updatePurchaseOrder
);
router.delete(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  PurchaseOrdersController.deletePurchaseOrder
);

export default router;
