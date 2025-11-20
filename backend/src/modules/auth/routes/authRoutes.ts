import { Router, Request, Response, NextFunction } from "express";
import { AuthController } from "../controllers/authController";
import { registerSchema, loginSchema } from "../validators/authValidator";

const router = Router();

// Middleware di validazione
const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ message: err.errors || err.message });
  }
};

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);

export default router;




