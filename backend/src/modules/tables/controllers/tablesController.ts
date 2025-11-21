import { Request, Response } from "express";
import { TablesService } from "../services/tablesService";

export class TablesController {
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
      const tables = await TablesService.getAllTables();
      res.json(tables);
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
