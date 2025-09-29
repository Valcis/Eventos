import {z} from 'zod';



export const EventoUpsertSchema = z.object({
    id: z.string().uuid().optional(),
    nombre: z.string().min(1).max(100).trim(),
    fecha: z.string().min(1).trim(),
    direccion: z.string().max(150).trim().optional(),
    presupuesto: z.coerce.number().min(0).optional(),
    aforoMaximo: z.coerce.number().int().min(0).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    isActive: z.boolean().default(true),
});
export type EventoUpsert = z.infer<typeof EventoUpsertSchema>;

