import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { getSalesAnalyticsSchema, getTopProductsSchema, getOverviewAnalyticsSchema, getPerformanceMetricsSchema } from '../validators/analyticsValidator';
import { validateQuery } from '../validators/analyticsValidator';

const router = Router();

// Overview analytics
router.get('/overview', validateQuery(getOverviewAnalyticsSchema), AnalyticsController.getOverviewAnalytics);

// Sales analytics
router.get('/sales', validateQuery(getSalesAnalyticsSchema), AnalyticsController.getSalesAnalytics);

// Top products
router.get('/top-products', validateQuery(getTopProductsSchema), AnalyticsController.getTopProducts);

// Performance metrics
router.get('/performance', validateQuery(getPerformanceMetricsSchema), AnalyticsController.getPerformanceMetrics);

export default router;
