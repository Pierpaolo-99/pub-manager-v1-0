import { z } from "zod";

// Validazione per creare un ingrediente
export const createIngredientSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  quantity: z.number().nonnegative("La quantità deve essere >= 0"),
  unit: z.string().min(1, "Unità di misura obbligatoria").optional(),
});

// Validazione per aggiornare un ingrediente
export const updateIngredientSchema = z.object({
  name: z.string().min(1).optional(),
  quantity: z.number().nonnegative().optional(),
  unit: z.string().min(1).optional(),
});
