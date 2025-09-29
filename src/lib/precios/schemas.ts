import { z } from 'zod';

export const PrecioUpsertSchema = z.object({
    id: z.string().uuid().optional(),
    eventoId: z.string().min(1),
    concepto: z.string().min(1).trim(),
    importe: z.coerce.number().min(0),
    moneda: z.string().min(1).trim(),
    locked: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    isActive: z.boolean().default(true),
});
export type PrecioUpsert = z.infer<typeof PrecioUpsertSchema>;
