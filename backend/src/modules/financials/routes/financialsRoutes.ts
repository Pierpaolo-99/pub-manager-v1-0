import { Router } from 'express';
import { FinancialsController } from '../controllers/financialsController';
import {
  createCashMovementSchema,
  updateCashMovementSchema,
  createCashShiftSchema,
  updateCashShiftSchema,
  closeCashShiftSchema,
  createFinancialReportSchema,
  updateFinancialReportSchema,
  zodValidate,
} from '../validators/financialsValidator';

const router = Router();

// CashMovement
router.post('/movements', zodValidate(createCashMovementSchema), FinancialsController.createCashMovement);
router.get('/movements', FinancialsController.getAllCashMovements);
router.get('/movements/:id', FinancialsController.getCashMovementById);
router.put('/movements/:id', zodValidate(updateCashMovementSchema), FinancialsController.updateCashMovement);
router.delete('/movements/:id', FinancialsController.deleteCashMovement);

// CashShift
router.post('/shifts', zodValidate(createCashShiftSchema), FinancialsController.createCashShift);
router.get('/shifts', FinancialsController.getAllCashShifts);
router.get('/shifts/:id', FinancialsController.getCashShiftById);
router.put('/shifts/:id', zodValidate(updateCashShiftSchema), FinancialsController.updateCashShift);
router.post('/shifts/:id/close', zodValidate(closeCashShiftSchema), FinancialsController.closeCashShift);
router.delete('/shifts/:id', FinancialsController.deleteCashShift);

// FinancialReport
router.post('/reports', zodValidate(createFinancialReportSchema), FinancialsController.createFinancialReport);
router.get('/reports', FinancialsController.getAllFinancialReports);
router.get('/reports/:id', FinancialsController.getFinancialReportById);
router.delete('/reports/:id', FinancialsController.deleteFinancialReport);

export default router;
