import { PrismaClient, PurchaseOrderStatus } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export interface PurchaseOrderItemInput {
  ingredientId: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice?: number;
  receivedQuantity?: number;
  notes?: string;
}

export interface CreatePurchaseOrderInput {
  supplierId: number;
  orderNumber?: string;
  orderDate?: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  subtotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  shippingCost?: number;
  total?: number;
  paymentMethod?: string;
  paymentTerms?: string;
  invoiceNumber?: string;
  deliveryAddress?: string;
  notes?: string;
  createdBy?: number;
  status?: PurchaseOrderStatus;
  items?: PurchaseOrderItemInput[];
}

export class PurchaseOrdersService {
  // Crea ordine di acquisto
  static async createPurchaseOrder(data: CreatePurchaseOrderInput) {
    // Calcolo totali se non forniti
    let subtotal = 0;
    if (data.items && data.items.length > 0) {
      subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }
    const discountAmount = data.discountAmount || 0;
    const shippingCost = data.shippingCost || 0;
    const taxRate = 0.22;
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = data.taxAmount !== undefined ? data.taxAmount : discountedSubtotal * taxRate;
    const total = data.total !== undefined ? data.total : discountedSubtotal + taxAmount + shippingCost;

    // Genera orderNumber se non fornito
    let orderNumber = data.orderNumber;
    if (!orderNumber) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const lastOrder = await prisma.purchaseOrder.findFirst({
        where: { orderNumber: { startsWith: `ORD-${year}${month}-` } },
        orderBy: { orderNumber: 'desc' },
      });
      let nextNumber = 1;
      if (lastOrder && lastOrder.orderNumber) {
        const parts = lastOrder.orderNumber.split('-');
        const numPart = parts[2] ? parseInt(parts[2]) : 0;
        nextNumber = isNaN(numPart) ? 1 : numPart + 1;
      }
      orderNumber = `ORD-${year}${month}-${String(nextNumber).padStart(3, '0')}`;
    }

