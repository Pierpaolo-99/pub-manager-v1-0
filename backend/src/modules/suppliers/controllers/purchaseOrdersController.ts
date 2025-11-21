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
      const orders = await PurchaseOrdersService.getAllPurchaseOrders();
      res.json(orders);
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
