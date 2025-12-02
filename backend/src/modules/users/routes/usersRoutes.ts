import { Router } from "express";
import { UserController } from "../controllers/usersController";
import { userSchema } from "../validators/usersValidators";
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

// Rotte utenti
// Statistiche utenti
router.get(
  "/stats",
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  UserController.getStats
);
// Crea utente
router.post(
  '/',
  authorizeRoles(Role.ADMIN),
  validate(userSchema),
  UserController.createUser
);
// Lista utenti con filtri/paginazione
router.get(
  '/',
  authorizeRoles(Role.ADMIN),
  UserController.getAllUsers
);
// Utente per ID
router.get(
  '/:id',
  authorizeRoles(Role.ADMIN),
  UserController.getUserById
);
// Aggiorna utente
router.put(
  '/:id',
  authorizeRoles(Role.ADMIN),
  validate(userSchema),
  UserController.updateUser
);
// Elimina utente
router.delete(
  '/:id',
  authorizeRoles(Role.ADMIN),
  UserController.deleteUser
);

// Endpoint extra/statistiche (da aggiungere)

export default router;
