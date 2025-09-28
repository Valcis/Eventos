import { z } from 'zod';

export const BaseItemSchema = z.object({
  id: z.string().min(1),
  nombre: z.string().trim().min(1).max(120),
  activo: z.boolean(),
  notas: z.string().trim().max(500).optional(),
});

export const ComercialSchema = BaseItemSchema.extend({
  telefono: z.string().trim().max(40).optional(),
});
export const MetodoPagoSchema = BaseItemSchema.extend({
  requiereReceptor: z.boolean().default(false),
});
export const PagadorSchema = BaseItemSchema;
export const TiendaSchema = BaseItemSchema.extend({
  direccion: z.string().trim().max(200).optional(),
  horario: z.string().trim().max(120).optional(),
});
export const UnidadSchema = BaseItemSchema;
export const TipoPrecioSchema = BaseItemSchema.refine(
  (v) => ['con_iva', 'sin_iva'].includes(v.nombre),
  {
    message: 'Tipo de precio inválido (usa con_iva/sin_iva)',
  },
);
export const TipoConsumoSchema = BaseItemSchema.refine(
  (v) => ['comer_aqui', 'recoger'].includes(v.nombre),
  {
    message: 'Tipo de consumo inválido (usa comer_aqui/recoger)',
  },
);
export const BenefBizumSchema = BaseItemSchema;
export const PuntoRecogidaSchema = BaseItemSchema.extend({
  direccion: z.string().trim().max(200).optional(),
  horario: z.string().trim().max(120).optional(),
  comentarios: z.string().trim().max(500).optional(),
});

export type Comercial = z.infer<typeof ComercialSchema>;
export type MetodoPago = z.infer<typeof MetodoPagoSchema>;
export type Pagador = z.infer<typeof PagadorSchema>;
export type Tienda = z.infer<typeof TiendaSchema>;
export type Unidad = z.infer<typeof UnidadSchema>;
export type TipoPrecio = z.infer<typeof TipoPrecioSchema>;
export type TipoConsumo = z.infer<typeof TipoConsumoSchema>;
export type BenefBizum = z.infer<typeof BenefBizumSchema>;
export type PuntoRecogida = z.infer<typeof PuntoRecogidaSchema>;
