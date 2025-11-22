
import { PrismaClient, OrderStatus, PaymentMethod, PaymentStatus } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  tableId?: number;
  customer?: string;
  items: OrderItemInput[];
  userId?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  subtotal?: number;
  taxAmount?: number;
  promotionId?: number;
  notes?: string;
  kitchenNotes?: string;
  estimatedReadyTime?: Date;
  servedAt?: Date;
  paidAt?: Date;
  heldAt?: Date;
  changeGiven?: number;
  discountType?: string;
  discountAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  status?: OrderStatus;
}

export class OrderService {
  // Filtri avanzati, paginazione, join
  static async getAllOrders(params: {
    status?: OrderStatus;
    tableId?: number;
    paymentMethod?: PaymentMethod;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const {
      status,
      tableId,
      paymentMethod,
      dateFrom,
      dateTo,
      limit = 100,
      offset = 0,
    } = params;

    const where: any = {};
    if (status) where.status = status;
    if (tableId) where.tableId = tableId;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
        table: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    // Conteggio totale per paginazione
    const total = await prisma.order.count({ where });

    // Arricchisci con items_count
    const ordersWithCount = orders.map(order => ({
      ...order,
      items_count: order.items.length,
    }));

    return {
      orders: ordersWithCount,
      pagination: {
        limit,
        offset,
        total,
      },
    };
  }

  // Dettaglio ordine con join
  static async getOrderById(id: number) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        table: true,
        user: true,
      },
    });
    if (!order) throw new Error("Order not found");
    return order;
  }

  // Statistiche ordini
  static async getOrdersStats() {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const date30 = new Date();
    date30.setDate(today.getDate() - 30);

    const stats = await prisma.order.aggregate({
      _count: { id: true },
      _avg: { total: true },
      _sum: { total: true },
      where: {
        createdAt: { gte: date30 },
      },
    });

    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(todayStr + "T00:00:00.000Z"),
          lte: new Date(todayStr + "T23:59:59.999Z"),
        },
      },
    });
    const pendingOrders = await prisma.order.count({
      where: { status: { in: [OrderStatus.PENDING, OrderStatus.IN_PREPARAZIONE] } },
    });
    const readyOrders = await prisma.order.count({
      where: { status: OrderStatus.PRONTO },
    });
    const completedOrders = await prisma.order.count({
      where: { status: { in: [OrderStatus.SERVITO, OrderStatus.PAGATO] } },
    });
    const cancelledOrders = await prisma.order.count({
      where: { status: OrderStatus.ANNULLATO },
    });
    const dineInOrders = await prisma.order.count({ where: { tableId: { not: null } } });
    const takeawayOrders = await prisma.order.count({ where: { tableId: null } });

    return {
      total_orders: stats._count.id ?? 0,
      today_orders: todayOrders ?? 0,
      pending_orders: pendingOrders ?? 0,
      ready_orders: readyOrders ?? 0,
      completed_orders: completedOrders ?? 0,
      cancelled_orders: cancelledOrders ?? 0,
      today_revenue: stats._sum.total ?? 0,
      average_order_value: stats._avg.total ?? 0,
      dine_in_orders: dineInOrders ?? 0,
      takeaway_orders: takeawayOrders ?? 0,
    };
  }

  // Lista ordini sospesi
  static async listHeldOrders() {
    return prisma.order.findMany({
      where: { heldAt: { not: null } },
      orderBy: { heldAt: "desc" },
      include: { items: true },
    });
  }

  // Checkout ordine (pagamento)
  static async checkoutOrder(id: number, paymentMethod: PaymentMethod, changeGiven?: number) {
    return prisma.order.update({
      where: { id: id },
      data: {
        status: OrderStatus.PAGATO,
        paymentStatus: PaymentStatus.COMPLETED,
        paymentMethod: paymentMethod,
        changeGiven: changeGiven ?? null,
        paidAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // Rimborso ordine
  static async refundOrder(id: number) {
    return prisma.order.update({
      where: { id: id },
      data: {
        status: OrderStatus.ANNULLATO,
        paymentStatus: PaymentStatus.FAILED,
        updatedAt: new Date(),
      },
    });
  }

  // Sospendi ordine
  static async holdOrder(id: number) {
    return prisma.order.update({
      where: { id: id },
      data: {
        heldAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  // Recupera ordine sospeso
  static async recallOrder(id: number) {
    return prisma.order.update({
      where: { id: id },
      data: {
        heldAt: null,
        updatedAt: new Date(),
      },
    });
  }

  // Applica sconto manuale
  static async applyDiscount(id: number, discountType: string, discountAmount: number) {
    return prisma.order.update({
      where: { id: id },
      data: {
        discountType: discountType,
        discountAmount: discountAmount,
        updatedAt: new Date(),
      },
    });
  }

  // Aggiorna solo lo status di un ordine (con gestione tavolo)
  static async updateOrderStatus(id: number, status: OrderStatus) {
    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status: status, updatedAt: new Date() },
      include: { items: true, table: true },
    });
    // Se l'ordine è pagato o annullato, libera il tavolo
    if ((status === OrderStatus.PAGATO || status === OrderStatus.ANNULLATO) && updatedOrder.tableId) {
      await prisma.table.update({
        where: { id: updatedOrder.tableId },
        data: { status: "FREE", updatedAt: new Date() },
      });
    }
    return updatedOrder;
  }

  // Creazione ordine (come prima, con stock)
  static async createOrder(data: CreateOrderInput) {
    const {
      tableId,
      customer,
      items,
      userId,
      customerName,
      customerPhone,
      customerEmail,
      subtotal,
      taxAmount,
      promotionId,
      notes,
      kitchenNotes,
      estimatedReadyTime,
      servedAt,
      paidAt,
      heldAt,
      changeGiven,
      discountType,
      discountAmount,
      paymentMethod,
      paymentStatus,
      status
    } = data;
    if (!tableId && !customer) {
      throw new Error("Deve esserci almeno tableId o customer");
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          tableId: tableId ?? null,
          customer: customer ?? null,
          total,
          userId: userId ?? null,
          customerName: customerName ?? null,
          customerPhone: customerPhone ?? null,
          customerEmail: customerEmail ?? null,
          subtotal: subtotal ?? 0,
          taxAmount: taxAmount ?? 0,
          promotionId: promotionId ?? null,
          notes: notes ?? null,
          kitchenNotes: kitchenNotes ?? null,
          estimatedReadyTime: estimatedReadyTime ?? null,
          servedAt: servedAt ?? null,
          paidAt: paidAt ?? null,
          heldAt: heldAt ?? null,
          changeGiven: changeGiven ?? null,
          discountType: discountType ?? null,
          discountAmount: discountAmount ?? 0,
          paymentMethod: paymentMethod ?? PaymentMethod.CASH,
          paymentStatus: paymentStatus ?? PaymentStatus.PENDING,
          status: status ?? OrderStatus.PENDING,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtSale: item.price,
              subtotal: item.price * item.quantity,
              status: "PENDING",
            })),
          },
        },
        include: { items: true },
      });
      for (const item of items) {
        const productIngredients = await tx.productIngredient.findMany({
          where: { productId: item.productId },
        });
        for (const pi of productIngredients) {
          const totalToDeduct = pi.quantity * item.quantity;
          const ingredient = await tx.ingredient.findUnique({
            where: { id: pi.ingredientId },
          });
          if (!ingredient) {
            throw new Error(`Ingrediente con id ${pi.ingredientId} non trovato`);
          }
          if (ingredient.quantity < totalToDeduct) {
            throw new Error(`Stock insufficiente per l'ingrediente ${ingredient.name}`);
          }
          await tx.ingredient.update({
            where: { id: pi.ingredientId },
            data: { quantity: { decrement: totalToDeduct } },
          });
        }
      }
      return order;
    });
    return result;
  }

  // Aggiornamento ordine (come prima, con stock)
  static async updateOrder(id: number, data: Partial<CreateOrderInput>) {
    if (!data.items) {
      // Costruisci l'oggetto data solo con i campi effettivamente presenti
      const updateData: any = {};
      if (data.tableId !== undefined) updateData.tableId = data.tableId;
      if (data.customer !== undefined) updateData.customer = data.customer;
      if (data.userId !== undefined) updateData.userId = data.userId;
      if (data.customerName !== undefined) updateData.customerName = data.customerName;
      if (data.customerPhone !== undefined) updateData.customerPhone = data.customerPhone;
      if (data.customerEmail !== undefined) updateData.customerEmail = data.customerEmail;
      if (data.subtotal !== undefined) updateData.subtotal = data.subtotal;
      if (data.taxAmount !== undefined) updateData.taxAmount = data.taxAmount;
      if (data.promotionId !== undefined) updateData.promotionId = data.promotionId;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.kitchenNotes !== undefined) updateData.kitchenNotes = data.kitchenNotes;
      if (data.estimatedReadyTime !== undefined) updateData.estimatedReadyTime = data.estimatedReadyTime;
      if (data.servedAt !== undefined) updateData.servedAt = data.servedAt;
      if (data.paidAt !== undefined) updateData.paidAt = data.paidAt;
      if (data.heldAt !== undefined) updateData.heldAt = data.heldAt;
      if (data.changeGiven !== undefined) updateData.changeGiven = data.changeGiven;
      if (data.discountType !== undefined) updateData.discountType = data.discountType;
      if (data.discountAmount !== undefined) updateData.discountAmount = data.discountAmount;
      if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;
      if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
      if (data.status !== undefined) updateData.status = data.status;
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: { items: true },
      });
      return updatedOrder;
    }
    const items = data.items ?? [];
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Order items non validi per l'aggiornamento");
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = await prisma.$transaction(async (tx) => {
      const oldOrder = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!oldOrder) throw new Error("Order not found");
      for (const oldItem of oldOrder.items) {
        const productIngredients = await tx.productIngredient.findMany({
          where: { productId: oldItem.productId },
        });
        for (const pi of productIngredients) {
          const totalToRestore = pi.quantity * oldItem.quantity;
          await tx.ingredient.update({
            where: { id: pi.ingredientId },
            data: { quantity: { increment: totalToRestore } },
          });
        }
      }
      const updateData: any = {};
      if (data.tableId !== undefined) updateData.tableId = data.tableId;
      if (data.customer !== undefined) updateData.customer = data.customer;
      if (data.userId !== undefined) updateData.userId = data.userId;
      if (data.customerName !== undefined) updateData.customerName = data.customerName;
      if (data.customerPhone !== undefined) updateData.customerPhone = data.customerPhone;
      if (data.customerEmail !== undefined) updateData.customerEmail = data.customerEmail;
      if (data.subtotal !== undefined) updateData.subtotal = data.subtotal;
      if (data.taxAmount !== undefined) updateData.taxAmount = data.taxAmount;
      if (data.promotionId !== undefined) updateData.promotionId = data.promotionId;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.kitchenNotes !== undefined) updateData.kitchenNotes = data.kitchenNotes;
      if (data.estimatedReadyTime !== undefined) updateData.estimatedReadyTime = data.estimatedReadyTime;
      if (data.servedAt !== undefined) updateData.servedAt = data.servedAt;
      if (data.paidAt !== undefined) updateData.paidAt = data.paidAt;
      if (data.heldAt !== undefined) updateData.heldAt = data.heldAt;
      if (data.changeGiven !== undefined) updateData.changeGiven = data.changeGiven;
      if (data.discountType !== undefined) updateData.discountType = data.discountType;
      if (data.discountAmount !== undefined) updateData.discountAmount = data.discountAmount;
      if (data.paymentMethod !== undefined) updateData.paymentMethod = data.paymentMethod;
      if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
      if (data.status !== undefined) updateData.status = data.status;
      updateData.total = total;
      updateData.items = {
        deleteMany: {},
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      for (const item of items) {
        const productIngredients = await tx.productIngredient.findMany({
          where: { productId: item.productId },
        });
        for (const pi of productIngredients) {
          const totalToDeduct = pi.quantity * item.quantity;
          const ingredient = await tx.ingredient.findUnique({
            where: { id: pi.ingredientId },
          });
          if (!ingredient) {
            throw new Error(`Ingrediente con id ${pi.ingredientId} non trovato`);
          }
          if (ingredient.quantity < totalToDeduct) {
            throw new Error(`Stock insufficiente per l'ingrediente ${ingredient.name}`);
          }
          await tx.ingredient.update({
            where: { id: pi.ingredientId },
            data: { quantity: { decrement: totalToDeduct } },
          });
        }
      }
      const updatedOrder = await tx.order.update({
        where: { id },
        data: updateData,
        include: { items: true },
      });
      return updatedOrder;
    });
    return result;
  }

  // Cancellazione ordine (con controllo stato pagato)
  static async deleteOrder(id: number) {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new Error("Order not found");
    if (order.status === "PAGATO") {
      throw new Error("Non è possibile eliminare un ordine già pagato");
    }
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      await tx.order.delete({ where: { id } });
      if (order.tableId) {
        await tx.table.update({
          where: { id: order.tableId },
          data: { status: "FREE", updatedAt: new Date() },
        });
      }
    });
    return { message: "Order deleted successfully" };
  }
}


