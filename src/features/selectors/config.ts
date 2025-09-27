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
    key: string; // nombre, telefono, etc.
    label: string;
    type: FieldKind;
    optional?: boolean;
    showInTable?: boolean; // si debe aparecer como columna (además de Nombre y Activo)
};


export type SelectorConfig = {
    title: string;
    tableColumns: string[]; // Visible en la card (incluye Activo según contrato)
    fields: FieldSpec[]; // Campos para formulario e info (Activo NO aparece aquí)
    schema: z.ZodType<unknown>; // Validación por tipo
};
export const SELECTOR_CONFIG: Record<SelectorKind, SelectorConfig> = {
    comerciales: {
        title: "Comerciales",
        tableColumns: ["Nombre", "Tel.", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "telefono", label: "Teléfono", type: "text", optional: true, showInTable: true },
            { key: "notas", label: "Notas", type: "text", optional: true },
        ],
        schema: ComercialSchema,
    },
    metodosPago: {
        title: "Métodos de pago",
        tableColumns: ["Nombre", "Requiere receptor", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "requiereReceptor", label: "Requiere receptor", type: "checkbox" },
            { key: "notas", label: "Notas", type: "text", optional: true },
        ],
        schema: MetodoPagoSchema,
    },
    pagadores: {
        title: "Pagadores",
        tableColumns: ["Nombre", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "notas", label: "Notas", type: "text", optional: true },
        ],
        schema: PagadorSchema,
    },
    tiendas: {
        title: "Tiendas",
        tableColumns: ["Nombre", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "direccion", label: "Dirección", type: "text", optional: true },
            { key: "horario", label: "Horario", type: "text", optional: true },
            { key: "notas", label: "Notas", type: "text", optional: true },
        ],
        schema: TiendaSchema,
    },
    unidades: {
        title: "Unidades",
        tableColumns: ["Nombre", "Abreviatura", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "abreviatura", label: "Abreviatura", type: "text", optional: true, showInTable: true },
            { key: "notas", label: "Notas", type: "text", optional: true },
        ],
        schema: UnidadSchema,
    },
    tiposPrecio: {
        title: "Tipos de precio",
        tableColumns: ["Nombre", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "notas", label: "Notas", type: "text", optional: true },
        ],
        schema: TipoPrecioSchema,
    },
    tipoConsumo: {
        title: "Tipo de consumo",
        tableColumns: ["Nombre", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "notas", label: "Notas", type: "text", optional: true },
        ],
        schema: TipoConsumoSchema,
    },
    benefBizum: {
        title: "Receptor/Cobrador",
        tableColumns: ["Nombre", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "telefono", label: "Teléfono", type: "text", optional: true },
            { key: "notas", label: "Notas", type: "text", optional: true },
        ],
        schema: BenefBizumSchema,
    },
    puntosRecogida: {
        title: "Puntos de recogida",
        tableColumns: ["Nombre", "Activo"],
        fields: [
            { key: "nombre", label: "Nombre", type: "text" },
            { key: "direccion", label: "Dirección", type: "text", optional: true },
            { key: "horario", label: "Horario", type: "text", optional: true },
            { key: "comentarios", label: "Comentarios", type: "textarea", optional: true },
        ],
        schema: PuntoRecogidaSchema,
    },
};