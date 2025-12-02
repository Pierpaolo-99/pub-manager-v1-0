import { Router } from "express";
import { ProductController } from "../controllers/productsController";
import { createProductSchema, updateProductSchema } from "../validators/productsValidator";
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

// Rotte prodotti

// Statistiche prodotti
router.get("/stats", ProductController.getProductStats);

router.get('/:id/allergens', ProductController.getProductAllergens);

router.post(
  "/",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
  validate(createProductSchema),
  ProductController.createProduct
);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.put(
  "/:id",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
  validate(updateProductSchema),
  ProductController.updateProduct
);
router.delete(
  "/:id",
  authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
  ProductController.deleteProduct
);

export default router;
