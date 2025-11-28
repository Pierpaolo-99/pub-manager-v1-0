import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

export class AnalyticsController {
  // GET /api/analytics/overview
  static async getOverviewAnalytics(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getOverviewAnalytics();
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Errore nel caricamento analytics', details: error.message });
    }
  }

  // GET /api/analytics/sales
  static async getSalesAnalytics(req: Request, res: Response) {
    try {
      const { period, startDate, endDate } = (req as any).validatedQuery || {};
      const data = await AnalyticsService.getSalesAnalytics({
        period,
        startDate,
        endDate,
      });
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Errore nel caricamento analytics vendite', details: error.message });
    }
  }

  // GET /api/analytics/top-products
  static async getTopProducts(req: Request, res: Response) {
    try {
      const { limit, period } = (req as any).validatedQuery || {};
      const data = await AnalyticsService.getTopProducts({
        limit,
        period,
      });
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Errore nel caricamento top products', details: error.message });
    }
  }

  // GET /api/analytics/performance
  static async getPerformanceMetrics(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getPerformanceMetrics();
      res.json({ success: true, data, timestamp: new Date().toISOString() });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Errore nel caricamento metriche performance', details: error.message });
    }
  }
}
