import { PrismaClient, TableStatus } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface CreateTableInput {
  number: number;
  seats: number;
  status?: TableStatus;
  note?: string;
}

export class TablesService {
  // Crea tavolo
  static async createTable(data: CreateTableInput) {
    return prisma.table.create({ data });
  }

  // Recupera tutti i tavoli
  static async getAllTables() {
    return prisma.table.findMany({ include: { orders: true } });
  }

  // Recupera tavolo per ID
  static async getTableById(id: number) {
    const table = await prisma.table.findUnique({
      where: { id },
      include: { orders: true },
    });
    if (!table) throw new Error("Table not found");
    return table;
  }

  // Aggiorna tavolo
  static async updateTable(id: number, data: Partial<CreateTableInput>) {
    return prisma.table.update({
      where: { id },
      data,
      include: { orders: true },
    });
  }

  // Cancella tavolo
  static async deleteTable(id: number) {
    await prisma.table.delete({ where: { id } });
    return { message: "Table deleted successfully" };
  }
}
