import { Request, Response } from 'express';
import { PromotionsService } from '../services/promotionsService';

export class PromotionsController {
  static async createPromotion(req: Request, res: Response) {
    try {
      const promotion = await PromotionsService.createPromotion(req.body);
      res.status(201).json(promotion);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  static async getAllPromotions(req: Request, res: Response) {
    try {
      const { active, type, productId, categoryId } = req.query;
      const params: {
        active?: boolean;
        type?: any;
        productId?: number;
        categoryId?: number;
      } = {};
      if (typeof active === 'string') params.active = active === 'true';
      if (type) params.type = type;
      if (productId) params.productId = Number(productId);
      if (categoryId) params.categoryId = Number(categoryId);
      const promotions = await PromotionsService.getAllPromotions(params);
      res.json(promotions);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  static async getPromotionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const promotion = await PromotionsService.getPromotionById(Number(id));
      if (!promotion) return res.status(404).json({ error: 'Promozione non trovata' });
      res.json(promotion);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }

  static async updatePromotion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const promotion = await PromotionsService.updatePromotion(Number(id), req.body);
      res.json(promotion);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  static async deletePromotion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PromotionsService.deletePromotion(Number(id));
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  static async addPromotionToProduct(req: Request, res: Response) {
    try {
      const { promotionId, productId } = req.body;
      const result = await PromotionsService.addPromotionToProduct(Number(promotionId), Number(productId));
      res.status(201).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  static async removePromotionFromProduct(req: Request, res: Response) {
    try {
      const { promotionId, productId } = req.body;
      await PromotionsService.removePromotionFromProduct(Number(promotionId), Number(productId));
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  static async addPromotionToCategory(req: Request, res: Response) {
    try {
      const { promotionId, categoryId } = req.body;
      const result = await PromotionsService.addPromotionToCategory(Number(promotionId), Number(categoryId));
      res.status(201).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  static async removePromotionFromCategory(req: Request, res: Response) {
    try {
      const { promotionId, categoryId } = req.body;
      await PromotionsService.removePromotionFromCategory(Number(promotionId), Number(categoryId));
      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      res.status(400).json({ error: err.message });
    }
  }

  static async getPromotionStats(req: Request, res: Response) {
    try {
      const stats = await PromotionsService.getPromotionStats();
      res.json(stats);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ error: err.message });
    }
  }
}
