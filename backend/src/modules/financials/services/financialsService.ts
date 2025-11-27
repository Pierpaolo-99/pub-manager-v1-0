import { PrismaClient, CashMovementType, ReportType } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

export class FinancialsService {
  // CashMovement CRUD
  static async createCashMovement(data: any) {
    return prisma.cashMovement.create({ data });
  }

  static async getAllCashMovements(filters: { type?: CashMovementType; userId?: number; shiftId?: number; from?: Date; to?: Date } = {}) {
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.userId) where.userId = filters.userId;
    if (filters.shiftId) where.shiftId = filters.shiftId;
    if (filters.from) where.createdAt = { ...(where.createdAt || {}), gte: filters.from };
    if (filters.to) where.createdAt = { ...(where.createdAt || {}), lte: filters.to };
    return prisma.cashMovement.findMany({
      where,
      include: {
        user: true,
        shift: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCashMovementById(id: number) {
    return prisma.cashMovement.findUnique({
      where: { id },
      include: { user: true, shift: true },
    });
  }

  static async updateCashMovement(id: number, data: any) {
    return prisma.cashMovement.update({
      where: { id },
      data,
    });
  }

  static async deleteCashMovement(id: number) {
    return prisma.cashMovement.delete({
      where: { id },
    });
  }

  // CashShift CRUD
  static async createCashShift(data: any) {
    return prisma.cashShift.create({ data });
  }

  static async getAllCashShifts(filters: { openedById?: number; closedById?: number; from?: Date; to?: Date } = {}) {
    const where: any = {};
    if (filters.openedById) where.openedById = filters.openedById;
    if (filters.closedById) where.closedById = filters.closedById;
    if (filters.from) where.openedAt = { ...(where.openedAt || {}), gte: filters.from };
    if (filters.to) where.openedAt = { ...(where.openedAt || {}), lte: filters.to };
    return prisma.cashShift.findMany({
      where,
      include: {
        openedBy: true,
        closedBy: true,
        movements: true,
      },
      orderBy: { openedAt: 'desc' },
    });
  }

  static async getCashShiftById(id: number) {
    return prisma.cashShift.findUnique({
      where: { id },
      include: { openedBy: true, closedBy: true, movements: true },
    });
  }

  static async updateCashShift(id: number, data: any) {
    return prisma.cashShift.update({
      where: { id },
      data,
    });
  }

  static async closeCashShift(id: number, closedById: number, closingAmount: number, notes?: string) {
    const data: any = {
      closedById,
      closedAt: new Date(),
      closingAmount,
    };
    if (notes !== undefined) data.notes = notes;
    return prisma.cashShift.update({
      where: { id },
      data,
    });
  }

  static async deleteCashShift(id: number) {
    return prisma.cashShift.delete({
      where: { id },
    });
  }

  // FinancialReport CRUD
  static async createFinancialReport(data: any) {
    return prisma.financialReport.create({ data });
  }

  static async getAllFinancialReports(filters: { type?: ReportType; period?: string; from?: Date; to?: Date } = {}) {
    const where: any = {};
    if (filters.type) where.type = filters.type;
    if (filters.period) where.period = filters.period;
    if (filters.from) where.startDate = { ...(where.startDate || {}), gte: filters.from };
    if (filters.to) where.endDate = { ...(where.endDate || {}), lte: filters.to };
    return prisma.financialReport.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
    });
  }

  static async getFinancialReportById(id: number) {
    return prisma.financialReport.findUnique({
      where: { id },
    });
  }

  static async deleteFinancialReport(id: number) {
    return prisma.financialReport.delete({
      where: { id },
    });
  }
}
