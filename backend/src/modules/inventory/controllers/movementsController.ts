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
      const movements = await MovementService.getAllMovements();
      res.json(movements);
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
