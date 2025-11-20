import { PrismaClient } from "../../../generated/prisma/client";

const prisma = new PrismaClient();

export class MovementService {
  // Creazione movimento
  static async createMovement(data: {
    ingredientId: number;
    type: "IN" | "OUT";
    quantity: number;
    note?: string;
  }) {
    // Inizio transazione
    return prisma.$transaction(async (prisma) => {
      // Crea il movimento
      const movement = await prisma.movement.create({ data });

      // Aggiorna la quantità dell’ingrediente
      const increment = data.type === "IN" ? data.quantity : -data.quantity;
      await prisma.ingredient.update({
        where: { id: data.ingredientId },
        data: { quantity: { increment } },
      });

      return movement;
    });
  }

  // Recupero tutti i movimenti
  static async getAllMovements() {
    return prisma.movement.findMany({ include: { ingredient: true } });
  }

  // Recupero movimento per ID
  static async getMovementById(id: number) {
    const movement = await prisma.movement.findUnique({ where: { id }, include: { ingredient: true } });
    if (!movement) throw new Error("Movement not found");
    return movement;
  }

  // Aggiornamento movimento
  static async updateMovement(id: number, data: {
    type?: "IN" | "OUT";
    quantity?: number;
    note?: string;
  }) {
    return prisma.$transaction(async (prisma) => {
      // 1️⃣ Recupera il movimento esistente
      const existing = await prisma.movement.findUnique({ where: { id } });
      if (!existing) throw new Error("Movement not found");

      // 2️⃣ Calcola la correzione per la quantità dell'ingrediente
      // Annulla l'effetto del vecchio movimento
      const revert = existing.type === "IN" ? -existing.quantity : existing.quantity;

      // Applica la nuova quantità se fornita, altrimenti mantiene la vecchia
      const newQuantity = data.quantity ?? existing.quantity;
      const newType = data.type ?? existing.type;
      const apply = newType === "IN" ? newQuantity : -newQuantity;

      // 3️⃣ Aggiorna la quantità dell'ingrediente
      await prisma.ingredient.update({
        where: { id: existing.ingredientId },
        data: { quantity: { increment: revert + apply } },
      });

      // 4️⃣ Aggiorna il movimento
      const updated = await prisma.movement.update({
        where: { id },
        data,
      });

      return updated;
    });
  }

  // Eliminazione movimento
  static async deleteMovement(id: number) {
    return prisma.$transaction(async (prisma) => {
      // 1️⃣ Recupera il movimento esistente
      const movement = await prisma.movement.findUnique({ where: { id } });
      if (!movement) throw new Error("Movement not found");

      // 2️⃣ Calcola la correzione della quantità
      // Se era IN, sottrai; se era OUT, aggiungi
      const correction = movement.type === "IN" ? -movement.quantity : movement.quantity;

      // 3️⃣ Aggiorna la quantità dell'ingrediente
      await prisma.ingredient.update({
        where: { id: movement.ingredientId },
        data: { quantity: { increment: correction } },
      });

      // 4️⃣ Elimina il movimento
      await prisma.movement.delete({ where: { id } });

      return { message: "Movement deleted successfully" };
    });
  }
}
