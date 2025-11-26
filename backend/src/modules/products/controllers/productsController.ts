import { Request, Response } from "express";
import { ProductService } from "../services/productsService";

export class ProductController {
      static async getProductAllergens(req: Request, res: Response) {
        try {
          const productId = Number(req.params.id);
          const allergens = await ProductService.getAllergensForProduct(productId);
          res.json({ success: true, allergens });
        } catch (err: any) {
          res.status(500).json({ success: false, error: err.message });
        }
      }
    static async getProductStats(req: Request, res: Response) {
      try {
        const stats = await ProductService.getProductStats();
        res.json(stats);
      } catch (err: any) {
        res.status(500).json({ message: err.message });
      }
    }
  static async createProduct(req: Request, res: Response) {
    try {
      // I campi sono già validati dal middleware, passiamo direttamente a ProductService
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAllProducts(req: Request, res: Response) {
    try {
      const {
        categoryId,
        active,
        featured,
        search,
        limit,
        offset,
        sort_by,
        sort_direction
      } = req.query;

      // Conversione parametri numerici e booleani
      const params: any = {
        categoryId: categoryId ? Number(categoryId) : undefined,
        active: active !== undefined ? (active === "true" ? true : active === "false" ? false : active) : undefined,
        featured: featured !== undefined ? (featured === "true" ? true : featured === "false" ? false : featured) : undefined,
        search: search as string,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
        sort_by: sort_by as string,
        sort_direction: sort_direction as "ASC" | "DESC",
      };

      const products = await ProductService.getAllProducts(params);
      res.json(products);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const product = await ProductService.getProductById(id);
      res.json(product);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      // I campi sono già validati dal middleware, passiamo direttamente a ProductService
      const product = await ProductService.updateProduct(id, req.body);
      res.json(product);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await ProductService.deleteProduct(id);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}
