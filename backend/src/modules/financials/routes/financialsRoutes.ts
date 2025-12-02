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
import { authorizeRoles } from '../../../middlewares/authorizeRoles';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

// CashMovement
router.post(
  '/movements',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(createCashMovementSchema),
  FinancialsController.createCashMovement
);
router.get('/movements', FinancialsController.getAllCashMovements);
router.get('/movements/:id', FinancialsController.getCashMovementById);
router.put(
  '/movements/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(updateCashMovementSchema),
  FinancialsController.updateCashMovement
);
router.delete(
  '/movements/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  FinancialsController.deleteCashMovement
);

// CashShift
router.post(
  '/shifts',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(createCashShiftSchema),
  FinancialsController.createCashShift
);
router.get('/shifts', FinancialsController.getAllCashShifts);
router.get('/shifts/:id', FinancialsController.getCashShiftById);
router.put(
  '/shifts/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(updateCashShiftSchema),
  FinancialsController.updateCashShift
);
router.post(
  '/shifts/:id/close',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(closeCashShiftSchema),
  FinancialsController.closeCashShift
);
router.delete(
  '/shifts/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  FinancialsController.deleteCashShift
);

// FinancialReport
router.post(
  '/reports',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  zodValidate(createFinancialReportSchema),
  FinancialsController.createFinancialReport
);
router.get('/reports', FinancialsController.getAllFinancialReports);
router.get('/reports/:id', FinancialsController.getFinancialReportById);
router.delete(
  '/reports/:id',
  authorizeRoles(Role.ADMIN, Role.MANAGER),
  FinancialsController.deleteFinancialReport
);

export default router;
