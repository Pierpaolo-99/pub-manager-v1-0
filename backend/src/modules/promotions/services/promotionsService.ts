import { PrismaClient, PromotionType } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

export class PromotionsService {
  // Crea una promozione
  static async createPromotion(data: any) {
    return prisma.promotion.create({ data });
  }

  // Ottieni tutte le promozioni (con filtri opzionali)
  static async getAllPromotions({ active, type, productId, categoryId }: { active?: boolean; type?: PromotionType; productId?: number; categoryId?: number } = {}) {
    return prisma.promotion.findMany({
      where: {
        ...(active !== undefined ? { active } : {}),
        ...(type ? { type } : {}),
        ...(productId ? { products: { some: { productId } } } : {}),
        ...(categoryId ? { categories: { some: { categoryId } } } : {}),
      },
      include: {
        products: { include: { product: true } },
        categories: { include: { category: true } },
        orders: true,
      },
    });
  }

  // Ottieni una promozione per ID
  static async getPromotionById(id: number) {
    return prisma.promotion.findUnique({
      where: { id },
      include: {
        products: { include: { product: true } },
        categories: { include: { category: true } },
        orders: true,
      },
    });
  }

  // Aggiorna una promozione
  static async updatePromotion(id: number, data: any) {
    return prisma.promotion.update({
      where: { id },
      data,
    });
  }

  // Elimina una promozione
  static async deletePromotion(id: number) {
    return prisma.promotion.delete({
      where: { id },
    });
  }

  // Associa una promozione a un prodotto
  static async addPromotionToProduct(promotionId: number, productId: number) {
    return prisma.promotionProduct.create({
      data: { promotionId, productId },
    });
  }

  // Rimuovi associazione promozione-prodotto
  static async removePromotionFromProduct(promotionId: number, productId: number) {
    return prisma.promotionProduct.delete({
      where: { promotionId_productId: { promotionId, productId } },
    });
  }

  // Associa una promozione a una categoria
  static async addPromotionToCategory(promotionId: number, categoryId: number) {
    return prisma.promotionCategory.create({
      data: { promotionId, categoryId },
    });
  }

  // Rimuovi associazione promozione-categoria
  static async removePromotionFromCategory(promotionId: number, categoryId: number) {
    return prisma.promotionCategory.delete({
      where: { promotionId_categoryId: { promotionId, categoryId } },
    });
  }

  // Statistiche: promozioni attive e utilizzi
  static async getPromotionStats() {
    return prisma.promotion.findMany({
      select: {
        id: true,
        name: true,
        active: true,
        currentUses: true,
        maxUses: true,
        orders: { select: { id: true } },
      },
    });
  }
}
