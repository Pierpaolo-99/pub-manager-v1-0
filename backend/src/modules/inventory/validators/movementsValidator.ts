import { z } from "zod";

// Tipo di movimento: entrata o uscita
export const movementTypeEnum = z.enum(["IN", "OUT"]);

// Validazione per creare un movimento di magazzino
export const createMovementSchema = z.object({
  ingredientId: z.number(),
  type: movementTypeEnum,
  quantity: z.number().positive("La quantità deve essere maggiore di 0"),
  note: z.string().optional(),
});

// Validazione per aggiornare un movimento
export const updateMovementSchema = z.object({
  type: movementTypeEnum.optional(),
  quantity: z.number().positive().optional(),
  note: z.string().optional(),
});
