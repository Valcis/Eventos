import {z} from "zod";
import {Selectores} from "./types";

/** Esquema base alineado con Selectores.BaseItem (id, nombre, activo, notas). */
const BaseItemSchema = z.object({
    id: z.string().min(1),
    nombre: z.string().trim().min(1).max(120),
    activo: z.boolean(),
    notas: z.string().trim().max(500).optional(),
});

/** 1) Comerciales */
export const ComercialSchema = BaseItemSchema.extend({
    telefono: z.string().trim().max(20).optional(),
});
export type Comercial = Selectores.Comercial;

/** 2) Métodos de pago */
export const MetodoPagoSchema = BaseItemSchema.extend({
    requiereReceptor: z.boolean().optional(),
});
export type MetodoPago = Selectores.MetodoPago;

/** 3) Pagadores */
export const PagadorSchema = BaseItemSchema.extend({
    telefono: z.string().trim().max(20).optional(),
});
export type Pagador = Selectores.Pagador;

/** 4) Tiendas */
export const TiendaSchema = BaseItemSchema.extend({
    direccion: z.string().trim().max(200).optional(),
    horario: z.string().trim().max(120).optional(),
});
export type Tienda = Selectores.Tienda;

/** 5) Unidades */
export const UnidadSchema = BaseItemSchema.extend({
    abreviatura: z.string().trim().max(12).optional(),
});
export type Unidad = Selectores.Unidad;

/** 6) Tipo de precio (nominal por nombre: con_iva/sin_iva) */
export const TipoPrecioSchema = BaseItemSchema.refine(
    (v) => ["con_iva", "sin_iva"].includes(v.nombre),
    {message: "Tipo de precio inválido (usa con_iva / sin_iva)"}
);
export type TipoPrecio = Selectores.TipoPrecio;

/** 7) Tipo de consumo (nominal por nombre: comer_aqui/recoger) */
export const TipoConsumoSchema = BaseItemSchema.refine(
    (v) => ["comer_aqui", "recoger"].includes(v.nombre),
    {message: "Tipo de consumo inválido (usa comer_aqui / recoger)"}
);
export type TipoConsumo = Selectores.TipoConsumo;

/** 8) Receptor/Cobrador */
export const ReceptorCobradorSchema = BaseItemSchema.extend({
    telefono: z.string().trim().max(20).optional(),
});
export type ReceptorCobrador = Selectores.ReceptorCobrador;

/** 9) Puntos de recogida */
export const PuntoRecogidaSchema = BaseItemSchema.extend({
    direccion: z.string().trim().max(200).optional(),
    horario: z.string().trim().max(120).optional(),
    telefono: z.string().trim().max(20).optional(),
    capacidad: z.number().int().nonnegative().optional(),
    comentarios: z.string().trim().max(500).optional(),
});
export type PuntoRecogida = Selectores.PuntoRecogida;

/** Mapa utilitario para resolver esquema por tabla */
export const SELECTOR_SCHEMAS = {
    comerciales: ComercialSchema,
    metodosPago: MetodoPagoSchema,
    pagadores: PagadorSchema,
    tiendas: TiendaSchema,
    unidades: UnidadSchema,
    tipoConsumo: TipoConsumoSchema,
    receptorCobrador: ReceptorCobradorSchema,
    puntosRecogida: PuntoRecogidaSchema,

    // si necesitas validar/sembrar tipoPrecio de forma separada:
    tipoPrecio: TipoPrecioSchema,
} as const;
export type SelectorKind = Selectores.Kind;
