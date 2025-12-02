import { Router, Request, Response, NextFunction } from 'express';
import { RecipeIngredientsController } from '../controllers/recipeIngredientsController';
import { recipeIngredientSchema } from '../validators/recipeIngredientsValidator';
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

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
router.post(
	'/',
	authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
	validateRecipeIngredient,
	RecipeIngredientsController.create
);
router.put(
	'/:id',
	authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
	validateRecipeIngredient,
	RecipeIngredientsController.update
);
router.delete(
	'/:id',
	authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
	RecipeIngredientsController.delete
);

export default router;
