import {z} from 'zod';

export const precioSchema = z.object({
    eventoId: z.string().min(1),
    concepto: z.string().min(1),
    importe: z.coerce.number().nonnegative(),
});