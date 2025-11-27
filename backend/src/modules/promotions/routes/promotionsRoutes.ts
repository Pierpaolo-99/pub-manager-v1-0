import { Router } from 'express';
import { PromotionsController } from '../controllers/promotionsController';
import {
  createPromotionSchema,
  updatePromotionSchema,
  promotionProductSchema,
  promotionCategorySchema,
  zodValidate,
} from '../validators/promotionsValidator';

const router = Router();

// CRUD promozioni
router.post('/', zodValidate(createPromotionSchema), PromotionsController.createPromotion);
router.get('/', PromotionsController.getAllPromotions);
router.get('/:id', PromotionsController.getPromotionById);
router.put('/:id', zodValidate(updatePromotionSchema), PromotionsController.updatePromotion);
router.delete('/:id', PromotionsController.deletePromotion);

// Associa/disassocia promozione a prodotto
router.post('/add-product', zodValidate(promotionProductSchema), PromotionsController.addPromotionToProduct);
router.post('/remove-product', zodValidate(promotionProductSchema), PromotionsController.removePromotionFromProduct);

// Associa/disassocia promozione a categoria
router.post('/add-category', zodValidate(promotionCategorySchema), PromotionsController.addPromotionToCategory);
router.post('/remove-category', zodValidate(promotionCategorySchema), PromotionsController.removePromotionFromCategory);

// Statistiche promozioni
router.get('/stats', PromotionsController.getPromotionStats);

export default router;
