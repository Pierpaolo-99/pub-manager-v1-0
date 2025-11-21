import { Router } from "express";
import { ProductController } from "../controllers/productsController";
import { createProductSchema, updateProductSchema } from "../validators/productsValidator";

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
router.post("/", validate(createProductSchema), ProductController.createProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.put("/:id", validate(updateProductSchema), ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;
