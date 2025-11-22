import { Request, Response } from 'express';
import { CategoriesService } from '../services/categoriesService';

export class CategoriesController {
  static async getAll(req: Request, res: Response) {
    const { active, search, sortBy, sortOrder, limit, offset } = req.query;
    const filters: any = {};
    if (active !== undefined) filters.active = active === 'true';
    if (search) filters.search = search;
    if (sortBy) filters.sortBy = sortBy;
    if (sortOrder) filters.sortOrder = sortOrder === 'desc' ? 'desc' : 'asc';
    if (limit) filters.limit = Number(limit);
    if (offset) filters.offset = Number(offset);

    const categories = await CategoriesService.getAll(filters);
    res.json({
      success: true,
      categories,
      pagination: {
        limit: filters.limit ?? 100,
        offset: filters.offset ?? 0,
        total: categories.length
      }
    });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const category = await CategoriesService.getById(Number(id));
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  }

  static async create(req: Request, res: Response) {
    const category = await CategoriesService.create(req.body);
    res.status(201).json(category);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const category = await CategoriesService.update(Number(id), req.body);
    res.json(category);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await CategoriesService.delete(Number(id));
    res.status(204).send();
  }

  static async getActive(req: Request, res: Response) {
    const categories = await CategoriesService.getActive();
    res.json({ success: true, categories });
  }

  static async getStats(req: Request, res: Response) {
    const stats = await CategoriesService.getStats();
    res.json({ success: true, stats });
  }
}
