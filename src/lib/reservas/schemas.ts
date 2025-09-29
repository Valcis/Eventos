import {z} from 'zod';


export const ReservaUpsertSchema = z.object({
    id: z.string().uuid().optional(),
    eventoId: z.string().min(1),
    cliente: z.string().min(1).trim(),
    parrilladas: z.coerce.number().int().min(0),
    picarones: z.coerce.number().int().min(0),
    metodoPagoId: z.string().min(1),
    receptorId: z.string().min(1),
    tipoConsumoId: z.string().min(1),
    comercialId: z.string().min(1),
    totalPedido: z.coerce.number().min(0),
    pagado: z.boolean().default(false),
    comprobado: z.boolean().default(false),
    locked: z.boolean().default(false),
    puntoRecogidaId: z.string().min(1).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    isActive: z.boolean().default(true),
});
export type ReservaUpsert = z.infer<typeof ReservaUpsertSchema>;


