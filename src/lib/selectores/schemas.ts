import {z} from 'zod';
import {registerSchema} from '../shared/ui/schemaRegistry';

export const BaseItemSchema = z.object({
    id: z.string().min(1),
    nombre: z.string().trim().min(1).max(120),
    activo: z.boolean(),
    notas: z.string().trim().max(500).optional(),
});
// registerSchema('baseItems', BaseItemSchema);

export const ComercialSchema = BaseItemSchema.extend({
    telefono: z.string().trim().max(15).optional(),
});
registerSchema('comercial', ComercialSchema);

export const MetodoPagoSchema = BaseItemSchema.extend({
    requiereReceptor: z.boolean().default(false),
});
registerSchema('metodoPago', MetodoPagoSchema);

export const PagadorSchema = BaseItemSchema;
registerSchema('pagador', PagadorSchema);

export const TiendaSchema = BaseItemSchema.extend({
    direccion: z.string().trim().max(200).optional(),
    horario: z.string().trim().max(120).optional(),
});
registerSchema('tienda', TiendaSchema);

export const UnidadSchema = BaseItemSchema;
registerSchema('unidad', UnidadSchema);

export const TipoPrecioSchema = BaseItemSchema.refine(
    (v) => ['con_iva', 'sin_iva'].includes(v.nombre),
    {message: 'Tipo de precio inválido (usa con_iva/sin_iva)',},
);

export const TipoConsumoSchema = BaseItemSchema.refine(
    (v) => ['comer_aqui', 'recoger'].includes(v.nombre),
    {message: 'Tipo de consumo inválido (usa comer_aqui/recoger)',},
);

export const ReceptorCobradorSchema = BaseItemSchema;
registerSchema('receptorCobrador', ReceptorCobradorSchema);

export const PuntoRecogidaSchema = BaseItemSchema.extend({
    direccion: z.string().trim().max(200).optional(),
    horario: z.string().trim().max(120).optional(),
});
registerSchema('puntoRecogida', PuntoRecogidaSchema);

export type Comercial = z.infer<typeof ComercialSchema>;
export type MetodoPago = z.infer<typeof MetodoPagoSchema>;
export type Pagador = z.infer<typeof PagadorSchema>;
export type Tienda = z.infer<typeof TiendaSchema>;
export type Unidad = z.infer<typeof UnidadSchema>;
export type TipoPrecio = z.infer<typeof TipoPrecioSchema>;
export type TipoConsumo = z.infer<typeof TipoConsumoSchema>;
export type ReceptorCobrador = z.infer<typeof ReceptorCobradorSchema>;
export type PuntoRecogida = z.infer<typeof PuntoRecogidaSchema>;
