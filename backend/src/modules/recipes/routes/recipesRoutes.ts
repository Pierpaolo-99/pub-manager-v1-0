import { Router, Request, Response, NextFunction } from 'express';
import { RecipesController } from '../controllers/recipesController';
import { recipeSchema } from '../validators/recipesValidator';
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

function validateRecipe(req: Request, res: Response, next: NextFunction) {
	try {
		recipeSchema.parse(req.body);
		next();
	} catch (err: any) {
		return res.status(400).json({ error: err.errors || err.message });
	}
}

router.get('/available-products', RecipesController.getAvailableProducts);
router.get('/', RecipesController.getAll); // supporta query params per filtri
router.get('/stats', RecipesController.getStats);
router.get('/:id', RecipesController.getById);
router.post(
	'/',
	authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
	validateRecipe,
	RecipesController.create
);
router.put(
	'/:id',
	authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
	validateRecipe,
	RecipesController.update
);
router.delete(
	'/:id',
	authorizeRoles(Role.ADMIN, Role.MANAGER, Role.CHEF),
	RecipesController.delete
);

export default router;
