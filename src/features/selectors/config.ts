import {z} from "zod";
import type {SelectorKind} from "../../types/selectores";
import {
    ComercialSchema,
    MetodoPagoSchema,
    PagadorSchema,
    TiendaSchema,
    UnidadSchema,
    TipoPrecioSchema,
    TipoConsumoSchema,
    BenefBizumSchema,
    PuntoRecogidaSchema,
} from "../../lib/validators/selectores";

export type FieldKind = "text" | "checkbox" | "textarea";

export type FieldSpec = {
    key: string;       // nombre, telefono, etc.
    label: string;
    type: FieldKind;
    optional?: boolean;
    showInTable?: boolean; // si debe aparecer como columna (además de Nombre; Activo va siempre en tabla pero sin encabezado visible)
};

export type SelectorConfig = {
    title: string;
    tableColumns: string[]; // Visible en la card (incluye "Activo" primero)
    fields: FieldSpec[];    // Campos para formulario e info (Activo NO aparece aquí)
    schema: z.ZodType<unknown>;
};

export const SELECTOR_CONFIG: Record<SelectorKind, SelectorConfig> = {
    comerciales: {
        title: "Comerciales",
        tableColumns: ["Activo", "Nombre"], // Teléfono oculto en tabla
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "telefono", label: "Teléfono", type: "text", optional: true},
            {key: "notas", label: "Notas", type: "text", optional: true},
        ],
        schema: ComercialSchema,
    },
    metodosPago: {
        title: "Métodos de pago",
        tableColumns: ["Activo", "Nombre", "Requiere receptor"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "requiereReceptor", label: "Requiere receptor", type: "checkbox"},
            {key: "notas", label: "Notas", type: "text", optional: true},
        ],
        schema: MetodoPagoSchema,
    },
    pagadores: {
        title: "Pagadores",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "notas", label: "Notas", type: "text", optional: true},
        ],
        schema: PagadorSchema,
    },
    tiendas: {
        title: "Tiendas",
        tableColumns: ["Activo", "Nombre"], // resto via Info
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "direccion", label: "Dirección", type: "text", optional: true},
            {key: "horario", label: "Horario", type: "text", optional: true},
            {key: "notas", label: "Notas", type: "text", optional: true},
        ],
        schema: TiendaSchema,
    },
    unidades: {
        title: "Unidades",
        tableColumns: ["Activo", "Nombre"], // Abreviatura oculta en tabla
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "abreviatura", label: "Abreviatura", type: "text", optional: true},
            {key: "notas", label: "Notas", type: "text", optional: true},
        ],
        schema: UnidadSchema,
    },
    tiposPrecio: {
        title: "Tipos de precio",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "notas", label: "Notas", type: "text", optional: true},
        ],
        schema: TipoPrecioSchema,
    },
    tipoConsumo: {
        title: "Tipo de consumo",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "notas", label: "Notas", type: "text", optional: true},
        ],
        schema: TipoConsumoSchema,
    },
    benefBizum: {
        title: "Receptor/Cobrador",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "telefono", label: "Teléfono", type: "text", optional: true},
            {key: "notas", label: "Notas", type: "text", optional: true},
        ],
        schema: BenefBizumSchema,
    },
    puntosRecogida: {
        title: "Puntos de recogida",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "direccion", label: "Dirección", type: "text", optional: true},
            {key: "horario", label: "Horario", type: "text", optional: true},
            {key: "comentarios", label: "Comentarios", type: "textarea", optional: true},
        ],
        schema: PuntoRecogidaSchema,
    },
};
