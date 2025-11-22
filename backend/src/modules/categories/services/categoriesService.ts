import { PrismaClient } from '../../../generated/prisma/client';
const prisma = new PrismaClient();

export class CategoriesService {
  static async getAll({ active, search, sortBy = 'sortOrder', sortOrder = 'asc', limit = 100, offset = 0 }: {
    active?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  } = {}) {
    const where: any = {};
    if (active !== undefined) where.active = active;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    const allowedSorts = ['id', 'name', 'sortOrder', 'createdAt'];
    const orderBy = allowedSorts.includes(sortBy)
      ? { [sortBy]: sortOrder === 'desc' ? 'desc' as const : 'asc' as const }
      : { sortOrder: 'asc' as const };
    return prisma.category.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: { products: true }
    });
  }

  static async getActive() {
    return prisma.category.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, description: true, icon: true, color: true, sortOrder: true }
    });
  }

  static async getById(id: number) {
    return prisma.category.findUnique({ where: { id }, include: { products: true } });
  }

  static async create(data: any) {
    return prisma.category.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.category.update({ where: { id }, data });
  }

  static async delete(id: number) {
    // Controllo dipendenze: non elimina se ci sono prodotti collegati
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new Error(`Impossibile eliminare: ${productCount} prodotti collegati a questa categoria`);
    }
    return prisma.category.delete({ where: { id } });
  }

  static async getStats() {
    const total = await prisma.category.count();
    const active = await prisma.category.count({ where: { active: true } });
    const inactive = await prisma.category.count({ where: { active: false } });
    const productsWithCategory = await prisma.product.count({ where: { categoryId: { not: null } } });
    const productsWithoutCategory = await prisma.product.count({ where: { categoryId: null } });
    return {
      totalCategories: total,
      activeCategories: active,
      inactiveCategories: inactive,
      totalProductsWithCategory: productsWithCategory,
      productsWithoutCategory
    };
  }
}
