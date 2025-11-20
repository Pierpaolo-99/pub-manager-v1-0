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
      const ingredients = await IngredientService.getAllIngredients();
      res.json(ingredients);
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
}
