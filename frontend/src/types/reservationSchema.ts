// src/types/reservationSchema.ts
import { z } from "zod";

export const serviceSchema = z.object({
  idService: z.number(),
  name: z.string(),
  price: z.number(),
});

export const clientSchema = z.object({
  id: z.number().optional(),
  firstName: z.string(),
});

export const reservationSchema = z.object({
  idReservation: z.number().optional(),
  date: z.string().optional(),

  startTime: z.string(),
  endTime: z.string(),
  detail: z.string(),

  status: z.enum([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ]),

  clientId: z.number(),
  availabilityId: z.number(),

  // 🔥 RELACIONES BIEN TIPADAS
  client: clientSchema.optional(),
  services: z.array(serviceSchema).optional(),
});

export type Reservation = z.infer<typeof reservationSchema>;