import { Request, Response } from 'express';
import { ReportsService } from '../services/reportsService';

export class ReportsController {
  static async salesReport(req: Request, res: Response) {
    try {
      const { startDate, endDate, groupBy } = req.query;
      const report = await ReportsService.getSalesReport({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        groupBy: (groupBy as 'day' | 'hour' | 'month' | 'year') || 'day',
      });
      res.json({ success: true, data: report });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }

  static async topProducts(req: Request, res: Response) {
    try {
      const { startDate, endDate, limit, categoryId } = req.query;
      const report = await ReportsService.getTopProducts({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
        limit: limit ? Number(limit) : 10,
        ...(categoryId ? { categoryId: Number(categoryId) } : {}),
      });
      res.json({ success: true, data: report });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }

  static async inventoryReport(req: Request, res: Response) {
    try {
      const { status, supplier, expiringDays } = req.query;
      const report = await ReportsService.getInventoryReport({
        status: status as string,
        supplier: supplier as string,
        expiringDays: expiringDays ? Number(expiringDays) : 30,
      });
      res.json({ success: true, data: report });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }

  static async costsAnalysis(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const report = await ReportsService.getCostsAnalysis({
        startDate: new Date(startDate as string),
        endDate: new Date(endDate as string),
      });
      res.json({ success: true, data: report });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }

  static async quickStats(req: Request, res: Response) {
    try {
      const stats = await ReportsService.getQuickStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ success: false, error: message });
    }
  }
}
