import { Router } from "express";

import { OrdersController } from "../controllers/ordersController";
import { createOrderSchema, updateOrderSchema, updateOrderStatusSchema } from "../validators/ordersValidator";
import { z } from "zod";

// Middleware di validazione Zod
import { Request, Response, NextFunction } from "express";

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

// Crea un nuovo ordine
router.post("/", validateBody(createOrderSchema), OrdersController.createOrder);

// Recupera tutti gli ordini
router.get("/", OrdersController.getAllOrders);

// Recupera un ordine per ID
router.get("/:id", OrdersController.getOrderById);

// Aggiorna un ordine
router.put("/:id", validateBody(updateOrderSchema), OrdersController.updateOrder);

// Cancella un ordine
router.delete("/:id", OrdersController.deleteOrder);

// Aggiorna lo status di un ordine
router.patch(
	"/:id/status",
	validateBody(updateOrderStatusSchema),
	OrdersController.updateOrderStatus
);

export default router;
