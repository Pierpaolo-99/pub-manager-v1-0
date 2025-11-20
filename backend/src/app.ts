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

