import { z } from 'zod';

// Zod schemas for Gasto entity with normalization (trim, bounds)
export const GastoSchema = z.object({
  id: z.string().min(1),
  eventoId: z.string().min(1),
  producto: z.string().trim().min(1).max(120),
  unidad: z.string().trim().min(1).max(30),
  cantidad: z.number().finite().nonnegative(),
  tipoPrecio: z.enum(['bruto', 'neto']),
  tipoIVA: z.number().finite().min(0).max(100),
  base: z.number().finite().min(0),
  iva: z.number().finite().min(0),
  total: z.number().finite().min(0),
  isPack: z.boolean(),
  unidadesPack: z.number().int().positive().optional(),
  precioUnidad: z.number().finite().positive().optional(),
  pagador: z.string().trim().max(60).optional(),
  tienda: z.string().trim().max(60).optional(),
  notas: z.string().trim().max(500).optional(),
  comprobado: z.boolean().default(false),
  locked: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type GastoFromSchema = z.infer<typeof GastoSchema>;

// Upsert schema (no id on create)
export const GastoUpsertSchema = GastoSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
});
