import { Request, Response } from 'express';
import { allergensService } from '../services/allergensService';
import { allergenCreateSchema, allergenUpdateSchema, allergenProductAssignSchema } from '../validators/allergensValidator';

export class AllergensController {
  async getAllergens(req: Request, res: Response) {
    try {
      const { active, search, limit, offset } = req.query;
      const params: {
        active?: boolean | 'all';
        search?: string;
        limit?: number;
        offset?: number;
      } = {
        limit: limit ? Number(limit) : 100,
        offset: offset ? Number(offset) : 0
      };
      if (active === 'all') params.active = 'all';
      else if (active === 'true') params.active = true;
      else if (active === 'false') params.active = false;
      if (typeof search === 'string') params.search = search;
      const allergens = await allergensService.getAllergens(params);
      res.json({ success: true, allergens, pagination: { limit: Number(limit) || 100, offset: Number(offset) || 0, total: allergens.length } });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getActiveAllergens(req: Request, res: Response) {
    try {
      const allergens = await allergensService.getActiveAllergens();
      res.json({ success: true, allergens });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getAllergenById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const allergen = await allergensService.getAllergenById(id);
      if (!allergen) return res.status(404).json({ success: false, error: 'Allergene non trovato' });
      res.json({ success: true, allergen });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getAllergenStats(req: Request, res: Response) {
    try {
      const stats = await allergensService.getAllergenStats();
      res.json({ success: true, stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async createAllergen(req: Request, res: Response) {
    try {
      // Rimuovo proprietà undefined
      const data: { name: string; description?: string; active?: boolean } = { name: req.body.name, description: req.body.description };
      if (typeof req.body.active === 'boolean') data.active = req.body.active;
      const allergen = await allergensService.createAllergen(data);
      res.status(201).json({ success: true, allergen });
    } catch (err: any) {
      if (err.message.includes('esiste già')) return res.status(409).json({ success: false, error: err.message });
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async updateAllergen(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      // Rimuovo proprietà undefined
      const data: Partial<{ name: string; description: string; active: boolean }> = {};
      if (typeof req.body.name === 'string') data.name = req.body.name;
      if (typeof req.body.description === 'string') data.description = req.body.description;
      if (typeof req.body.active === 'boolean') data.active = req.body.active;
      const allergen = await allergensService.updateAllergen(id, data);
      res.json({ success: true, allergen });
    } catch (err: any) {
      if (err.message.includes('esiste già')) return res.status(409).json({ success: false, error: err.message });
      if (err.message.includes('non trovato')) return res.status(404).json({ success: false, error: err.message });
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async deleteAllergen(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await allergensService.deleteAllergen(id);
      res.json({ success: true, message: 'Allergene eliminato con successo' });
    } catch (err: any) {
      if (err.message.includes('collegati')) return res.status(409).json({ success: false, error: err.message });
      if (err.message.includes('non trovato')) return res.status(404).json({ success: false, error: err.message });
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getProductAllergens(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const allergens = await allergensService.getProductAllergens(productId);
      res.json({ success: true, allergens });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async addAllergenToProduct(req: Request, res: Response) {
    try {
      const parse = allergenProductAssignSchema.safeParse(req.body);
      if (!parse.success) {
        return res.status(400).json({ success: false, error: parse.error.issues.map((e: { message: string }) => e.message).join(', ') });
      }
      const { productId, allergenId } = parse.data;
      const association = await allergensService.addAllergenToProduct(productId, allergenId);
      res.status(201).json({ success: true, association });
    } catch (err: any) {
      if (err.message.includes('già esistente')) return res.status(409).json({ success: false, error: err.message });
      if (err.message.includes('non trovato')) return res.status(404).json({ success: false, error: err.message });
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async removeAllergenFromProduct(req: Request, res: Response) {
    try {
      const productId = Number(req.params.productId);
      const allergenId = Number(req.params.allergenId);
      const count = await allergensService.removeAllergenFromProduct(productId, allergenId);
      if (count === 0) return res.status(404).json({ success: false, error: 'Associazione non trovata' });
      res.json({ success: true, message: 'Allergene rimosso dal prodotto con successo' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const allergensController = new AllergensController();
