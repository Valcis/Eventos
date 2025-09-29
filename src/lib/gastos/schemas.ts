import {z} from 'zod';

export const GastoUpsertSchema = z.object({
    id: z.string().uuid().optional(),
    eventoId: z.string().min(1),
    producto: z.string().min(1).trim(),
    unidadId: z.string().min(1),
    cantidad: z.coerce.number().min(0),
    tipoPrecio: z.enum(['con IVA', 'sin IVA']),
    tipoIVA: z.coerce.number().min(0),
    precioBase: z.coerce.number().min(0),
    precioNeto: z.coerce.number().min(0),
    isPack: z.boolean().default(false),
    unidadesPack: z.coerce.number().int().min(1).optional(),
    precioUnidad: z.coerce.number().min(0).optional(),
    pagadorId: z.string().min(1).optional(),
    tiendaId: z.string().min(1).optional(),
    notas: z.string().trim().optional(),
    comprobado: z.boolean().default(false),
    locked: z.boolean().default(false),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    isActive: z.boolean().default(true),
});
export type GastoUpsert = z.infer<typeof GastoUpsertSchema>;
