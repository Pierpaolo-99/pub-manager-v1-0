

import { PrismaClient } from '../../../generated/prisma/client';
const prisma = new PrismaClient();

// Interfaccia per i filtri di getAll
interface RecipeIngredientFilters {
  recipeId?: number | undefined;
  ingredientId?: number | undefined;
  search?: string | undefined;
  isOptional?: boolean | string | undefined;
  preparationStep?: number | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

export class RecipeIngredientsService {
  // Filtri avanzati + paginazione
  static async getAll({ recipeId, ingredientId, search, isOptional, preparationStep, page = 1, pageSize = 20 }: RecipeIngredientFilters = {}) {
    const where: any = {};
    if (recipeId) where.recipeId = recipeId;
    if (ingredientId) where.ingredientId = ingredientId;
    if (isOptional !== undefined) where.isOptional = isOptional === true || isOptional === 'true';
    if (preparationStep) where.preparationStep = preparationStep;
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: 'insensitive' } },
        { unit: { contains: search, mode: 'insensitive' } }
      ];
    }
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      prisma.recipeIngredient.findMany({
        where,
        include: { recipe: true, ingredient: true },
        orderBy: { preparationStep: 'asc' },
        skip,
        take: pageSize
      }),
      prisma.recipeIngredient.count({ where })
    ]);
    return { items, total, page, pageSize, filters: { recipeId, ingredientId, search, isOptional, preparationStep } };
  }

  static async getById(id: number) {
    const item = await prisma.recipeIngredient.findUnique({ where: { id }, include: { recipe: true, ingredient: true } });
    if (!item) throw new Error('Ingrediente ricetta non trovato');
    return item;
  }

  // Create con validazione duplicati
  static async create(data: any) {
    // Un solo ingrediente per ricetta
    const exists = await prisma.recipeIngredient.findFirst({
      where: { recipeId: data.recipeId, ingredientId: data.ingredientId }
    });
    if (exists) throw new Error('Questo ingrediente è già presente nella ricetta');
    return prisma.recipeIngredient.create({ data });
  }

  // Update con validazione duplicati
  static async update(id: number, data: any) {
    if (data.recipeId && data.ingredientId) {
      const exists = await prisma.recipeIngredient.findFirst({
        where: { recipeId: data.recipeId, ingredientId: data.ingredientId, NOT: { id } }
      });
      if (exists) throw new Error('Questo ingrediente è già presente nella ricetta');
    }
    return prisma.recipeIngredient.update({ where: { id }, data });
  }

  static async delete(id: number) {
    return prisma.recipeIngredient.delete({ where: { id } });
  }

  // Statistiche
  static async getStats() {
    const total = await prisma.recipeIngredient.count();
    const optional = await prisma.recipeIngredient.count({ where: { isOptional: true } });
    const steps = await prisma.recipeIngredient.count({ where: { preparationStep: { not: null } } });
    return { total, optional, withPreparationStep: steps };
  }
}
