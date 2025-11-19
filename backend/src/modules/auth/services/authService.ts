import bcrypt from "bcrypt";
import { User } from "../models/User";

const users: User[] = []; // mock DB per ora

export const registerUser = async (username: string, email: string, password: string) => {
  // Controllo duplicati
  if (users.find(u => u.email === email)) {
    throw new Error("Email already registered");
  }

  // Hash password
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
