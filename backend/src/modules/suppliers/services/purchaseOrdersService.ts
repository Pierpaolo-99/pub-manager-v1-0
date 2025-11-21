import { PrismaClient, PurchaseOrderStatus } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface CreatePurchaseOrderInput {
  supplierId: number;
  orderDate?: Date;
  status?: PurchaseOrderStatus;
  total?: number;
  note?: string;
}

export class PurchaseOrdersService {
  // Crea ordine di acquisto
  static async createPurchaseOrder(data: CreatePurchaseOrderInput) {
    return prisma.purchaseOrder.create({ data });
  }

  // Recupera tutti gli ordini di acquisto
  static async getAllPurchaseOrders() {
    return prisma.purchaseOrder.findMany({ include: { supplier: true } });
  }

  // Recupera ordine di acquisto per ID
  static async getPurchaseOrderById(id: number) {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { supplier: true },
    });
    if (!order) throw new Error("Purchase order not found");
    return order;
  }

  // Aggiorna ordine di acquisto
  static async updatePurchaseOrder(id: number, data: Partial<CreatePurchaseOrderInput>) {
    return prisma.purchaseOrder.update({
      where: { id },
      data,
      include: { supplier: true },
    });
  }

  // Cancella ordine di acquisto
  static async deletePurchaseOrder(id: number) {
    await prisma.purchaseOrder.delete({ where: { id } });
    return { message: "Purchase order deleted successfully" };
  }
}
