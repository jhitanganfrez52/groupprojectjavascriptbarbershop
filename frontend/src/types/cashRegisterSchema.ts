// src/types/cashRegisterSchema.ts
import { z } from "zod";

export const cashRegisterSchema = z.object({
  type: z.enum(["income", "expense"]),
  concept: z.string(),
  amount: z.number(),
  method: z.enum(["cash", "qr", "card"]),
  reservationId: z.number().optional(),
  serviceId: z.number().optional(),

  date: z.union([z.string(), z.date()]).optional(),
});

export type CashRegister = z.infer<typeof cashRegisterSchema>; // exporta el tipo