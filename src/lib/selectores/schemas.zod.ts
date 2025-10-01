import { z } from 'zod';

/**
 * BaseItem común a todos los selectores.
 * - id: string
 * - nombre: string
 * - isActive: boolean
 * - notas?: string
 */
export const BaseItemSchema = z.object({
    id: z.string().min(1, 'id_required'),
    nombre: z.string().min(1, 'nombre_required'),
    isActive: z.boolean(),
    notas: z.string().optional(),
});

export type BaseItem = z.infer<typeof BaseItemSchema>;

/**
 * Claves canónicas para cada mini-tabla de Selectores.
 * (Se evita usar literales sueltas en el código)
 */
export const selectorKeys = {
    comercial: 'comercial',
    metodoPago: 'metodoPago',
    puntoRecogida: 'puntoRecogida',
    tipoConsumo: 'tipoConsumo',
    receptor: 'receptor',
    cobrador: 'cobrador',
    unidad: 'unidad',
    pagador: 'pagador',
    tienda: 'tienda',
} as const;

export type SelectorKey = typeof selectorKeys[keyof typeof selectorKeys];

/** Comercial: BaseItem + teléfono? */
export const ComercialSchema = BaseItemSchema.extend({
    telefono: z.string().optional(),
});

/** Método de pago: BaseItem + requireReceptor (boolean) */
export const MetodoPagoSchema = BaseItemSchema.extend({
    requireReceptor: z.boolean(),
});

/** Punto de recogida: BaseItem + dirección?/horario?/comentarios? */
export const PuntoRecogidaSchema = BaseItemSchema.extend({
    direccion: z.string().optional(),
    horario: z.string().optional(),
    comentarios: z.string().optional(),
});

/** Tipo de consumo: solo BaseItem */
export const TipoConsumoSchema = BaseItemSchema;

/** Receptor: solo BaseItem */
export const ReceptorSchema = BaseItemSchema;

/** Cobrador: solo BaseItem */
export const CobradorSchema = BaseItemSchema;

/** Unidad: solo BaseItem */
export const UnidadSchema = BaseItemSchema;

/** Pagador: solo BaseItem */
export const PagadorSchema = BaseItemSchema;

/** Tienda: BaseItem + dirección?/horario? */
export const TiendaSchema = BaseItemSchema.extend({
    direccion: z.string().optional(),
    horario: z.string().optional(),
});

/**
 * Registro de esquemas por clave.
 * Útil para mini-tablas dinámicas (Minitable).
 */
export const selectorSchemaRegistry = {
    [selectorKeys.comercial]: ComercialSchema,
    [selectorKeys.metodoPago]: MetodoPagoSchema,
    [selectorKeys.puntoRecogida]: PuntoRecogidaSchema,
    [selectorKeys.tipoConsumo]: TipoConsumoSchema,
    [selectorKeys.receptor]: ReceptorSchema,
    [selectorKeys.cobrador]: CobradorSchema,
    [selectorKeys.unidad]: UnidadSchema,
    [selectorKeys.pagador]: PagadorSchema,
    [selectorKeys.tienda]: TiendaSchema,
} as const;
