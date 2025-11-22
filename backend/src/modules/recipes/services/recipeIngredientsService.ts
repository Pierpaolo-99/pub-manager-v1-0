import { PrismaClient } from '../../../generated/prisma/client';
const prisma = new PrismaClient();

export const RecipeIngredientsService = {
  async getAll() {
    return prisma.recipeIngredient.findMany({ include: { recipe: true, ingredient: true } });
  },
  async getById(id: number) {
    return prisma.recipeIngredient.findUnique({ where: { id }, include: { recipe: true, ingredient: true } });
  },
  async create(data: any) {
    return prisma.recipeIngredient.create({ data });
  },
  async update(id: number, data: any) {
    return prisma.recipeIngredient.update({ where: { id }, data });
  },
  async delete(id: number) {
    return prisma.recipeIngredient.delete({ where: { id } });
  }
};
