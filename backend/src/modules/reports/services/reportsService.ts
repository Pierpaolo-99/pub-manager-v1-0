import { PrismaClient } from '../../../generated/prisma/client';
const prisma = new PrismaClient();

export class ReportsService {
  // Aggregazione vendite per periodo
  static async getSalesReport({ startDate, endDate, groupBy = 'day' }: { startDate: Date; endDate: Date; groupBy?: 'day' | 'hour' | 'month' | 'year' }) {
    // Recupera ordini filtrati
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ['SERVITO', 'PAGATO'] },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
      },
    });

    // Funzione per ottenere la chiave di raggruppamento
    function getGroupKey(date: Date): string {
      const d = new Date(date);
      if (groupBy === 'day') return (d.toISOString().split('T')[0] || d.toISOString());
      if (groupBy === 'month') return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (groupBy === 'year') return `${d.getFullYear()}`;
      if (groupBy === 'hour') return `${d.toISOString().split('T')[0]} ${d.getHours()}:00`;
      return d.toISOString();
    }

    // Raggruppa ordini
    const grouped: Record<string, { totals: number[]; ids: number[] }> = {};
    for (const order of orders) {
      const key = getGroupKey(order.createdAt);
      if (!grouped[key]) grouped[key] = { totals: [], ids: [] };
      grouped[key].totals.push(Number(order.total));
      grouped[key].ids.push(order.id);
    }

    // Costruisci la risposta personalizzata
    const result = Object.entries(grouped).map(([period, data]) => {
      const count = data.ids.length;
      const sum = data.totals.reduce((a, b) => a + b, 0);
      const avg = count > 0 ? sum / count : 0;
      const min = Math.min(...data.totals);
      const max = Math.max(...data.totals);
      return {
        period,
        orders_count: count,
        total_revenue: sum,
        avg_order_value: avg,
        min_order: min,
        max_order: max,
      };
    });
    return result;
  }

  // Top prodotti venduti
  static async getTopProducts({ startDate, endDate, limit = 10, categoryId }: { startDate: Date; endDate: Date; limit?: number; categoryId?: number }) {
    // Primo step: aggrega per prodotto
    const grouped = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          status: { in: ['SERVITO', 'PAGATO'] },
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        ...(categoryId && { product: { categoryId } }),
      },
      _sum: { quantity: true, subtotal: true },
      _count: { orderId: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    // Calcola revenue totale per percentuali
    const totalRevenue = grouped.reduce((sum, p) => sum + Number(p._sum.subtotal || 0), 0);

    // Recupera dettagli prodotto e categoria
    const productIds = grouped.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });
    // Mappa per accesso rapido
    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    // Costruisci risposta arricchita
    return grouped.map((row, idx) => {
      const prod = productMap[row.productId];
      return {
        rank: idx + 1,
        productId: row.productId,
        productName: prod?.name || '',
        category: prod?.category?.name || '',
        categoryColor: prod?.category?.color || '',
        quantitySold: Number(row._sum.quantity || 0),
        ordersCount: row._count.orderId,
        totalRevenue: Number(row._sum.subtotal || 0),
        revenuePercentage: totalRevenue > 0 ? Math.round((Number(row._sum.subtotal || 0) / totalRevenue) * 10000) / 100 : 0,
      };
    });
  }

  // Report inventario
  static async getInventoryReport({ status, supplier, expiringDays = 30 }: { status?: string; supplier?: string; expiringDays?: number }) {
    const ingredients = await prisma.ingredient.findMany({
      where: {
        ...(supplier && { supplier: { contains: supplier } }),
        active: true,
      },
      include: {
        movements: true,
      },
    });

    // Calcolo breakdown per stato (esempio semplificato)
    let ok = 0, esaurito = 0, critico = 0;
    let totalQuantity = 0, totalValue = 0;
    for (const ing of ingredients) {
      totalQuantity += Number(ing.quantity || 0);
      totalValue += Number(ing.quantity || 0) * Number(ing.costPerUnit || 0);
      if (ing.quantity <= 0) esaurito++;
      else if (ing.quantity <= 5) critico++; // Soglia esempio
      else ok++;
    }

    const stats = {
      total_items: ingredients.length,
      total_quantity: totalQuantity,
      total_value: Math.round(totalValue * 100) / 100,
      status_breakdown: { ok, esaurito, critico }
    };

    return { inventory: ingredients, stats };
  }

  // Analisi costi
  static async getCostsAnalysis({ startDate, endDate }: { startDate: Date; endDate: Date }) {
    // Ricavi
    const revenueAgg = await prisma.order.aggregate({
      where: {
        status: { in: ['SERVITO', 'PAGATO'] },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { total: true },
      _count: { id: true },
      _avg: { total: true },
    });
    // Costi acquisti
    const purchaseAgg = await prisma.purchaseOrder.aggregate({
      where: {
        status: { in: ['RECEIVED'] },
        actualDeliveryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { total: true },
      _count: { id: true },
      _avg: { total: true },
    });

    // Breakdown leggibile
    const revenue = {
      total: Number(revenueAgg._sum.total) || 0,
      orders: revenueAgg._count.id || 0,
      avg_order: Number(revenueAgg._avg.total) || 0
    };
    const purchaseCosts = {
      total: Number(purchaseAgg._sum.total) || 0,
      orders: purchaseAgg._count.id || 0,
      avg_order: Number(purchaseAgg._avg.total) || 0
    };
    const profit = revenue.total - purchaseCosts.total;
    const margin_percentage = revenue.total > 0 ? Math.round((profit / revenue.total) * 10000) / 100 : 0;

    return { revenue, purchaseCosts, profit, margin_percentage };
  }

  // Statistiche rapide dashboard
  static async getQuickStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Statistiche di oggi
    const todayStats = await prisma.order.aggregate({
      where: {
        status: { in: ['SERVITO', 'PAGATO'] },
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      _count: { id: true },
      _sum: { total: true },
      _avg: { total: true },
    });
    // Statistiche di ieri
    const yesterdayStats = await prisma.order.aggregate({
      where: {
        status: { in: ['SERVITO', 'PAGATO'] },
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
      _count: { id: true },
      _sum: { total: true },
      _avg: { total: true },
    });

    // Calcola variazioni percentuali
    const revenueChange = (Number(yesterdayStats._sum.total) > 0)
      ? ((Number(todayStats._sum.total) - Number(yesterdayStats._sum.total)) / Number(yesterdayStats._sum.total)) * 100
      : 0;
    const ordersChange = (yesterdayStats._count.id > 0)
      ? ((todayStats._count.id - yesterdayStats._count.id) / yesterdayStats._count.id) * 100
      : 0;

    return {
      today: {
        orders: todayStats._count.id || 0,
        revenue: Number(todayStats._sum.total) || 0,
        avg_order: Number(todayStats._avg.total) || 0
      },
      yesterday: {
        orders: yesterdayStats._count.id || 0,
        revenue: Number(yesterdayStats._sum.total) || 0,
        avg_order: Number(yesterdayStats._avg.total) || 0
      },
      revenue_change: Math.round(revenueChange * 100) / 100,
      orders_change: Math.round(ordersChange * 100) / 100,
      timestamp: new Date().toISOString()
    };
  }
}
