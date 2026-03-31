import { z } from "zod";

export const companySchema = z.object({
  idCompany: z.number().optional(),

  companyName: z
    .string()
    .min(1, "El nombre de la empresa es obligatorio"),

  logoImage: z.string().url().nullable().optional(),

  qrImage: z.string().url().nullable().optional(),

  phoneNumber: z
    .string()
    .min(6, "Teléfono muy corto")
    .nullable()
    .optional(),

  email: z
    .string()
    .email("Email inválido")
    .nullable()
    .optional(),

  address: z
    .string()
    .min(3, "Dirección muy corta")
    .nullable()
    .optional(),
});

/* ✅ ESTO ES LO QUE TE FALTA */
export type Company = z.infer<typeof companySchema>;