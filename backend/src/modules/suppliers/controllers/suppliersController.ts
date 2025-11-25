import { Request, Response } from "express";
import { SuppliersService } from "../services/suppliersService";

export class SuppliersController {
  static async createSupplier(req: Request, res: Response) {
    try {
      const supplier = await SuppliersService.createSupplier(req.body);
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAllSuppliers(req: Request, res: Response) {
    try {
      // Filtri avanzati da query string
      const filters = {
        search: req.query.search as string,
        active: req.query.active as string,
        paymentTerms: req.query.paymentTerms as string,
        city: req.query.city as string,
        country: req.query.country as string,
        vatNumber: req.query.vatNumber as string,
        companyName: req.query.companyName as string,
      };
      const result = await SuppliersService.getAllSuppliers(filters);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  // Endpoint fornitori attivi (dropdown)
  static async getActiveSuppliers(req: Request, res: Response) {
    try {
      const suppliers = await SuppliersService.getActiveSuppliers();
      res.json({ suppliers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Endpoint prodotti forniti da supplier
  static async getSupplierProducts(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const supplierId = parseInt(id, 10);
      if (isNaN(supplierId)) return res.status(400).json({ error: "ID non valido" });
      const result = await SuppliersService.getSupplierProducts(supplierId);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // Endpoint termini di pagamento disponibili
  static async getPaymentTerms(req: Request, res: Response) {
    try {
      const paymentTerms = await SuppliersService.getPaymentTerms();
      res.json({ paymentTerms });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Endpoint statistiche fornitori
  static async getSuppliersStats(req: Request, res: Response) {
    try {
      const stats = await SuppliersService.getSuppliersStats();
      res.json({ stats });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSupplierById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const supplierId = parseInt(id, 10);
      if (isNaN(supplierId)) return res.status(400).json({ error: "ID non valido" });
      const supplier = await SuppliersService.getSupplierById(supplierId);
      res.json(supplier);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  static async updateSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const supplierId = parseInt(id, 10);
      if (isNaN(supplierId)) return res.status(400).json({ error: "ID non valido" });
      const updatedSupplier = await SuppliersService.updateSupplier(supplierId, req.body);
      res.json(updatedSupplier);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteSupplier(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID mancante" });
      const supplierId = parseInt(id, 10);
      if (isNaN(supplierId)) return res.status(400).json({ error: "ID non valido" });
      const result = await SuppliersService.deleteSupplier(supplierId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
