import { PrismaClient, IngredientCategory, StorageType } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export class IngredientService {
  // Creazione ingrediente con tutti i campi
  static async createIngredient(data: any) {
    // Parsing JSON per allergenInfo e nutritionalInfo
    if (data.allergenInfo && typeof data.allergenInfo !== "string") {
      data.allergenInfo = JSON.stringify(data.allergenInfo);
    }
    if (data.nutritionalInfo && typeof data.nutritionalInfo !== "string") {
      data.nutritionalInfo = JSON.stringify(data.nutritionalInfo);
    }
    return prisma.ingredient.create({ data });
  }

  // Recupero tutti gli ingredienti con filtri avanzati
  static async getAllIngredients(filters: {
    category?: IngredientCategory | "all";
    supplier?: string | "all";
    search?: string;
    active?: boolean | string;
    storageType?: StorageType | "all";
  } = {}) {
    const {
      category,
      supplier,
      search,
      active,
      storageType
    } = filters;

    const where: any = {};
    if (category && category !== "all") where.category = category;
    if (supplier && supplier !== "all") where.supplier = supplier;
    if (storageType && storageType !== "all") where.storageType = storageType;
    if (active !== undefined) where.active = active === true || active === "true";
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { supplierCode: { contains: search, mode: "insensitive" } },
        { barcode: { contains: search, mode: "insensitive" } }
      ];
    }

    const ingredients = await prisma.ingredient.findMany({ where, orderBy: { name: "asc" } });

    // Parsing JSON per i campi
    const processedIngredients = ingredients.map(ingredient => ({
      ...ingredient,
      allergenInfo: ingredient.allergenInfo ? JSON.parse(ingredient.allergenInfo as any) : null,
      nutritionalInfo: ingredient.nutritionalInfo ? JSON.parse(ingredient.nutritionalInfo as any) : null,
      active: Boolean(ingredient.active)
    }));

    return {
      ingredients: processedIngredients,
      total: processedIngredients.length,
      filters: { category, supplier, search, active, storageType }
    };
  }

  // Recupero ingrediente per ID con parsing JSON
  static async getIngredientById(id: number) {
    const ingredient = await prisma.ingredient.findUnique({ where: { id } });
    if (!ingredient) throw new Error("Ingredient not found");
    return {
      ...ingredient,
      allergenInfo: ingredient.allergenInfo ? JSON.parse(ingredient.allergenInfo as any) : null,
      nutritionalInfo: ingredient.nutritionalInfo ? JSON.parse(ingredient.nutritionalInfo as any) : null,
      active: Boolean(ingredient.active)
    };
  }

  // Aggiornamento ingrediente con tutti i campi
  static async updateIngredient(id: number, data: any) {
    if (data.allergenInfo && typeof data.allergenInfo !== "string") {
      data.allergenInfo = JSON.stringify(data.allergenInfo);
    }
    if (data.nutritionalInfo && typeof data.nutritionalInfo !== "string") {
      data.nutritionalInfo = JSON.stringify(data.nutritionalInfo);
    }
    return prisma.ingredient.update({ where: { id }, data });
  }

  // Eliminazione ingrediente
  static async deleteIngredient(id: number) {
    // Elimina prima i collegamenti con i prodotti
    await prisma.productIngredient.deleteMany({ where: { ingredientId: id } });
    await prisma.ingredient.delete({ where: { id } });
    return { message: "Ingredient deleted successfully" };
  }

  // Recupero categorie ingredienti
  static getIngredientCategories() {
    return [
      { value: "beverage", label: "Bevande" },
      { value: "meat", label: "Carne" },
      { value: "fish", label: "Pesce" },
      { value: "vegetable", label: "Verdure" },
      { value: "dairy", label: "Latticini" },
      { value: "grain", label: "Cereali" },
      { value: "spice", label: "Spezie" },
      { value: "sauce", label: "Salse" },
      { value: "other", label: "Altro" }
    ];
  }

  // Recupero tipi di storage
  static getStorageTypes() {
    return [
      { value: "ambient", label: "Ambiente" },
      { value: "refrigerated", label: "Refrigerato" },
      { value: "frozen", label: "Congelato" }
    ];
  }

  // Recupero fornitori disponibili
  static async getSuppliers() {
    const suppliers = await prisma.ingredient.findMany({
      where: { supplier: { not: null } },
      select: { supplier: true },
      distinct: ["supplier"]
    });
    return suppliers.map(row => row.supplier).filter(Boolean);
  }
}
