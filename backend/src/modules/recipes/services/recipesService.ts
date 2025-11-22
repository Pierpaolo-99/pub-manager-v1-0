import { PrismaClient } from '../../../generated/prisma/client';
const prisma = new PrismaClient();

export const RecipesService = {
  async getAll() {
    return prisma.recipe.findMany({ include: { ingredients: true, products: true } });
  },
  async getById(id: number) {
    return prisma.recipe.findUnique({ where: { id }, include: { ingredients: true, products: true } });
  },
  async create(data: any) {
    return prisma.recipe.create({ data });
  },
  async update(id: number, data: any) {
    return prisma.recipe.update({ where: { id }, data });
  },
  async delete(id: number) {
    return prisma.recipe.delete({ where: { id } });
  }
};
