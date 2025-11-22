import { Router, Request, Response, NextFunction } from 'express';
import { CategoriesController } from '../controllers/categoriesController';
import { categorySchema } from '../validators/categoriesValidator';

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
router.post('/', validateCategory, CategoriesController.create);
router.put('/:id', validateCategory, CategoriesController.update);
router.delete('/:id', CategoriesController.delete);

export default router;
