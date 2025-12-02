import { Router } from "express";
import { IngredientController } from "../controllers/ingredientsController";
import { MovementController } from "../controllers/movementsController";
import { createIngredientSchema, updateIngredientSchema } from "../validators/ingredientsValidator";
import { createMovementSchema, updateMovementSchema } from "../validators/movementsValidator";
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// Middleware di validazione
const validate = (schema: any) => (req: any, res: any, next: any) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ message: err.errors || err.message });
  }
};

// Routes ingredienti
router.post(
  "/ingredients",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.KITCHEN),
  validate(createIngredientSchema),
  IngredientController.createIngredient
);
router.get("/ingredients", IngredientController.getAllIngredients);
router.get("/ingredients/categories", IngredientController.getIngredientCategories);
router.get("/ingredients/storage-types", IngredientController.getStorageTypes);
router.get("/ingredients/suppliers", IngredientController.getSuppliers);
router.get("/ingredients/:id", IngredientController.getIngredientById);
router.put(
  "/ingredients/:id",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.KITCHEN),
  validate(updateIngredientSchema),
  IngredientController.updateIngredient
);
router.delete(
  "/ingredients/:id",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.KITCHEN),
  IngredientController.deleteIngredient
);

// Routes movimenti
router.post(
  "/movements",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.KITCHEN),
  validate(createMovementSchema),
  MovementController.createMovement
);
router.get("/movements", MovementController.getAllMovements);
router.get("/movements/:id", MovementController.getMovementById);
router.put(
  "/movements/:id",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.KITCHEN),
  validate(updateMovementSchema),
  MovementController.updateMovement
);
router.delete(
  "/movements/:id",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.KITCHEN),
  MovementController.deleteMovement
);

export default router;

