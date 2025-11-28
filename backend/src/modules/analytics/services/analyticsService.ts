import { PrismaClient } from '../../../generated/prisma/client';
import { startOfDay, endOfDay, startOfWeek, startOfMonth } from 'date-fns';

const prisma = new PrismaClient();

export class AnalyticsService {
  // Overview analytics per dashboard
  static async getOverviewAnalytics() {
    // Calcolo date
    const today = startOfDay(new Date());
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const monthStart = startOfMonth(today);

    // ORDERS
    const ordersStats = await prisma.order.aggregate({
      _count: { id: true },
      _avg: { total: true },
      _sum: { total: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // PRODUCTS
    const productsStats = await prisma.product.aggregate({
      _count: { id: true },
    });

    // STOCK (Ingredient)
    const stockStats = await prisma.ingredient.aggregate({
      _count: { id: true },
      _sum: { quantity: true },
    });

    // USERS
    const usersStats = await prisma.user.aggregate({
      _count: { id: true },
    });

    // TABLES
    const tablesStats = await prisma.table.aggregate({
      _count: { id: true },
    });

    // CATEGORIES
    const categoriesStats = await prisma.category.aggregate({
      _count: { id: true },
    });

    return {
      orders: {
        total: ordersStats._count.id || 0,
        avgOrderValue: ordersStats._avg.total || 0,
        totalRevenue: ordersStats._sum.total || 0,
      },
      products: {
        total: productsStats._count.id || 0,
      },
      stock: {
        totalItems: stockStats._count.id || 0,
        totalQuantity: stockStats._sum.quantity || 0,
      },
      users: {
        total: usersStats._count.id || 0,
      },
      tables: {
        total: tablesStats._count.id || 0,
      },
      categories: {
        total: categoriesStats._count.id || 0,
      },
    };
  }

  // Sales analytics per periodo
  static async getSalesAnalytics({ period = 7, startDate, endDate }: { period?: number | undefined; startDate?: string | undefined; endDate?: string | undefined }) {
    let where: any = { status: { in: ['SERVITO', 'PAGATO'] } };
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        where.createdAt = {
          gte: start,
          lte: end,
        };
      }
    } else {
      const safePeriod = typeof period === 'number' && !isNaN(period) && period > 0 ? period : 7;
      const gteDate = new Date(Date.now() - safePeriod * 24 * 60 * 60 * 1000);
      if (!isNaN(gteDate.getTime())) {
        where.createdAt = {
          gte: gteDate,
        };
      }
    }
    const sales = await prisma.order.findMany({
      where,
      select: {
        createdAt: true,
        total: true,
        tableId: true,
      },
    });

    // Aggregazione per giorno
    const dailyMap: Record<string, any> = {};
    let totalOrders = 0;
    let totalRevenue = 0;
    let dineInOrders = 0;
    let takeawayOrders = 0;

    for (const order of sales) {
      const date = new Date(order.createdAt).toISOString().slice(0, 10);
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          orders: 0,
          totalRevenue: 0,
          dineInOrders: 0,
          takeawayOrders: 0,
        };
      }
      dailyMap[date].orders++;
      dailyMap[date].totalRevenue += Number(order.total) || 0;
      if (order.tableId) {
        dailyMap[date].dineInOrders++;
        dineInOrders++;
      } else {
        dailyMap[date].takeawayOrders++;
        takeawayOrders++;
      }
      totalOrders++;
      totalRevenue += Number(order.total) || 0;
    }

    // Calcola avgOrderValue per giorno
    const daily = Object.values(dailyMap).map((d: any) => ({
      ...d,
      avgOrderValue: d.orders > 0 ? d.totalRevenue / d.orders : 0,
    }));

    // Summary
    const summary = {
      orders: totalOrders,
      revenue: totalRevenue,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      dineInOrders,
      takeawayOrders,
    };

    return { daily, summary };
  }

  // Top products analytics
  static async getTopProducts({ limit = 10, period = 30 }: { limit?: number | undefined; period?: number | undefined }) {
    // Calcola la data di inizio periodo
    const safePeriod = typeof period === 'number' && !isNaN(period) && period > 0 ? period : 30;
    const startDate = new Date(Date.now() - safePeriod * 24 * 60 * 60 * 1000);
    const paidOrders = await prisma.order.findMany({
      where: {
        status: { in: ['PAGATO', 'SERVITO'] },
        createdAt: { gte: startDate },
      },
      select: { id: true },
    });
    const paidOrderIds = paidOrders.map(o => o.id);

    // Step 2: recupera gli order_items associati
    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: { in: paidOrderIds },
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        order: true,
      },
    });
    console.log('DEBUG orderItems:', orderItems);

    // Aggrega per prodotto
    const productMap: Record<number, any> = {};
    for (const item of orderItems) {
      const pid = item.productId;
      if (!productMap[pid]) {
        productMap[pid] = {
          id: pid,
          name: item.product?.name || 'Prodotto',
          category: item.product?.category?.name || 'Nessuna categoria',
          categoryColor: item.product?.category?.color || '#6B7280',
          quantity: 0,
          orders: 0,
          revenue: 0,
          avgPrice: 0,
        };
      }
      productMap[pid].quantity += item.quantity;
      productMap[pid].orders += 1;
      productMap[pid].revenue += Number(item.subtotal) || 0;
      productMap[pid].avgPrice += Number(item.priceAtSale) || 0;
    }
    console.log('DEBUG products:', Object.values(productMap));

    // Calcola avgPrice e ranking
    const products = Object.values(productMap).map((p: any, idx) => ({
      ...p,
      avgPrice: p.orders > 0 ? p.avgPrice / p.orders : 0,
      rank: idx + 1,
    }));

    // Ordina per quantità venduta
    products.sort((a: any, b: any) => b.quantity - a.quantity);

    // Restituisci tutti i prodotti aggregati (debug)
    return products;
  }

  // Performance metrics
  static async getPerformanceMetrics() {
    // Recupera tutti gli ordini recenti (ultimi 30 giorni)
    const periodDays = 30;
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        createdAt: true,
        servedAt: true,
        paidAt: true,
        status: true,
        tableId: true,
      },
    });

    // Tempo medio di completamento (da createdAt a servedAt o paidAt)
    let totalTime = 0;
    let completedOrders = 0;
    let lateOrders = 0;
    const lateThresholdMinutes = 30;

    for (const order of orders) {
      let endTime: Date | undefined = undefined;
      if (order.paidAt) {
        endTime = order.paidAt;
      } else if (order.servedAt) {
        endTime = order.servedAt;
      }
      if (endTime) {
        const diffMs = new Date(endTime).getTime() - new Date(order.createdAt).getTime();
        const diffMinutes = diffMs / (1000 * 60);
        totalTime += diffMinutes;
        completedOrders++;
        if (diffMinutes > lateThresholdMinutes) {
          lateOrders++;
        }
      }
    }
    const avgOrderTime = completedOrders > 0 ? totalTime / completedOrders : 0;

    // Occupazione tavoli: ordini con tableId e status NON chiuso (es. diverso da 'PAGATO'/'CANCELLATO')
    const activeTableOrders = orders.filter(o => o.tableId && !['PAGATO', 'CANCELLATO'].includes(o.status));
    const occupiedTables = new Set(activeTableOrders.map(o => o.tableId));

    return {
      avgOrderTime, // minuti
      completedOrders,
      lateOrders,
      lateThresholdMinutes,
      occupiedTables: Array.from(occupiedTables),
      occupiedTablesCount: occupiedTables.size,
    };
  }
}
