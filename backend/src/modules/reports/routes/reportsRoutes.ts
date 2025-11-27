import { Router } from 'express';
import { ReportsController } from '../controllers/reportsController';
import {
  salesReportSchema,
  topProductsSchema,
  inventoryReportSchema,
  costsAnalysisSchema,
  quickStatsSchema,
  zodValidate,
} from '../validators/reportsValidator';

const router = Router();

router.get('/sales', zodValidate(salesReportSchema), ReportsController.salesReport);
router.get('/top-products', zodValidate(topProductsSchema), ReportsController.topProducts);
router.get('/inventory', zodValidate(inventoryReportSchema), ReportsController.inventoryReport);
router.get('/costs', zodValidate(costsAnalysisSchema), ReportsController.costsAnalysis);
router.get('/quick-stats', zodValidate(quickStatsSchema), ReportsController.quickStats);

export default router;
