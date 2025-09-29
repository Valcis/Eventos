import { z } from 'zod';

export const eventoSchema = z.object({
    nombre: z.string().trim().min(1).max(120),
    fecha: z.string().trim().min(1),
    ubicacionId: z
        .string()
        .trim()
        .min(1)
        .optional()
        .transform((v) => (v === '' ? undefined : v)),
    presupuesto: z.coerce.number().nonnegative(),
});

export type EventoCreateInput = z.infer<typeof eventoSchema>;
