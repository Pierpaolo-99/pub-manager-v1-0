import { Router } from "express";
import { UserController } from "../controllers/usersController";
import { createUserSchema, updateUserSchema } from "../validators/usersValidators";

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

// Rotte utenti
router.post("/", validate(createUserSchema), UserController.createUser);  // Crea utente
router.get("/", UserController.getAllUsers);                               // Lista utenti
router.get("/:id", UserController.getUserById);                            // Utente per ID
router.put("/:id", validate(updateUserSchema), UserController.updateUser); // Aggiorna utente
router.delete("/:id", UserController.deleteUser);                          // Elimina utente

export default router;
