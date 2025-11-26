import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// 🔹 Configurazione ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Middleware globali
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 🔹 Route di test
app.get("/", (req: Request, res: Response) => {
  res.send("Pub Manager v1.0 backend is running!");
});

// 🔹 Import e mount moduli
import authRoutes from "./modules/auth/routes/authRoutes";
app.use("/auth", authRoutes);

import userRoutes from "./modules/users/routes/usersRoutes";
app.use("/users", userRoutes);

import inventoryRoutes from "./modules/inventory/routes/inventoryRoutes";
app.use("/inventory", inventoryRoutes);

import productRoutes from "./modules/products/routes/ProductsRoutes";
app.use("/products", productRoutes);

import ordersRoutes from "./modules/orders/routes/ordersRoutes"
app.use("/orders", ordersRoutes);

import tablesRoutes from "./modules/tables/routes/tablesRoutes"
app.use("/tables", tablesRoutes);

import suppliersRoutes from "./modules/suppliers/routes/suppliersRoutes"
app.use("/suppliers", suppliersRoutes);

import purchaseOrdersRoutes from "./modules/suppliers/routes/purchaseOrdersRoutes"
app.use("/purchaseOrders", purchaseOrdersRoutes);

import recipesRoutes from "./modules/recipes/routes/recipesRoutes"
app.use("/recipes", recipesRoutes);

import recipeIngredients from "./modules/recipes/routes/recipeIngredientsRoutes"
app.use("/recipe-ingredients", recipeIngredients);

import categoriesRoutes from "./modules/categories/routes/categoriesRoutes"
app.use("/categories", categoriesRoutes);

import allergensRoutes from "./modules/allergens/routes/allergensRoutes"
app.use("/allergens", allergensRoutes);

// 🔹 Middleware gestione errori
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// 🔹 Avvio server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app; // 🔹 utile se vuoi testare o usare in test/unit

