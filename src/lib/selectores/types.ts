import { z } from 'zod';

import {
    ComercialSchema,
    MetodoPagoSchema,
    PagadorSchema,
    TiendaSchema,
    UnidadSchema,
    ReceptorCobradorSchema,
    PuntoRecogidaSchema,
} from '../../lib/selectores/schemas';



export interface BaseItem {
  id: string;
  nombre: string;
  activo: boolean;
  notas?: string;
}


// Esquema libre para Tipo de consumo (sin restricciones)
const TipoConsumoFreeSchema = z.object({
    id: z.string(),
    nombre: z.string().min(1, 'Requerido'),
    notas: z.string().optional(),
    activo: z.boolean(),
});

export type FieldKind = 'text' | 'checkbox' | 'textarea' | 'select' | 'number';

export interface FieldSpec {
    key: string;
    label: string;
    type: FieldKind;
    optional?: boolean;
    showInTable?: boolean;
    fullWidth?: boolean;
    options?: Array<{ label: string; value: string | number | boolean }>;
}


export interface ReceptorCobrador extends BaseItem {
}

export interface MetodoPago extends BaseItem {
    requiereReceptor?: boolean;
}

export interface ReceptorCobrador extends BaseItem {
}

export interface TipoConsumo extends BaseItem {
}

export interface Comercial extends BaseItem {
    telefonos?: string;
}


export interface Tienda extends BaseItem {
    direccion?: string;
    horario?: string;
}


export interface Pagador extends BaseItem {
}


export interface Unidad extends BaseItem {
}


export interface PuntoRecogida extends BaseItem {
    direccion?: string;
    horario?: string;
}

export type SelectorKind =
  | 'comerciales'
  | 'metodosPago'
  | 'pagadores'
  | 'tiendas'
  | 'unidades'
  | 'tipoConsumo'
  | 'receptorCobrador'
  | 'puntosRecogida';



export interface SelectorConfig {
    title: string;
    tableColumns: string[]; // incluye "Activo" al principio
    fields: FieldSpec[]; // (Activo NO va aquí)
    schema: z.ZodType<unknown>;
}

export const SELECTOR_CONFIG: Record<SelectorKind, SelectorConfig> = {
    comerciales: {
        title: 'Comerciales',
        tableColumns: ['Activo', 'Nombre'],
        fields: [
            { key: 'nombre', label: 'Nombre', type: 'text' },
            { key: 'telefono', label: 'Teléfono', type: 'text', optional: true },
            { key: 'notas', label: 'Notas', type: 'text', optional: true, fullWidth: true },
        ],
        schema: ComercialSchema,
    },
    metodosPago: {
        title: 'Métodos de pago',
        tableColumns: ['Activo', 'Nombre', 'Requiere receptor'],
        fields: [
            { key: 'nombre', label: 'Nombre', type: 'text' },
            {
                key: 'requiereReceptor',
                label: 'Requiere receptor',
                type: 'select',
                options: [
                    { label: 'Sí', value: true },
                    { label: 'No', value: false },
                ],
            },
            { key: 'notas', label: 'Notas', type: 'text', optional: true, fullWidth: true },
        ],
        schema: MetodoPagoSchema,
    },
    pagadores: {
        title: 'Pagadores',
        tableColumns: ['Activo', 'Nombre'],
        fields: [
            { key: 'nombre', label: 'Nombre', type: 'text' },
            { key: 'telefono', label: 'Teléfono', type: 'text', optional: true },
            { key: 'notas', label: 'Notas', type: 'text', optional: true, fullWidth: true },
        ],
        schema: PagadorSchema,
    },
    tiendas: {
        title: 'Tiendas',
        tableColumns: ['Activo', 'Nombre'],
        fields: [
            { key: 'nombre', label: 'Nombre', type: 'text' },
            { key: 'direccion', label: 'Dirección', type: 'text', optional: true },
            { key: 'horario', label: 'Horario', type: 'text', optional: true },
            { key: 'notas', label: 'Notas', type: 'text', optional: true, fullWidth: true },
        ],
        schema: TiendaSchema,
    },
    unidades: {
        title: 'Unidades',
        tableColumns: ['Activo', 'Nombre'],
        fields: [
            { key: 'nombre', label: 'Nombre', type: 'text' },
            { key: 'abreviatura', label: 'Abreviatura', type: 'text', optional: true },
            { key: 'notas', label: 'Notas', type: 'text', optional: true, fullWidth: true },
        ],
        schema: UnidadSchema,
    },
    tipoConsumo: {
        title: 'Tipo de consumo',
        tableColumns: ['Activo', 'Nombre'],
        fields: [
            { key: 'nombre', label: 'Nombre', type: 'text' },
            { key: 'notas', label: 'Notas', type: 'text', optional: true, fullWidth: true },
        ],
        schema: TipoConsumoFreeSchema, // libre
    },
    receptorCobrador: {
        title: 'Receptor/Cobrador',
        tableColumns: ['Activo', 'Nombre'],
        fields: [
            { key: 'nombre', label: 'Nombre', type: 'text' },
            { key: 'telefono', label: 'Teléfono', type: 'text', optional: true },
            { key: 'notas', label: 'Notas', type: 'text', optional: true, fullWidth: true },
        ],
        schema: ReceptorCobradorSchema,
    },
    puntosRecogida: {
        title: 'Puntos de recogida',
        tableColumns: ['Activo', 'Nombre'],
        fields: [
            { key: 'nombre', label: 'Nombre', type: 'text' },
            { key: 'direccion', label: 'Dirección', type: 'text', optional: true },
            { key: 'horario', label: 'Horario', type: 'text', optional: true },
            { key: 'telefono', label: 'Teléfono', type: 'text', optional: true }, // 👈 nuevo
            { key: 'capacidad', label: 'Capacidad', type: 'number', optional: true }, // 👈 nuevo
            { key: 'comentarios', label: 'Notas', type: 'text', optional: true, fullWidth: true },
        ],
        schema: PuntoRecogidaSchema,
    },
};
