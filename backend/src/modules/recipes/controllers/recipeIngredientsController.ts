
import { Request, Response } from 'express';
import { RecipeIngredientsService } from '../services/recipeIngredientsService';

export class RecipeIngredientsController {
  static async getAll(req: Request, res: Response) {
    try {
      const { recipeId, ingredientId, search, isOptional, preparationStep, page, pageSize } = req.query;
      // Conversione tipi
      const filters = {
        recipeId: recipeId ? Number(recipeId) : undefined,
        ingredientId: ingredientId ? Number(ingredientId) : undefined,
        search: typeof search === 'string' ? search : undefined,
        isOptional: typeof isOptional === 'string' ? (isOptional === 'true' ? true : isOptional === 'false' ? false : isOptional) : undefined,
        preparationStep: preparationStep ? Number(preparationStep) : undefined,
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 20
      };
      const result = await RecipeIngredientsService.getAll(filters);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await RecipeIngredientsService.getById(Number(id));
      res.json(item);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const item = await RecipeIngredientsService.create(req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await RecipeIngredientsService.update(Number(id), req.body);
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await RecipeIngredientsService.delete(Number(id));
      res.json({ message: 'Ingrediente ricetta eliminato', id: Number(id) });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await RecipeIngredientsService.getStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
