import { Router, Request, Response, NextFunction } from "express";
import { TablesController } from "../controllers/tablesController";
import { createTableSchema, updateTableSchema } from "../validators/tablesValidator";
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

router.post("/", validateBody(createTableSchema), TablesController.createTable);
router.get("/", TablesController.getAllTables);
router.get("/:id", TablesController.getTableById);
router.put("/:id", validateBody(updateTableSchema), TablesController.updateTable);
router.delete("/:id", TablesController.deleteTable);

export default router;
