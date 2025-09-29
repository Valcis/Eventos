import {z} from "zod";

export const eventoSchema = z.object({
    nombre: z.string().min(1),
    fecha: z.string().min(1),
    ubicacionId: z.string().optional(),
    presupuesto: z.coerce.number().nonnegative(),
});