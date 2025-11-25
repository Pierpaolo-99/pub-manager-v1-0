import { Request, Response } from "express";
import { IngredientService } from "../services/ingredientsService";

export class IngredientController {
  static async createIngredient(req: Request, res: Response) {
    try {
      const ingredient = await IngredientService.createIngredient(req.body);
      res.status(201).json(ingredient);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllIngredients(req: Request, res: Response) {
    try {
      // Conversione filtri da query string
      const filters = {
        category: typeof req.query.category === "string" ? (req.query.category as any) : "all",
        supplier: typeof req.query.supplier === "string" ? req.query.supplier : "",
        search: typeof req.query.search === "string" ? req.query.search : "",
        active: typeof req.query.active === "string" ? req.query.active : "",
        storageType: typeof req.query.storageType === "string" ? (req.query.storageType as any) : "all"
      };
      const result = await IngredientService.getAllIngredients(filters);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getIngredientById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const ingredient = await IngredientService.getIngredientById(id);
      res.json(ingredient);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  static async updateIngredient(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await IngredientService.updateIngredient(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteIngredient(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await IngredientService.deleteIngredient(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static getIngredientCategories(req: Request, res: Response) {
    try {
      const categories = IngredientService.getIngredientCategories();
      res.json({ categories });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static getStorageTypes(req: Request, res: Response) {
    try {
      const storageTypes = IngredientService.getStorageTypes();
      res.json({ storageTypes });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getSuppliers(req: Request, res: Response) {
    try {
      const suppliers = await IngredientService.getSuppliers();
      res.json({ suppliers });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}
