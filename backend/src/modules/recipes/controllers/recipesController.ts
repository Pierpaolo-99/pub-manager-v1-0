import { Request, Response } from 'express';
import { RecipesService } from '../services/recipesService';

export class RecipesController {
    static async getAvailableProducts(req: Request, res: Response) {
      try {
        const products = await RecipesService.getAvailableProducts();
        res.json({ products });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  static async getAll(req: Request, res: Response) {
    try {
      const { search, active, difficulty, productId, page, pageSize } = req.query;
      // Conversione tipi
      const filters = {
        search: typeof search === 'string' ? search : undefined,
        active: typeof active === 'string' ? (active === 'true' ? true : active === 'false' ? false : active) : undefined,
        difficulty: typeof difficulty === 'string' ? difficulty : undefined,
        productId: productId ? Number(productId) : undefined,
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 20
      };
      const result = await RecipesService.getAll(filters);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipe = await RecipesService.getById(Number(id));
      res.json(recipe);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const recipe = await RecipesService.create(req.body);
      res.status(201).json(recipe);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const recipe = await RecipesService.update(Number(id), req.body);
      res.json(recipe);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await RecipesService.delete(Number(id));
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await RecipesService.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
