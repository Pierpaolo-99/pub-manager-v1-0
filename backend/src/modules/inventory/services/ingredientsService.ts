import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export class IngredientService {
  // Creazione ingrediente
  static async createIngredient(data: { name: string; quantity: number; unit: string }) {
    return prisma.ingredient.create({ data });
  }

  // Recupero tutti gli ingredienti
  static async getAllIngredients() {
    return prisma.ingredient.findMany();
  }

  // Recupero ingrediente per ID
  static async getIngredientById(id: number) {
    const ingredient = await prisma.ingredient.findUnique({ where: { id } });
    if (!ingredient) throw new Error("Ingredient not found");
    return ingredient;
  }

  // Aggiornamento ingrediente
  static async updateIngredient(id: number, data: Partial<{ name: string; quantity: number; unit?: string }>) {
    return prisma.ingredient.update({ where: { id }, data });
  }

  // Eliminazione ingrediente
  static async deleteIngredient(id: number) {
    // Elimina prima i collegamenti con i prodotti
    await prisma.productIngredient.deleteMany({ where: { ingredientId: id } });
    await prisma.ingredient.delete({ where: { id } });
    return { message: "Ingredient deleted successfully" };
  }
}
