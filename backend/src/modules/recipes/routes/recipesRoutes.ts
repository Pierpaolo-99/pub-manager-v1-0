import { Router, Request, Response, NextFunction } from 'express';
import { RecipesController } from '../controllers/recipesController';
import { recipeSchema } from '../validators/recipesValidator';

const router = Router();

function validateRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		recipeSchema.parse(req.body);
		next();
	} catch (err: any) {
		return res.status(400).json({ error: err.errors || err.message });
	}
}

router.get('/', RecipesController.getAll);
router.get('/:id', RecipesController.getById);
router.post('/', validateRecipe, RecipesController.create);
router.put('/:id', validateRecipe, RecipesController.update);
router.delete('/:id', RecipesController.delete);

export default router;
