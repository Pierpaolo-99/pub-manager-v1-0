import { Request, Response } from 'express';
import { RecipesService } from '../services/recipesService';

export const RecipesController = {
  async getAll(req: Request, res: Response) {
    const recipes = await RecipesService.getAll();
    res.json(recipes);
  },
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const recipe = await RecipesService.getById(Number(id));
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  },
  async create(req: Request, res: Response) {
    const recipe = await RecipesService.create(req.body);
    res.status(201).json(recipe);
  },
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const recipe = await RecipesService.update(Number(id), req.body);
    res.json(recipe);
  },
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await RecipesService.delete(Number(id));
    res.status(204).send();
  }
};
