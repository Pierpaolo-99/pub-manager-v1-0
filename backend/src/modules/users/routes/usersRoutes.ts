import { Router } from "express";
import { UserController } from "../controllers/usersController";
import { userSchema } from "../validators/usersValidators";

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
// Statistiche utenti
router.get("/stats", UserController.getStats);
// Crea utente
router.post("/", validate(userSchema), UserController.createUser);
// Lista utenti con filtri/paginazione
router.get("/", UserController.getAllUsers);
// Utente per ID
router.get("/:id", UserController.getUserById);
// Aggiorna utente
router.put("/:id", validate(userSchema), UserController.updateUser);
// Elimina utente
router.delete("/:id", UserController.deleteUser);

// Endpoint extra/statistiche (da aggiungere)

export default router;
