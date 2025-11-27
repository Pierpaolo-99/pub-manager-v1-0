import { Request, Response } from 'express';
import { FinancialsService } from '../services/financialsService';

export class FinancialsController {
  // CashMovement
  static async createCashMovement(req: Request, res: Response) {
    try {
      const movement = await FinancialsService.createCashMovement(req.body);
      res.status(201).json(movement);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllCashMovements(req: Request, res: Response) {
    try {
      const { type, userId, shiftId, from, to } = req.query;
      const filters: any = {};
      if (type) filters.type = type;
      if (userId) filters.userId = Number(userId);
      if (shiftId) filters.shiftId = Number(shiftId);
      if (from) filters.from = new Date(from as string);
      if (to) filters.to = new Date(to as string);
      const movements = await FinancialsService.getAllCashMovements(filters);
      res.json(movements);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getCashMovementById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const movement = await FinancialsService.getCashMovementById(Number(id));
      if (!movement) return res.status(404).json({ error: 'Movimento non trovato' });
      res.json(movement);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateCashMovement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const movement = await FinancialsService.updateCashMovement(Number(id), req.body);
      res.json(movement);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteCashMovement(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await FinancialsService.deleteCashMovement(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // CashShift
  static async createCashShift(req: Request, res: Response) {
    try {
      const shift = await FinancialsService.createCashShift(req.body);
      res.status(201).json(shift);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllCashShifts(req: Request, res: Response) {
    try {
      const { openedById, closedById, from, to } = req.query;
      const filters: any = {};
      if (openedById) filters.openedById = Number(openedById);
      if (closedById) filters.closedById = Number(closedById);
      if (from) filters.from = new Date(from as string);
      if (to) filters.to = new Date(to as string);
      const shifts = await FinancialsService.getAllCashShifts(filters);
      res.json(shifts);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getCashShiftById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shift = await FinancialsService.getCashShiftById(Number(id));
      if (!shift) return res.status(404).json({ error: 'Turno di cassa non trovato' });
      res.json(shift);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateCashShift(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const shift = await FinancialsService.updateCashShift(Number(id), req.body);
      res.json(shift);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async closeCashShift(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { closedById, closingAmount, notes } = req.body;
      const shift = await FinancialsService.closeCashShift(Number(id), Number(closedById), Number(closingAmount), notes);
      res.json(shift);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async deleteCashShift(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await FinancialsService.deleteCashShift(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // FinancialReport
  static async createFinancialReport(req: Request, res: Response) {
    try {
      const report = await FinancialsService.createFinancialReport(req.body);
      res.status(201).json(report);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async getAllFinancialReports(req: Request, res: Response) {
    try {
      const { type, period, from, to } = req.query;
      const filters: any = {};
      if (type) filters.type = type;
      if (period) filters.period = period as string;
      if (from) filters.from = new Date(from as string);
      if (to) filters.to = new Date(to as string);
      const reports = await FinancialsService.getAllFinancialReports(filters);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getFinancialReportById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const report = await FinancialsService.getFinancialReportById(Number(id));
      if (!report) return res.status(404).json({ error: 'Report non trovato' });
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async deleteFinancialReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await FinancialsService.deleteFinancialReport(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
