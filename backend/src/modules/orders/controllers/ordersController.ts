
import { Request, Response } from "express";
import { OrderService } from "../services/ordersService";
import { OrderStatus, PaymentMethod } from "../../../generated/prisma/client";

export class OrdersController {
	static async createOrder(req: Request, res: Response) {
		try {
			const order = await OrderService.createOrder(req.body);
			res.status(201).json({ success: true, order });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	static async getAllOrders(req: Request, res: Response) {
		try {
			const {
				status,
				tableId,
				paymentMethod,
				dateFrom,
				dateTo,
				limit,
				offset,
			} = req.query;

			const params: any = {};
			if (status) params.status = status as OrderStatus;
			if (tableId) params.tableId = parseInt(tableId as string, 10);
			if (paymentMethod) params.paymentMethod = paymentMethod as PaymentMethod;
			if (dateFrom) params.dateFrom = dateFrom as string;
			if (dateTo) params.dateTo = dateTo as string;
			if (limit) params.limit = parseInt(limit as string, 10);
			if (offset) params.offset = parseInt(offset as string, 10);

			const result = await OrderService.getAllOrders(params);
			res.json({ success: true, ...result });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	}

	static async getOrderById(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ success: false, error: "ID ordine mancante" });
			}
			const orderId = parseInt(id, 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ success: false, error: "ID ordine non valido" });
			}
			const order = await OrderService.getOrderById(orderId);
			res.json({ success: true, order });
		} catch (error: any) {
			res.status(404).json({ success: false, error: error.message });
		}
	}

	static async getOrdersStats(req: Request, res: Response) {
		try {
			const stats = await OrderService.getOrdersStats();
			res.json({ success: true, stats });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	}

	static async listHeldOrders(req: Request, res: Response) {
		try {
			const orders = await OrderService.listHeldOrders();
			res.json({ success: true, orders });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error.message });
		}
	}

	static async checkoutOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { paymentMethod, changeGiven } = req.body;
			if (!id || !paymentMethod) {
				return res.status(400).json({ success: false, error: "ID e metodo pagamento obbligatori" });
			}
			const orderId = parseInt(id, 10);
			const order = await OrderService.checkoutOrder(orderId, paymentMethod as PaymentMethod, changeGiven);
			res.json({ success: true, order });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	static async refundOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ success: false, error: "ID ordine obbligatorio" });
			}
			const orderId = parseInt(id, 10);
			const order = await OrderService.refundOrder(orderId);
			res.json({ success: true, order });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	static async holdOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ success: false, error: "ID ordine obbligatorio" });
			}
			const orderId = parseInt(id, 10);
			const order = await OrderService.holdOrder(orderId);
			res.json({ success: true, order });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	static async recallOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ success: false, error: "ID ordine obbligatorio" });
			}
			const orderId = parseInt(id, 10);
			const order = await OrderService.recallOrder(orderId);
			res.json({ success: true, order });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	static async applyDiscount(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { discountType, discountAmount } = req.body;
			if (!id || !discountType || discountAmount === undefined) {
				return res.status(400).json({ success: false, error: "ID, tipo e importo sconto obbligatori" });
			}
			const orderId = parseInt(id, 10);
			const order = await OrderService.applyDiscount(orderId, discountType, discountAmount);
			res.json({ success: true, order });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	static async updateOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ success: false, error: "ID ordine mancante" });
			}
			const orderId = parseInt(id, 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ success: false, error: "ID ordine non valido" });
			}
			const updatedOrder = await OrderService.updateOrder(orderId, req.body);
			res.json({ success: true, order: updatedOrder });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	static async updateOrderStatus(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ success: false, error: "ID ordine mancante" });
			}
			const orderId = parseInt(id, 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ success: false, error: "ID ordine non valido" });
			}
			const { status } = req.body;
			if (!status) {
				return res.status(400).json({ success: false, error: "Status mancante" });
			}
			const updatedOrder = await OrderService.updateOrderStatus(orderId, status as OrderStatus);
			res.json({ success: true, order: updatedOrder });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}

	static async deleteOrder(req: Request, res: Response) {
		try {
			const { id } = req.params;
			if (!id) {
				return res.status(400).json({ success: false, error: "ID ordine mancante" });
			}
			const orderId = parseInt(id, 10);
			if (isNaN(orderId)) {
				return res.status(400).json({ success: false, error: "ID ordine non valido" });
			}
			const result = await OrderService.deleteOrder(orderId);
			res.json({ success: true, ...result });
		} catch (error: any) {
			res.status(400).json({ success: false, error: error.message });
		}
	}
}
