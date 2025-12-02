import { Router } from 'express';
import { allergenCreateSchema, allergenUpdateSchema, allergenProductAssignSchema } from '../validators/allergensValidator';
import { zodValidate } from '../validators/allergensValidator';
import { allergensController } from '../controllers/allergensController';
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// CRUD allergeni
router.get('/', allergensController.getAllergens.bind(allergensController));
router.get('/active', allergensController.getActiveAllergens.bind(allergensController));
router.get('/stats', allergensController.getAllergenStats.bind(allergensController));
router.get('/:id', allergensController.getAllergenById.bind(allergensController));
router.post(
	'/',
	authorizeRoles(Role.ADMIN, Role.MANAGER),
	zodValidate(allergenCreateSchema),
	allergensController.createAllergen.bind(allergensController)
);
router.patch(
	'/:id',
	authorizeRoles(Role.ADMIN, Role.MANAGER),
	zodValidate(allergenUpdateSchema),
	allergensController.updateAllergen.bind(allergensController)
);
router.delete(
	'/:id',
	authorizeRoles(Role.ADMIN, Role.MANAGER),
	allergensController.deleteAllergen.bind(allergensController)
);

// Associazione allergeni-prodotto
router.get('/product/:productId', allergensController.getProductAllergens.bind(allergensController));
router.post(
	'/product',
	authorizeRoles(Role.ADMIN, Role.MANAGER),
	zodValidate(allergenProductAssignSchema),
	allergensController.addAllergenToProduct.bind(allergensController)
);
router.delete(
	'/product/:productId/:allergenId',
	authorizeRoles(Role.ADMIN, Role.MANAGER),
	allergensController.removeAllergenFromProduct.bind(allergensController)
);

export default router;
