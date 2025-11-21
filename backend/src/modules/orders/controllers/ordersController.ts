import { Request, Response } from "express";
import { OrderService } from "../services/ordersService";

export class OrdersController {
	// Crea un nuovo ordine
	static async createOrder(req: Request, res: Response) {
		try {
			const order = await OrderService.createOrder(req.body);
			res.status(201).json(order);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	// Recupera tutti gli ordini
	static async getAllOrders(req: Request, res: Response) {
		try {
			const orders = await OrderService.getAllOrders();
			res.json(orders);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	// Recupera un ordine per ID
	static async getOrderById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ error: "ID ordine mancante" });
			}
			const orderId = parseInt(id, 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ error: "ID ordine non valido" });
			}
			const order = await OrderService.getOrderById(orderId);
			res.json(order);
		} catch (error: any) {
			res.status(404).json({ error: error.message });
		}
	}

	// Aggiorna un ordine
	static async updateOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ error: "ID ordine mancante" });
			}
			const orderId = parseInt(id, 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ error: "ID ordine non valido" });
			}
			const updatedOrder = await OrderService.updateOrder(orderId, req.body);
			res.json(updatedOrder);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	// Aggiorna solo lo status di un ordine
	static async updateOrderStatus(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ error: "ID ordine mancante" });
			}
			const orderId = parseInt(id, 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ error: "ID ordine non valido" });
			}
			const { status } = req.body;
			if (!status) {
				return res.status(400).json({ error: "Status mancante" });
			}
			const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
			res.json(updatedOrder);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	// Cancella un ordine
	static async deleteOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ error: "ID ordine mancante" });
			}
			const orderId = parseInt(id, 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ error: "ID ordine non valido" });
			}
			const result = await OrderService.deleteOrder(orderId);
			res.json(result);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}
}
