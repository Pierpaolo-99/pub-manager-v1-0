import { Request, Response } from 'express';
import { RecipeIngredientsService } from '../services/recipeIngredientsService';

export const RecipeIngredientsController = {
  async getAll(req: Request, res: Response) {
    const items = await RecipeIngredientsService.getAll();
    res.json(items);
  },
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const item = await RecipeIngredientsService.getById(Number(id));
    if (!item) return res.status(404).json({ error: 'RecipeIngredient not found' });
    res.json(item);
  },
  async create(req: Request, res: Response) {
    const item = await RecipeIngredientsService.create(req.body);
    res.status(201).json(item);
  },
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const item = await RecipeIngredientsService.update(Number(id), req.body);
    res.json(item);
  },
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await RecipeIngredientsService.delete(Number(id));
    res.status(204).send();
  }
};
