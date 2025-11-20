import { PrismaClient, Role } from "../../../generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export class UserService {
  // Creazione utente
  static async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
  }) {
    // Controllo se l'utente esiste già
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || "USER",
      },
    });

    return user;
  }

  // Recupero tutti gli utenti
  static async getAllUsers() {
    return prisma.user.findMany();
  }

  // Recupero singolo utente per ID
  static async getUserById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");
    return user;
  }

  // Aggiornamento utente
  static async updateUser(id: number, data: Partial<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
  }>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return updatedUser;
  }

  // Cancellazione utente
  static async deleteUser(id: number) {
    await prisma.user.delete({ where: { id } });
    return { message: "User deleted successfully" };
  }
}
