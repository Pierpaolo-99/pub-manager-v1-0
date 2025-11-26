import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

type IngredientInput = {
    ingredientId: number;
    quantity: number;
};

type ProductInput = {
    name: string;
    basePrice: number;
    categoryId: number;
    description?: string;
    imageUrl?: string;
    active?: boolean;
    featured?: boolean;
    sortOrder?: number;
    preparationTime?: number;
    calories?: number;
    ingredients?: IngredientInput[];
};

export class ProductService {
            // Recupera tutti gli allergeni (diretti e da ingredienti) di un prodotto
            static async getAllergensForProduct(productId: number) {
                // Allergeni associati direttamente al prodotto
                const direct = await prisma.productAllergen.findMany({
                    where: { productId },
                    include: { allergen: true }
                });

                // Allergeni associati agli ingredienti del prodotto
                const ingredientAllergens = await prisma.productIngredient.findMany({
                    where: { productId },
                    include: {
                        ingredient: {
                            include: {
                                ingredientAllergens: {
                                    include: { allergen: true }
                                }
                            }
                        }
                    }
                });

                // Estraggo tutti gli allergeni dagli ingredienti
                const allergensFromIngredients = ingredientAllergens
                    .flatMap(pi => pi.ingredient.ingredientAllergens.map(ia => ia.allergen));

                // Estraggo tutti gli allergeni diretti
                const directAllergens = direct.map(pa => pa.allergen);

                // Unisco e rimuovo duplicati (per id)
                const allAllergens = [...directAllergens, ...allergensFromIngredients];
                const uniqueAllergens = Object.values(
                    allAllergens.reduce((acc, allergen) => {
                        acc[allergen.id] = allergen;
                        return acc;
                    }, {} as Record<number, typeof allAllergens[0]>)
                );

                return uniqueAllergens;
            }
        // Statistiche prodotti
        static async getProductStats() {
            const [stats] = await prisma.$queryRawUnsafe<any[]>(`
                SELECT 
                    COUNT(*) as total_products,
                    COUNT(CASE WHEN active = 1 THEN 1 END) as active_products,
                    COUNT(CASE WHEN featured = 1 THEN 1 END) as featured_products,
                    AVG(basePrice) as avg_price,
                    MIN(basePrice) as min_price,
                    MAX(basePrice) as max_price,
                    AVG(preparationTime) as avg_prep_time,
                    COUNT(DISTINCT categoryId) as categories_count
                FROM products
            `);
            // Conversione BigInt in Number
            Object.keys(stats).forEach(key => {
                if (typeof stats[key] === 'bigint') {
                    stats[key] = Number(stats[key]);
                }
            });
            return stats;
        }
    // Creazione prodotto
    static async createProduct(data: ProductInput) {
        const productData: any = {
            name: data.name,
            basePrice: data.basePrice,
            categoryId: data.categoryId,
        };

        if (data.description) productData.description = data.description;
        if (data.imageUrl) productData.imageUrl = data.imageUrl;
        if (data.active !== undefined) productData.active = data.active;
        if (data.featured !== undefined) productData.featured = data.featured;
        if (data.sortOrder !== undefined) productData.sortOrder = data.sortOrder;
        if (data.preparationTime !== undefined) productData.preparationTime = data.preparationTime;
        if (data.calories !== undefined) productData.calories = data.calories;

        if (data.ingredients && data.ingredients.length > 0) {
            productData.ingredients = {
                create: data.ingredients.map((i) => ({
                    ingredientId: i.ingredientId,
                    quantity: i.quantity,
                })),
            };
        }

        const product = await prisma.product.create({
            data: productData,
            include: { ingredients: true, category: true },
        });

        return product;
    }

    // Recupero tutti i prodotti con filtri, paginazione e ordinamento
    static async getAllProducts(params: {
        categoryId?: number;
        active?: boolean | "all";
        featured?: boolean | "all";
        search?: string;
        limit?: number;
        offset?: number;
        sort_by?: string;
        sort_direction?: "ASC" | "DESC";
    } = {}) {
        const {
            categoryId,
            active,
            featured,
            search,
            limit = 100,
            offset = 0,
            sort_by = "sortOrder",
            sort_direction = "ASC"
        } = params;

        // Costruisci i filtri
        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (active !== undefined && active !== "all") where.active = !!active;
        if (featured !== undefined && featured !== "all") where.featured = !!featured;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } }
            ];
        }

        // Validazione campi ordinamento
        const validSortFields = ["name", "basePrice", "sortOrder", "createdAt", "preparationTime", "calories"];
        const sortField = validSortFields.includes(sort_by || "") ? sort_by : "sortOrder";
        const sortDir = sort_direction === "DESC" ? "desc" : "asc";

        return prisma.product.findMany({
            where,
            include: { ingredients: true, category: true },
            orderBy: { [sortField]: sortDir },
            take: limit,
            skip: offset,
        });
    }

    // Recupero prodotto per ID
    static async getProductById(id: number) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { ingredients: true, category: true },
        });
        if (!product) throw new Error("Product not found");
        return product;
    }

    // Aggiornamento prodotto
    static async updateProduct(id: number, data: ProductInput) {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.basePrice !== undefined) updateData.basePrice = data.basePrice;
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.active !== undefined) updateData.active = data.active;
        if (data.featured !== undefined) updateData.featured = data.featured;
        if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
        if (data.preparationTime !== undefined) updateData.preparationTime = data.preparationTime;
        if (data.calories !== undefined) updateData.calories = data.calories;

        if (data.ingredients) {
            // Se arrivano ingredienti, eliminare quelli esistenti e creare i nuovi
            updateData.ingredients = {
                deleteMany: {},
                create: data.ingredients.map((i) => ({
                    ingredientId: i.ingredientId,
                    quantity: i.quantity,
                })),
            };
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
            include: { ingredients: true, category: true },
        });

        return updatedProduct;
    }

    // Eliminazione prodotto
    static async deleteProduct(id: number) {
        // Rimuovi prima i collegamenti con gli ingredienti
        await prisma.productIngredient.deleteMany({
            where: { productId: id },
        });

        // Poi elimina il prodotto
        await prisma.product.delete({
            where: { id },
        });

        return { message: "Product deleted successfully" };
    }
}

