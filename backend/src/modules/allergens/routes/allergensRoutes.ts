import { Router } from 'express';
import { allergenCreateSchema, allergenUpdateSchema, allergenProductAssignSchema } from '../validators/allergensValidator';
import { zodValidate } from '../validators/allergensValidator';
import { allergensController } from '../controllers/allergensController';

const router = Router();

// CRUD allergeni
router.get('/', allergensController.getAllergens.bind(allergensController));
router.get('/active', allergensController.getActiveAllergens.bind(allergensController));
router.get('/stats', allergensController.getAllergenStats.bind(allergensController));
router.get('/:id', allergensController.getAllergenById.bind(allergensController));
router.post('/', zodValidate(allergenCreateSchema), allergensController.createAllergen.bind(allergensController));
router.patch('/:id', zodValidate(allergenUpdateSchema), allergensController.updateAllergen.bind(allergensController));
router.delete('/:id', allergensController.deleteAllergen.bind(allergensController));

// Associazione allergeni-prodotto
router.get('/product/:productId', allergensController.getProductAllergens.bind(allergensController));
router.post('/product', zodValidate(allergenProductAssignSchema), allergensController.addAllergenToProduct.bind(allergensController));
router.delete('/product/:productId/:allergenId', allergensController.removeAllergenFromProduct.bind(allergensController));

export default router;
