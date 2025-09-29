import {z} from "zod";
import {MetodoPago, TipoConsumo} from "../shared/types";


export const reservaSchema = z.object({
    eventoId: z.string().min(1),
    cliente: z.string().min(1),
    parrilladas: z.coerce.number().int().nonnegative(),
    picarones: z.coerce.number().int().nonnegative(),
    tipoConsumo: z.custom<TipoConsumo>(
        (v) => v === 'comer_aqui' || v === 'para_llevar' || v === 'domicilio',
    ),
    puntoRecogidaId: z.string().optional(),
    metodoPago: z.custom<MetodoPago>((v) => v === 'efectivo' || v === 'tarjeta' || v === 'bizum'),
    receptor: z.string().optional(),
    totalPedido: z.coerce.number().nonnegative(),
    pagado: z.coerce.boolean(),
    comprobado: z.coerce.boolean(),
    locked: z.coerce.boolean().default(false),
});