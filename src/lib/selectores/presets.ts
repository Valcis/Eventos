// src/lib/selectores/presets.ts
/**
 * Presets de UI para las tablas de selectores y su registro inmediato en el presetsStore.
 * - Define las vistas (compact/expanded) de cada selector.
 * - Construye el catálogo (label, order, flags) a partir de schemas.colums.ts.
 * - Registra table + search para cada entidad en el presetsStore.
 *
 * NOTA: Este módulo ejecuta el registro al importarse (side-effect intencional).
 */

import { registerPresets } from "../ui/presetsStore";
import type { TablePreset, SearchPreset, ColumnOverride } from "../ui/contracts";
import type { Entity } from "../ui/registry";
import {
    comercialColumns,
    metodoPagoColumns,
    pagadorColumns,
    tiendaColumns,
    unidadColumns,
    tipoConsumoColumns,
    receptorColumns,
    puntoRecogidaColumns,
} from "./schemas.colums";

// -----------------------------
// 1) Definición de presets (vistas) por selector
// -----------------------------
export const selectoresPresets: {
    comercial: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
    metodoPago: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
    pagador: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
    tienda: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
    unidad: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
    tipoConsumo: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
    receptor: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
    puntoRecogida: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
} = {
    comercial: {
        compact: ["nombre", "telefono", "isActive"],
        expanded: ["id", "nombre", "telefono", "notas", "createdAt", "updatedAt", "isActive"],
    },
    metodoPago: {
        compact: ["nombre", "isActive"],
        expanded: ["id", "nombre", "comentarios", "createdAt", "updatedAt", "isActive"],
    },
    pagador: {
        compact: ["nombre", "isActive"],
        expanded: ["id", "nombre", "notas", "createdAt", "updatedAt", "isActive"],
    },
    tienda: {
        compact: ["nombre", "direccion", "horario", "isActive"],
        expanded: ["id", "nombre", "direccion", "horario", "notas", "createdAt", "updatedAt", "isActive"],
    },
    unidad: {
        compact: ["nombre", "isActive"],
        expanded: ["id", "nombre", "notas", "createdAt", "updatedAt", "isActive"],
    },
    tipoConsumo: {
        compact: ["nombre", "isActive"],
        expanded: ["id", "nombre", "notas", "createdAt", "updatedAt", "isActive"],
    },
    receptor: {

        compact: ["nombre", "requiereReceptor", "isActive"],
        expanded: ["id", "nombre", "requiereReceptor", "notas", "createdAt", "updatedAt", "isActive"],
    },
    puntoRecogida: {
        compact: ["nombre", "direccion", "isActive"],
        expanded: ["id", "nombre", "direccion", "horario", "notas", "createdAt", "updatedAt", "isActive"],
    },
};

// -----------------------------
// 2) Catálogo: labels y orden estable
// -----------------------------
const LABELS: Record<string, string> = {
    id: "ID",
    nombre: "Nombre",
    isActive: "Activo",
    notas: "Notas",
    telefono: "Teléfono",
    requiereReceptor: "Requiere receptor",
    direccion: "Dirección",
    horario: "Horario",
    comentarios: "Comentarios",
    createdAt: "Creado",
    updatedAt: "Actualizado",
};


/**
 * Construye el catálogo combinando:
 * - columnas del meta (orden estable por índice)
 * - columnas usadas en las vistas (compact/expanded) que no estén en meta
 */
/**
 * Catálogo SOLO desde schema.columns (no inyecta columnas extra),
 * para cumplir el validador actual.
 */
function buildCatalogFromSchema(meta: ReadonlyArray<{ column: string }>): ColumnOverride[] {
    const step = 10;
    return meta.map((m, index) => ({
        column: m.column,
        label: m.column,
        order: step * (index + 1),
        filterable: true,
        sortable: true,
    }));
}

/**
 * Normaliza las vistas para que solo usen columnas declaradas en schema.columns.
 * Evita errores del tipo "columna ... no existe en schema.columns".
 */
function normalizeViews(
    meta: ReadonlyArray<{ column: string }>,
    views: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> }
): { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> } {
    const allowed = new Set(meta.map((m) => m.column));
    const compact = views.compact.filter((c) => allowed.has(c));
    const expanded = views.expanded.filter((c) => allowed.has(c));
    return { compact, expanded };
}

// -----------------------------
// 3) Registro en presetsStore para las 8 entidades
// -----------------------------
type SelectorKey =
    | "comerciales"
    | "metodosPago"
    | "pagadores"
    | "tiendas"
    | "unidades"
    | "tipoConsumo"
    | "receptorCobrador"
    | "puntosRecogida";

const registros: ReadonlyArray<{
    entity: Entity & SelectorKey;
    columns: ReadonlyArray<{ column: string }>;
    views: { compact: ReadonlyArray<string>; expanded: ReadonlyArray<string> };
    searchFields: ReadonlyArray<string>;
}> = [
    {
        entity: "comerciales",
        columns: comercialColumns,
        views: selectoresPresets.comercial,
        searchFields: selectoresPresets.comercial.compact,
    },
    {
        entity: "metodosPago",
        columns: metodoPagoColumns,
        views: selectoresPresets.metodoPago,
        searchFields: selectoresPresets.metodoPago.compact,
    },
    {
        entity: "pagadores",
        columns: pagadorColumns,
        views: selectoresPresets.pagador,
        searchFields: selectoresPresets.pagador.compact,
    },
    {
        entity: "tiendas",
        columns: tiendaColumns,
        views: selectoresPresets.tienda,
        searchFields: selectoresPresets.tienda.compact,
    },
    {
        entity: "unidades",
        columns: unidadColumns,
        views: selectoresPresets.unidad,
        searchFields: selectoresPresets.unidad.compact,
    },
    {
        entity: "tipoConsumo",
        columns: tipoConsumoColumns,
        views: selectoresPresets.tipoConsumo,
        searchFields: selectoresPresets.tipoConsumo.compact,
    },
    {
        entity: "receptorCobrador",
        columns: receptorColumns,
        views: selectoresPresets.receptor,
        searchFields: selectoresPresets.receptor.compact,
    },
    {
        entity: "puntosRecogida",
        columns: puntoRecogidaColumns,
        views: selectoresPresets.puntoRecogida,
        searchFields: selectoresPresets.puntoRecogida.compact,
    },
];

function registerSelectorPresetsInStore(): void {
    for (const item of registros) {
        // 1) Filtra vistas contra schema.columns
        const normalizedViews = normalizeViews(item.columns, item.views);

        // 2) Catálogo derivado EXCLUSIVAMENTE del schema
        const catalog = buildCatalogFromSchema(item.columns);

        const table: TablePreset = {
            catalog,
            views: {
                compact: normalizedViews.compact,
                expanded: normalizedViews.expanded,
            },
        };
        const search: SearchPreset = { fields: normalizedViews.compact };

        registerPresets(item.entity, { table, search });
    }
}

// Side-effect: registrar todo al importar este módulo
registerSelectorPresetsInStore();
