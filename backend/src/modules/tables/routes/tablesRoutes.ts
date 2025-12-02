import { Router, Request, Response, NextFunction } from "express";
import { TablesController } from "../controllers/tablesController";
import { createTableSchema, updateTableSchema, updateTableStatusSchema } from "../validators/tablesValidator";
import { z } from "zod";
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

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

router.patch(
  "/:id/status",
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateBody(updateTableStatusSchema),
  TablesController.updateTableStatus
);
router.post(
  '/',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateBody(createTableSchema),
  TablesController.createTable
);
router.get("/", TablesController.getAllTables);
router.get("/stats", TablesController.getTablesStats);
router.get("/locations", TablesController.getLocations);
router.get("/:id", TablesController.getTableById);
router.put(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateBody(updateTableSchema),
  TablesController.updateTable
);
router.delete(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  TablesController.deleteTable
);

export default router;
