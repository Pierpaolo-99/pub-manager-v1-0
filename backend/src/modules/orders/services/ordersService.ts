import { PrismaClient, OrderStatus } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

interface OrderItemInput {
  productId: number;
  quantity: number;
  price: number;
}

interface CreateOrderInput {
  tableNumber?: number;
  customer?: string;
  items: OrderItemInput[];
}

export class OrderService {
    // Aggiorna solo lo status di un ordine
    static async updateOrderStatus(id: number, status: OrderStatus) {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: { items: true },
      });
      return updatedOrder;
    }
  // Creazione ordine
  static async createOrder(data: CreateOrderInput) {
    const { tableNumber, customer, items } = data;

    if (!tableNumber && !customer) {
      throw new Error("Deve esserci almeno tableNumber o customer");
    }

    // Calcola il totale ordine
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Transazione: crea ordine e scala ingredienti
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crea l'ordine e gli order items
      const order = await tx.order.create({
        data: {
          tableNumber: tableNumber ?? null,
          customer: customer ?? null,
          total,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });

      // 2. Per ogni item, recupera ingredienti e scala stock
      for (const item of items) {
        // Recupera ingredienti necessari per il prodotto
        const productIngredients = await tx.productIngredient.findMany({
          where: { productId: item.productId },
        });

        for (const pi of productIngredients) {
          // Calcola quantità totale da scalare
          const totalToDeduct = pi.quantity * item.quantity;

          // Recupera ingrediente attuale
          const ingredient = await tx.ingredient.findUnique({
            where: { id: pi.ingredientId },
          });
          if (!ingredient) {
            throw new Error(`Ingrediente con id ${pi.ingredientId} non trovato`);
          }
          if (ingredient.quantity < totalToDeduct) {
            throw new Error(`Stock insufficiente per l'ingrediente ${ingredient.name}`);
          }

          // Scala la quantità
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

  // Recupera tutti gli ordini
  static async getAllOrders() {
    return prisma.order.findMany({ include: { items: true } });
  }

  // Recupera ordine per ID
  static async getOrderById(id: number) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new Error("Order not found");
    return order;
  }

  // Aggiornamento ordine
  static async updateOrder(id: number, data: Partial<CreateOrderInput>) {
    // Se non ci sono items, aggiorna solo i dati base
    if (!data.items) {
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          tableNumber: data.tableNumber ?? null,
          customer: data.customer ?? null,
        },
        include: { items: true },
      });
      return updatedOrder;
    }

    // Altrimenti aggiorna anche gli ingredienti in transazione
    const items = data.items ?? [];
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Order items non validi per l'aggiornamento");
    }

    // Calcola il nuovo totale ordine
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Recupera i vecchi order items
      const oldOrder = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!oldOrder) throw new Error("Order not found");

      // 2. Ripristina stock ingredienti dei vecchi order items
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

      // 3. Prepara i nuovi order items
      const updateData: any = {
        tableNumber: data.tableNumber ?? null,
        customer: data.customer ?? null,
        total,
        items: {
          deleteMany: {},
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      };

      // 4. Scala stock ingredienti per i nuovi order items
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

      // 5. Aggiorna l'ordine
      const updatedOrder = await tx.order.update({
        where: { id },
        data: updateData,
        include: { items: true },
      });
      return updatedOrder;
    });
    return result;
  }

  // Cancellazione ordine
  static async deleteOrder(id: number) {
    await prisma.$transaction(async (tx) => {
      // Cancella prima tutti gli OrderItem associati
      await tx.orderItem.deleteMany({ where: { orderId: id } });
      // Poi elimina l'ordine
      await tx.order.delete({ where: { id } });
    });
    return { message: "Order deleted successfully" };
  }
}


