import { PrismaClient, Difficulty } from '../../../generated/prisma/client';

// Interfaccia per i filtri di getAll
interface RecipeFilters {
  search?: string | undefined;
  active?: boolean | string | undefined;
  difficulty?: Difficulty | string | undefined;
  productId?: number | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}
const prisma = new PrismaClient();

export class RecipesService {
    // Prodotti disponibili per ricette
    static async getAvailableProducts() {
      // Prendi solo prodotti attivi NON associati a nessuna ricetta
      const products = await prisma.product.findMany({
        where: {
          active: true,
          recipeId: null // solo prodotti non associati a ricetta
        },
        select: {
          id: true,
          name: true,
          basePrice: true
        },
        orderBy: { name: 'asc' }
      });
      return products;
    }
  // Filtri avanzati + paginazione
  static async getAll({ search, active, difficulty, productId, page = 1, pageSize = 20 }: RecipeFilters = {}) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { instructions: { contains: search } }
      ];
    }
    if (active !== undefined) where.active = active === true || active === 'true';
    if (difficulty) where.difficulty = difficulty;
    if (productId) where.products = { some: { id: productId } };
    const skip = (page - 1) * pageSize;
    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: {
          ingredients: { include: { ingredient: true } },
          products: true
        },
        orderBy: { name: 'asc' },
        skip,
        take: pageSize
      }),
      prisma.recipe.count({ where })
    ]);
    // Statistiche summary
    const summary = {
      total,
      active: recipes.filter(r => r.active).length,
      inactive: recipes.filter(r => !r.active).length,
      withProducts: recipes.filter(r => r.products.length > 0).length
    };
    return { recipes, total, page, pageSize, summary, filters: { search, active, difficulty, productId } };
  }

  // Get by ID con ingredienti/prodotti
  static async getById(id: number) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: { include: { ingredient: true } },
        products: true
      }
    });
    if (!recipe) throw new Error('Ricetta non trovata');
    return recipe;
  }

  // Create con validazione duplicati e ingredienti associati
  static async create(data: any) {
    // Duplicato su nome
    const existing = await prisma.recipe.findUnique({ where: { name: data.name } });
    if (existing) throw new Error('Esiste già una ricetta con questo nome');
    // Ingredienti associati
    const { ingredients, ...recipeData } = data;
    const recipe = await prisma.recipe.create({ data: recipeData });
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      await Promise.all(ingredients.map((item: any) =>
        prisma.recipeIngredient.create({
          data: { ...item, recipeId: recipe.id }
        })
      ));
    }
    return this.getById(recipe.id);
  }

  // Update con ingredienti associati
  static async update(id: number, data: any) {
    // Duplicato su nome (se cambiato)
    if (data.name) {
      const existing = await prisma.recipe.findFirst({ where: { name: data.name, NOT: { id } } });
      if (existing) throw new Error('Esiste già una ricetta con questo nome');
    }
    const { ingredients, ...recipeData } = data;
    const recipe = await prisma.recipe.update({ where: { id }, data: recipeData });
    if (Array.isArray(ingredients)) {
      // Aggiorna ingredienti: elimina e ricrea
      await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
      await Promise.all(ingredients.map((item: any) =>
        prisma.recipeIngredient.create({
          data: { ...item, recipeId: id }
        })
      ));
    }
    return this.getById(id);
  }

  // Soft delete/disattivazione
  static async delete(id: number) {
    await prisma.recipe.update({ where: { id }, data: { active: false } });
    return { message: 'Ricetta disattivata', id };
  }

  // Statistiche globali
  static async getStats() {
    const total = await prisma.recipe.count();
    const active = await prisma.recipe.count({ where: { active: true } });
    const inactive = await prisma.recipe.count({ where: { active: false } });
    const withProducts = await prisma.recipe.count({ where: { products: { some: {} } } });
    return { total, active, inactive, withProducts };
  }
}
