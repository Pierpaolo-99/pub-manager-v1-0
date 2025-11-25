import { Router } from "express";
import { IngredientController } from "../controllers/ingredientsController";
import { MovementController } from "../controllers/movementsController";
import { createIngredientSchema, updateIngredientSchema } from "../validators/ingredientsValidator";
import { createMovementSchema, updateMovementSchema } from "../validators/movementsValidator";

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
router.post("/ingredients", validate(createIngredientSchema), IngredientController.createIngredient);
router.get("/ingredients", IngredientController.getAllIngredients);
router.get("/ingredients/categories", IngredientController.getIngredientCategories);
router.get("/ingredients/storage-types", IngredientController.getStorageTypes);
router.get("/ingredients/suppliers", IngredientController.getSuppliers);
router.get("/ingredients/:id", IngredientController.getIngredientById);
router.put("/ingredients/:id", validate(updateIngredientSchema), IngredientController.updateIngredient);
router.delete("/ingredients/:id", IngredientController.deleteIngredient);

// Routes movimenti
router.post("/movements", validate(createMovementSchema), MovementController.createMovement);
router.get("/movements", MovementController.getAllMovements);
router.get("/movements/:id", MovementController.getMovementById);
router.put("/movements/:id", validate(updateMovementSchema), MovementController.updateMovement);
router.delete("/movements/:id", MovementController.deleteMovement);

export default router;

