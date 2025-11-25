import { PrismaClient, MovementType, MovementReferenceType } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export class MovementService {
  // Creazione movimento con tutti i campi
  static async createMovement(data: any) {
    return prisma.$transaction(async (tx) => {
      // Crea il movimento
      const movement = await tx.movement.create({ data });

      // Calcola correzione stock ingrediente
      const increment = MovementService.getStockIncrement(movement.type, Number(movement.quantity));
      await tx.ingredient.update({
        where: { id: movement.ingredientId },
        data: { quantity: { increment } },
      });

      return movement;
    });
  }

  // Recupero tutti i movimenti con filtri avanzati
  static async getAllMovements(filters: {
    ingredientId?: number;
    type?: MovementType | "all";
    supplier?: string;
    startDate?: string;
    endDate?: string;
    referenceType?: MovementReferenceType | "all";
    search?: string;
    limit?: number;
    page?: number;
  } = {}) {
    const {
      ingredientId,
      type,
      supplier,
      startDate,
      endDate,
      referenceType,
      search,
      limit = 50,
      page = 1
    } = filters;

    const where: any = {};
    if (ingredientId) where.ingredientId = ingredientId;
    if (type && type !== "all") where.type = type;
    if (supplier) where.supplier = supplier;
    if (referenceType && referenceType !== "all") where.referenceType = referenceType;
    if (startDate) where.createdAt = { gte: new Date(startDate) };
    if (endDate) {
      where.createdAt = where.createdAt || {};
      where.createdAt.lte = new Date(endDate);
    }
    if (search) {
      where.OR = [
        { reason: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } },
        { supplier: { contains: search, mode: "insensitive" } },
        { invoiceNumber: { contains: search, mode: "insensitive" } },
        { batchCode: { contains: search, mode: "insensitive" } }
      ];
    }

    const skip = (page - 1) * limit;
    const movements = await prisma.movement.findMany({
      where,
      include: { ingredient: true, user: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip
    });

    return {
      movements,
      pagination: {
        page,
        limit,
        total: movements.length
      }
    };
  }

  // Recupero movimento per ID con dettagli
  static async getMovementById(id: number) {
    const movement = await prisma.movement.findUnique({
      where: { id },
      include: { ingredient: true, user: true }
    });
    if (!movement) throw new Error("Movement not found");
    return movement;
  }

  // Aggiornamento movimento con correzione stock
  static async updateMovement(id: number, data: any) {
    return prisma.$transaction(async (tx) => {
      // Recupera il movimento esistente
      const existing = await tx.movement.findUnique({ where: { id } });
      if (!existing) throw new Error("Movement not found");

      // Calcola correzione stock: annulla effetto vecchio movimento
      const revert = MovementService.getStockIncrement(existing.type, -Number(existing.quantity));
      // Applica nuovo effetto
      const newType = data.type ?? existing.type;
      const newQuantity = Number(data.quantity ?? existing.quantity);
      const apply = MovementService.getStockIncrement(newType, newQuantity);

      await tx.ingredient.update({
        where: { id: existing.ingredientId },
        data: { quantity: { increment: revert + apply } },
      });

      // Aggiorna il movimento
      const updated = await tx.movement.update({ where: { id }, data });
      return updated;
    });
  }

  // Eliminazione movimento con correzione stock
  static async deleteMovement(id: number) {
    return prisma.$transaction(async (tx) => {
      const movement = await tx.movement.findUnique({ where: { id } });
      if (!movement) throw new Error("Movement not found");

      // Calcola correzione stock: annulla effetto movimento
      const correction = MovementService.getStockIncrement(movement.type, -Number(movement.quantity));
      await tx.ingredient.update({
        where: { id: movement.ingredientId },
        data: { quantity: { increment: correction } },
      });

      await tx.movement.delete({ where: { id } });
      return { message: "Movement deleted successfully" };
    });
  }

  // Helper: calcolo incremento stock in base al tipo movimento
  static getStockIncrement(type: MovementType, quantity: number) {
    switch (type) {
      case "purchase":
      case "adjustment":
      case "production":
        return quantity;
      case "sale":
      case "waste":
      case "transfer":
        return -quantity;
      default:
        return 0;
    }
  }
}
