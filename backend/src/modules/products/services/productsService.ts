import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

type IngredientInput = {
    ingredientId: number;
    quantity: number;
};

type ProductInput = {
    name: string;
    price: number;
    categoryId: number;
    description?: string;
    ingredients?: IngredientInput[];
};

export class ProductService {
    // Creazione prodotto
    static async createProduct(data: ProductInput) {
        const productData: any = {
            name: data.name,
            price: data.price,
            categoryId: data.categoryId,
        };

        if (data.description) productData.description = data.description;

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

    // Recupero tutti i prodotti
    static async getAllProducts() {
        return prisma.product.findMany({
            include: { ingredients: true, category: true },
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
        const updateData: any = {
            name: data.name,
            price: data.price,
            categoryId: data.categoryId,
        };

        if (data.description !== undefined) updateData.description = data.description;

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

