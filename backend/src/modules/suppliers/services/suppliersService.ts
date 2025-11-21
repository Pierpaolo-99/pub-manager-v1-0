import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface CreateSupplierInput {
  name: string;
  vatNumber: string;
  address?: string;
  contact?: string;
  note?: string;
}

export class SuppliersService {
  // Crea fornitore
  static async createSupplier(data: CreateSupplierInput) {
    return prisma.supplier.create({ data });
  }

  // Recupera tutti i fornitori
  static async getAllSuppliers() {
    return prisma.supplier.findMany({ include: { purchaseOrders: true } });
  }

  // Recupera fornitore per ID
  static async getSupplierById(id: number) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { purchaseOrders: true },
    });
    if (!supplier) throw new Error("Supplier not found");
    return supplier;
  }

  // Aggiorna fornitore
  static async updateSupplier(id: number, data: Partial<CreateSupplierInput>) {
    return prisma.supplier.update({
      where: { id },
      data,
      include: { purchaseOrders: true },
    });
  }

  // Cancella fornitore
  static async deleteSupplier(id: number) {
    await prisma.supplier.delete({ where: { id } });
    return { message: "Supplier deleted successfully" };
  }
}
