import {z} from "zod";
import type {SelectorKind} from "../../types/selectores";
import {
    ComercialSchema,
    MetodoPagoSchema,
    PagadorSchema,
    TiendaSchema,
    UnidadSchema,
    BenefBizumSchema,
    PuntoRecogidaSchema,
} from "../../lib/validators/selectores";

// Esquema libre para Tipo de consumo (sin restricciones)
const TipoConsumoFreeSchema = z.object({
    id: z.string(),
    nombre: z.string().min(1, "Requerido"),
    notas: z.string().optional(),
    activo: z.boolean(),
});

export type FieldKind = "text" | "checkbox" | "textarea" | "select";

export type FieldSpec = {
    key: string;       // nombre, telefono, etc.
    label: string;
    type: FieldKind;
    optional?: boolean;
    showInTable?: boolean; // (solo informativo)
    fullWidth?: boolean;   // ocupa ancho completo del modal
    options?: Array<{ label: string; value: string | number | boolean }>;
};

export type SelectorConfig = {
    title: string;
    tableColumns: string[]; // Visible en la card (incluye "Activo" primero)
    fields: FieldSpec[];    // Campos para formulario e info (Activo NO aparece aquí)
    schema: z.ZodType<unknown>;
};

export const SELECTOR_CONFIG: Record<SelectorKind, SelectorConfig> = {
    unidades: {
        title: "Unidades",
        tableColumns: ["Activo", "Nombre"], // Abreviatura oculta
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "abreviatura", label: "Abreviatura", type: "text", optional: true},
            {key: "notas", label: "Notas", type: "text", optional: true, fullWidth: true},
        ],
        schema: UnidadSchema,
    },
    pagadores: {
        title: "Pagadores",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "telefono", label: "Teléfono", type: "text", optional: true},
            {key: "notas", label: "Notas", type: "text", optional: true, fullWidth: true},
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
            {key: "notas", label: "Notas", type: "text", optional: true, fullWidth: true},
        ],
        schema: TiendaSchema,
    },
    comerciales: {
        title: "Comerciales / Captadores",
        tableColumns: ["Activo", "Nombre"], // Teléfono oculto
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "telefono", label: "Teléfono", type: "text", optional: true},
            {key: "notas", label: "Notas", type: "text", optional: true, fullWidth: true},
        ],
        schema: ComercialSchema,
    },
    tipoConsumo: {
        title: "Tipo de consumo",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "notas", label: "Notas", type: "text", optional: true, fullWidth: true},
        ],
        schema: TipoConsumoFreeSchema, // sin restricciones
    },
    puntosRecogida: {
        title: "Puntos de recogida",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "direccion", label: "Dirección", type: "text", optional: true},
            {key: "horario", label: "Horario", type: "text", optional: true},
            {key: "comentarios", label: "Notas", type: "text", optional: true, fullWidth: true},
        ],
        schema: PuntoRecogidaSchema,
    },
    metodosPago: {
        title: "Métodos de pago",
        tableColumns: ["Activo", "Nombre", "Requiere receptor"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {
                key: "requiereReceptor",
                label: "Requiere receptor",
                type: "select",
                options: [
                    {label: "Sí", value: true},
                    {label: "No", value: false},
                ],
            },
            {key: "notas", label: "Notas", type: "text", optional: true, fullWidth: true},
        ],
        schema: MetodoPagoSchema,
    },
    benefBizum: {
        title: "Receptor / Cobrador",
        tableColumns: ["Activo", "Nombre"],
        fields: [
            {key: "nombre", label: "Nombre", type: "text"},
            {key: "telefono", label: "Teléfono", type: "text", optional: true},
            {key: "notas", label: "Notas", type: "text", optional: true, fullWidth: true},
        ],
        schema: BenefBizumSchema,
    },
};
