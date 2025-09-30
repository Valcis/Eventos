// lib/reservas/presets.ts
// Presets para RESERVAS, derivados del schema.columns (sin duplicar IDs).
// - catalog: se genera con label a partir del id (Title Case).
// - views: compact = primeras 6 columnas; expanded = todas (ajústalo si quieres).
// - search: por defecto usa todas con el mismo label (ajústalo libremente).

import {TablePreset, SearchPreset, ColumnOverride} from "../ui/contracts";
import {reservasColumns} from "./schema.columns";

function toTitleCase(input: string): string {
    // "reservaId" -> "Reserva Id", "created_at" -> "Created At"
    const spaced = input
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-\.]+/g, " ")
        .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const catalog: ReadonlyArray<ColumnOverride> = reservasColumns.map((c) => ({
    id: c.id,
    label: toTitleCase(c.id),
}));

const compactIds = catalog.slice(0, Math.min(6, catalog.length)).map((c) => ({id: c.id}));
const expandedIds = catalog.map((c) => ({id: c.id}));

export const reservasTablePreset: TablePreset = {
    catalog,
    views: {
        compact: compactIds,
        expanded: expandedIds,
    },
};

export const reservasSearchPreset: SearchPreset = {
    fields: catalog.map((c) => ({id: c.id, label: c.label})),
};
