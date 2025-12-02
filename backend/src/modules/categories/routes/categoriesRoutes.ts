import { Router, Request, Response, NextFunction } from 'express';
import { CategoriesController } from '../controllers/categoriesController';
import { categorySchema } from '../validators/categoriesValidator';
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

function validateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    categorySchema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ error: err.errors || err.message });
  }
}


router.get('/', CategoriesController.getAll);
router.get('/active', CategoriesController.getActive);
router.get('/stats', CategoriesController.getStats);
router.get('/:id', CategoriesController.getById);
router.post(
  '/',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateCategory,
  CategoriesController.create
);
router.put(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  validateCategory,
  CategoriesController.update
);
router.delete(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  CategoriesController.delete
);

export default router;
