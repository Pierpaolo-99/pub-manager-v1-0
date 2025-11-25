import { Request, Response } from "express";
import { MovementService } from "../services/movementsService";

export class MovementController {
  static async createMovement(req: Request, res: Response) {
    try {
      const movement = await MovementService.createMovement(req.body);
      res.status(201).json(movement);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllMovements(req: Request, res: Response) {
    try {
      // Filtri avanzati da query string
      let filters: any = {
        type: typeof req.query.type === "string" ? req.query.type : "all",
        referenceType: typeof req.query.referenceType === "string" ? req.query.referenceType : "all",
        limit: req.query.limit ? Number(req.query.limit) : 50,
        page: req.query.page ? Number(req.query.page) : 1
      };
      if (req.query.ingredientId) filters.ingredientId = Number(req.query.ingredientId);
      if (typeof req.query.supplier === "string") filters.supplier = req.query.supplier;
      if (typeof req.query.startDate === "string") filters.startDate = req.query.startDate;
      if (typeof req.query.endDate === "string") filters.endDate = req.query.endDate;
      if (typeof req.query.search === "string") filters.search = req.query.search;
      const result = await MovementService.getAllMovements(filters);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getMovementById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const movement = await MovementService.getMovementById(id);
      res.json(movement);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  static async updateMovement(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await MovementService.updateMovement(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteMovement(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await MovementService.deleteMovement(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
