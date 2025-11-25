import { Request, Response } from "express";
import { PurchaseOrdersService } from "../services/purchaseOrdersService";

export class PurchaseOrdersController {
  static async createPurchaseOrder(req: Request, res: Response) {
    try {
      const order = await PurchaseOrdersService.createPurchaseOrder(req.body);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllPurchaseOrders(req: Request, res: Response) {
    try {
      // Filtri avanzati da query string
      const filters: any = {};
      if (req.query.status) filters.status = req.query.status as string;
      if (req.query.supplierId) filters.supplierId = Number(req.query.supplierId);
      if (req.query.search) filters.search = req.query.search as string;
      if (req.query.fromDate) filters.fromDate = req.query.fromDate as string;
      if (req.query.toDate) filters.toDate = req.query.toDate as string;
      if (req.query.limit) filters.limit = Number(req.query.limit);
      if (req.query.offset) filters.offset = Number(req.query.offset);
      const result = await PurchaseOrdersService.getAllPurchaseOrders(filters);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  // Endpoint statistiche ordini di acquisto
  static async getPurchaseOrdersStats(req: Request, res: Response) {
    try {
      const stats = await PurchaseOrdersService.getPurchaseOrdersStats();
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPurchaseOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const orderId = parseInt(id, 10);
      if (isNaN(orderId)) return res.status(400).json({ error: "ID non valido" });
      const order = await PurchaseOrdersService.getPurchaseOrderById(orderId);
      res.json(order);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async updatePurchaseOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const orderId = parseInt(id, 10);
      if (isNaN(orderId)) return res.status(400).json({ error: "ID non valido" });
      const updatedOrder = await PurchaseOrdersService.updatePurchaseOrder(orderId, req.body);
      res.json(updatedOrder);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deletePurchaseOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const orderId = parseInt(id, 10);
      if (isNaN(orderId)) return res.status(400).json({ error: "ID non valido" });
      const result = await PurchaseOrdersService.deletePurchaseOrder(orderId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
