import { PrismaClient, TableStatus } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface CreateTableInput {
  number: number;
  seats: number;
  status?: TableStatus;
  note?: string;
  active?: boolean;
}

export class TablesService {
      // Aggiorna solo lo stato del tavolo
      static async updateTableStatus(id: number, status: TableStatus) {
        return prisma.table.update({
          where: { id },
          data: { status },
        });
      }
    // Locazioni disponibili
    static async getLocations() {
      const locations = await prisma.table.findMany({
        where: {
          location: {
            not: null
          }
        },
        select: { location: true }
      });
      // Filtra e restituisce solo valori unici e non vuoti
      return Array.from(new Set(locations.map(l => l.location).filter(l => l && l.trim() !== "")));
    }
  // Crea tavolo
  static async createTable(data: CreateTableInput) {
    return prisma.table.create({ data });
  }

  // Recupera tutti i tavoli con filtri avanzati
  static async getAllTables(filters?: {
    location?: string;
    status?: TableStatus;
    capacity?: string;
    active?: boolean;
  }) {
    const where: any = {};
    if (filters) {
      if (filters.location) where.location = filters.location;
      if (filters.status) where.status = filters.status;
      if (filters.active !== undefined) where.active = filters.active;
      if (filters.capacity) {
        if (filters.capacity === "1-2") {
          where.seats = { lte: 2 };
        } else if (filters.capacity === "3-4") {
          where.seats = { gte: 3, lte: 4 };
        } else if (filters.capacity === "5-6") {
          where.seats = { gte: 5, lte: 6 };
        } else if (filters.capacity === "7+") {
          where.seats = { gte: 7 };
        }
      }
    }
    return prisma.table.findMany({
      where,
      include: {
        orders: {
          include: { items: true }
        }
      }
    });
  }

  // Statistiche tavoli
  static async getTablesStats() {
    const tables = await prisma.table.findMany();
    const stats = {
      total: tables.length,
      free: tables.filter(t => t.status === "FREE").length,
      occupied: tables.filter(t => t.status === "OCCUPIED").length,
      reserved: tables.filter(t => t.status === "RESERVED").length,
      cleaning: tables.filter(t => t.status === "CLEANING").length,
      active: tables.filter(t => t.active).length,
      inactive: tables.filter(t => !t.active).length,
      totalCapacity: tables.reduce((sum, t) => sum + t.seats, 0),
      availableCapacity: tables.filter(t => t.status === "FREE").reduce((sum, t) => sum + t.seats, 0),
      locationsCount: new Set(tables.map(t => t.location).filter(Boolean)).size,
      avgCapacity: tables.length > 0 ? Math.round((tables.reduce((sum, t) => sum + t.seats, 0) / tables.length) * 10) / 10 : 0
    };
    return stats;
  }

  // Recupera tavolo per ID
  static async getTableById(id: number) {
    const table = await prisma.table.findUnique({
      where: { id },
      include: {
        orders: {
          include: { items: true }
        }
      },
    });
    if (!table) throw new Error("Table not found");
    return table;
  }

  // Aggiorna tavolo
  static async updateTable(id: number, data: Partial<CreateTableInput>) {
    return prisma.table.update({
      where: { id },
      data,
      include: {
        orders: {
          include: { items: true }
        }
      },
    });
  }

  // Cancella tavolo con controllo ordini attivi
  static async deleteTable(id: number) {
    // Cerca ordini attivi (status diversi da PAGATO, ANNULLATO)
    const activeOrders = await prisma.order.count({
      where: {
        tableId: id,
        status: {
          notIn: ["PAGATO", "ANNULLATO"]
        }
      }
    });
    if (activeOrders > 0) {
      throw new Error(`Non puoi eliminare un tavolo con ordini attivi (${activeOrders})`);
    }
    await prisma.table.delete({ where: { id } });
    return { message: "Table deleted successfully" };
  }
}
