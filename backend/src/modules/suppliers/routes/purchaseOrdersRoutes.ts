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
router.post("/", validateBody(createPurchaseOrderSchema), PurchaseOrdersController.createPurchaseOrder);
router.get("/", PurchaseOrdersController.getAllPurchaseOrders);
router.get("/:id", PurchaseOrdersController.getPurchaseOrderById);
router.put("/:id", validateBody(updatePurchaseOrderSchema), PurchaseOrdersController.updatePurchaseOrder);
router.delete("/:id", PurchaseOrdersController.deletePurchaseOrder);

export default router;