    // Crea ordine con items
    // Costruisci oggetto data senza undefined
    const orderData: any = {
      supplierId: data.supplierId,
      orderNumber,
      subtotal,
      taxAmount,
      discountAmount,
      shippingCost,
      total,
      status: data.status || 'PENDING',
    };
    if (data.orderDate) orderData.orderDate = data.orderDate;
    if (data.expectedDeliveryDate) orderData.expectedDeliveryDate = data.expectedDeliveryDate;
    if (data.actualDeliveryDate) orderData.actualDeliveryDate = data.actualDeliveryDate;
    if (data.paymentMethod) orderData.paymentMethod = data.paymentMethod;
    if (data.paymentTerms) orderData.paymentTerms = data.paymentTerms;
    if (data.invoiceNumber) orderData.invoiceNumber = data.invoiceNumber;
    if (data.deliveryAddress) orderData.deliveryAddress = data.deliveryAddress;
    if (data.notes) orderData.notes = data.notes;
    if (data.createdBy) orderData.createdBy = data.createdBy;
    if (data.items && data.items.length > 0) {
      orderData.purchaseOrderItems = {
        create: data.items.map(item => ({
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice || (item.quantity * item.unitPrice),
          receivedQuantity: item.receivedQuantity ?? 0,
          notes: item.notes ?? '',
        })),
      };
    }
    const order = await prisma.purchaseOrder.create({
      data: orderData,
      include: { supplier: true, purchaseOrderItems: true },
    });
    return order;
  }

  // Recupera tutti gli ordini di acquisto
  static async getAllPurchaseOrders(filters: {
    status?: string;
    supplierId?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const {
      status,
      supplierId,
      search,
      fromDate,
      toDate,
      limit = 50,
      offset = 0,
    } = filters;
    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (supplierId && supplierId !== 0) where.supplierId = supplierId;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (fromDate) where.orderDate = { gte: new Date(fromDate) };
    if (toDate) {
      where.orderDate = where.orderDate ? { ...where.orderDate, lte: new Date(toDate) } : { lte: new Date(toDate) };
    }
    const orders = await prisma.purchaseOrder.findMany({
      where,
      include: { supplier: true, purchaseOrderItems: true },
      orderBy: [{ orderDate: 'desc' }, { createdAt: 'desc' }],
      skip: offset,
      take: limit,
    });
    // Statistiche
    const stats = await PurchaseOrdersService.getPurchaseOrdersStats();
    return {
      orders,
      stats,
      pagination: {
        limit,
        offset,
        total: orders.length,
      },
    };
  }

  // Recupera ordine di acquisto per ID
  static async getPurchaseOrderById(id: number) {
    const order = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        purchaseOrderItems: {
          include: { ingredient: true },
        },
      },
    });
    if (!order) throw new Error("Purchase order not found");
    return order;
  }

  // Aggiorna ordine di acquisto
  static async updatePurchaseOrder(id: number, data: Partial<CreatePurchaseOrderInput>) {
    // Aggiorna i campi principali
    const updateData: any = { ...data };
    // Calcola totali se items forniti
    if (data.items && data.items.length > 0) {
      const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const discountAmount = data.discountAmount || 0;
      const shippingCost = data.shippingCost || 0;
      const taxRate = 0.22;
      const discountedSubtotal = subtotal - discountAmount;
      const taxAmount = data.taxAmount !== undefined ? data.taxAmount : discountedSubtotal * taxRate;
      const total = data.total !== undefined ? data.total : discountedSubtotal + taxAmount + shippingCost;
      updateData.subtotal = subtotal;
      updateData.taxAmount = taxAmount;
      updateData.total = total;
    }
    // Aggiorna ordine
    const order = await prisma.purchaseOrder.update({
      where: { id },
      data: updateData,
      include: { supplier: true, purchaseOrderItems: true },
    });
    // Aggiorna items se forniti
    if (data.items && data.items.length > 0) {
      // Elimina items esistenti
      await prisma.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: id } });
      // Inserisci nuovi items
      await prisma.purchaseOrder.update({
        where: { id },
        data: {
          purchaseOrderItems: {
            create: data.items.map(item => ({
              ingredientId: item.ingredientId,
              quantity: item.quantity,
              unit: item.unit,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice || (item.quantity * item.unitPrice),
              receivedQuantity: item.receivedQuantity ?? 0,
              notes: item.notes ?? '',
            })),
          },
        },
      });
    }
    // Restituisci ordine aggiornato con items
    return await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { supplier: true, purchaseOrderItems: true },
    });
  }

  // Cancella ordine di acquisto
  static async deletePurchaseOrder(id: number) {
    // Elimina items
    await prisma.purchaseOrderItem.deleteMany({ where: { purchaseOrderId: id } });
    // Elimina ordine
    await prisma.purchaseOrder.delete({ where: { id } });
    return { message: "Purchase order deleted successfully" };
  }
  // Statistiche ordini di acquisto
  static async getPurchaseOrdersStats() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const totalOrders = await prisma.purchaseOrder.count({ where: { orderDate: { gte: lastMonth } } });
    const draftOrders = await prisma.purchaseOrder.count({ where: { status: 'PENDING', orderDate: { gte: lastMonth } } });
    const receivedOrders = await prisma.purchaseOrder.count({ where: { status: 'RECEIVED', orderDate: { gte: lastMonth } } });
    const cancelledOrders = await prisma.purchaseOrder.count({ where: { status: 'CANCELLED', orderDate: { gte: lastMonth } } });
    const totalValue = await prisma.purchaseOrder.aggregate({
      _sum: { total: true },
      where: { orderDate: { gte: lastMonth }, status: { not: 'CANCELLED' } },
    });
    return {
      totalOrders,
      draftOrders,
      receivedOrders,
      cancelledOrders,
      totalValue: totalValue._sum.total || 0,
    };
  }
}
