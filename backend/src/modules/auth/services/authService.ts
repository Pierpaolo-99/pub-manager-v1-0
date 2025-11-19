import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

// Mock database temporaneo
const users: User[] = [];

export const registerUser = async (username: string, email: string, password: string) => {
  if (users.find(u => u.email === email)) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    role: "staff"
  };

  users.push(newUser);
  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  const secret: jwt.Secret = process.env.JWT_SECRET || "fallbacksecret";

  // 🔹 expiresIn come numero di secondi, TypeScript-friendly
  const expiresIn = process.env.JWT_EXPIRES_IN
    ? parseInt(process.env.JWT_EXPIRES_IN, 10)
    : 86400; // fallback 1 giorno

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    secret,
    { expiresIn } // ✅ ora TypeScript accetta senza errori
  );

  return { user, token };
};


