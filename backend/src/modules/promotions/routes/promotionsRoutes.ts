import { Router } from 'express';
import { PromotionsController } from '../controllers/promotionsController';
import {
  createPromotionSchema,
  updatePromotionSchema,
  promotionProductSchema,
  promotionCategorySchema,
  zodValidate,
} from '../validators/promotionsValidator';
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// CRUD promozioni
router.post(
  '/',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(createPromotionSchema),
  PromotionsController.createPromotion
);
router.get('/', PromotionsController.getAllPromotions);
router.get('/:id', PromotionsController.getPromotionById);
router.put(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(updatePromotionSchema),
  PromotionsController.updatePromotion
);
router.delete(
  '/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  PromotionsController.deletePromotion
);

// Associa/disassocia promozione a prodotto
router.post(
  '/add-product',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(promotionProductSchema),
  PromotionsController.addPromotionToProduct
);
router.post(
  '/remove-product',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(promotionProductSchema),
  PromotionsController.removePromotionFromProduct
);

// Associa/disassocia promozione a categoria
router.post(
  '/add-category',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(promotionCategorySchema),
  PromotionsController.addPromotionToCategory
);
router.post(
  '/remove-category',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(promotionCategorySchema),
  PromotionsController.removePromotionFromCategory
);

// Statistiche promozioni
router.get('/stats', PromotionsController.getPromotionStats);

export default router;
