import { PrismaClient, Prisma } from '../../../generated/prisma/client';

const prisma = new PrismaClient();

export class AllergensService {
  // GET tutti gli allergeni con filtri
  async getAllergens({ active, search, limit = 100, offset = 0 }: {
    active?: boolean | 'all' | undefined;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: Prisma.AllergenWhereInput = {};
    if (active !== undefined && active !== 'all') {
      where.active = active === true;
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }
    const allergens = await prisma.allergen.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: offset,
      take: limit
    });
    return allergens;
  }

  // GET solo allergeni attivi (per dropdown)
  async getActiveAllergens() {
    return prisma.allergen.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true, description: true }
    });
  }

  // GET singolo allergene per ID
  async getAllergenById(id: number) {
    return prisma.allergen.findUnique({ where: { id } });
  }

  // GET statistiche allergeni
  async getAllergenStats() {
    const [total, active, inactive, totalProductAllergenAssociations, productsWithAllergensArr] = await Promise.all([
      prisma.allergen.count(),
      prisma.allergen.count({ where: { active: true } }),
      prisma.allergen.count({ where: { active: false } }),
      prisma.productAllergen.count(),
      prisma.productAllergen.findMany({ select: { productId: true }, distinct: ['productId'] })
    ]);
    return {
      total_allergens: total,
      active_allergens: active,
      inactive_allergens: inactive,
      products_with_allergens: productsWithAllergensArr.length,
      total_product_allergen_associations: totalProductAllergenAssociations
    };
  }

  // POST nuovo allergene
  async createAllergen(data: {
    name: string;
    description?: string;
    active?: boolean;
  }) {
    // Verifica duplicato
    const exists = await prisma.allergen.findUnique({ where: { name: data.name } });
    if (exists) throw new Error('Un allergene con questo nome esiste già');
    return prisma.allergen.create({ data });
  }

  // PATCH aggiornamento allergene
  async updateAllergen(id: number, data: Partial<{ name: string; description: string; active: boolean; }>) {
    // Verifica esistenza
    const allergen = await prisma.allergen.findUnique({ where: { id } });
    if (!allergen) throw new Error('Allergene non trovato');
    if (data.name && data.name !== allergen.name) {
      const duplicate = await prisma.allergen.findUnique({ where: { name: data.name } });
      if (duplicate) throw new Error('Un allergene con questo nome esiste già');
    }
    return prisma.allergen.update({ where: { id }, data });
  }

  // DELETE allergene
  async deleteAllergen(id: number) {
    // Controlla dipendenze
    const productCount = await prisma.productAllergen.count({ where: { allergenId: id } });
    if (productCount > 0) throw new Error(`Impossibile eliminare: ${productCount} prodotti collegati a questo allergene`);
    return prisma.allergen.delete({ where: { id } });
  }

  // GET allergeni per prodotto specifico
  async getProductAllergens(productId: number) {
    return prisma.productAllergen.findMany({
      where: { productId },
      include: { allergen: true }
    });
  }

  // POST assegna allergene a prodotto
  async addAllergenToProduct(productId: number, allergenId: number) {
    // Verifica duplicato
    const exists = await prisma.productAllergen.findFirst({ where: { productId, allergenId } });
    if (exists) throw new Error('Associazione già esistente tra prodotto e allergene');
    // Verifica esistenza prodotto/allergene
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error('Prodotto non trovato');
    const allergen = await prisma.allergen.findUnique({ where: { id: allergenId, active: true } });
    if (!allergen) throw new Error('Allergene non trovato o non attivo');
    return prisma.productAllergen.create({ data: { productId, allergenId } });
  }

  // DELETE rimuovi allergene da prodotto
  async removeAllergenFromProduct(productId: number, allergenId: number) {
    const result = await prisma.productAllergen.deleteMany({ where: { productId, allergenId } });
    return result.count;
  }
}

export const allergensService = new AllergensService();
