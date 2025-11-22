import { Request, Response } from "express";
import { TablesService } from "../services/tablesService";

export class TablesController {
  static async getTablesStats(req: Request, res: Response) {
    try {
      const stats = await TablesService.getTablesStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
      static async updateTableStatus(req: Request, res: Response) {
        try {
          const { id } = req.params;
          if (!id) return res.status(400).json({ error: "ID mancante" });
          const tableId = parseInt(id, 10);
          if (isNaN(tableId)) return res.status(400).json({ error: "ID non valido" });
          const { status } = req.body;
          if (!status) return res.status(400).json({ error: "Status mancante" });
          const updated = await TablesService.updateTableStatus(tableId, status);
          res.json({ success: true, table: updated });
        } catch (error: any) {
          res.status(400).json({ success: false, error: error.message });
        }
      }
    static async getLocations(req: Request, res: Response) {
      try {
        const locations = await TablesService.getLocations();
        res.json({ locations });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    }
  static async createTable(req: Request, res: Response) {
    try {
      const table = await TablesService.createTable(req.body);
      res.status(201).json(table);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllTables(req: Request, res: Response) {
    try {
      const { location, status, capacity, active } = req.query;
      const filters: any = {};
      if (location) filters.location = location;
      if (status) filters.status = status;
      if (capacity) filters.capacity = capacity;
      if (active !== undefined) filters.active = active === "true" ? true : active === "false" ? false : undefined;
      const tablesRaw = await TablesService.getAllTables(filters);

      // Arricchisci la risposta per il frontend
      const tables = tablesRaw.map(table => {
        // Status label
        const statusMap: any = {
          FREE: "libero",
          OCCUPIED: "occupato",
          RESERVED: "riservato",
          CLEANING: "pulizia",
          CLOSED: "chiuso"
        };
        // Area
        const area = table.location || "interno";
        // Last occupied
        const lastOccupied = table.status === "OCCUPIED" ? table.updatedAt : null;
        // Current order (solo se status attivo)
        const currentOrder = table.orders?.find(o => ["PENDING", "IN_PREPARAZIONE", "PRONTO", "SERVITO"].includes(o.status));
        return {
          ...table,
          status_label: statusMap[table.status] || table.status,
          area,
          lastOccupied,
          currentOrder: currentOrder ? {
            id: currentOrder.id,
            total: currentOrder.total,
            status: currentOrder.status,
            createdAt: currentOrder.createdAt,
            items: currentOrder.items ? currentOrder.items.length : 0
          } : null
        };
      });

      // Summary
      const summary = {
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

      res.json({
        success: true,
        tables,
        summary,
        filters: {
          location: location || null,
          status: status || null,
          capacity: capacity || null,
          active: active !== undefined ? active : null
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTableById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const tableId = parseInt(id, 10);
      if (isNaN(tableId)) return res.status(400).json({ error: "ID non valido" });
      const table = await TablesService.getTableById(tableId);
      res.json(table);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async updateTable(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const tableId = parseInt(id, 10);
      if (isNaN(tableId)) return res.status(400).json({ error: "ID non valido" });
      const updatedTable = await TablesService.updateTable(tableId, req.body);
      res.json(updatedTable);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteTable(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const tableId = parseInt(id, 10);
      if (isNaN(tableId)) return res.status(400).json({ error: "ID non valido" });
      const result = await TablesService.deleteTable(tableId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
