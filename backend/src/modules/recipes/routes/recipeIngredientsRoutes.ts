import { Router, Request, Response, NextFunction } from 'express';
import { RecipeIngredientsController } from '../controllers/recipeIngredientsController';
import { recipeIngredientSchema } from '../validators/recipeIngredientsValidator';

const router = Router();

function validateRecipeIngredient(req: Request, res: Response, next: NextFunction) {
	try {
		recipeIngredientSchema.parse(req.body);
		next();
	} catch (err: any) {
		return res.status(400).json({ error: err.errors || err.message });
	}
}


router.get('/', RecipeIngredientsController.getAll); // supporta query params per filtri
router.get('/stats', RecipeIngredientsController.getStats);
router.get('/:id', RecipeIngredientsController.getById);
router.post('/', validateRecipeIngredient, RecipeIngredientsController.create);
router.put('/:id', validateRecipeIngredient, RecipeIngredientsController.update);
router.delete('/:id', RecipeIngredientsController.delete);

export default router;
